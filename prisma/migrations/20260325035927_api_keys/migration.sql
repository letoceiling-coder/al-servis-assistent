/*
  Warnings:

  - You are about to drop the column `label` on the `ApiKey` table. All the data in the column will be lost.
  - Added the required column `assistantId` to the `ApiKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "label",
ADD COLUMN     "assistantId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
