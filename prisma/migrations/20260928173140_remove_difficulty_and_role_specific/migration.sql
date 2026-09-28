-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'SCREENING', 'INTERVIEWING', 'OFFER', 'REJECTED', 'WITHDRAWN', 'ACCEPTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RoundType" AS ENUM ('PHONE_SCREEN', 'RECRUITER_SCREEN', 'TECHNICAL_CODING', 'TECHNICAL_SYSTEM_DESIGN', 'BEHAVIORAL', 'HIRING_MANAGER', 'PANEL', 'ONSITE', 'FINAL', 'OTHER');

-- CreateEnum
CREATE TYPE "RoundStatus" AS ENUM ('PASSED', 'FAILED', 'PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('TECHNICAL_CODING', 'TECHNICAL_SYSTEM_DESIGN', 'TECHNICAL_ALGORITHMS', 'TECHNICAL_DATABASE', 'TECHNICAL_ARCHITECTURE', 'BEHAVIORAL_LEADERSHIP', 'BEHAVIORAL_CONFLICT', 'BEHAVIORAL_TEAMWORK', 'BEHAVIORAL_FAILURE', 'BEHAVIORAL_SUCCESS', 'COMPANY_CULTURE', 'COMPENSATION', 'GENERAL');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'HR_CONTACTED', 'APPLIED', 'REJECTED', 'GHOSTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "currentRole" TEXT,
    "currentCompany" TEXT,
    "targetRole" TEXT,
    "currentSalary" INTEGER,
    "expectedSalary" INTEGER,
    "phone" TEXT,
    "location" TEXT,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "jobDescription" TEXT DEFAULT '',
    "jobUrl" TEXT,
    "location" TEXT,
    "workMode" "WorkMode" NOT NULL DEFAULT 'HYBRID',
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "appliedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "hasReferral" BOOLEAN NOT NULL DEFAULT false,
    "referrerName" TEXT,
    "referrerEmail" TEXT,
    "referrerLinkedIn" TEXT,
    "referralNotes" TEXT,
    "resumeVersion" TEXT,
    "resumeUrl" TEXT,
    "coverLetterUrl" TEXT,
    "expectedSalary" INTEGER,
    "offeredSalary" INTEGER,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "notes" TEXT DEFAULT '',
    "tags" TEXT DEFAULT '',
    "userId" TEXT NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_rounds" (
    "id" TEXT NOT NULL,
    "roundType" "RoundType" NOT NULL,
    "roundNumber" INTEGER NOT NULL DEFAULT 1,
    "scheduledDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "durationMinutes" INTEGER,
    "interviewerName" TEXT,
    "interviewerTitle" TEXT,
    "interviewerEmail" TEXT,
    "interviewerNotes" TEXT DEFAULT '',
    "status" "RoundStatus" NOT NULL DEFAULT 'SCHEDULED',
    "feedback" TEXT DEFAULT '',
    "rating" INTEGER,
    "prepNotes" TEXT DEFAULT '',
    "generalNotes" TEXT DEFAULT '',
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "interview_rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "category" "QuestionCategory" NOT NULL,
    "myAnswer" TEXT DEFAULT '',
    "modelAnswer" TEXT DEFAULT '',
    "keyPoints" TEXT DEFAULT '',
    "tags" TEXT DEFAULT '',
    "timesAsked" INTEGER NOT NULL DEFAULT 1,
    "lastAskedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confidenceLevel" INTEGER,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "round_questions" (
    "id" TEXT NOT NULL,
    "contextNotes" TEXT DEFAULT '',
    "wasAnswered" BOOLEAN NOT NULL DEFAULT true,
    "performance" INTEGER,
    "roundId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "round_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT,
    "referrerName" TEXT NOT NULL,
    "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT DEFAULT '',
    "contactDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followUpDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "applications_userId_idx" ON "applications"("userId");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE INDEX "applications_appliedDate_idx" ON "applications"("appliedDate");

-- CreateIndex
CREATE INDEX "applications_companyName_idx" ON "applications"("companyName");

-- CreateIndex
CREATE INDEX "interview_rounds_applicationId_idx" ON "interview_rounds"("applicationId");

-- CreateIndex
CREATE INDEX "interview_rounds_roundType_idx" ON "interview_rounds"("roundType");

-- CreateIndex
CREATE INDEX "interview_rounds_status_idx" ON "interview_rounds"("status");

-- CreateIndex
CREATE INDEX "interview_rounds_scheduledDate_idx" ON "interview_rounds"("scheduledDate");

-- CreateIndex
CREATE INDEX "questions_userId_idx" ON "questions"("userId");

-- CreateIndex
CREATE INDEX "questions_category_idx" ON "questions"("category");

-- CreateIndex
CREATE INDEX "questions_needsReview_idx" ON "questions"("needsReview");

-- CreateIndex
CREATE INDEX "questions_lastAskedDate_idx" ON "questions"("lastAskedDate");

-- CreateIndex
CREATE INDEX "round_questions_roundId_idx" ON "round_questions"("roundId");

-- CreateIndex
CREATE INDEX "round_questions_questionId_idx" ON "round_questions"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "round_questions_roundId_questionId_key" ON "round_questions"("roundId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_applicationId_key" ON "referrals"("applicationId");

-- CreateIndex
CREATE INDEX "referrals_userId_idx" ON "referrals"("userId");

-- CreateIndex
CREATE INDEX "referrals_status_idx" ON "referrals"("status");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_rounds" ADD CONSTRAINT "interview_rounds_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "round_questions" ADD CONSTRAINT "round_questions_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "interview_rounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "round_questions" ADD CONSTRAINT "round_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
