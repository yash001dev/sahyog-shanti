import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Handle GET and POST requests
export default async function handler(req, res) {
  if (req.method === "GET") {
    // Fetch all users from the database
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  }

  if (req.method === "POST") {
    const { name, email } = req.body;
    try {
      // Create a new user in the database
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
        },
      });
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ error: "User creation failed" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
