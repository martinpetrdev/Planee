/*
  Warnings:

  - Changed the type of `secretHash` on the `McpKey` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "McpKey" DROP COLUMN "secretHash",
ADD COLUMN     "secretHash" BYTEA NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "McpKey_secretHash_key" ON "McpKey"("secretHash");
