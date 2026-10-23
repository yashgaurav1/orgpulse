export interface ItemMeans {
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  q5: number | null;
  q6: number | null;
}

export interface ActiveTrigger {
  id: string;
  item: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5' | 'Q6' | 'LATE_CODE' | 'LEAVE_RATIO' | 'TRANSFERS' | 'TRAINING';
  domain: string;
  triggerCondition: string;
  likelyCause: string;
  responsePlan: string;
  ownerRole: string;
  dueDays: number;
  currentValue: number;
  threshold: number;
  isExtension?: boolean;
  itemName?: string;
  reason?: string;
  recommendation?: string;
}

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface SquadRiskAssessment {
  riskLevel: RiskLevel;
  activeTriggers: ActiveTrigger[];
  averagePulse: number | null;
  ruleExplanation: string;
}

export const PLAYBOOK_DEFINITIONS: Record<string, {
  likelyCause: string;
  responsePlan: string;
  ownerRole: string;
  dueDays: number;
  isExtension?: boolean;
}> = {
  Q5: {
    likelyCause: 'Unplanned client requests, poor sprint estimation, unmanaged escalations',
    responsePlan: 'Audit sprint backlog; adjust story point allocation; set an evening communication buffer (8:00 PM-8:00 AM)',
    ownerRole: 'Project manager and delivery lead',
    dueDays: 10,
  },
  Q4: {
    likelyCause: 'Punitive responses to defects; fear of negative reviews',
    responsePlan: 'Blameless post-mortem on recent defects; anonymous team blocker channel; leadership coaching for the manager; HRBP observes sprint planning',
    ownerRole: 'Delivery director and HRBP',
    dueDays: 14,
  },
  Q1: {
    likelyCause: 'Tasks disconnected from client outcome',
    responsePlan: 'Show how tickets link to client goals in sprint planning; job-crafting conversation',
    ownerRole: 'Delivery manager',
    dueDays: 21,
    isExtension: true,
  },
  Q2: {
    likelyCause: 'Access, tooling or environment blockers',
    responsePlan: 'Log and clear the top three blockers',
    ownerRole: 'Delivery manager with IT',
    dueDays: 14,
    isExtension: true,
  },
  Q3: {
    likelyCause: 'No visible growth path',
    responsePlan: 'Stay-interview follow-up; learning plan; stretch or rotation option',
    ownerRole: 'Delivery manager and L&D lead',
    dueDays: 30,
    isExtension: true,
  },
  Q6: {
    likelyCause: 'Team climate issues',
    responsePlan: 'Team conversation using the conduct guide; HRBP check-in',
    ownerRole: 'Delivery manager and HRBP',
    dueDays: 21,
    isExtension: true,
  },
};

/**
 * Evaluates flag rules based on item means and previous cycle comparison.
 * Exact thresholds from Section 11:
 * - Item 5 (Workload) below 3.0 (< 3.0)
 * - Item 4 (Safety) below 3.2 (< 3.2)
 * - Items 1, 2, 3, 6 below 3.0 (< 3.0)
 * - Fall of 0.4 or more vs previous cycle (if previous cycle met N >= 5)
 */
export function evaluateSquadFlags(
  currentMeans: ItemMeans,
  previousMeans?: ItemMeans | null,
  previousMetThreshold: boolean = false
): ActiveTrigger[] {
  const triggers: ActiveTrigger[] = [];

  // 1. Q5 Workload: mean below 3.0
  if (currentMeans.q5 !== null && currentMeans.q5 < 3.0) {
    triggers.push({
      id: 'TRIGGER_Q5_LOW',
      item: 'Q5',
      domain: 'Workload sustainability',
      triggerCondition: 'Mean score is below 3.0',
      currentValue: currentMeans.q5,
      threshold: 3.0,
      ...PLAYBOOK_DEFINITIONS.Q5,
    });
  }

  // 2. Q4 Psychological Safety: mean below 3.2
  if (currentMeans.q4 !== null && currentMeans.q4 < 3.2) {
    triggers.push({
      id: 'TRIGGER_Q4_LOW',
      item: 'Q4',
      domain: 'Psychological safety',
      triggerCondition: 'Mean score is below 3.2',
      currentValue: currentMeans.q4,
      threshold: 3.2,
      ...PLAYBOOK_DEFINITIONS.Q4,
    });
  }

  // Extensions (marked to validate): Q1, Q2, Q3, Q6 below 3.0
  const extensions: Array<{ key: 'q1' | 'q2' | 'q3' | 'q6'; item: 'Q1' | 'Q2' | 'Q3' | 'Q6'; domain: string }> = [
    { key: 'q1', item: 'Q1', domain: 'Work purpose' },
    { key: 'q2', item: 'Q2', domain: 'Operational support' },
    { key: 'q3', item: 'Q3', domain: 'Skill growth' },
    { key: 'q6', item: 'Q6', domain: 'Team advocacy' },
  ];

  for (const ext of extensions) {
    const val = currentMeans[ext.key];
    if (val !== null && val < 3.0) {
      triggers.push({
        id: `TRIGGER_${ext.item}_LOW`,
        item: ext.item,
        domain: ext.domain,
        triggerCondition: 'Mean score is below 3.0 (Extension: to validate)',
        currentValue: val,
        threshold: 3.0,
        ...PLAYBOOK_DEFINITIONS[ext.item],
      });
    }
  }

  // Period-over-period Drop Rule: >= 0.4 fall (only if previous cycle met N >= 5)
  if (previousMetThreshold && previousMeans) {
    const allKeys: Array<'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6'> = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];
    for (const k of allKeys) {
      const cur = currentMeans[k];
      const prev = previousMeans[k];
      if (cur !== null && prev !== null) {
        const drop = Number((prev - cur).toFixed(2));
        if (drop >= 0.4) {
          const itemCode = k.toUpperCase() as 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5' | 'Q6';
          // Only add drop trigger if not already triggered on absolute score
          const alreadyTriggered = triggers.some((t) => t.item === itemCode);
          if (!alreadyTriggered) {
            triggers.push({
              id: `TRIGGER_${itemCode}_DROP`,
              item: itemCode,
              domain: PLAYBOOK_DEFINITIONS[itemCode]?.ownerRole ? `Drop in ${itemCode}` : itemCode,
              triggerCondition: `Score dropped by ${drop.toFixed(2)} (>= 0.40) versus previous cycle`,
              currentValue: cur,
              threshold: prev - 0.4,
              ...PLAYBOOK_DEFINITIONS[itemCode],
            });
          }
        }
      }
    }
  }

  return triggers;
}

/**
 * Calculates Squad Risk Level from Section 12:
 * - Low: 0 active triggers AND average pulse >= 4.0
 * - Moderate: 0 active triggers AND average pulse < 4.0
 * - High: 1-2 active triggers
 * - Critical: 3 or more active triggers
 */
export function calculateSquadRisk(
  triggers: ActiveTrigger[],
  averagePulse: number | null
): SquadRiskAssessment {
  const triggerCount = triggers.length;

  let riskLevel: RiskLevel;
  let ruleExplanation: string;

  if (triggerCount >= 3) {
    riskLevel = 'Critical';
    ruleExplanation = `${triggerCount} active triggers detected (Threshold: 3 or more triggers = Critical).`;
  } else if (triggerCount >= 1) {
    riskLevel = 'High';
    ruleExplanation = `${triggerCount} active trigger${triggerCount > 1 ? 's' : ''} detected (Threshold: 1-2 triggers = High).`;
  } else if (averagePulse !== null && averagePulse >= 4.0) {
    riskLevel = 'Low';
    ruleExplanation = `0 active triggers and overall pulse average of ${averagePulse.toFixed(2)} >= 4.0 (Low risk).`;
  } else {
    riskLevel = 'Moderate';
    ruleExplanation = `0 active triggers, but overall pulse average of ${averagePulse !== null ? averagePulse.toFixed(2) : 'N/A'} is below 4.0 (Moderate risk).`;
  }

  return {
    riskLevel,
    activeTriggers: triggers,
    averagePulse,
    ruleExplanation,
  };
}

/**
 * Calculates interval in days between two cycles.
 * Returns true if less than 90 days apart, requiring a warning label.
 */
export function isShortInterval(startDateA: string | Date, startDateB: string | Date): { isShort: boolean; daysBetween: number } {
  const d1 = new Date(startDateA).getTime();
  const d2 = new Date(startDateB).getTime();
  const diffDays = Math.round(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
  return {
    isShort: diffDays < 90,
    daysBetween: diffDays,
  };
}
