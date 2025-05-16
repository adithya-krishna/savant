/*
  Warnings:

  - You are about to drop the `counselors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `leads` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stages` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TeamMemberRole" AS ENUM ('STAFF', 'INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "CourseDifficulty" AS ENUM ('FOUNDATION', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "fk_counselor";

-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "fk_stage";

-- DropTable
DROP TABLE "counselors";

-- DropTable
DROP TABLE "leads";

-- DropTable
DROP TABLE "stages";

-- CreateTable
CREATE TABLE "Leads" (
    "id" VARCHAR(20) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "phone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(255),
    "address" TEXT NOT NULL,
    "walkin_date" DATE,
    "expected_budget" DECIMAL(10,2),
    "demo_taken" BOOLEAN DEFAULT false,
    "color_code" VARCHAR(7),
    "number_of_contact_attempts" INTEGER DEFAULT 0,
    "last_contacted_date" TIMESTAMP(6),
    "next_followup" TIMESTAMP(6),
    "stage_id" VARCHAR(20),
    "team_member_id" VARCHAR(20),
    "instrument_id" VARCHAR(20),
    "source_id" VARCHAR(20),
    "create_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sources" (
    "id" VARCHAR(20) NOT NULL,
    "source" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "Sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instruments" (
    "id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "Instruments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "difficulty" "CourseDifficulty" DEFAULT 'FOUNDATION',
    "description" VARCHAR(255),
    "instrument_id" VARCHAR(20),
    "teacher_id" VARCHAR(20),

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" VARCHAR(20) NOT NULL,
    "lead_id" VARCHAR(20),
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "parent_first_name" VARCHAR(100),
    "parent_last_name" VARCHAR(100),
    "parent_phone" VARCHAR(15),
    "address" TEXT,
    "gmaps_place_id" VARCHAR(255),
    "gmaps_url" VARCHAR(1024),
    "gmaps_latitude" DECIMAL(10,8),
    "gmaps_longitude" DECIMAL(11,8),
    "dob" DATE NOT NULL,
    "gender" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100),
    "primary_contact" VARCHAR(20) NOT NULL,
    "secondary_contact" VARCHAR(20),
    "intended_subject" VARCHAR(100),
    "learning_goal" VARCHAR(100),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" VARCHAR(20) NOT NULL,
    "student_id" VARCHAR(20),
    "plan_code" VARCHAR(10),
    "course_id" VARCHAR(20),
    "amount_paid" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "preferred_timings" VARCHAR(50),
    "preferred_days" VARCHAR(50),
    "teacher_name" VARCHAR(100),
    "classes_remaining" INTEGER NOT NULL DEFAULT 0,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plans" (
    "code" VARCHAR(10) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Plans_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Stage" (
    "id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" VARCHAR(20) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(15) NOT NULL,
    "role" "TeamMemberRole" NOT NULL DEFAULT 'STAFF',
    "active" BOOLEAN DEFAULT true,
    "create_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Leads_email_key" ON "Leads"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Instruments_name_key" ON "Instruments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Student_lead_id_key" ON "Student"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "Stage_name_key" ON "Stage"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_email_key" ON "TeamMember"("email");

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "fk_stage" FOREIGN KEY ("stage_id") REFERENCES "Stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "fk_team_member" FOREIGN KEY ("team_member_id") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "fk_instrument" FOREIGN KEY ("instrument_id") REFERENCES "Instruments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "fk_source" FOREIGN KEY ("source_id") REFERENCES "Sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "fk_instrument" FOREIGN KEY ("instrument_id") REFERENCES "Instruments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "fk_teacher" FOREIGN KEY ("teacher_id") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "fk_lead" FOREIGN KEY ("lead_id") REFERENCES "Leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "fk_student" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "fk_plan_name" FOREIGN KEY ("plan_code") REFERENCES "Plans"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "fk_course" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
