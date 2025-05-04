/*
  Warnings:

  - You are about to drop the column `stageID` on the `leads` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_stageID_fkey";

-- AlterTable
ALTER TABLE "leads" DROP COLUMN "stageID",
ADD COLUMN     "stage_id" VARCHAR(20);

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "fk_stage" FOREIGN KEY ("stage_id") REFERENCES "stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
