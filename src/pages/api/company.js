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
    //Want only single company
    if (req.query.id) {
      const { id } = req.query;
      try {
        const company = await prisma.company.findUnique({
          where: { id: parseInt(id), createdBy: userId },
        });
        return res.status(200).json(company);
      } catch (error) {
        return res.status(500).json({ error: "Failed to fetch company" });
      }
    } else {
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

  if (req.method === "PUT") {
    const { id, name, email, whatsappNumber } = req.body;

    if (!id || !name) {
      return res
        .status(400)
        .json({ error: "Company ID and name are mandatory" });
    }

    try {
      const updatedCompany = await prisma.company.update({
        where: { id },
        data: { name, email, whatsappNumber },
      });
      return res.status(200).json(updatedCompany);
    } catch (error) {
      return res.status(500).json({ error: "Company update failed" });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Company ID is mandatory" });
    }

    try {
      await prisma.company.delete({
        where: { id },
      });
      return res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Company deletion failed" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
