/*
  Warnings:

  - A unique constraint covering the columns `[recommendationId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[noteId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `noteId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendationId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Recommendation" DROP CONSTRAINT "Recommendation_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "noteId" INTEGER NOT NULL,
ADD COLUMN     "recommendationId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_recommendationId_key" ON "Appointment"("recommendationId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_noteId_key" ON "Appointment"("noteId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "Recommendation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
