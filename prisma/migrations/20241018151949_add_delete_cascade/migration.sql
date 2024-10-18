-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_purchaseOrderId_fkey";

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
