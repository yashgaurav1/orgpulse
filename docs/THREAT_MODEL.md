# Haven: Security & Threat Model (docs/THREAT_MODEL.md)

This threat model evaluates potential attack vectors against employee anonymity, role hierarchy, and data confidentiality, along with the technical controls and mitigations implemented in Haven.

---

## 1. Asset Inventory & Confidentiality Tiers

| Asset | Sensitivity | Read Permissions | Storage Path |
|---|---|---|---|
| **Raw Survey Responses** | High (Critical) | Backend Cloud Functions ONLY (`allow read: false`) | `/companies/{cid}/cycles/{y}/responses/{id}` |
| **Participation Receipts** | High | Backend Cloud Functions ONLY (`allow read: false`) | `/companies/{cid}/cycles/{y}/participations/{hash}` |
| **Aggregated Squad Scores** | Medium | Manager of squad, HRBP, Leadership, Admin | `/companies/{cid}/cycles/{y}/aggregates/{teamId}` |
| **Support Requests** | High (Confidential) | Author Employee & Assigned HRBP ONLY | `/companies/{cid}/support_requests/{id}` |
| **Companion Chat Sessions** | High (Personal) | Author Employee ONLY | `/users/{uid}/companion_sessions/{id}` |
| **Company Keys & Settings** | Medium | Company Admin & HRBP | `/companies/{cid}` |
| **Administrative Audit Logs**| High (Integrity) | Company Admin & HRBP (Append-only) | `/companies/{cid}/audit_logs/{id}` |

---

## 2. Threat Analysis & Mitigations

### Threat 1: Malicious Delivery Manager Attempts to Unmask Subordinate Responses
- **Threat Vector**: A delivery manager with a small squad ($N=4$ or $N=5$) tries to identify which team member gave low scores by querying the API, filtering timestamps, or analyzing submitted comments.
- **Mitigation**:
  1. If $N < 5$, the aggregate payload is completely suppressed (`scores: null`, `items: []`, `comments: []`).
  2. Individual responses omit precise timestamps (no `created_at` or fractional seconds in response documents).
  3. Raw responses collection denies all client reads (`allow read: if false;`).
  4. Comments are never shown as raw unscrubbed strings to managers without exceeding $N \ge 10$ and passing through the PII scrubbing pipeline.

### Threat 2: De-Anonymization via Small Cohort Differencing
- **Threat Vector**: An attacker with access to both a Business Unit aggregate ($N=10$) and a sub-team aggregate ($N=6$) subtracts the scores to mathematically compute the exact scores of the 4-person sub-team.
- **Mitigation**:
  - The differencing protection algorithm detects complementary cell counts. If $N_{total} - N_{sub} < 5$, the complementary sub-unit is also suppressed, preventing algebraic extraction.

### Threat 3: Self-Elevation / Privilege Escalation via User Registration
- **Threat Vector**: An untrusted employee attempts to register as `company_admin`, `manager`, or `hrbp` during signup to bypass access controls.
- **Mitigation**:
  - In `firestore.rules`, user profile creation strictly enforces:
    ```javascript
    request.resource.data.approvedRole == 'employee' &&
    request.resource.data.isApproved == false
    ```
  - During updates, `approvedRole` and `isApproved` can only be modified by existing verified Admins or HRBPs where `request.auth.uid != userId` (preventing self-approval).

### Threat 4: Manager Snooping on Firewalled Wellbeing Support Tickets
- **Threat Vector**: A manager attempts to read confidential burnout or interpersonal complaints submitted by their team members to HR.
- **Mitigation**:
  - Security rules enforce:
    ```javascript
    allow read: if request.auth.uid == resource.data.employeeUid || isHrbp(companyId);
    ```
  - Delivery managers and senior executives cannot read tickets under any circumstances. Even within Firestore rules, `isManagerOfTeam` returns false for the support requests collection.

### Threat 5: Token Forgery or Replay
- **Threat Vector**: An employee submits multiple responses using the same survey link, or an attacker guesses a valid participation token.
- **Mitigation**:
  - Tokens are 32-byte cryptographically random hex strings ($2^{256}$ entropy).
  - Server transaction records `SHA-256(token)` in `/participations/{hash}`.
  - Second submission with the same token is rejected atomically.

### Threat 6: AI Data Leakage / Training on Sensitive Employee Prompts
- **Threat Vector**: Submitting employee feedback to external LLMs could lead to training data retention or exposure of proprietary/personal information.
- **Mitigation**:
  1. The AI provider API key is stored strictly as a Cloud Functions Secret, never exposed to client code.
  2. `pii-scrubber` scrubs names, corporate emails, phone numbers, and team names in server memory before building prompt payloads.
  3. The platform features an emergency **Executive AI Kill-Switch** in the Admin panel that immediately disables all LLM summarization and chat platform-wide with an immutable audit log entry.
  4. Non-evaluative system prompts strictly forbid clinical diagnoses, ranking, or quoting individual respondents.
