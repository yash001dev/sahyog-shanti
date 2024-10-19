import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const userId = 2; // decoded.userId;

  if (req.method === "PUT") {
    const { ids, status } = req.body;

    if (!ids) {
      return res.status(400).json({ error: "Purchase Order Id is required" });
    }

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    //Update current status of purchase order
    try {
      const updatedPurchaseOrders = await prisma.purchaseOrder.updateMany({
        where: {
          id: {
            in: ids,
          },
          createdBy: userId,
        },
        data: {
          currentStatus: status,
        },
      });

      res.status(200).json(updatedPurchaseOrders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
