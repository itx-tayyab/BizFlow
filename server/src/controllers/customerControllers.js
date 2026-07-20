import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis'; 

const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
await redisClient.connect();

const prisma = new PrismaClient();

export const newCustomer = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { name, phone } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { businessId: true }
        });

        if (!currentUser?.businessId) {
            return res.status(400).json({ message: "No business found." });
        }
        
        const businessId = currentUser.businessId;

        const customerExists = await prisma.customer.findFirst({
            where: {
                businessId: businessId,
                phone: phone
            },
        });

        if (customerExists) {
            return res.status(400).json({ message: "Customer with this phone number already exists" });
        }

        const customer = await prisma.customer.create({
            data: {
                name,
                phone,
                businessId: businessId
            },
        });

        const keys = await redisClient.keys(`customers:${businessId}:*`);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }

        return res.status(201).json({ success: true, customer });
        
    } catch (error) {
        console.error("New Customer Error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const CustomerDetails = async (req, res) => {
    try {
        const user = req.user?.id;
        const { id } = req.params;

        const { name, phone, email, address, cnicNumber, guarantorPhone } = req.body;

        if (!user) return res.status(401).json({ message: 'Unauthorized' });
        if (!id) return res.status(400).json({ message: 'Customer ID is required in the URL' });

        const currentUser = await prisma.user.findUnique({
            where: { id: user },
            select: { businessId: true }
        });

        const businessId = currentUser.businessId;

        const existingCustomer = await prisma.customer.findFirst({
            where: {
                id: id,
                businessId: businessId
            }
        });

        if (!existingCustomer) {
            return res.status(404).json({ message: "Customer not found in your workspace." });
        }

        const updatedCustomer = await prisma.customer.update({
            where: { id: id },
            data: {
                name,
                phone,
                email,
                address,
                cnicNumber,
                guarantorPhone
            }
        });

        return res.status(200).json({ success: true, message: "Customer details updated", customer: updatedCustomer });

    } catch (error) {
        console.error("Update Customer Error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const CustomerRisk = async (req, res) => {
    try {
        const user = req.user?.id;
        const { id } = req.params;
        const { creditLimit, isDefaulter } = req.body;

        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const currentUser = await prisma.user.findUnique({
            where: { id: user },
            select: { businessId: true, role: true }
        });

        if (currentUser.role === "STAFF") {
            return res.status(403).json({ success: false, message: "Only Owners and Managers can change credit limits." });
        }

        const existingCustomer = await prisma.customer.findFirst({
            where: { id: id, businessId: currentUser.businessId }
        });

        if (!existingCustomer) {
            return res.status(404).json({ success: false, message: "Customer not found." });
        }

        const updatedCustomer = await prisma.customer.update({
            where: { id: id },
            data: {
                creditLimit: parseFloat(creditLimit),
                isDefaulter: Boolean(isDefaulter)
            }
        });

        return res.status(200).json({
            success: true,
            message: "Risk settings updated securely.",
            customer: updatedCustomer
        });

    } catch (error) {
        console.error("Risk Update Error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getallCustomers = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { search, unpaid } = req.query; 

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { businessId: true }
        });

        if (!currentUser?.businessId) {
            return res.status(400).json({ message: "No business found." });
        }
        const businessId = currentUser.businessId;

        const cacheKey = `customers:${businessId}:search=${search || 'none'}:unpaid=${unpaid || 'false'}`;
        
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log("Serving Customers from Redis Cache! ⚡");
            return res.status(200).json({ success: true, customers: JSON.parse(cachedData) });
        }

        let queryConditions = { businessId: businessId };

        if (search) {
            queryConditions.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } }
            ];
        }

        const customersData = await prisma.customer.findMany({
            where: queryConditions,
            select: {
                id: true,
                name: true,
                phone: true,
                _count: { select: { orders: true } },
                orders: {
                    where: { status: { not: "CANCELLED" } },
                    select: {
                        totalAmount: true,
                        payments: { select: { amount: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        let formattedCustomers = customersData.map(customer => {
            let lifetimeSpend = 0;
            let totalPaid = 0;

            customer.orders.forEach(order => {
                lifetimeSpend += order.totalAmount;
                order.payments.forEach(payment => {
                    totalPaid += payment.amount;
                });
            });

            const outstandingBalance = lifetimeSpend - totalPaid;

            return {
                id: customer.id,
                name: customer.name,
                phone: customer.phone,
                totalOrders: customer._count.orders,
                lifetimeValue: lifetimeSpend,
                balance: outstandingBalance > 0 ? outstandingBalance : 0, 
            };
        });

        if (unpaid === 'true') {
            formattedCustomers = formattedCustomers.filter(c => c.balance > 0);
        }

        await redisClient.setEx(cacheKey, 3600, JSON.stringify(formattedCustomers));

        console.log("Serving Customers from PostgreSQL Database! 🐘");
        return res.status(200).json({ success: true, customers: formattedCustomers });

    } catch (error) {
        console.error("Error fetching all customers:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCustomerById = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { businessId: true }
        });

        if (!currentUser?.businessId) {
            return res.status(400).json({ message: "No business found." });
        }
        const businessId = currentUser.businessId;

        const customer = await prisma.customer.findFirst({
            where: {
                id: id,
                businessId: businessId
            },
            include: {
                orders: {
                    where: { status: { not: "CANCELLED" } },
                    include: {
                        payments: true,
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        let totalOrders = customer.orders.length;
        let lifetimeSpend = 0;
        let totalPaid = 0;

        const orderHistory = customer.orders.map(order => {
            let orderTotal = order.totalAmount;
            let orderPaid = order.payments.reduce((sum, p) => sum + p.amount, 0);
            let orderBalance = orderTotal - orderPaid;

            lifetimeSpend += orderTotal;
            totalPaid += orderPaid;

            return {
                id: order.id,
                orderNumber: order.orderNumber,
                date: new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
                total: orderTotal,
                status: order.status,
                payment: order.paymentStatus,
                balance: orderBalance > 0 ? orderBalance : 0
            };
        });

        const outstandingBalance = lifetimeSpend - totalPaid;

        const formattedCustomer = {
            id: customer.id,
            name: customer.name,
            phone: customer.phone,
            email: customer.email || "",
            address: customer.address || "",
            cnic: customer.cnicNumber || "",
            guarantorPhone: customer.guarantorPhone || "",
            creditLimit: customer.creditLimit,
            isDefaulter: customer.isDefaulter,
            joined: new Date(customer.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            }),
            metrics: {
                totalOrders,
                lifetimeValue: lifetimeSpend,
                outstandingBalance: outstandingBalance > 0 ? outstandingBalance : 0
            },
            orderHistory
        };

        return res.status(200).json({ success: true, customer: formattedCustomer });

    } catch (error) {
        console.error("Error fetching customer by id:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

