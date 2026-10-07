import { QuestionCategory } from '@prisma/client';

export const QUESTION_CATEGORIES: { value: QuestionCategory; label: string }[] = [
  { value: QuestionCategory.MACHINE_CODING, label: 'Machine Coding' },
  { value: QuestionCategory.DSA, label: 'DSA' },
  { value: QuestionCategory.SYSTEM_DESIGN, label: 'System Design' },
  { value: QuestionCategory.HIRING_MANAGER, label: 'Hiring Manager' },
  { value: QuestionCategory.HR_SCREENING, label: 'HR Screening' },
  { value: QuestionCategory.TECHNICAL_SCREENING, label: 'Technical Screening' },
  { value: QuestionCategory.CULTURAL_FIT, label: 'Cultural Fit' },
];

export const QUESTION_CATEGORY_LABELS: Record<QuestionCategory, string> = {
  [QuestionCategory.MACHINE_CODING]: 'Machine Coding',
  [QuestionCategory.DSA]: 'DSA',
  [QuestionCategory.SYSTEM_DESIGN]: 'System Design',
  [QuestionCategory.HIRING_MANAGER]: 'Hiring Manager',
  [QuestionCategory.HR_SCREENING]: 'HR Screening',
  [QuestionCategory.TECHNICAL_SCREENING]: 'Technical Screening',
  [QuestionCategory.CULTURAL_FIT]: 'Cultural Fit',
};

export function formatQuestionCategory(category: string): string {
  return QUESTION_CATEGORY_LABELS[category as QuestionCategory] || category.replace(/_/g, ' ');
}
