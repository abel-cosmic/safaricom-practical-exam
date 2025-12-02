/*
  Warnings:

  - The primary key for the `project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `project` table. All the data in the column will be lost.
  - The primary key for the `task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `task` table. All the data in the column will be lost.
  - The required column `id` was added to the `project` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `task` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_projectId_fkey";

-- AlterTable
ALTER TABLE "project" DROP CONSTRAINT "project_pkey",
DROP COLUMN "_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "project_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "task" DROP CONSTRAINT "task_pkey",
DROP COLUMN "_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "task_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
