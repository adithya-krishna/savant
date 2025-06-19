-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('DEFAULT', 'STAFF', 'INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "TeamMemberRole" AS ENUM ('STAFF', 'INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "CourseDifficulty" AS ENUM ('FOUNDATION', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNDISCLOSED');

-- CreateTable
CREATE TABLE "Leads" (
    "id" VARCHAR(20) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "phone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(255),
    "area" VARCHAR(255),
    "community" VARCHAR(100),
    "walkin_date" DATE,
    "expected_budget" INTEGER NOT NULL DEFAULT 0,
    "demo_taken" BOOLEAN DEFAULT false,
    "number_of_contact_attempts" INTEGER DEFAULT 0,
    "last_contacted_date" TIMESTAMPTZ(6),
    "next_followup" TIMESTAMPTZ(6),
    "stage_id" VARCHAR(20),
    "team_member_id" VARCHAR(20),
    "source_id" VARCHAR(20),
    "create_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMPTZ(6),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "Leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" VARCHAR(20) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "parent_first_name" VARCHAR(100) NOT NULL,
    "parent_last_name" VARCHAR(100),
    "parent_phone" VARCHAR(15),
    "address" TEXT,
    "gmaps_place_id" VARCHAR(255),
    "gmaps_url" VARCHAR(1024),
    "gmaps_latitude" DECIMAL(10,8),
    "gmaps_longitude" DECIMAL(11,8),
    "dob" DATE NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'UNDISCLOSED',
    "email" VARCHAR(100),
    "primary_contact" VARCHAR(20) NOT NULL,
    "secondary_contact" VARCHAR(20),
    "intended_subject" VARCHAR(100),
    "learning_goal" VARCHAR(100),
    "create_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMPTZ(6) NOT NULL,
    "lead_id" VARCHAR(20),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" VARCHAR(20) NOT NULL,
    "amount_paid" INTEGER NOT NULL DEFAULT 0,
    "start_date" DATE NOT NULL,
    "preferred_time_slots" JSONB,
    "slots_remaining" INTEGER NOT NULL DEFAULT 0,
    "student_id" VARCHAR(20) NOT NULL,
    "plan_code" VARCHAR(10) NOT NULL,
    "course_id" VARCHAR(20) NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "create_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMPTZ(6) NOT NULL,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "difficulty" "CourseDifficulty" NOT NULL DEFAULT 'FOUNDATION',
    "description" VARCHAR(255),
    "instrument_id" VARCHAR(20),
    "create_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plans" (
    "code" VARCHAR(10) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "total_slots" INTEGER NOT NULL DEFAULT 0,
    "description" VARCHAR(255),
    "create_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Plans_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Stage" (
    "id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "color" VARCHAR(10) DEFAULT '#99a1af',

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "TeamMember" (
    "id" VARCHAR(20) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "bio" TEXT,
    "avatar" VARCHAR(255),
    "phone" VARCHAR(15) NOT NULL,
    "role" "TeamMemberRole" NOT NULL DEFAULT 'STAFF',
    "active" BOOLEAN DEFAULT false,
    "create_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMPTZ(6) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notes" (
    "id" VARCHAR(20) NOT NULL,
    "content" TEXT NOT NULL,
    "is_pinned" BOOLEAN,
    "author_id" VARCHAR(20) NOT NULL,
    "lead_id" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" VARCHAR(20) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "start_date_time" TIMESTAMPTZ(6) NOT NULL,
    "end_date_time" TIMESTAMPTZ(6) NOT NULL,
    "host_id" TEXT NOT NULL,
    "created_by_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "UserRoles" NOT NULL DEFAULT 'DEFAULT',
    "team_member_id" TEXT,
    "student_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventGuests" (
    "A" VARCHAR(20) NOT NULL,
    "B" VARCHAR(20) NOT NULL,

    CONSTRAINT "_EventGuests_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TeacherCourses" (
    "A" VARCHAR(20) NOT NULL,
    "B" VARCHAR(20) NOT NULL,

    CONSTRAINT "_TeacherCourses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_LeadInstrument" (
    "A" VARCHAR(20) NOT NULL,
    "B" VARCHAR(20) NOT NULL,

    CONSTRAINT "_LeadInstrument_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Leads_email_key" ON "Leads"("email");

-- CreateIndex
CREATE INDEX "Leads_is_deleted_idx" ON "Leads"("is_deleted");

-- CreateIndex
CREATE INDEX "Student_is_deleted_idx" ON "Student"("is_deleted");

-- CreateIndex
CREATE INDEX "Enrollment_student_id_idx" ON "Enrollment"("student_id");

-- CreateIndex
CREATE INDEX "Enrollment_course_id_idx" ON "Enrollment"("course_id");

-- CreateIndex
CREATE INDEX "Enrollment_is_deleted_idx" ON "Enrollment"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stage_name_key" ON "Stage"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Instruments_name_key" ON "Instruments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_email_key" ON "TeamMember"("email");

-- CreateIndex
CREATE INDEX "TeamMember_is_deleted_idx" ON "TeamMember"("is_deleted");

-- CreateIndex
CREATE INDEX "Notes_lead_id_idx" ON "Notes"("lead_id");

-- CreateIndex
CREATE INDEX "Notes_author_id_idx" ON "Notes"("author_id");

-- CreateIndex
CREATE INDEX "Notes_created_at_idx" ON "Notes"("created_at");

-- CreateIndex
CREATE INDEX "Event_host_id_idx" ON "Event"("host_id");

-- CreateIndex
CREATE INDEX "Event_start_date_time_idx" ON "Event"("start_date_time");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_team_member_id_key" ON "users"("team_member_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_student_id_key" ON "users"("student_id");

-- CreateIndex
CREATE INDEX "_EventGuests_B_index" ON "_EventGuests"("B");

-- CreateIndex
CREATE INDEX "_TeacherCourses_B_index" ON "_TeacherCourses"("B");

-- CreateIndex
CREATE INDEX "_LeadInstrument_B_index" ON "_LeadInstrument"("B");

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "fk_stage" FOREIGN KEY ("stage_id") REFERENCES "Stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "fk_team_member" FOREIGN KEY ("team_member_id") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "fk_source" FOREIGN KEY ("source_id") REFERENCES "Sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_plan_code_fkey" FOREIGN KEY ("plan_code") REFERENCES "Plans"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instrument_id_fkey" FOREIGN KEY ("instrument_id") REFERENCES "Instruments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "TeamMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventGuests" ADD CONSTRAINT "_EventGuests_A_fkey" FOREIGN KEY ("A") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventGuests" ADD CONSTRAINT "_EventGuests_B_fkey" FOREIGN KEY ("B") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherCourses" ADD CONSTRAINT "_TeacherCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherCourses" ADD CONSTRAINT "_TeacherCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadInstrument" ADD CONSTRAINT "_LeadInstrument_A_fkey" FOREIGN KEY ("A") REFERENCES "Instruments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadInstrument" ADD CONSTRAINT "_LeadInstrument_B_fkey" FOREIGN KEY ("B") REFERENCES "Leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
