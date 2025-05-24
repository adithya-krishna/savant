/*
  Warnings:

  - You are about to drop the column `classes_remaining` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `teacher_name` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to alter the column `amount_paid` on the `Enrollment` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to drop the column `address` on the `Leads` table. All the data in the column will be lost.
  - You are about to drop the column `color_code` on the `Leads` table. All the data in the column will be lost.
  - The primary key for the `Notes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `price` on the `Plans` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(10,2)`.
  - The `gender` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNDISCLOSED');

-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "fk_author";

-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "fk_lead";

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "classes_remaining",
DROP COLUMN "teacher_name",
ADD COLUMN     "slots_remaining" INTEGER NOT NULL DEFAULT -1,
ALTER COLUMN "amount_paid" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Leads" DROP COLUMN "address",
DROP COLUMN "color_code",
ADD COLUMN     "community" VARCHAR(100);

-- AlterTable
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "author_id" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "lead_id" SET DATA TYPE VARCHAR(20),
ADD CONSTRAINT "Notes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Plans" ADD COLUMN     "total_slots" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'UNDISCLOSED';

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "fk_author" FOREIGN KEY ("author_id") REFERENCES "TeamMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "fk_lead" FOREIGN KEY ("lead_id") REFERENCES "Leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
