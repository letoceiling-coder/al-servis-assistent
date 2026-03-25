/*
  Warnings:

  - You are about to drop the column `title` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `assistantId` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chatId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "title",
ADD COLUMN     "assistantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "chatId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
