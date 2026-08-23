import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

const prisma = new PrismaClient();

const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
await redisClient.connect();

const CACHE_TTL = 900; // 15 minutes (900 seconds)

export const getFinancialOverview = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { days = 7 } = req.query;

        const currentUser = await prisma.user.findUnique({ where: { id: userId }, select: { businessId: true } });
        if (!currentUser?.businessId) return res.status(400).json({ message: "No workspace found." });
        const businessId = currentUser.businessId;

        // 🟢 REDIS CACHE
        const cacheKey = `reports:financial:${businessId}:days=${days}`;
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) return res.status(200).json(JSON.parse(cachedData));

        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - parseInt(days));

        const orders = await prisma.order.findMany({
            where: { businessId, createdAt: { gte: dateLimit }, status: { not: "CANCELLED" } },
            include: { items: { include: { product: true } } }
        });

        const payments = await prisma.payment.groupBy({
            by: ['method'],
            _sum: { amount: true },
            where: { order: { businessId, createdAt: { gte: dateLimit } } }
        });

        let totalRevenue = 0;
        let totalCost = 0;
        let totalDiscounts = 0;
        let totalPaid = 0;

        // For the Area Chart
        const dailyData = {};

        orders.forEach(order => {
            totalRevenue += order.totalAmount;
            totalDiscounts += order.discount || 0;

            const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!dailyData[dateStr]) dailyData[dateStr] = { date: dateStr, revenue: 0, profit: 0 };

            let orderCost = 0;
            order.items.forEach(item => {
                // If product has a costPrice, calculate profit. Otherwise, assume 100% profit (cost = 0)
                const cost = (item.product?.costPrice || 0) * item.quantity;
                orderCost += cost;
            });
            totalCost += orderCost;

            dailyData[dateStr].revenue += order.totalAmount;
            dailyData[dateStr].profit += (order.totalAmount - orderCost);
        });

        const paymentFlow = payments.map(p => ({
            name: p.method === "CASH" ? "Cash" : p.method === "BANK" ? "Bank Transfer" : "Online",
            value: p._sum.amount || 0,
            color: p.method === "CASH" ? "#10b981" : p.method === "BANK" ? "#3b82f6" : "#f59e0b"
        }));

        const allPaymentsTotal = payments.reduce((sum, p) => sum + (p._sum.amount || 0), 0);
        const pendingDues = totalRevenue - allPaymentsTotal;
        if (pendingDues > 0) {
            paymentFlow.push({ name: "Unpaid (Udhaar)", value: pendingDues, color: "#f43f5e" });
        }

        const responseData = {
            success: true,
            kpis: {
                totalRevenue,
                netProfit: totalRevenue - totalCost,
                averageOrderValue: orders.length > 0 ? (totalRevenue / orders.length) : 0,
                pendingDues: pendingDues > 0 ? pendingDues : 0
            },
            revenueTrend: Object.values(dailyData),
            paymentFlow
        };

        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(responseData));
        return res.status(200).json(responseData);

    } catch (error) {
        console.error("Financial Report Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getInventoryInsights = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { businessId: true }
        });

        if (!currentUser?.businessId) {
            return res.status(400).json({ message: "No workspace found." });
        }

        const businessId = currentUser.businessId;

        const cacheKey = `reports:inventory:${businessId}`;
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) return res.status(200).json(JSON.parse(cachedData));

        let topProducts = [];

        try {
            const topSelling = await prisma.orderItem.groupBy({
                by: ['productId'],
                _sum: { quantity: true, price: true },
                where: { order: { businessId, status: { not: "CANCELLED" } } },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5
            });

            for (const item of topSelling) {
                if (!item.productId) continue;

                const prod = await prisma.product.findUnique({
                    where: { id: item.productId },
                    select: { name: true, stock: true, price: true }
                });

                if (prod) {
                    topProducts.push({
                        name: prod.name,
                        sold: item._sum.quantity || 0,
                        revenue: item._sum.price || 0,
                        stock: prod.stock || 0
                    });
                }
            }
        } catch (groupError) {
            console.warn("Inventory top products query failed:", groupError);
            topProducts = [];
        }

        let deadStock = [];

        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const activeProductIds = await prisma.orderItem.findMany({
                where: { order: { businessId, createdAt: { gte: thirtyDaysAgo } } },
                select: { productId: true },
                distinct: ['productId']
            });

            const activeIdsArray = activeProductIds.map(a => a.productId).filter(Boolean);

            const deadStockItems = await prisma.product.findMany({
                where: {
                    businessId,
                    stock: { gt: 0 },
                    id: { notIn: activeIdsArray.length ? activeIdsArray : ['__none__'] }
                },
                select: { name: true, stock: true, costPrice: true, price: true },
                take: 5
            });

            deadStock = deadStockItems.map(p => ({
                name: p.name,
                daysUnsold: 30,
                stock: p.stock || 0,
                tiedValue: (p.stock || 0) * (p.costPrice || p.price || 0)
            }));
        } catch (stockError) {
            console.warn("Inventory dead stock query failed:", stockError);
            deadStock = [];
        }

        const responseData = { success: true, topProducts, deadStock };
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(responseData));
        return res.status(200).json(responseData);

    } catch (error) {
        console.error("Inventory Report Error:", error);
        return res.status(500).json({ message: error.message || "Server error" });
    }
};

export const getStaffPerformance = async (req, res) => {
    try {
        const userId = req.user?.id;
        const currentUser = await prisma.user.findUnique({ where: { id: userId }, select: { businessId: true } });
        const businessId = currentUser.businessId;

        const cacheKey = `reports:staff:${businessId}`;
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) return res.status(200).json(JSON.parse(cachedData));

        const staffStats = await prisma.order.groupBy({
            by: ['createdBy'],
            _sum: { totalAmount: true },
            _count: { id: true },
            where: { businessId, status: { not: "CANCELLED" } }
        });

        const staffPerformance = [];
        for (const stat of staffStats) {
            if (stat.createdBy) {
                const staffUser = await prisma.user.findUnique({ where: { id: stat.createdBy }, select: { name: true, role: true }});
                const roleFormatted = staffUser.role.charAt(0) + staffUser.role.slice(1).toLowerCase();
                staffPerformance.push({
                    name: `${staffUser.name} (${roleFormatted})`,
                    orders: stat._count.id,
                    revenue: stat._sum.totalAmount || 0
                });
            }
        }

        const responseData = { success: true, staffPerformance };
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(responseData));
        return res.status(200).json(responseData);

    } catch (error) {
        console.error("Staff Report Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getCustomerInsights = async (req, res) => {
    try {
        const userId = req.user?.id;
        const currentUser = await prisma.user.findUnique({ where: { id: userId }, select: { businessId: true } });
        const businessId = currentUser.businessId;

        const cacheKey = `reports:customers:${businessId}`;
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) return res.status(200).json(JSON.parse(cachedData));

        const vipStats = await prisma.order.groupBy({
            by: ['customerId'],
            _sum: { totalAmount: true },
            _count: { id: true },
            where: { businessId, status: { not: "CANCELLED" }, customerId: { not: null } },
            orderBy: { _sum: { totalAmount: 'desc' } },
            take: 10
        });

        const vipCustomers = [];
        for (const stat of vipStats) {
            const cust = await prisma.customer.findUnique({ where: { id: stat.customerId }, select: { name: true, isDefaulter: true }});
            vipCustomers.push({
                name: cust.name,
                type: cust.isDefaulter ? "Defaulter" : "Standard",
                orders: stat._count.id,
                spent: stat._sum.totalAmount || 0
            });
        }

        const responseData = { success: true, vipCustomers };
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(responseData));
        return res.status(200).json(responseData);

    } catch (error) {
        console.error("Customer Report Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};