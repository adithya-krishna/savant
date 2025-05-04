-- CreateTable
CREATE TABLE "counselors" (
    "id" VARCHAR(20) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(15) NOT NULL,
    "country_code" VARCHAR(5) DEFAULT '+91',
    "role" VARCHAR(50),
    "active" BOOLEAN DEFAULT true,
    "create_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "counselors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" VARCHAR(20) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "country_code" VARCHAR(5) DEFAULT '+91',
    "phone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(255),
    "parent_name" VARCHAR(100),
    "parent_phone" VARCHAR(15),
    "source" VARCHAR(100),
    "source_detail" VARCHAR(255),
    "how_heard_about_us" VARCHAR(255),
    "walkin_date" DATE,
    "location_name" VARCHAR(255),
    "subject_interested" VARCHAR(100),
    "expected_budget" DECIMAL(10,2),
    "stageID" VARCHAR(20),
    "demo_taken" BOOLEAN DEFAULT false,
    "color_code" VARCHAR(7),
    "number_of_contact_attempts" INTEGER DEFAULT 0,
    "last_contacted_date" TIMESTAMP(6),
    "next_followup" TIMESTAMP(6),
    "create_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "counselor_id" VARCHAR(20),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stages" (
    "id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "stages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "counselors_email_key" ON "counselors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "leads_email_key" ON "leads"("email");

-- CreateIndex
CREATE UNIQUE INDEX "stages_name_key" ON "stages"("name");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_stageID_fkey" FOREIGN KEY ("stageID") REFERENCES "stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "fk_counselor" FOREIGN KEY ("counselor_id") REFERENCES "counselors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
