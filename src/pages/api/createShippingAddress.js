import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const userId = 2; // decoded.userId;

  if (req.method === "POST") {
    const { shippingAddress } = req.body;
    try {
      const createdShippingAddress = await prisma.shippingAddress.create({
        data: {
          address: shippingAddress,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      res.status(201).json(createdShippingAddress);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    try {
      const shippingAddresses = await prisma.shippingAddress.findMany({
        where: {
          createdBy: userId,
        },
      });
      res.status(200).json(shippingAddresses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      const deletedShippingAddress = await prisma.shippingAddress.delete({
        where: {
          id,
        },
      });
      res.status(200).json(deletedShippingAddress);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    const { id, shippingAddress } = req.body;
    try {
      const updatedShippingAddress = await prisma.shippingAddress.update({
        where: {
          id,
        },
        data: {
          address: shippingAddress,
        },
      });
      res.status(200).json(updatedShippingAddress);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
