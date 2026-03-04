-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- AlterTable
ALTER TABLE "document_chunks" ADD COLUMN     "embedding" vector(1536);
