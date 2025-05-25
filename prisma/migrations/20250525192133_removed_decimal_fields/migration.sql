/*
  Warnings:

  - You are about to drop the column `preferred_days` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `preferred_end_time` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `preferred_start_time` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to alter the column `amount_paid` on the `Enrollment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `expected_budget` on the `Leads` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `price` on the `Plans` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - Made the column `expected_budget` on table `Leads` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "preferred_days",
DROP COLUMN "preferred_end_time",
DROP COLUMN "preferred_start_time",
ADD COLUMN     "preferred_time_slots" JSONB,
ALTER COLUMN "amount_paid" SET DEFAULT 0,
ALTER COLUMN "amount_paid" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Leads" ALTER COLUMN "expected_budget" SET NOT NULL,
ALTER COLUMN "expected_budget" SET DEFAULT 0,
ALTER COLUMN "expected_budget" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Plans" ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "price" SET DATA TYPE INTEGER;
