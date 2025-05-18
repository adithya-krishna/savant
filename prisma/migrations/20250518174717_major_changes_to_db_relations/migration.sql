-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED', 'ON_HOLD');

-- DropIndex
DROP INDEX "Student_lead_id_key";

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "deleted_at" TIMESTAMP(6),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Leads" ADD COLUMN     "deleted_at" TIMESTAMP(6),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Plans" ALTER COLUMN "price" SET DATA TYPE DECIMAL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "deleted_at" TIMESTAMP(6),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "deleted_at" TIMESTAMP(6),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "active" SET DEFAULT false;

-- CreateIndex
CREATE INDEX "Course_instrument_id_idx" ON "Course"("instrument_id");

-- CreateIndex
CREATE INDEX "Course_teacher_id_idx" ON "Course"("teacher_id");

-- CreateIndex
CREATE INDEX "Enrollment_student_id_idx" ON "Enrollment"("student_id");

-- CreateIndex
CREATE INDEX "Enrollment_course_id_idx" ON "Enrollment"("course_id");

-- CreateIndex
CREATE INDEX "Enrollment_is_deleted_idx" ON "Enrollment"("is_deleted");

-- CreateIndex
CREATE INDEX "Leads_is_deleted_idx" ON "Leads"("is_deleted");

-- CreateIndex
CREATE INDEX "Student_is_deleted_idx" ON "Student"("is_deleted");

-- CreateIndex
CREATE INDEX "Student_lead_id_idx" ON "Student"("lead_id");

-- CreateIndex
CREATE INDEX "TeamMember_is_deleted_idx" ON "TeamMember"("is_deleted");

-- RenameForeignKey
ALTER TABLE "Enrollment" RENAME CONSTRAINT "fk_student" TO "Enrollment_student_id_fkey";

-- RenameForeignKey
ALTER TABLE "Student" RENAME CONSTRAINT "fk_lead" TO "Student_lead_id_fkey";
