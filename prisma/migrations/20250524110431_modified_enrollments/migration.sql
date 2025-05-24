/*
  Warnings:

  - You are about to drop the column `preferred_timings` on the `Enrollment` table. All the data in the column will be lost.
  - The `preferred_days` column on the `Enrollment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `student_id` on table `Enrollment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plan_code` on table `Enrollment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "fk_instrument";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "fk_teacher";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_student_id_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "fk_course";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "fk_plan_name";

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "preferred_timings",
ADD COLUMN     "preferred_end_time" TIMESTAMP(6),
ADD COLUMN     "preferred_start_time" TIMESTAMP(6),
ALTER COLUMN "student_id" SET NOT NULL,
ALTER COLUMN "plan_code" SET NOT NULL,
DROP COLUMN "preferred_days",
ADD COLUMN     "preferred_days" INTEGER[],
ALTER COLUMN "slots_remaining" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "fk_student" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "fk_plan_name" FOREIGN KEY ("plan_code") REFERENCES "Plans"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "fk_course" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "fk_instrument" FOREIGN KEY ("instrument_id") REFERENCES "Instruments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "fk_teacher" FOREIGN KEY ("teacher_id") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
