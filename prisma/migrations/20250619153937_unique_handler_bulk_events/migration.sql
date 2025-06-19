/*
  Warnings:

  - A unique constraint covering the columns `[host_id,start_date_time,end_date_time]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_author_id_fkey";

-- AlterTable
ALTER TABLE "Notes" ALTER COLUMN "author_id" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Event_host_id_start_date_time_end_date_time_key" ON "Event"("host_id", "start_date_time", "end_date_time");

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
