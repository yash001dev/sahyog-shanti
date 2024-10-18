import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const userId = 2; // decoded.userId;
  if (req.method === "GET") {
    try {
      //Get id of the last purchase order
      const lastPurchaseOrder = await prisma.purchaseOrder.findFirst({
        orderBy: { id: "desc" },
      });
      //Purchase Order Number like this currentYear-sequenceNumber
      //Generate New Purchase Order Number Based on the last purchase order
      let purchaseOrderNo = "";
      if (lastPurchaseOrder) {
        const lastPurchaseOrderNo = lastPurchaseOrder.purchaseOrderNo;
        const lastYear = lastPurchaseOrderNo.split("-")[0];
        const currentYear = new Date().getFullYear();
        const sequenceNumber = parseInt(lastPurchaseOrderNo.split("-")[1]) + 1;
        if (lastYear === currentYear.toString()) {
          purchaseOrderNo = `${currentYear}-${sequenceNumber}`;
        } else {
          purchaseOrderNo = `${currentYear}-1`;
        }
      } else {
        purchaseOrderNo = `${new Date().getFullYear()}-1`;
      }
      res.status(200).json({ purchaseOrderNo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
