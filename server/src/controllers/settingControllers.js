import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createClient } from 'redis';

const prisma = new PrismaClient();

const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
await redisClient.connect();

export const profileInfo = async (req, res) => {
  try {
    const userId = req.user.id; 

    const cacheKey = `profile:${userId}`;
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log("Serving Profile from Redis Cache! ⚡");
      return res.status(200).json({ success: true, profile: JSON.parse(cachedData) });
    }

    const profile = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, phone: true, avatarUrl: true, role: true },
    });

    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(profile));

    console.log("Serving Profile from PostgreSQL! 🐘");
    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error('Error fetching profile info:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const businessInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    // First, find which business this user belongs to
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { businessId: true }
    });

    if (!user || !user.businessId) {
      return res.status(404).json({ success: false, message: 'Business info not found' });
    }

    // 🟢 REDIS: Check Cache using Business ID (So it's shared across all staff!)
    const cacheKey = `business:${user.businessId}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Serving Business Info from Redis Cache! ⚡");
      return res.status(200).json({ success: true, business: JSON.parse(cachedData) });
    }

    // Fetch Business from DB
    const businessData = await prisma.business.findUnique({
      where: { id: user.businessId },
      select: { id: true, name: true, phone: true, email: true, currency: true, address: true, logoUrl: true, slug: true }
    });

    // 🟢 REDIS: Save to Cache for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(businessData));

    console.log("Serving Business Info from PostgreSQL! 🐘");
    res.status(200).json({ success: true, business: businessData });
  } catch (error) {
    console.error('Error fetching business info:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateProfileInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, newPassword } = req.body; 

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    if (req.file && req.file.path) {
      updateData.avatarUrl = req.file.path; 
    }

    if (newPassword && newPassword.trim() !== "") {
       updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedProfile = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { name: true, email: true, phone: true, avatarUrl: true, role: true } 
    });

    await redisClient.del(`profile:${userId}`);
    console.log(`🧹 Cleared Profile cache for user ${userId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully', 
      profile: updatedProfile 
    });

  } catch (error) {
     console.error('Error updating profile:', error);
     return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateBusinessInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, email, currency, address } = req.body;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { businessId: true, role: true }
    });

    if (!currentUser?.businessId) {
      return res.status(400).json({ success: false, message: "No business found." });
    }

    if (currentUser.role !== 'OWNER') {
        return res.status(403).json({ success: false, message: "Only the workspace owner can change business settings." });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (currency) updateData.currency = currency;
    if (address) updateData.address = address;

    if (req.file && req.file.path) {
      updateData.logoUrl = req.file.path; 
    }

    const updatedBusiness = await prisma.business.update({
      where: { id: currentUser.businessId },
      data: updateData
    });

    await redisClient.del(`business:${currentUser.businessId}`);
    console.log(`🧹 Cleared Business cache for business ${currentUser.businessId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Business updated successfully', 
      business: updatedBusiness 
    });

  } catch (error) {
    console.error('Error updating business info:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};