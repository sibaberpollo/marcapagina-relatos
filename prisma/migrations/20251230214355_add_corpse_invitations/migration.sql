-- CreateEnum
CREATE TYPE "public"."InvitationStatus" AS ENUM ('sent', 'accepted', 'expired', 'declined');

-- CreateTable
CREATE TABLE "public"."corpse_invitations" (
    "id" TEXT NOT NULL,
    "corpseId" TEXT NOT NULL,
    "invitedEmail" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" "public"."InvitationStatus" NOT NULL DEFAULT 'sent',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "corpse_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "corpse_invitations_token_key" ON "public"."corpse_invitations"("token");

-- CreateIndex
CREATE INDEX "corpse_invitations_corpseId_idx" ON "public"."corpse_invitations"("corpseId");

-- CreateIndex
CREATE INDEX "corpse_invitations_token_idx" ON "public"."corpse_invitations"("token");

-- CreateIndex
CREATE UNIQUE INDEX "corpse_invitations_corpseId_invitedEmail_key" ON "public"."corpse_invitations"("corpseId", "invitedEmail");

-- AddForeignKey
ALTER TABLE "public"."corpse_invitations" ADD CONSTRAINT "corpse_invitations_corpseId_fkey" FOREIGN KEY ("corpseId") REFERENCES "public"."exquisite_corpses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
