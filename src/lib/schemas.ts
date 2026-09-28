import { z } from 'zod';
import {
  ApplicationStatus,
  WorkMode,
  Priority,
  RoundType,
  RoundStatus,
  QuestionCategory,
  Difficulty,
  ReferralStatus,
} from '@prisma/client';

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').max(100),
  email: z.string().email('Please provide a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(128),
  inviteCode: z.string().min(1, 'Invite code is required.'),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').max(100).optional(),
  currentRole: z.string().max(100).optional(),
  currentCompany: z.string().max(100).optional(),
  targetRole: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  currentSalary: z.string().max(50).optional(),
  expectedSalary: z.string().max(50).optional(),
});

export const applicationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.').max(200).trim(),
  jobTitle: z.string().min(1, 'Job title is required.').max(200).trim(),
  jobUrl: z.string().max(500).optional().or(z.literal('')),
  location: z.string().max(200).optional(),
  workMode: z.nativeEnum(WorkMode).default(WorkMode.HYBRID),
  status: z.nativeEnum(ApplicationStatus).default(ApplicationStatus.APPLIED),
  hasReferral: z.string().optional(),
  referrerName: z.string().max(200).optional(),
  resumeUrl: z.string().max(500).optional().or(z.literal('')),
  coverLetterUrl: z.string().max(500).optional().or(z.literal('')),
  expectedSalary: z.string().max(50).optional(),
  offeredSalary: z.string().max(50).optional(),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  notes: z.string().max(5000).optional(),
  tags: z.string().max(500).optional(),
  comment: z.string().max(1000).optional(),
  referralNotes: z.string().max(1000).optional(),
  referralId: z.string().optional().or(z.literal('')),
});

export const roundSchema = z.object({
  applicationId: z.string().cuid().optional(),
  roundType: z.nativeEnum(RoundType),
  roundNumber: z.coerce.number().int().min(1).max(20).default(1),
  roundDate: z.string().max(50).optional(),
  status: z.nativeEnum(RoundStatus).default(RoundStatus.SCHEDULED),
  initialQuestion: z.string().max(2000).optional(),
  initialAnswer: z.string().max(5000).optional(),
});

export const questionFormSchema = z.object({
  questionText: z.string().min(5, 'Question must be at least 5 characters.').max(2000).trim(),
  category: z.nativeEnum(QuestionCategory).default(QuestionCategory.GENERAL),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.MEDIUM),
  myAnswer: z.string().max(5000).optional(),
  modelAnswer: z.string().max(5000).optional(),
  keyPoints: z.string().max(2000).optional(),
  tags: z.string().max(500).optional(),
  confidenceLevel: z.string().max(1).optional(),
  needsReview: z.string().optional(),
});

export const addQuestionToRoundSchema = z.object({
  questionText: z.string().min(5, 'Question must be at least 5 characters.').max(2000).trim(),
  myAnswer: z.string().max(5000).optional(),
  category: z.nativeEnum(QuestionCategory).default(QuestionCategory.ROLE_SPECIFIC),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.MEDIUM),
});

export const referralSchema = z.object({
  company: z.string().min(1, 'Company name is required.').max(100).trim(),
  role: z.string().max(100).optional().or(z.literal('')),
  referrerName: z.string().min(1, 'Referrer name is required.').max(100).trim(),
  status: z.nativeEnum(ReferralStatus).default(ReferralStatus.PENDING),
  notes: z.string().max(2000).optional().or(z.literal('')),
  contactDate: z.string().min(1, 'Contact date is required.'),
  followUpDate: z.string().optional().or(z.literal('')),
});
