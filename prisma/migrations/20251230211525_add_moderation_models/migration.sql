-- CreateEnum
CREATE TYPE "public"."ModerationDecision" AS ENUM ('approved', 'rejected');

-- AlterEnum
ALTER TYPE "public"."CorpseStatus" ADD VALUE 'pending_moderation';

-- CreateTable
CREATE TABLE "public"."corpse_moderations" (
    "id" TEXT NOT NULL,
    "corpseId" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,
    "decision" "public"."ModerationDecision" NOT NULL,
    "feedback" TEXT,
    "reason" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transtextosId" TEXT,

    CONSTRAINT "corpse_moderations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "corpse_moderations_corpseId_key" ON "public"."corpse_moderations"("corpseId");

-- CreateIndex
CREATE INDEX "corpse_moderations_corpseId_idx" ON "public"."corpse_moderations"("corpseId");

-- CreateIndex
CREATE INDEX "corpse_moderations_moderatorId_idx" ON "public"."corpse_moderations"("moderatorId");

-- CreateIndex
CREATE INDEX "corpse_moderations_decision_idx" ON "public"."corpse_moderations"("decision");

-- AddForeignKey
ALTER TABLE "public"."corpse_moderations" ADD CONSTRAINT "corpse_moderations_corpseId_fkey" FOREIGN KEY ("corpseId") REFERENCES "public"."exquisite_corpses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."corpse_moderations" ADD CONSTRAINT "corpse_moderations_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
