-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "appointmentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Recommendation" ALTER COLUMN "content" SET DEFAULT '',
ALTER COLUMN "appointmentId" DROP NOT NULL;
