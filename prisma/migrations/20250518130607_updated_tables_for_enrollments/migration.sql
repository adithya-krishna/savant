/*
  Warnings:

  - You are about to drop the column `create_date` on the `Instruments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_date` on the `Instruments` table. All the data in the column will be lost.
  - You are about to drop the column `instrument_id` on the `Leads` table. All the data in the column will be lost.
  - Made the column `course_id` on table `Enrollment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `parent_first_name` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `create_date` on table `TeamMember` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_date` on table `TeamMember` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "fk_course";

-- DropForeignKey
ALTER TABLE "Leads" DROP CONSTRAINT "fk_instrument";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "create_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Enrollment" ALTER COLUMN "course_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Instruments" DROP COLUMN "create_date",
DROP COLUMN "updated_date";

-- AlterTable
ALTER TABLE "Leads" DROP COLUMN "instrument_id",
ALTER COLUMN "color_code" SET DEFAULT '#99a1af',
ALTER COLUMN "color_code" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "Plans" ADD COLUMN     "create_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" VARCHAR(255),
ADD COLUMN     "updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Stage" ADD COLUMN     "color" VARCHAR(10) DEFAULT '#99a1af';

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "parent_first_name" SET NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TeamMember" ALTER COLUMN "create_date" SET NOT NULL,
ALTER COLUMN "updated_date" SET NOT NULL;

-- CreateTable
CREATE TABLE "_LeadInstrument" (
    "A" VARCHAR(20) NOT NULL,
    "B" VARCHAR(20) NOT NULL,

    CONSTRAINT "_LeadInstrument_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LeadInstrument_B_index" ON "_LeadInstrument"("B");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "fk_course" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadInstrument" ADD CONSTRAINT "_LeadInstrument_A_fkey" FOREIGN KEY ("A") REFERENCES "Instruments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadInstrument" ADD CONSTRAINT "_LeadInstrument_B_fkey" FOREIGN KEY ("B") REFERENCES "Leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
