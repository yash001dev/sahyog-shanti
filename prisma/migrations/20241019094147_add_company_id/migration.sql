-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "companyId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
