-- CreateTable
CREATE TABLE "NotificationPushToken" (
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPushToken_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE INDEX "NotificationPushToken_userId_idx" ON "NotificationPushToken"("userId");

-- AddForeignKey
ALTER TABLE "NotificationPushToken" ADD CONSTRAINT "NotificationPushToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
