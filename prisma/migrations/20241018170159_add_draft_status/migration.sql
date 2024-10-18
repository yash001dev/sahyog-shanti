-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Draft', 'InTransit', 'Delivered');

-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "currentStatus" "Status" NOT NULL DEFAULT 'Draft';
