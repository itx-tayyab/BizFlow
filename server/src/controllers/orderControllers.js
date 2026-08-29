import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

const prisma = new PrismaClient();

const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
await redisClient.connect();

export const newOrder = async (req, res) => {
    try {
        const user = req.user?.id;

        const {
            customerId,
            items,
            discount = 0,
            amountPaid = 0,
            paymentMethod = "CASH",
            orderStatus = "COMPLETED"
        } = req.body;

        if (!user) return res.status(401).json({ message: 'Unauthorized' });
        if (!items || items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

        const parsedDiscount = Number(discount) || 0;
        const parsedAmountPaid = Number(amountPaid) || 0;

        const currentUser = await prisma.user.findUnique({
            where: { id: user },
            select: { businessId: true }
        });

        if (!currentUser?.businessId) return res.status(400).json({ message: 'User does not belong to a workspace' });
        const businessId = currentUser.businessId;

        const completeOrder = await prisma.$transaction(async (tx) => {

            let calculatedTotal = 0;
            const secureProducts = {};

            for (const item of items) {
                const product = await tx.product.findUnique({ where: { id: item.productId } });

                if (!product) throw new Error(`Product not found`);
                if (product.stock < item.quantity) {
                    throw new Error(`Not enough stock for ${product.name}. Only ${product.stock} left.`);
                }

                secureProducts[item.productId] = product;
                calculatedTotal += (product.price * item.quantity);
            }

            const finalGrandTotal = calculatedTotal - parsedDiscount;

            let calculatedPaymentStatus = "UNPAID";
            if (parsedAmountPaid >= finalGrandTotal) {
                calculatedPaymentStatus = "PAID";
            } else if (parsedAmountPaid > 0) {
                calculatedPaymentStatus = "PARTIAL";
            }
            
            const udhaarRequested = finalGrandTotal - parsedAmountPaid;

            if (udhaarRequested > 0) {
                if (!customerId) {
                    throw new Error("Walk-in customers must pay in full. Please select or create a customer profile to give Udhaar.");
                }

                const customer = await tx.customer.findUnique({ where: { id: customerId } });

                if (!customer) {
                    throw new Error("Customer profile not found. Cannot process Udhaar.");
                }

                if (customer.isDefaulter) {
                    throw new Error(`SALE BLOCKED: ${customer.name} is marked as a Defaulter.`);
                }

                if (customer.creditLimit === 0) {
                    throw new Error(`SALE BLOCKED: ${customer.name} has a credit limit of Rs. 0.`);
                }

                // EXCLUDE CANCELLED ORDERS FROM THE MATH!
                const totalBilled = await tx.order.aggregate({
                    where: { 
                        customerId,
                        status: { not: "CANCELLED" } 
                    }, 
                    _sum: { totalAmount: true }
                });
                
                const totalPaid = await tx.payment.aggregate({
                    where: { order: { customerId, status: { not: "CANCELLED" } } }, 
                    _sum: { amount: true }
                });

                const currentOutstanding = (totalBilled._sum.totalAmount || 0) - (totalPaid._sum.amount || 0);
                const projectedDebt = currentOutstanding + udhaarRequested;

                if (projectedDebt > customer.creditLimit) {
                    const minimumCashRequired = projectedDebt - customer.creditLimit;
                    throw new Error(`SALE BLOCKED: This exceeds ${customer.name}'s credit limit of Rs. ${customer.creditLimit.toLocaleString()}. You must collect at least Rs. ${minimumCashRequired.toLocaleString()} in cash right now to process this order.`);
                }
            }

            const order = await tx.order.create({
                data: {
                    customerId: customerId || null,
                    businessId: businessId,
                    status: orderStatus,
                    discount: parsedDiscount, 
                    paymentStatus: calculatedPaymentStatus,
                    totalAmount: finalGrandTotal,
                    createdBy: user,
                },
            });

            for (const item of items) {
                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: secureProducts[item.productId].price
                    }
                });

                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            if (parsedAmountPaid > 0) {
                await tx.payment.create({
                    data: {
                        orderId: order.id,
                        amount: parsedAmountPaid,
                        method: paymentMethod,
                        receivedBy: user
                    }
                });
            }

            return order;
        });

        const keysToDelete = await redisClient.keys(`*${businessId}*`);

        const filteredKeys = keysToDelete.filter(key => 
            key.startsWith('products:') || 
            key.startsWith('customers:') || 
            key.startsWith('orders:')
        );

        if (filteredKeys.length > 0) {
            await redisClient.del(filteredKeys);
            console.log(`🧹 Cleared ${filteredKeys.length} caches after New Order!`);
        }

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: completeOrder
        });

    } catch (error) {
        console.error("New Order Error:", error);
        const isCustomError = error.message.includes("stock") || error.message.includes("BLOCKED") || error.message.includes("Walk-in") || error.message.includes("Customer profile");
        return res.status(isCustomError ? 400 : 500).json({ success: false, message: error.message || 'Internal server error' });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const user = req.user?.id;
        // Include "days" default to 7, but allow "all" for Year-To-Date searches
        const { search, status, paymentStatus, days = 7 } = req.query;

        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const currentUser = await prisma.user.findUnique({
            where: { id: user },
            select: { businessId: true }
        });

        if (!currentUser?.businessId) return res.status(400).json({ message: 'User does not belong to a workspace' });
        const businessId = currentUser.businessId;

        // 🟢 1. REDIS CACHE
        const cacheKey = `orders:${businessId}:search=${search || 'none'}:status=${status || 'all'}:pay=${paymentStatus || 'all'}:days=${days}`;
        const cachedData = await redisClient.get(cacheKey);
        
        if (cachedData) {
            console.log("Serving Orders from Redis Cache! ⚡");
            return res.status(200).json({ success: true, orders: JSON.parse(cachedData) });
        }

        let queryConditions = { businessId: businessId };

        if (days !== "all" && !isNaN(parseInt(days))) {
            const dateLimit = new Date();
            dateLimit.setDate(dateLimit.getDate() - parseInt(days));
            queryConditions.createdAt = { gte: dateLimit };
        }

        if (status && status !== "All") queryConditions.status = status;
        if (paymentStatus && paymentStatus !== "All") queryConditions.paymentStatus = paymentStatus;

        if (search) {
            queryConditions.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                { customer: { name: { contains: search, mode: 'insensitive' } } },
                { customer: { phone: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const orders = await prisma.order.findMany({
            where: queryConditions,
            include: {
                customer: { select: { id: true, name: true, phone: true } },
                payments: { select: { amount: true } }
            },
            orderBy: { createdAt: 'desc' } 
        });

        const formattedOrders = orders.map(order => {
            const totalPaid = order.payments.reduce((sum, p) => sum + p.amount, 0);
            
            const pendingBalance = order.totalAmount - totalPaid;

            return {
                ...order,
                totalPaid: totalPaid,
                pendingBalance: pendingBalance > 0 ? pendingBalance : 0 
            };
        });
        await redisClient.setEx(cacheKey, 300, JSON.stringify(formattedOrders));

        console.log("Serving Orders from PostgreSQL! 🐘");
        return res.status(200).json({ success: true, orders: formattedOrders });

    } catch (error) {
        console.error("Get All Orders Error:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const getOrderById = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params; 

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        
        if (!id) return res.status(400).json({ message: 'Order ID is required in the URL' });

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { businessId: true }
        });

        const order = await prisma.order.findFirst({
            where: { 
                id: id, 
                businessId: currentUser.businessId 
            },
            include: {
                customer: true,
                items: { include: { product: { select: { name: true } } } },
                payments: {
                    include: { receiver: { select: { name: true, role: true } } },
                    orderBy: { createdAt: 'desc' }
                },
                creator: { select: { name: true } }
            }
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        return res.status(200).json({ success: true, order });

    } catch (error) {
        console.error("Get Order By ID Error:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { status } = req.body;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        if (!id) return res.status(400).json({ message: 'Order ID is required' });
        if (!status) return res.status(400).json({ message: 'Status is required' });

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { businessId: true }
        });

        const order = await prisma.order.findFirst({
            where: { id, businessId: currentUser.businessId }
        });

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (status === "CANCELLED" && order.status !== "CANCELLED") {
            const orderItems = await prisma.orderItem.findMany({
                where: { orderId: id }
            });
            await prisma.$transaction(async (tx) => {
                for (const item of orderItems) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { increment: item.quantity } }
                    });
                }
                await tx.order.update({
                    where: { id },
                    data: { status }
                });
            });
        } else {
            await prisma.order.update({
                where: { id },
                data: { status }
            });
        }

        return res.status(200).json({ success: true, message: `Order status updated to ${status}` });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const recordPayment = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { orderId, amount, method } = req.body;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        if (!orderId) return res.status(400).json({ message: 'Order ID is required' });
        
        const parsedAmount = parseFloat(amount);
        if (!parsedAmount || parsedAmount <= 0) {
            return res.status(400).json({ message: 'Valid amount greater than 0 is required' });
        }
        if (!method) return res.status(400).json({ message: 'Payment method is required' });

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { businessId: true }
        });

        if (!currentUser?.businessId) {
            return res.status(400).json({ message: 'User does not belong to a workspace' });
        }
        const businessId = currentUser.businessId;

        const order = await prisma.order.findFirst({
            where: { id: orderId, businessId: businessId },
            select: { 
                id: true, 
                totalAmount: true, 
                customerId: true,
                payments: { select: { amount: true } }
            }
        });

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        const totalPaidSoFar = order.payments.reduce((sum, p) => sum + p.amount, 0);
        const remainingBalance = order.totalAmount - totalPaidSoFar;

        if (remainingBalance <= 0) {
            return res.status(400).json({ success: false, message: 'This order is already fully paid.' });
        }

        if (parsedAmount > remainingBalance) {
            return res.status(400).json({ 
                success: false, 
                message: `Amount exceeds the pending balance. Maximum payable amount is Rs. ${remainingBalance.toLocaleString()}` 
            });
        }
        const newTotalPaid = totalPaidSoFar + parsedAmount;
        const newPaymentStatus = newTotalPaid >= order.totalAmount ? 'PAID' : 'PARTIAL';

        await prisma.$transaction(async (tx) => {
            await tx.payment.create({
                data: {
                    orderId: order.id,
                    amount: parsedAmount,
                    method: method,
                    receivedBy: userId
                }
            });

            await tx.order.update({
                where: { id: order.id },
                data: { paymentStatus: newPaymentStatus }
            });
        });

        const orderKeys = await redisClient.keys(`orders:${businessId}:*`);
        if (orderKeys.length > 0) await redisClient.del(orderKeys);
        const customerKeys = await redisClient.keys(`customers:${businessId}:*`);
        if (customerKeys.length > 0) await redisClient.del(customerKeys);

        return res.status(200).json({ success: true, message: 'Payment recorded successfully' });
        
    } catch (error) {
        console.error("Record Payment Error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const getPublicInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: id },
            include: {
                customer: true,
                items: { include: { product: { select: { name: true } } } },
                payments: { orderBy: { createdAt: 'desc' } },
                business: { 
                    select: { 
                        name: true, logoUrl: true, address: true, phone: true, email: true, currency: true 
                    } 
                }
            }
        });

        if (!order) return res.status(404).json({ success: false, message: 'Invoice not found' });

        const totalPaid = order.payments.reduce((sum, p) => sum + p.amount, 0);
        const pendingBalance = order.totalAmount - totalPaid;

        const formattedInvoice = {
            ...order,
            orderNumber: `ORD-${order.orderNumber || order.id.substring(0, 4)}`,
            totalPaid,
            pendingBalance: pendingBalance > 0 ? pendingBalance : 0
        };

        return res.status(200).json({ success: true, invoice: formattedInvoice });

    } catch (error) {
        console.error("Public Invoice Error:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}