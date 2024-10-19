import { PrismaClient } from "@prisma/client";
import { sendEmail } from "./purchaseOrder";

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

    try {
      if (status === "Approved") {
        //Get the purchase orders
        const purchaseOrders = await prisma.purchaseOrder.findMany({
          where: {
            id: {
              in: ids,
            },
            createdBy: userId,
          },
        });

        //Traverse through purchase orders and get company email
        for (const purchaseOrder of purchaseOrders) {
          const companyEmail = await prisma.company.findUnique({
            where: {
              id: purchaseOrder.companyId,
            },
            select: {
              email: true,
            },
          });

          //Get the shipping address
          const shippingAddress = await prisma.shippingAddress.findUnique({
            where: {
              id: purchaseOrder.shippingAddressId,
            },
          });

          //Book Information
          const books = await prisma.book.findMany({
            where: {
              purchaseOrderId: purchaseOrder.id,
            },
          });

          if (companyEmail) {
            await sendEmail(companyEmail.email, {
              ...purchaseOrder,
              books,
              shippingAddress: shippingAddress.address,
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
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
