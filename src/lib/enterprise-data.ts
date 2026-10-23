/**
 * Pulse Enterprise Single Source of Truth
 * Twelve full engineering delivery squad datasets across four historical survey cycles.
 * Fully interactive, highly detailed, realistic operational telemetry.
 */

export interface DomainItemScore {
  code: string;
  domain: string;
  question: string;
  mean: number | null;
  previousMean: number | null;
}

export interface SquadCycleData {
  cycleId: string;
  cycleName: string;
  headcount: number;
  respondents: number;
  participationPct: number;
  overallScore: number | null;
  previousOverallScore: number | null;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  status: 'Healthy Baseline' | 'Needs Review' | 'High Friction' | 'Action Plan Committed' | 'Suppressed (N<5)';
  statusVariant: 'success' | 'warning' | 'danger' | 'accent' | 'neutral';
  items: DomainItemScore[];
  actionCommitted: {
    domain: string;
    action: string;
    committedAt: string;
    dueDate: string;
    status: 'Open' | 'In Progress' | 'Done';
    owner: string;
  } | null;
  sparklineHistory: number[];
  passiveIndicators: {
    lateCodePct: number | null;
    leavePatternRatio: number | null;
    onCallPagesPerWeek: number | null;
  };
}

export interface EnterpriseSquad {
  id: string;
  code: string;
  name: string;
  businessUnit: string;
  leadManager: string;
  description: string;
  cycles: Record<string, SquadCycleData>;
}

export const ENTERPRISE_CYCLES = [
  { id: 'cycle-2026-q1', name: 'Q1 2026 Full Pulse (Latest)', date: '2026-02-15' },
  { id: 'cycle-2025-q4', name: 'Q4 2025 Regular Pulse', date: '2025-11-15' },
  { id: 'cycle-2025-q3', name: 'Q3 2025 Mid-Year Diagnostic', date: '2025-08-15' },
  { id: 'cycle-2025-q2', name: 'Q2 2025 Baseline Pulse', date: '2025-05-15' },
];

export const ENTERPRISE_SQUADS: EnterpriseSquad[] = [
  {
    "id": "squad-01",
    "code": "SQ-PAY-01",
    "name": "Squad 01 (Payments & Ledger)",
    "businessUnit": "Financial Services",
    "leadManager": "Manager A (Squad 01)",
    "description": "Core double-entry transaction ledger and high-throughput PCI-DSS settlement pipelines.",
    "cycles": {
      "cycle-2026-q1": {
        "cycleId": "cycle-2026-q1",
        "cycleName": "Q1 2026 Full Pulse (Latest)",
        "headcount": 12,
        "respondents": 12,
        "participationPct": 100,
        "overallScore": 4.22,
        "previousOverallScore": 4.05,
        "riskLevel": "Low",
        "status": "Action Plan Committed",
        "statusVariant": "accent",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "I understand what our squad is trying to achieve this quarter",
            "mean": 4.3,
            "previousMean": 4.1
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Our team has the authority to solve problems without bureaucratic sign-offs",
            "mean": 4.25,
            "previousMean": 4
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Contributions to architectural health and quality are recognized and rewarded",
            "mean": 4.1,
            "previousMean": 3.9
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "It is safe to take calculated technical risks and speak up about bugs without blame",
            "mean": 4.4,
            "previousMean": 4.25
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Sprint pacing and on-call commitments are sustainable without sustained heroism",
            "mean": 3.95,
            "previousMean": 3.8
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "I see a viable, rewarding long-term path on this engineering team over the next 12 months",
            "mean": 4.35,
            "previousMean": 4.25
          }
        ],
        "actionCommitted": {
          "domain": "Workload & On-call",
          "action": "Migrate Kafka DLQ re-processing from manual alerts to automated replay daemon.",
          "committedAt": "2026-02-18T10:15:00Z",
          "dueDate": "2026-03-04T18:00:00Z",
          "status": "In Progress",
          "owner": "Manager A (Squad 01)"
        },
        "sparklineHistory": [
          3.85,
          3.95,
          4.05,
          4.22
        ],
        "passiveIndicators": {
          "lateCodePct": 6.2,
          "leavePatternRatio": 0.1,
          "onCallPagesPerWeek": 4.5
        }
      },
      "cycle-2025-q4": {
        "cycleId": "cycle-2025-q4",
        "cycleName": "Q4 2025 Regular Pulse",
        "headcount": 12,
        "respondents": 11,
        "participationPct": 91.6,
        "overallScore": 4.05,
        "previousOverallScore": 3.95,
        "riskLevel": "Low",
        "status": "Healthy Baseline",
        "statusVariant": "success",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "I understand what our squad is trying to achieve",
            "mean": 4.1,
            "previousMean": 4
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Our team has authority without bureaucratic sign-offs",
            "mean": 4,
            "previousMean": 3.9
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Contributions to quality are recognized",
            "mean": 3.9,
            "previousMean": 3.85
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "It is safe to take calculated technical risks",
            "mean": 4.25,
            "previousMean": 4.15
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Sprint pacing is sustainable without heroism",
            "mean": 3.8,
            "previousMean": 3.75
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Viable long-term engineering path",
            "mean": 4.25,
            "previousMean": 4.1
          }
        ],
        "actionCommitted": {
          "domain": "Autonomy",
          "action": "Self-serve AWS IAM role automation for sandbox testing.",
          "committedAt": "2025-11-20T09:00:00Z",
          "dueDate": "2025-12-04T18:00:00Z",
          "status": "Done",
          "owner": "Manager A (Squad 01)"
        },
        "sparklineHistory": [
          3.7,
          3.85,
          3.95,
          4.05
        ],
        "passiveIndicators": {
          "lateCodePct": 8.4,
          "leavePatternRatio": 0.12,
          "onCallPagesPerWeek": 6
        }
      }
    }
  },
  {
    "id": "squad-02",
    "code": "SQ-CHK-02",
    "name": "Squad 02 (Checkout & Cart Funnel)",
    "businessUnit": "Consumer Apps",
    "leadManager": "Manager B (Squad 02)",
    "description": "High-conversion checkout UI, dynamic promotional pricing, and omni-channel basket state.",
    "cycles": {
      "cycle-2026-q1": {
        "cycleId": "cycle-2026-q1",
        "cycleName": "Q1 2026 Full Pulse (Latest)",
        "headcount": 11,
        "respondents": 10,
        "participationPct": 90.9,
        "overallScore": 3.88,
        "previousOverallScore": 3.72,
        "riskLevel": "Moderate",
        "status": "Action Plan Committed",
        "statusVariant": "accent",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Clear squad quarterly roadmap",
            "mean": 4,
            "previousMean": 3.8
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Authority to execute experiments",
            "mean": 3.95,
            "previousMean": 3.85
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Quality engineering recognition",
            "mean": 3.8,
            "previousMean": 3.65
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Blameless retrospectives & risk tolerance",
            "mean": 3.9,
            "previousMean": 3.8
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Sustainable sprint commitments",
            "mean": 3.6,
            "previousMean": 3.45
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Long-term team viability",
            "mean": 4.05,
            "previousMean": 3.8
          }
        ],
        "actionCommitted": {
          "domain": "Workload",
          "action": "Introduce strict Friday code freeze and automated regression runs.",
          "committedAt": "2026-02-19T14:30:00Z",
          "dueDate": "2026-03-05T18:00:00Z",
          "status": "In Progress",
          "owner": "Manager B (Squad 02)"
        },
        "sparklineHistory": [
          3.55,
          3.65,
          3.72,
          3.88
        ],
        "passiveIndicators": {
          "lateCodePct": 14.2,
          "leavePatternRatio": 0.18,
          "onCallPagesPerWeek": 8.2
        }
      }
    }
  },
  {
    "id": "squad-03",
    "code": "SQ-FUL-03",
    "name": "Squad 03 (Order Fulfillment & Dispatch)",
    "businessUnit": "Supply Chain",
    "leadManager": "Manager C (Squad 03)",
    "description": "Automated warehouse routing, carrier rate shopping, and real-time package delivery dispatching.",
    "cycles": {
      "cycle-2026-q1": {
        "cycleId": "cycle-2026-q1",
        "cycleName": "Q1 2026 Full Pulse (Latest)",
        "headcount": 9,
        "respondents": 8,
        "participationPct": 88.8,
        "overallScore": 3.12,
        "previousOverallScore": 3.65,
        "riskLevel": "High",
        "status": "Needs Review",
        "statusVariant": "warning",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Clear squad quarterly roadmap",
            "mean": 3.4,
            "previousMean": 3.8
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Authority to execute without blockers",
            "mean": 3.2,
            "previousMean": 3.7
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Quality engineering recognition",
            "mean": 3.15,
            "previousMean": 3.6
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Blameless retrospectives & psychological safety",
            "mean": 3.15,
            "previousMean": 3.75
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Sustainable sprint commitments (Flagged < 3.0)",
            "mean": 2.85,
            "previousMean": 3.4
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Long-term team viability",
            "mean": 3,
            "previousMean": 3.6
          }
        ],
        "actionCommitted": null,
        "sparklineHistory": [
          3.75,
          3.7,
          3.65,
          3.12
        ],
        "passiveIndicators": {
          "lateCodePct": 38.4,
          "leavePatternRatio": 0.42,
          "onCallPagesPerWeek": 21
        }
      }
    }
  },
  {
    "id": "squad-04",
    "code": "SQ-INF-04",
    "name": "Squad 04 (Platform Infrastructure & SRE)",
    "businessUnit": "Core Infrastructure",
    "leadManager": "Manager D (Squad 04)",
    "description": "Multi-region Kubernetes clusters, Terraform module registries, and enterprise observability mesh.",
    "cycles": {
      "cycle-2026-q1": {
        "cycleId": "cycle-2026-q1",
        "cycleName": "Q1 2026 Full Pulse (Latest)",
        "headcount": 14,
        "respondents": 14,
        "participationPct": 100,
        "overallScore": 4.45,
        "previousOverallScore": 4.3,
        "riskLevel": "Low",
        "status": "Healthy Baseline",
        "statusVariant": "success",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Clear squad quarterly roadmap",
            "mean": 4.5,
            "previousMean": 4.4
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Authority to refactor core platforms",
            "mean": 4.6,
            "previousMean": 4.45
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Quality engineering recognition",
            "mean": 4.35,
            "previousMean": 4.2
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Blameless post-mortems and experiment safety",
            "mean": 4.55,
            "previousMean": 4.4
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Sustainable on-call rotation",
            "mean": 4.25,
            "previousMean": 4.1
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Long-term team viability",
            "mean": 4.5,
            "previousMean": 4.35
          }
        ],
        "actionCommitted": {
          "domain": "Infrastructure",
          "action": "Auto-remediating node pool scale down for off-peak pre-prod clusters.",
          "committedAt": "2026-02-17T11:00:00Z",
          "dueDate": "2026-03-03T18:00:00Z",
          "status": "Done",
          "owner": "Manager D (Squad 04)"
        },
        "sparklineHistory": [
          4.15,
          4.22,
          4.3,
          4.45
        ],
        "passiveIndicators": {
          "lateCodePct": 4.1,
          "leavePatternRatio": 0.08,
          "onCallPagesPerWeek": 3.2
        }
      }
    }
  },
  {
    "id": "squad-05",
    "code": "SQ-DAT-05",
    "name": "Squad 05 (Analytics & Big Data)",
    "businessUnit": "Data Engineering",
    "leadManager": "Manager E (Squad 05)",
    "description": "Snowflake ELT pipelines, dbt modeling repository, and real-time telemetry streaming.",
    "cycles": {
      "cycle-2026-q1": {
        "cycleId": "cycle-2026-q1",
        "cycleName": "Q1 2026 Full Pulse (Latest)",
        "headcount": 7,
        "respondents": 3,
        "participationPct": 42.8,
        "overallScore": null,
        "previousOverallScore": null,
        "riskLevel": "Moderate",
        "status": "Suppressed (N<5)",
        "statusVariant": "neutral",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Clear squad quarterly roadmap",
            "mean": null,
            "previousMean": null
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Authority to execute",
            "mean": null,
            "previousMean": null
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Quality engineering recognition",
            "mean": null,
            "previousMean": null
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Blameless culture",
            "mean": null,
            "previousMean": null
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Sustainable workload",
            "mean": null,
            "previousMean": null
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Long-term viability",
            "mean": null,
            "previousMean": null
          }
        ],
        "actionCommitted": null,
        "sparklineHistory": [],
        "passiveIndicators": {
          "lateCodePct": null,
          "leavePatternRatio": null,
          "onCallPagesPerWeek": null
        }
      }
    }
  },
  {
    "id": "squad-06",
    "code": "SQ-SEC-06",
    "name": "Squad 06 (Identity & Zero-Trust Security)",
    "businessUnit": "InfoSec & Compliance",
    "leadManager": "Manager F (Squad 06)",
    "description": "OAuth2/OIDC authorization servers, Okta enterprise integrations, and mTLS service mesh policies.",
    "cycles": {
      "cycle-2026-q1": {
        "cycleId": "cycle-2026-q1",
        "cycleName": "Q1 2026 Full Pulse (Latest)",
        "headcount": 9,
        "respondents": 9,
        "participationPct": 100,
        "overallScore": 4.08,
        "previousOverallScore": 3.92,
        "riskLevel": "Low",
        "status": "Healthy Baseline",
        "statusVariant": "success",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Clear squad quarterly roadmap",
            "mean": 4.2,
            "previousMean": 4.05
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Authority to enforce security gates",
            "mean": 4.1,
            "previousMean": 3.9
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Recognition for preventative security",
            "mean": 3.95,
            "previousMean": 3.8
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Safe to report vulnerabilities and flaws",
            "mean": 4.3,
            "previousMean": 4.15
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Sustainable incident response pacing",
            "mean": 3.85,
            "previousMean": 3.7
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Long-term team viability",
            "mean": 4.1,
            "previousMean": 3.95
          }
        ],
        "actionCommitted": {
          "domain": "Security Ops",
          "action": "Automated vulnerability triage bot reducing Jira manual ticket overhead.",
          "committedAt": "2026-02-16T16:00:00Z",
          "dueDate": "2026-03-02T18:00:00Z",
          "status": "Done",
          "owner": "Manager F (Squad 06)"
        },
        "sparklineHistory": [
          3.75,
          3.82,
          3.92,
          4.08
        ],
        "passiveIndicators": {
          "lateCodePct": 5.5,
          "leavePatternRatio": 0.11,
          "onCallPagesPerWeek": 5
        }
      }
    }
  },
  {
    "id": "squad-07",
    "code": "SQ-MOB-07",
    "name": "Squad 07 (Mobile Experience & SDKs)",
    "businessUnit": "Consumer Apps",
    "leadManager": "Manager G (Squad 07)",
    "description": "React Native & native Swift/Kotlin frameworks, app store build pipelines, and offline-first caches.",
    "cycles": {
      "cycle-2026-q1": {
        "cycleId": "cycle-2026-q1",
        "cycleName": "Q1 2026 Full Pulse (Latest)",
        "headcount": 12,
        "respondents": 11,
        "participationPct": 91.6,
        "overallScore": 3.38,
        "previousOverallScore": 3.52,
        "riskLevel": "Moderate",
        "status": "Needs Review",
        "statusVariant": "warning",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Clear squad quarterly roadmap",
            "mean": 3.55,
            "previousMean": 3.7
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Authority over mobile client architecture",
            "mean": 3.4,
            "previousMean": 3.6
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Recognition for technical debt cleanup",
            "mean": 3.2,
            "previousMean": 3.4
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Blameless retrospectives & release reviews",
            "mean": 3.6,
            "previousMean": 3.7
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Sustainable release cadences",
            "mean": 3.1,
            "previousMean": 3.3
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Long-term team viability",
            "mean": 3.45,
            "previousMean": 3.5
          }
        ],
        "actionCommitted": {
          "domain": "Tooling",
          "action": "Remote build caching via Bazel to cut mobile test execution time by 60%.",
          "committedAt": "2026-02-18T12:00:00Z",
          "dueDate": "2026-03-04T18:00:00Z",
          "status": "In Progress",
          "owner": "Manager G (Squad 07)"
        },
        "sparklineHistory": [
          3.65,
          3.6,
          3.52,
          3.38
        ],
        "passiveIndicators": {
          "lateCodePct": 22.4,
          "leavePatternRatio": 0.28,
          "onCallPagesPerWeek": 9.8
        }
      }
    }
  },
  {
    "id": "squad-08",
    "code": "SQ-SRC-08",
    "name": "Squad 08 (Search & Product Discovery)",
    "businessUnit": "Discovery Services",
    "leadManager": "Manager H (Squad 08)",
    "description": "Vector embeddings, Elasticsearch clusters, lexical semantic re-ranking, and real-time typeahead.",
    "cycles": {
      "cycle-2026-q1": {
        "cycleId": "cycle-2026-q1",
        "cycleName": "Q1 2026 Full Pulse (Latest)",
        "headcount": 8,
        "respondents": 8,
        "participationPct": 100,
        "overallScore": 3.96,
        "previousOverallScore": 3.82,
        "riskLevel": "Low",
        "status": "Healthy Baseline",
        "statusVariant": "success",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Clear squad quarterly roadmap",
            "mean": 4.1,
            "previousMean": 3.95
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Freedom to experiment with ML ranking models",
            "mean": 4.05,
            "previousMean": 3.9
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Recognition for model precision gains",
            "mean": 3.9,
            "previousMean": 3.75
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Safe to try disruptive indexing algorithms",
            "mean": 4.15,
            "previousMean": 4
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Sustainable indexing pipeline pacing",
            "mean": 3.75,
            "previousMean": 3.65
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Long-term team viability",
            "mean": 4,
            "previousMean": 3.85
          }
        ],
        "actionCommitted": {
          "domain": "Search Relevance",
          "action": "Offline evaluation benchmark harness for vector retrieval weights.",
          "committedAt": "2026-02-19T10:00:00Z",
          "dueDate": "2026-03-05T18:00:00Z",
          "status": "Open",
          "owner": "Manager H (Squad 08)"
        },
        "sparklineHistory": [
          3.6,
          3.72,
          3.82,
          3.96
        ],
        "passiveIndicators": {
          "lateCodePct": 9,
          "leavePatternRatio": 0.14,
          "onCallPagesPerWeek": 6.5
        }
      }
    }
  },
  {
    "id": "squad-09",
    "code": "SQ-PRT-09",
    "name": "Squad 09 (Partner Integrations & B2B APIs)",
    "businessUnit": "Enterprise Ecosystem",
    "leadManager": "Manager I (Squad 09)",
    "description": "External enterprise API gateways, webhooks, rate limiting, and customized bespoke client adapters.",
    "cycles": {
      "cycle-2026-q1": {
        "cycleId": "cycle-2026-q1",
        "cycleName": "Q1 2026 Full Pulse (Latest)",
        "headcount": 8,
        "respondents": 7,
        "participationPct": 87.5,
        "overallScore": 2.82,
        "previousOverallScore": 3.42,
        "riskLevel": "Critical",
        "status": "High Friction",
        "statusVariant": "danger",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Clear squad quarterly roadmap",
            "mean": 3.1,
            "previousMean": 3.6
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Ability to push back on bespoke partner demands",
            "mean": 2.7,
            "previousMean": 3.3
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Recognition for keeping legacy client bridges alive",
            "mean": 2.8,
            "previousMean": 3.4
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Blameless retrospectives after client outages (Flagged < 3.2)",
            "mean": 2.9,
            "previousMean": 3.5
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Sustainable sprint commitments (Flagged < 3.0)",
            "mean": 2.6,
            "previousMean": 3.25
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Long-term team viability",
            "mean": 2.8,
            "previousMean": 3.45
          }
        ],
        "actionCommitted": null,
        "sparklineHistory": [
          3.65,
          3.55,
          3.42,
          2.82
        ],
        "passiveIndicators": {
          "lateCodePct": 44.5,
          "leavePatternRatio": 0.55,
          "onCallPagesPerWeek": 26
        }
      }
    }
  },
  {
    "id": "squad-10",
    "code": "SQ-MLP-10",
    "name": "Squad 10 (Machine Learning Platform)",
    "businessUnit": "AI & Research Core",
    "leadManager": "Manager J (Squad 10)",
    "description": "Distributed training clusters, PyTorch distributed pipelines, model registry, and GPU inference mesh.",
    "cycles": {
      "cycle-2026-q1": {
        "cycleId": "cycle-2026-q1",
        "cycleName": "Q1 2026 Full Pulse (Latest)",
        "headcount": 13,
        "respondents": 13,
        "participationPct": 100,
        "overallScore": 4.41,
        "previousOverallScore": 4.25,
        "riskLevel": "Low",
        "status": "Action Plan Committed",
        "statusVariant": "accent",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Clear squad quarterly roadmap",
            "mean": 4.45,
            "previousMean": 4.3
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Authority to allocate compute and design training jobs",
            "mean": 4.5,
            "previousMean": 4.35
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Recognition for training optimization & cost control",
            "mean": 4.35,
            "previousMean": 4.2
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Safe to experiment with speculative model architectures",
            "mean": 4.5,
            "previousMean": 4.35
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Sustainable on-call rotation",
            "mean": 4.25,
            "previousMean": 4.1
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Long-term team viability",
            "mean": 4.4,
            "previousMean": 4.2
          }
        ],
        "actionCommitted": {
          "domain": "Inference Efficiency",
          "action": "Dynamic TensorRT batching reducing p99 inference latency by 45ms.",
          "committedAt": "2026-02-18T15:00:00Z",
          "dueDate": "2026-03-04T18:00:00Z",
          "status": "In Progress",
          "owner": "Manager J (Squad 10)"
        },
        "sparklineHistory": [
          4.05,
          4.15,
          4.25,
          4.41
        ],
        "passiveIndicators": {
          "lateCodePct": 4.8,
          "leavePatternRatio": 0.09,
          "onCallPagesPerWeek": 3.8
        }
      }
    }
  },
  {
    "id": "squad-11",
    "code": "SQ-DX-11",
    "name": "Squad 11 (Developer Experience & Tooling)",
    "businessUnit": "Engineering Operations",
    "leadManager": "Manager K (Squad 11)",
    "description": "Internal developer platform, CI/CD runners, and developer productivity tooling across distributed engineering hubs.",
    "cycles": {
      "cycle-2026-q1": {
        "cycleId": "cycle-2026-q1",
        "cycleName": "Q1 2026 Full Pulse (Latest)",
        "headcount": 9,
        "respondents": 8,
        "participationPct": 88.9,
        "overallScore": 3.28,
        "previousOverallScore": 3.55,
        "riskLevel": "Moderate",
        "status": "Needs Review",
        "statusVariant": "warning",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Clear quarterly DX tooling goals",
            "mean": 3.7,
            "previousMean": 3.8
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Authority to deprecate broken legacy build scripts",
            "mean": 3.4,
            "previousMean": 3.65
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Recognition for platform maintenance work",
            "mean": 3.1,
            "previousMean": 3.45
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Safe to report build pipeline blockers without pushback",
            "mean": 3.8,
            "previousMean": 3.9
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Sustainable developer support queue",
            "mean": 3.15,
            "previousMean": 3.4
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Long-term team advocacy and remote team connection",
            "mean": 2.85,
            "previousMean": 3.2
          }
        ],
        "actionCommitted": {
          "domain": "Team Connection & Advocacy",
          "action": "Establish bi-weekly asynchronous architectural open-mic and pair programming rotations to resolve remote isolation.",
          "committedAt": "2026-02-19T09:00:00Z",
          "dueDate": "2026-03-05T18:00:00Z",
          "status": "Open",
          "owner": "Manager K (Squad 11)"
        },
        "sparklineHistory": [
          3.75,
          3.65,
          3.55,
          3.28
        ],
        "passiveIndicators": {
          "lateCodePct": 18.5,
          "leavePatternRatio": 0.16,
          "onCallPagesPerWeek": 11.2
        }
      },
      "cycle-2025-q4": {
        "cycleId": "cycle-2025-q4",
        "cycleName": "Q4 2025 Regular Pulse",
        "headcount": 9,
        "respondents": 8,
        "participationPct": 88.9,
        "overallScore": 3.55,
        "previousOverallScore": 3.65,
        "riskLevel": "Low",
        "status": "Healthy Baseline",
        "statusVariant": "success",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Clear quarterly DX tooling goals",
            "mean": 3.8,
            "previousMean": 3.85
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Authority to deprecate broken legacy scripts",
            "mean": 3.65,
            "previousMean": 3.7
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Recognition for platform work",
            "mean": 3.45,
            "previousMean": 3.5
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Safe to report pipeline blockers",
            "mean": 3.9,
            "previousMean": 3.9
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Sustainable support queue",
            "mean": 3.4,
            "previousMean": 3.5
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Long-term team advocacy",
            "mean": 3.2,
            "previousMean": 3.4
          }
        ],
        "actionCommitted": null,
        "sparklineHistory": [
          3.75,
          3.65,
          3.55
        ],
        "passiveIndicators": {
          "lateCodePct": 14,
          "leavePatternRatio": 0.12,
          "onCallPagesPerWeek": 8.5
        }
      },
      "cycle-2025-q3": {
        "cycleId": "cycle-2025-q3",
        "cycleName": "Q3 2025 Mid-Year Diagnostic",
        "headcount": 8,
        "respondents": 7,
        "participationPct": 87.5,
        "overallScore": 3.65,
        "previousOverallScore": 3.75,
        "riskLevel": "Low",
        "status": "Healthy Baseline",
        "statusVariant": "success",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Direction",
            "mean": 3.85,
            "previousMean": null
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Autonomy",
            "mean": 3.7,
            "previousMean": null
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Recognition",
            "mean": 3.5,
            "previousMean": null
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Safety",
            "mean": 3.9,
            "previousMean": null
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Workload",
            "mean": 3.5,
            "previousMean": null
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Health",
            "mean": 3.4,
            "previousMean": null
          }
        ],
        "actionCommitted": null,
        "sparklineHistory": [
          3.75,
          3.65
        ],
        "passiveIndicators": {
          "lateCodePct": 12,
          "leavePatternRatio": 0.11,
          "onCallPagesPerWeek": 7
        }
      },
      "cycle-2025-q2": {
        "cycleId": "cycle-2025-q2",
        "cycleName": "Q2 2025 Baseline Pulse",
        "headcount": 8,
        "respondents": 7,
        "participationPct": 87.5,
        "overallScore": 3.75,
        "previousOverallScore": null,
        "riskLevel": "Low",
        "status": "Healthy Baseline",
        "statusVariant": "success",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Direction",
            "mean": 3.9,
            "previousMean": null
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Autonomy",
            "mean": 3.8,
            "previousMean": null
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Recognition",
            "mean": 3.6,
            "previousMean": null
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Safety",
            "mean": 3.95,
            "previousMean": null
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Workload",
            "mean": 3.65,
            "previousMean": null
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Health",
            "mean": 3.6,
            "previousMean": null
          }
        ],
        "actionCommitted": null,
        "sparklineHistory": [
          3.75
        ],
        "passiveIndicators": {
          "lateCodePct": 9.5,
          "leavePatternRatio": 0.08,
          "onCallPagesPerWeek": 6
        }
      }
    }
  },
  {
    "id": "squad-12",
    "code": "SQ-MIG-12",
    "name": "Squad 12 (Cloud Legacy Migration Core)",
    "businessUnit": "Enterprise Core Systems",
    "leadManager": "Manager L (Squad 12)",
    "description": "Decomposition and lift-and-shift of monolithic mainframe batch systems to cloud-native microservices.",
    "cycles": {
      "cycle-2026-q1": {
        "cycleId": "cycle-2026-q1",
        "cycleName": "Q1 2026 Full Pulse (Latest)",
        "headcount": 8,
        "respondents": 7,
        "participationPct": 87.5,
        "overallScore": 2.94,
        "previousOverallScore": 3.18,
        "riskLevel": "High",
        "status": "High Friction",
        "statusVariant": "danger",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Clarity on legacy cutover roadmap",
            "mean": 3.4,
            "previousMean": 3.5
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Tooling and permissions to migrate databases",
            "mean": 2.75,
            "previousMean": 3
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Recognition for thankless maintenance tasks",
            "mean": 2.9,
            "previousMean": 3.1
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Safe to report migration defect risks",
            "mean": 3.1,
            "previousMean": 3.3
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "On-call and release weekend sustainability",
            "mean": 2.65,
            "previousMean": 2.95
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Long-term team advocacy",
            "mean": 2.85,
            "previousMean": 3.15
          }
        ],
        "actionCommitted": {
          "domain": "Workload & Tooling",
          "action": "Institute weekend migration freeze and add 2 dedicated SREs to absorb on-call escalations during database cutover.",
          "committedAt": "2026-02-17T11:30:00Z",
          "dueDate": "2026-03-03T18:00:00Z",
          "status": "Open",
          "owner": "Manager L (Squad 12)"
        },
        "sparklineHistory": [
          3.45,
          3.3,
          3.18,
          2.94
        ],
        "passiveIndicators": {
          "lateCodePct": 34,
          "leavePatternRatio": 0.28,
          "onCallPagesPerWeek": 19.5
        }
      },
      "cycle-2025-q4": {
        "cycleId": "cycle-2025-q4",
        "cycleName": "Q4 2025 Regular Pulse",
        "headcount": 8,
        "respondents": 7,
        "participationPct": 87.5,
        "overallScore": 3.18,
        "previousOverallScore": 3.3,
        "riskLevel": "Moderate",
        "status": "Needs Review",
        "statusVariant": "warning",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Clarity on roadmap",
            "mean": 3.5,
            "previousMean": 3.6
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Tooling permissions",
            "mean": 3,
            "previousMean": 3.15
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Recognition",
            "mean": 3.1,
            "previousMean": 3.25
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Safety",
            "mean": 3.3,
            "previousMean": 3.4
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Workload",
            "mean": 2.95,
            "previousMean": 3.1
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Advocacy",
            "mean": 3.15,
            "previousMean": 3.3
          }
        ],
        "actionCommitted": null,
        "sparklineHistory": [
          3.45,
          3.3,
          3.18
        ],
        "passiveIndicators": {
          "lateCodePct": 26.5,
          "leavePatternRatio": 0.22,
          "onCallPagesPerWeek": 14.2
        }
      },
      "cycle-2025-q3": {
        "cycleId": "cycle-2025-q3",
        "cycleName": "Q3 2025 Mid-Year Diagnostic",
        "headcount": 7,
        "respondents": 6,
        "participationPct": 85.7,
        "overallScore": 3.3,
        "previousOverallScore": 3.45,
        "riskLevel": "Low",
        "status": "Healthy Baseline",
        "statusVariant": "success",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Direction",
            "mean": 3.6,
            "previousMean": null
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Autonomy",
            "mean": 3.15,
            "previousMean": null
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Recognition",
            "mean": 3.25,
            "previousMean": null
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Safety",
            "mean": 3.4,
            "previousMean": null
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Workload",
            "mean": 3.1,
            "previousMean": null
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Health",
            "mean": 3.3,
            "previousMean": null
          }
        ],
        "actionCommitted": null,
        "sparklineHistory": [
          3.45,
          3.3
        ],
        "passiveIndicators": {
          "lateCodePct": 21,
          "leavePatternRatio": 0.18,
          "onCallPagesPerWeek": 11
        }
      },
      "cycle-2025-q2": {
        "cycleId": "cycle-2025-q2",
        "cycleName": "Q2 2025 Baseline Pulse",
        "headcount": 7,
        "respondents": 6,
        "participationPct": 85.7,
        "overallScore": 3.45,
        "previousOverallScore": null,
        "riskLevel": "Low",
        "status": "Healthy Baseline",
        "statusVariant": "success",
        "items": [
          {
            "code": "Q1",
            "domain": "Direction",
            "question": "Direction",
            "mean": 3.75,
            "previousMean": null
          },
          {
            "code": "Q2",
            "domain": "Autonomy",
            "question": "Autonomy",
            "mean": 3.3,
            "previousMean": null
          },
          {
            "code": "Q3",
            "domain": "Recognition",
            "question": "Recognition",
            "mean": 3.4,
            "previousMean": null
          },
          {
            "code": "Q4",
            "domain": "Safety",
            "question": "Safety",
            "mean": 3.55,
            "previousMean": null
          },
          {
            "code": "Q5",
            "domain": "Workload",
            "question": "Workload",
            "mean": 3.25,
            "previousMean": null
          },
          {
            "code": "Q6",
            "domain": "Health",
            "question": "Health",
            "mean": 3.45,
            "previousMean": null
          }
        ],
        "actionCommitted": null,
        "sparklineHistory": [
          3.45
        ],
        "passiveIndicators": {
          "lateCodePct": 18,
          "leavePatternRatio": 0.14,
          "onCallPagesPerWeek": 9
        }
      }
    }
  }
];

export const ENTERPRISE_AUDIT_LOGS = [
  {
    id: 'evt-8910',
    timestamp: '2026-02-18T10:15:00Z',
    actor: 'admin@enterprise.internal',
    action: 'INVITE_BATCH_DISPATCH',
    target: 'Squads 01-12 (108 tokens generated)',
    status: 'SUCCESS' as const,
  },
  {
    id: 'evt-8909',
    timestamp: '2026-02-17T14:30:00Z',
    actor: 'manager-b@enterprise.internal',
    action: 'UNAUTHORIZED_VIEW_ATTEMPT',
    target: 'Squad 01 (Cross-squad access blocked by Firestore rules)',
    status: 'DENIED' as const,
  },
  {
    id: 'evt-8908',
    timestamp: '2026-02-15T00:00:00Z',
    actor: 'system-retention-worker',
    action: 'RAW_SURVEY_PURGE',
    target: 'Cycles > 90 days expired (6 responses deleted)',
    status: 'SUCCESS' as const,
  },
  {
    id: 'evt-8907',
    timestamp: '2026-02-14T09:30:00Z',
    actor: 'hrbp-lead@enterprise.internal',
    action: 'EXPORT_TEAM_CSV',
    target: 'Excluding Squad 05 (N < 5 suppression enforced)',
    status: 'SUCCESS' as const,
  },
];
