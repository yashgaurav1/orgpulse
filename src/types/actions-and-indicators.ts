import { z } from 'zod';

export const ActionStatusSchema = z.enum(['Open', 'In progress', 'Done', 'Blocked']);
export type ActionStatus = z.infer<typeof ActionStatusSchema>;

export const CreateActionSchema = z.object({
  squadId: z.string().uuid(),
  cycleId: z.string().uuid(),
  triggerName: z.string().min(2),
  likelyCause: z.string().min(3),
  responsePlan: z.string().min(5),
  ownerRole: z.string().min(2),
  dueDays: z.number().int().min(1).max(90),
  notes: z.string().optional(),
});
export type CreateActionInput = z.infer<typeof CreateActionSchema>;

export const UpdateActionSchema = z.object({
  actionId: z.string().uuid(),
  status: ActionStatusSchema,
  notes: z.string().optional(),
});
export type UpdateActionInput = z.infer<typeof UpdateActionSchema>;

export interface ActionItem {
  id: string;
  squadId: string;
  cycleId: string;
  triggerName: string;
  likelyCause: string;
  responsePlan: string;
  ownerRole: string;
  dueDate: string;
  status: ActionStatus;
  notes: string;
  isOverdue: boolean;
  daysToDueOrClose: number;
  createdAt: string;
  updatedAt: string;
}

// Operational Indicators Schema (Strictly Aggregated, Never Per-Person)
export const OperationalIndicatorSchema = z.object({
  squadId: z.string().uuid(),
  cycleId: z.string().uuid(),
  offHoursCodePct: z.number().min(0).max(100).nullable().optional(),
  leavePatternRatio: z.number().min(0).max(1.0).nullable().optional(),
  internalTransfersCount: z.number().int().min(0).optional().default(0),
  trainingAttendancePct: z.number().min(0).max(100).nullable().optional(),
});
export type OperationalIndicatorInput = z.input<typeof OperationalIndicatorSchema>;
