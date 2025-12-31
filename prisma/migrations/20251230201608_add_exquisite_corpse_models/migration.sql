-- CreateEnum
CREATE TYPE "public"."CorpseStatus" AS ENUM ('active', 'ended', 'completed');

-- CreateTable
CREATE TABLE "public"."exquisite_corpses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT,
    "status" "public"."CorpseStatus" NOT NULL DEFAULT 'active',
    "maxContributors" INTEGER NOT NULL DEFAULT 10,
    "currentContributorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "exquisite_corpses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."corpse_segments" (
    "id" TEXT NOT NULL,
    "corpseId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isSkipped" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "corpse_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."corpse_authors" (
    "id" TEXT NOT NULL,
    "corpseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasContributed" BOOLEAN NOT NULL DEFAULT false,
    "voteToEnd" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "corpse_authors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "corpse_segments_corpseId_idx" ON "public"."corpse_segments"("corpseId");

-- CreateIndex
CREATE INDEX "corpse_segments_authorId_idx" ON "public"."corpse_segments"("authorId");

-- CreateIndex
CREATE INDEX "corpse_segments_position_idx" ON "public"."corpse_segments"("position");

-- CreateIndex
CREATE INDEX "corpse_authors_corpseId_idx" ON "public"."corpse_authors"("corpseId");

-- CreateIndex
CREATE INDEX "corpse_authors_userId_idx" ON "public"."corpse_authors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "corpse_authors_corpseId_userId_key" ON "public"."corpse_authors"("corpseId", "userId");

-- AddForeignKey
ALTER TABLE "public"."corpse_segments" ADD CONSTRAINT "corpse_segments_corpseId_fkey" FOREIGN KEY ("corpseId") REFERENCES "public"."exquisite_corpses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."corpse_segments" ADD CONSTRAINT "corpse_segments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."corpse_authors" ADD CONSTRAINT "corpse_authors_corpseId_fkey" FOREIGN KEY ("corpseId") REFERENCES "public"."exquisite_corpses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."corpse_authors" ADD CONSTRAINT "corpse_authors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
