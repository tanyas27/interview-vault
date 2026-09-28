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
    "workMode" TEXT NOT NULL DEFAULT 'HYBRID',
    "status" TEXT NOT NULL DEFAULT 'APPLIED',
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
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "notes" TEXT DEFAULT '',
    "tags" TEXT DEFAULT '',
    "userId" TEXT NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_rounds" (
    "id" TEXT NOT NULL,
    "roundType" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL DEFAULT 1,
    "scheduledDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "durationMinutes" INTEGER,
    "interviewerName" TEXT,
    "interviewerTitle" TEXT,
    "interviewerEmail" TEXT,
    "interviewerNotes" TEXT DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
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
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'MEDIUM',
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
CREATE INDEX "questions_difficulty_idx" ON "questions"("difficulty");

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
