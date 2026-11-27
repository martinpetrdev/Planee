-- CreateTable
CREATE TABLE "EarlyAccessProgramInvitation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EarlyAccessProgramInvitation_pkey" PRIMARY KEY ("id")
);
