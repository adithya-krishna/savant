-- DropIndex
DROP INDEX "Course_instrument_id_idx";

-- DropIndex
DROP INDEX "Course_teacher_id_idx";

-- DropIndex
DROP INDEX "Enrollment_course_id_idx";

-- DropIndex
DROP INDEX "Enrollment_is_deleted_idx";

-- DropIndex
DROP INDEX "Enrollment_student_id_idx";

-- DropIndex
DROP INDEX "Notes_author_id_idx";

-- DropIndex
DROP INDEX "Notes_create_at_idx";

-- DropIndex
DROP INDEX "Notes_lead_id_idx";

-- DropIndex
DROP INDEX "Student_is_deleted_idx";

-- DropIndex
DROP INDEX "Student_lead_id_idx";

-- AlterTable
ALTER TABLE "Enrollment" ALTER COLUMN "is_deleted" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Course_instrument_id_teacher_id_idx" ON "Course"("instrument_id", "teacher_id");

-- CreateIndex
CREATE INDEX "Enrollment_student_id_course_id_is_deleted_idx" ON "Enrollment"("student_id", "course_id", "is_deleted");

-- CreateIndex
CREATE INDEX "Notes_lead_id_author_id_create_at_idx" ON "Notes"("lead_id", "author_id", "create_at");

-- CreateIndex
CREATE INDEX "Student_lead_id_is_deleted_idx" ON "Student"("lead_id", "is_deleted");
