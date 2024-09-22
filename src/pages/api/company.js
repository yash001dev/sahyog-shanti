import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  //   const token = req.headers.authorization?.split(" ")[1];

  //   if (!token) {
  //     return res.status(401).json({ error: "Authorization token required" });
  //   }

  //   const decoded = verifyToken(token);
  //   if (!decoded) {
  //     return res.status(401).json({ error: "Invalid or expired token" });
  //   }
  const userId = 2; // decoded.userId;
  if (req.method === "GET") {
    try {
      // Fetch all companies created by the authenticated user
      const companies = await prisma.company.findMany({
        where: {
          createdBy: userId, // Filter by the user who created the companies
        },
      });
      return res.status(200).json(companies);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch companies" });
    }
  }

  if (req.method === "POST") {
    const { name, email, whatsappNumber } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Company name is mandatory" });
    }

    try {
      // Create a new company and associate it with the authenticated user
      const newCompany = await prisma.company.create({
        data: {
          name,
          email,
          whatsappNumber,
          createdBy: userId ?? 2, // Associate the company with the user
        },
      });
      return res.status(201).json(newCompany);
    } catch (error) {
      return res.status(500).json({ error: "Company creation failed" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
