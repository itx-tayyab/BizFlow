import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

const prisma = new PrismaClient();

const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
await redisClient.connect();

export const addCategory = async (req, res) => {
  try {
    const user = req.user?.id;
    const { name } = req.body;

    if (!user) return res.status(401).json({ message: "User not found" });

    const currentUser = await prisma.user.findUnique({
      where: { id: user },
      select: { businessId: true }
    });

    const businessId = currentUser.businessId;

    if (!businessId) {
      return res.status(400).json({ message: "User does not have an associated business" });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const categoryName = name.trim();

    const existingCategory = await prisma.category.findFirst({
      where: {
        businessId,
        name: {
          equals: name,
          mode: "insensitive"
        }
      }
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists"
      });
    }

    const category = await prisma.category.create({
      data: {
        name: categoryName,
        businessId: businessId
      }
    });

    const cacheKey = `categories:${businessId}`;
    await redisClient.del(cacheKey);
    console.log(`Cache cleared for key: ${cacheKey} 🧹`);

    res.status(201).json({
      message: "Category Created Successfully",
      category: category
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getCategories = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { businessId: true }
    });

    if (!currentUser?.businessId) {
      return res.status(400).json({ success: false, message: "No business found." });
    }

    const businessId = currentUser.businessId;

    const cacheKey = `categories:${businessId}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving from Redis Cache! ⚡");
      return res.status(200).json({ success: true, categories: JSON.parse(cachedData) });
    }

    const categories = await prisma.category.findMany({
      where: { businessId: businessId },
    });

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(categories));

    console.log("Serving from PostgreSQL Database! 🐘");
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Get Categories Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const user = req.user?.id;
    const { name, price, category, stock, sku } = req.body;

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: user },
      select: { businessId: true }
    });

    const categoryExists = await prisma.category.findFirst({
      where: {
        name: category,
        businessId: currentUser.businessId
      },
      select: { id: true }
    });

    if (!categoryExists) {
      return res.status(400).json({ message: "Category does not exist" });
    }

    if (!currentUser || !currentUser.businessId) {
      return res.status(400).json({ message: "User does not have an associated business" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        categoryId: categoryExists.id,
        stock,
        sku,
        businessId: currentUser.businessId
      }
    });

    const keys = await redisClient.keys(`products:${currentUser.businessId}:*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    };

    res.status(201).json({
      message: "Product Created Successfully",
      product: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getProducts = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { search, category, stock } = req.query;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { businessId: true }
    });

    if (!currentUser?.businessId) {
      return res.status(400).json({ success: false, message: "No business found." });
    }

    const businessId = currentUser.businessId;

    const cacheKey = `products:${businessId}:search=${search || 'none'}:cat=${category || 'all'}:stock=${stock || 'all'}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving from Redis Cache! ⚡");
      return res.status(200).json({ success: true, products: JSON.parse(cachedData) });
    }

    let queryConditions = {
      businessId: businessId,
    };

    if (search) {
      queryConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category && category !== "All") {
      queryConditions.category = {
        name: category
      };
    }

    if (stock === "out") {
      queryConditions.stock = 0;
    } else if (stock === "low") {
      queryConditions.stock = { gt: 0, lte: 5 };
    }

    const products = await prisma.product.findMany({
      where: queryConditions,
      include: {
        category: true
      },
    });

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(products));

    console.log("Serving from PostgreSQL Database! 🐘");
    return res.status(200).json({ success: true, products });

  } catch (error) {
    console.error("Get Products Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// export const deleteProduct = async (req, res) => {
//   try {
//     const user = req.user?.id;
//     const { id } = req.params;

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     const currentUser = await prisma.user.findUnique({
//       where: { id: user },
//       select: { businessId: true }
//     });

//     if (!currentUser || !currentUser.businessId) {
//       return res.status(400).json({ message: "User does not have an associated business" });
//     }

//     const product = await prisma.product.findUnique({
//       where: { id: id },
//       select: { businessId: true }
//     });

//     if (!product || product.businessId !== currentUser.businessId) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     await prisma.product.delete({
//       where: { id: id }
//     });

//     const keys = await redisClient.keys(`products:${currentUser.businessId}:*`);
//     if (keys.length > 0) {
//       await redisClient.del(keys);
//     };

//     res.status(200).json({
//       message: "Product Deleted Successfully",
//       product: product
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

