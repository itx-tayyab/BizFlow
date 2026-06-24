import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const BusinessOnboarding = async (req, res) => {
    const {
        name,
        industry,
        teamSize,
        currency,
        phone, 
        address, 
        slug,
        ownerId
    } = req.body;

    if (!ownerId) {
        return res.status(400).json({ message: "ownerId is required" });
    }

    try {
        const existingBusiness = await prisma.business.findUnique({
            where: { slug: slug }
        });
        
        if (existingBusiness) {
            return res.status(400).json({ message: "Business Slug Already Exists" });
        }

        const result = await prisma.$transaction(async (tx) => {
            
            // A. Create the Business
            const newBusiness = await tx.business.create({
                data: {
                    name: name,
                    industry: industry,
                    teamSize: teamSize,
                    currency: currency,
                    slug: slug,
                    phone: phone,
                    address: address,
                    ownerId: ownerId,
                }
            });

            await tx.user.update({
                where: { id: ownerId },
                data: {
                    role: "OWNER",
                    businessId: newBusiness.id // 🟢 Replaces null with the new ID
                }
            });

            return newBusiness;
        });

        res.status(201).json({
            message: "Business Onboarding Successful",
            business: result
        });

    } catch (err) {
        console.error("Onboarding Error:", err);
        res.status(500).json({ message: "Server error" });
    }
}