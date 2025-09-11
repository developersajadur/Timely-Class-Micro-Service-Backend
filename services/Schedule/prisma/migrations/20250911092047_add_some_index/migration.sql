-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('user', 'admin');

-- CreateIndex
CREATE INDEX "archives_userId_scheduleId_idx" ON "public"."archives"("userId", "scheduleId");

-- CreateIndex
CREATE INDEX "schedules_userId_title_subject_priority_day_idx" ON "public"."schedules"("userId", "title", "subject", "priority", "day");
