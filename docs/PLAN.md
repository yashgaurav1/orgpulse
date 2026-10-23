# Haven: Employee Emotional Wellbeing & Mental Wellness Platform
## Engineering Architecture, Data Model, Security Architecture & Assumptions (docs/PLAN.md)

---

## 1. System Purpose & Core Principles
**Product Name:** Haven  
**One-Line Purpose:** Helps companies understand and improve employee emotional wellbeing and mental wellness through an anonymous survey, guided support, and role-based analytics.

### Fundamental Tenets
1. **Uncompromised Anonymity:** Responses are stored solely with company, team, and cycle identifiers. No user ID, email address, IP address, user agent, or high-resolution timestamp is ever persisted with a survey response.
2. **Strict Minimum Group Protection ($N \ge 5$):** Any team with fewer than 5 respondents returns `{ group, hidden: true }` from every API and server read path. No numbers, scorebars, flags, or comments are ever included in the DOM or JSON payload.
3. **Differencing Protection:** Complementary suppression is applied when rolling up team scores to business unit levels to guarantee that a hidden team's metrics cannot be computed by subtraction.
4. **Firewalled Human & AI Support:** Wellbeing support requests route strictly to HRBPs or designated wellbeing leads, never to an employee's direct manager or executive leadership. Companion chat conversations are 100% private to the employee, are never visible to employers, and are never mined for performance or evaluation.
5. **Crisis Intervention Layer:** The AI companion actively monitors for crisis phrases (self-harm, acute distress) and halts conversational flow to present emergency helpline resources (India Tele-MANAS: `14416` / `1800-891-4416`) and an instant human escalation pathway.
6. **Legally Grounded Transparency:** Mandatory notice on all survey and diagnostic interfaces: *"Privacy notice shown before the survey. Legal review required before real use."* No claims of legal compliance, invented certifications, or fake testimonials.

---

## 2. Multi-Tenant Firestore Data Model

Tenant isolation is enforced by scoping all corporate resources under `companies/{companyId}`.

```
/companies/{companyId}
  ├── /company_codes/{codeId}
  ├── /business_units/{unitId}
  ├── /teams/{teamId}
  ├── /cycles/{cycleId}
  │     ├── /invites/{tokenHash}
  │     ├── /responses/{responseId}  (READ REVOKED: Cloud Function write only)
  │     ├── /participations/{receiptHash}
  │     └── /aggregates/{teamId}
  ├── /support_requests/{requestId} (Restricted: Employee creator & HRBP only)
  ├── /audit_logs/{logId} (Append-only)
  └── /settings/governance

/users/{userId}
  ├── profile data (companyId, requestedRole, approvedRole, teamId)
  └── /companion_sessions/{sessionId} (Employee private only)

/companion_bots/{botId} (Global catalog of wellbeing guide personas)
```

### Collection Schemas

#### 1. `companies/{companyId}`
```typescript
interface CompanyDocument {
  id: string;
  name: string;
  domainRestrictions?: string[]; // Allowed email domains (e.g. ['acme.com'])
  createdAt: string;
  createdBy: string; // Admin uid
  activeCodeId: string;
  settings: {
    minGroupSize: number; // Default 5, configurable upward only
    retentionDays: number; // Default 90 days
    aiCommentSummaryEnabled: boolean; // Default false (kill-switch)
    aiCompanionEnabled: boolean; // Default true
    geminiModel: string;
  };
}
```

#### 2. `companies/{companyId}/company_codes/{codeId}`
```typescript
interface CompanyCodeDocument {
  id: string; // The code itself (e.g. 'HAVEN-ACME-8821')
  companyId: string;
  status: 'active' | 'rotated' | 'revoked';
  createdAt: string;
  expiresAt: string | null;
  createdBy: string;
}
```

#### 3. `companies/{companyId}/teams/{teamId}`
```typescript
interface TeamDocument {
  id: string;
  code: string;
  name: string;
  businessUnitId: string;
  businessUnitName: string;
  managerUid: string | null;
  headcount: number;
  createdAt: string;
}
```

#### 4. `users/{userId}`
```typescript
interface UserProfileDocument {
  uid: string;
  email: string;
  displayName: string;
  companyId: string | null;
  teamId: string | null;
  businessUnitId: string | null;
  assignedUnitIds?: string[]; // For HRBP or Senior Leadership
  requestedRole: 'employee' | 'manager' | 'hrbp' | 'senior_leadership';
  approvedRole: 'employee' | 'manager' | 'hrbp' | 'senior_leadership' | 'company_admin';
  isApproved: boolean; // Must be approved by Admin/HRBP before elevated access
  emailVerified: boolean;
  createdAt: string;
}
```

#### 5. `companies/{companyId}/cycles/{cycleId}/responses/{responseId}`
**SECURITY MANDATE: Read permission is REVOKED across all client roles. Accessible only via Cloud Functions.**
```typescript
interface AnonymousResponseDocument {
  id: string;
  companyId: string;
  teamId: string;
  cycleId: string;
  // Ratings on 1-5 scale
  q1_purpose: number | null;
  q2_tools: number | null;
  q3_growth: number | null;
  q4_safety: number | null;
  q5_workload: number | null;
  q6_connection: number | null;
  // Optional wellbeing check-ins
  checkin_mood?: number | null;
  checkin_stress?: number | null;
  checkin_sleep?: number | null;
  checkin_energy?: number | null;
  comment?: string; // Cap 600 characters
  submittedAtMonth: string; // Granular only to Year-Month (e.g. '2026-10') to prevent timing correlation
}
```

#### 6. `companies/{companyId}/cycles/{cycleId}/participations/{receiptHash}`
Stores single-use token receipt to prevent duplicate submissions, zero linkage to response:
```typescript
interface ParticipationReceiptDocument {
  tokenHash: string; // SHA-256 of token
  cycleId: string;
  burnedAt: string;
}
```

#### 7. `companies/{companyId}/support_requests/{requestId}`
```typescript
interface SupportRequestDocument {
  id: string;
  companyId: string;
  employeeUid: string | null; // null if employee chose to remain anonymous
  employeeAlias?: string; // e.g. "Anonymous Request #3912"
  supportType: 'talk_to_someone' | 'counselling_referral' | 'workload_concern' | 'other';
  urgency: 'low' | 'medium' | 'high';
  notes: string;
  status: 'open' | 'assigned' | 'in_progress' | 'closed' | 'withdrawn';
  assignedHrbpUid: string | null;
  assignedHrbpName?: string;
  createdAt: string;
  messages: Array<{
    senderRole: 'employee' | 'hrbp';
    text: string;
    timestamp: string;
  }>;
}
```

#### 8. `users/{userId}/companion_sessions/{sessionId}`
```typescript
interface CompanionSessionDocument {
  sessionId: string;
  botId: string; // e.g. 'aarav-grounding'
  createdAt: string;
  saved: boolean; // Employee toggle, default false
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}
```

#### 9. `companies/{companyId}/audit_logs/{logId}`
```typescript
interface AuditLogDocument {
  id: string;
  actorUid: string;
  actorRole: string;
  action: 'view_aggregates' | 'export_csv' | 'generate_ai_summary' | 'rotate_code' | 'approve_role';
  targetGroup: string; // e.g. teamId or unitId
  cycleId?: string;
  timestamp: string;
}
```

---

## 3. Security Model & Role-Based Access Controls

| Role | Survey Access | Team Analytics | Unit / Org Analytics | Support Requests | AI Companion | Admin & Settings |
|---|---|---|---|---|---|---|
| **Employee** | Take survey via single-use token | None | None | Create & view own requests only | Private full chat | None |
| **Manager** | None | Assigned team only ($N \ge 5$) | None | **FORBIDDEN** | None | None |
| **HRBP** | None | Assigned teams ($N \ge 5$) | Assigned units ($N \ge 5$) | Full triage inbox | None | Role approvals, cycles |
| **Senior Leadership** | None | None | Unit & Org level ($N \ge 5$) | Volume counts only (no PII) | None | None |
| **Company Admin** | None | None | None | **FORBIDDEN** | None | Full tenant administration |

### Cloud Function Security Definer Boundary
1. `submitSurveyResponse`: Receives `{ companyId, cycleId, token, ratings, comment }`. In one batch transaction:
   - Verifies and burns the token in `participations`.
   - Inserts the anonymous response document in `responses` with zero user metadata.
   - Updates running aggregate counters if needed.
2. `computeAggregates`: Aggregates team metrics. Strictly checks if respondents $< 5$. If so, outputs `{ teamId, hidden: true }`. Calculates differencing protection before publishing unit roll-ups.
3. `generateBuThematicSummary`: Strips all PII (names, emails, phones, URLs). Rejects requests with $< 10$ responses or $< 5$ comments. Checks global AI kill switch.
4. `retentionPurge`: Scheduled nightly job. Deletes raw responses and comments for cycles closed $> 90$ days ago, retaining only safe aggregate summaries.

---

## 4. Key Assumptions & Constraints
- **Multi-Tenant Scoping:** Every user belongs to one active company at a time. Multi-company memberships are supported by switching contexts.
- **Client-Side Secrets Prohibition:** Firebase Client Config contains public API keys; all privileged keys (Gemini API key, service account credentials) reside exclusively in Cloud Functions environment variables / secrets.
- **Offline / Local Demo Guarantee:** In Demo mode, all state operates against in-memory/localStorage seed fixtures without executing network mutations to Firebase.
- **Emergency Tele-MANAS Grounding:** Official Indian Tele-MANAS helpline numbers: Toll-Free `14416` or `1800-891-4416`. Any additional regional numbers are explicitly tagged "Verify before use".

---

## 5. Labelled Placeholders for User Deployment
- `[FIREBASE_API_KEY]`: Firebase Web API Key
- `[FIREBASE_AUTH_DOMAIN]`: Firebase Auth Domain (`<project-id>.firebaseapp.com`)
- `[FIREBASE_PROJECT_ID]`: Firebase Project ID
- `[FIREBASE_STORAGE_BUCKET]`: Firebase Storage Bucket URL
- `[FIREBASE_MESSAGING_SENDER_ID]`: Firebase Cloud Messaging Sender ID
- `[FIREBASE_APP_ID]`: Firebase Web App ID
- `[GEMINI_API_KEY]`: Google Gemini API Key for Cloud Functions AI services
