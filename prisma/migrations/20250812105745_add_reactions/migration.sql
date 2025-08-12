-- CreateEnum
CREATE TYPE "public"."ReactionType" AS ENUM ('UP', 'DOUBLE');

-- CreateTable
CREATE TABLE "public"."reactions" (
    "userId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "public"."ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("userId","contentType","slug")
);

-- AddForeignKey
ALTER TABLE "public"."reactions" ADD CONSTRAINT "reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
