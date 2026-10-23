import { z } from 'zod';

export const SURVEY_QUESTIONS = [
  {
    id: 'q1',
    number: 1,
    domain: 'Work purpose',
    text: "I understand how my current technical tasks contribute to the client's business goals.",
  },
  {
    id: 'q2',
    number: 2,
    domain: 'Operational support',
    text: "I have the access permissions, hardware, software tools, and technical guidance needed to finish my tasks without excessive delays.",
  },
  {
    id: 'q3',
    number: 3,
    domain: 'Skill growth',
    text: "Over the past three months, I have had opportunities to build technical or professional skills that advance my career.",
  },
  {
    id: 'q4',
    number: 4,
    domain: 'Psychological safety',
    text: "If I encounter an engineering roadblock or delivery problem, I can raise it to my lead without fear of negative consequences.",
  },
  {
    id: 'q5',
    number: 5,
    domain: 'Workload sustainability',
    text: "My daily workload allows me to disconnect from work outside regular business hours on most workdays.",
  },
  {
    id: 'q6',
    number: 6,
    domain: 'Team advocacy',
    text: "I would recommend my delivery squad to an engineering peer as a supportive and productive place to work.",
  },
] as const;

export const RATING_SCALE = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
] as const;

export const SurveySubmissionSchema = z.object({
  token: z.string().min(16, 'Invalid token format').max(128),
  q1: z.number().int().min(1).max(5).nullable().optional(),
  q2: z.number().int().min(1).max(5).nullable().optional(),
  q3: z.number().int().min(1).max(5).nullable().optional(),
  q4: z.number().int().min(1).max(5).nullable().optional(),
  q5: z.number().int().min(1).max(5).nullable().optional(),
  q6: z.number().int().min(1).max(5).nullable().optional(),
  comment: z
    .string()
    .max(600, 'Comments must be 600 characters or fewer')
    .nullable()
    .optional(),
});

export type SurveySubmission = z.infer<typeof SurveySubmissionSchema>;

export interface SurveyTokenVerification {
  valid: boolean;
  cycleId?: string;
  squadId?: string;
  squadName?: string;
  businessUnitName?: string;
  cycleName?: string;
  alreadyUsed?: boolean;
  cycleClosed?: boolean;
}
