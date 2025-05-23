-- CreateTable
CREATE TABLE "Notes" (
    "id" VARCHAR(14) NOT NULL,
    "content" TEXT NOT NULL,
    "is_pinned" BOOLEAN,
    "author_id" VARCHAR(14) NOT NULL,
    "lead_id" VARCHAR(14) NOT NULL,
    "create_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notes_lead_id_idx" ON "Notes"("lead_id");

-- CreateIndex
CREATE INDEX "Notes_author_id_idx" ON "Notes"("author_id");

-- CreateIndex
CREATE INDEX "Notes_create_at_idx" ON "Notes"("create_at");

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "fk_author" FOREIGN KEY ("author_id") REFERENCES "TeamMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "fk_lead" FOREIGN KEY ("lead_id") REFERENCES "Leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
