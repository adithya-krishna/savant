/*
  Warnings:

  - You are about to drop the column `create_at` on the `Notes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "fk_course";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "fk_plan_name";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "fk_student";

-- DropIndex
DROP INDEX "Course_instrument_id_teacher_id_idx";

-- DropIndex
DROP INDEX "Enrollment_student_id_course_id_is_deleted_idx";

-- DropIndex
DROP INDEX "Notes_lead_id_author_id_create_at_idx";

-- DropIndex
DROP INDEX "Student_lead_id_is_deleted_idx";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updated_date" DROP DEFAULT,
ALTER COLUMN "updated_date" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Enrollment" ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updated_date" DROP DEFAULT,
ALTER COLUMN "updated_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Leads" ALTER COLUMN "last_contacted_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "next_followup" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updated_date" DROP DEFAULT,
ALTER COLUMN "updated_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "create_at",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Plans" ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updated_date" DROP DEFAULT,
ALTER COLUMN "updated_date" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updated_date" DROP DEFAULT,
ALTER COLUMN "updated_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "TeamMember" ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updated_date" DROP DEFAULT,
ALTER COLUMN "updated_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMPTZ(6);

-- CreateTable
CREATE TABLE "Event" (
    "id" VARCHAR(20) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "start_date_time" TIMESTAMPTZ(6) NOT NULL,
    "end_date_time" TIMESTAMPTZ(6) NOT NULL,
    "series_id" VARCHAR(20),
    "host_id" TEXT,
    "created_by_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSeries" (
    "id" VARCHAR(20) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "recurrence_rule" TEXT NOT NULL,
    "start_date" TIMESTAMPTZ(6) NOT NULL,
    "end_date" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "host_id" VARCHAR(20),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "EventSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exclusion" (
    "id" VARCHAR(20) NOT NULL,
    "series_id" VARCHAR(20) NOT NULL,
    "event_id" VARCHAR(20) NOT NULL,
    "reason" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exclusion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventGuests" (
    "A" VARCHAR(20) NOT NULL,
    "B" VARCHAR(20) NOT NULL,

    CONSTRAINT "_EventGuests_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Event_series_id_idx" ON "Event"("series_id");

-- CreateIndex
CREATE INDEX "Event_host_id_idx" ON "Event"("host_id");

-- CreateIndex
CREATE INDEX "Event_start_date_time_idx" ON "Event"("start_date_time");

-- CreateIndex
CREATE INDEX "EventSeries_host_id_idx" ON "EventSeries"("host_id");

-- CreateIndex
CREATE UNIQUE INDEX "Exclusion_series_id_event_id_key" ON "Exclusion"("series_id", "event_id");

-- CreateIndex
CREATE INDEX "_EventGuests_B_index" ON "_EventGuests"("B");

-- CreateIndex
CREATE INDEX "Enrollment_student_id_idx" ON "Enrollment"("student_id");

-- CreateIndex
CREATE INDEX "Enrollment_course_id_idx" ON "Enrollment"("course_id");

-- CreateIndex
CREATE INDEX "Enrollment_is_deleted_idx" ON "Enrollment"("is_deleted");

-- CreateIndex
CREATE INDEX "Notes_lead_id_idx" ON "Notes"("lead_id");

-- CreateIndex
CREATE INDEX "Notes_author_id_idx" ON "Notes"("author_id");

-- CreateIndex
CREATE INDEX "Notes_created_at_idx" ON "Notes"("created_at");

-- CreateIndex
CREATE INDEX "Student_is_deleted_idx" ON "Student"("is_deleted");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "fk_student" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "fk_plan_name" FOREIGN KEY ("plan_code") REFERENCES "Plans"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "fk_course" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "EventSeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSeries" ADD CONSTRAINT "EventSeries_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exclusion" ADD CONSTRAINT "Exclusion_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "EventSeries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exclusion" ADD CONSTRAINT "Exclusion_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventGuests" ADD CONSTRAINT "_EventGuests_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventGuests" ADD CONSTRAINT "_EventGuests_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
