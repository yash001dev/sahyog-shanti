-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "vendorInvoice" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vendorName" TEXT;
