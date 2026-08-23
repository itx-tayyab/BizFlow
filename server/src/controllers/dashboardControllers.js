import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

const prisma = new PrismaClient();

const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
await redisClient.connect();

const CACHE_TTL = 900;

const formatRelativeTime = (dateValue) => {
    const diffMs = Date.now() - new Date(dateValue).getTime();
    const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

    if (diffMinutes < 60) return `${diffMinutes} min ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return new Date(dateValue).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { businessId: true }
        });

        if (!currentUser?.businessId) {
            return res.status(400).json({ message: 'User does not belong to a workspace' });
        }

        const businessId = currentUser.businessId;
        const cacheKey = `dashboard:${businessId}`;
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) return res.status(200).json(JSON.parse(cachedData));

        const now = new Date();
        const startOfToday = new Date(now); startOfToday.setHours(0,0,0,0);
        const startOfSevenDays = new Date(now); startOfSevenDays.setDate(startOfSevenDays.getDate() - 6); startOfSevenDays.setHours(0,0,0,0);

        const [orders, todaysOrders, unpaidOrders, paymentBreakdown] = await Promise.all([
            prisma.order.findMany({
                where: {
                    businessId,
                    status: { not: 'CANCELLED' }
                },
                include: {
                    customer: { select: { name: true } },
                    payments: { select: { amount: true } }
                },
                orderBy: { createdAt: 'desc' },
                take: 10
            }),
            prisma.order.findMany({
                where: {
                    businessId,
                    status: { not: 'CANCELLED' },
                    createdAt: { gte: startOfToday }
                },
                select: { totalAmount: true }
            }),
            prisma.order.findMany({
                where: {
                    businessId,
                    status: { not: 'CANCELLED' },
                    paymentStatus: { in: ['UNPAID', 'PARTIAL'] }
                },
                select: { id: true, totalAmount: true, paymentStatus: true, customerId: true, createdAt: true, payments: { select: { amount: true } } }
            }),
            prisma.payment.groupBy({
                by: ['method'],
                _sum: { amount: true },
                where: {
                    order: {
                        businessId,
                        createdAt: { gte: startOfSevenDays }
                    }
                }
            })
        ]);

        const todayRevenue = todaysOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
        const pendingPayments = unpaidOrders.reduce((sum, order) => {
            const totalPaid = order.payments.reduce((paymentSum, payment) => paymentSum + Number(payment.amount || 0), 0);
            return sum + Math.max(0, Number(order.totalAmount || 0) - totalPaid);
        }, 0);

        const activeOrders = await prisma.order.count({
            where: {
                businessId,
                status: { not: 'CANCELLED' }
            }
        });

        const pendingOrderCount = unpaidOrders.length;

        const chartData = [];
        for (let i = 6; i >= 0; i -= 1) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            const dayKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const dayRevenue = orders
                .filter((order) => {
                    const createdAt = new Date(order.createdAt);
                    return createdAt >= date && createdAt < nextDay;
                })
                .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

            chartData.push({ name: dayKey.split(' ')[0], revenue: dayRevenue });
        }

        const paymentHealth = [
            {
                name: 'Paid Securely',
                value: paymentBreakdown.find((item) => item.method === 'CASH')?._sum.amount || 0,
                color: '#10b981'
            },
            {
                name: 'Pending (Udhaar)',
                value: pendingPayments,
                color: '#f43f5e'
            },
            {
                name: 'Partial Advances',
                value: paymentBreakdown.find((item) => item.method === 'BANK')?._sum.amount || 0,
                color: '#f59e0b'
            }
        ];

        const recentOrders = orders.slice(0, 5).map((order) => ({
            orderNumber: order.orderNumber,
            customerName: order.customer?.name || 'Walk-in Customer',
            totalAmount: Number(order.totalAmount || 0),
            paymentStatus: order.paymentStatus,
            relativeTime: formatRelativeTime(order.createdAt)
        }));

        const responseData = {
            success: true,
            kpis: {
                todayRevenue,
                pendingPayments,
                activeOrders,
                pendingOrderCount
            },
            chartData,
            paymentHealth,
            recentOrders
        };

        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(responseData));
        return res.status(200).json(responseData);
    } catch (error) {
        console.error('Dashboard Data Error:', error);
        return res.status(500).json({ message: error.message || 'Server error' });
    }
};
