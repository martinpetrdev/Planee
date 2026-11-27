/*
  Warnings:

  - You are about to drop the column `secret` on the `McpKey` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[secretHash]` on the table `McpKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `secretHash` to the `McpKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "McpKey" DROP COLUMN "secret",
ADD COLUMN     "secretHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "McpKey_secretHash_key" ON "McpKey"("secretHash");
