# PULSE: Privacy and Data Flow Architecture

> **Notice:** This document provides a plain-English explanation of how employee survey data is collected, stored, aggregated, and protected within **Pulse**. It is designed for employees, Delivery Managers, HR Business Partners, and Information Security teams.

---

## 1. Core Privacy Invariants at a Glance

| Aspect | What Pulse Does |
| :--- | :--- |
| **Login Requirement** | **Employees never log in.** There are no user accounts, passwords, or employee ID prompts. Participation is via single-use cryptographic links. |
| **Email Privacy** | Corporate emails are used strictly in server memory to dispatch survey links and are **immediately discarded**. No email address or email-to-token mapping is ever written to the database. |
| **Response Anonymity** | Survey responses are stored with zero link to invite records, tokens, or employee IDs. |
| **Timestamps** | **Zero fine-grained timestamps.** No hours, minutes, seconds, or `created_at` fields exist on responses. Only the broad quarterly cycle ID is recorded. |
| **Minimum Reporting Size** | **$N \ge 5$ threshold.** If fewer than 5 members of a delivery squad respond, results are completely hidden or rolled up into the Business Unit aggregate. |
| **Raw Comments** | **Never shown raw to anyone.** Comments are processed exclusively at the Business Unit level by a privacy-scrubbed AI summarizer when at least 10 responses and 5 comments exist. |
| **Purpose Limitation** | Survey results and conversation guides are strictly prohibited from being used for individual appraisal, rating, compensation, promotion, or redundancy decisions. |

---

## 2. What Is Stored vs. What Is NOT Stored

### What IS Stored
1. **`invites` Table:**
   - A single-use SHA-256 token hash (a mathematical fingerprint of a 32-byte random cryptographic token).
   - Boolean flag indicating whether the token has been consumed (`used = TRUE`).
   - The date the token was used (`used_on = DATE` only; e.g. `2026-10-19`).
   - Associated Delivery Squad ID and Cycle ID.
2. **`responses` Table:**
   - Random primary key (`gen_random_uuid()`).
   - Assigned Delivery Squad ID and Cycle ID.
   - 1–5 scale ratings for Questions 1 through 6 (nullable; each question is skippable).
   - Optional operational tooling comment (max 600 characters).
3. **`squad_historical_aggregates` Table:**
   - Mathematical averages (means) and response counts per squad per cycle ($N \ge 5$ squads only), archived prior to retention purges.
4. **`audit_log` Table:**
   - Append-only log recording actor role, target group, cycle, and timestamp of aggregate reads and data exports.

### What Is Strictly NOT Stored
- **NO Employee Names or Employee IDs.**
- **NO Corporate Email Addresses or Email Hashes.**
- **NO IP Addresses or Geolocation Data.**
- **NO Device Identifiers or User-Agent Strings.**
- **NO Plaintext Tokens** (only the irreversibly hashed SHA-256 digest is stored in `invites`).
- **NO Foreign Key or Join Path** between `responses` and `invites`.
- **NO Response Submission Timestamps** finer than the quarterly cycle itself.

---

## 3. End-to-End Data Flow

```
1. HR CSV UPLOAD
   HRBP uploads CSV: (email, squad_name).
   ↓
2. IN-MEMORY TOKEN GENERATION
   Server creates a 32-byte random cryptographic token (256 bits of entropy).
   Server computes: token_hash = SHA256(token).
   ↓
3. SEPARATION OF CONCERNS
   ├─► Token Hash & Squad ID stored in `invites` table.
   └─► Raw Token embedded in single-use link: https://pulse.company.internal/survey/[token]
       Dispatched via SMTP / Resend to the employee's email.
   ↓
4. MEMORY PURGE
   The employee email address is immediately discarded from memory.
   Zero record exists connecting the email to the token hash.
   ↓
5. ANONYMOUS SUBMISSION
   Employee clicks link on mobile or desktop browser.
   Reads DPDP Act 2023 consent notice (voluntary, skippable, purpose limit).
   Fills 1–5 ratings and optional feedback comment.
   Submits payload to server.
   ↓
6. ATOMIC CONSUMPTION & STORAGE
   In a single database transaction (`submit_response`):
   • Verifies cycle is currently open.
   • Verifies `token_hash` exists in `invites` and `used = FALSE`.
   • Marks `used = TRUE` and records `used_on = CURRENT_DATE`.
   • Inserts response into `responses` table with non-sequential UUID.
   ↓
7. ZERO-LEAKAGE RESPONSE
   Server returns an identical generic confirmation page regardless of rating choices.
```

---

## 4. Role Access Matrix

| System Data / Artifact | Employee | Delivery Manager | Delivery Director | HRBP | Pilot Lead (Admin) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Individual Survey Responses** | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| **Raw Freeform Comments** | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| **Own Squad Aggregate Scores ($N \ge 5$)** | ❌ None | ✅ Full Access | ✅ Full Access | ✅ Full Access | ✅ Full Access |
| **Other Squad Aggregate Scores** | ❌ None | ❌ Blocked (403) | ✅ (In own BU) | ✅ (In own BU) | ✅ Full Access |
| **Below-Threshold Squad Scores ($N < 5$)** | ❌ None | ❌ Hidden | ❌ Hidden (Rolled up) | ❌ Hidden (Rolled up) | ❌ Hidden (Rolled up) |
| **Pending Invite Status** | ❌ None | ❌ None | ❌ None | ✅ Counts Only | ✅ Counts Only |
| **Manager Follow-Through Metrics** | ❌ None | ❌ None | ✅ Viewable | ✅ Viewable | ✅ Viewable |
| **Append-Only Access Audit Log** | ❌ None | ❌ None | ❌ None | ❌ None | ✅ Viewable |
| **Team-Level CSV Export** | ❌ None | ❌ None | ❌ None | ✅ (Excl. Hidden) | ✅ (Excl. Hidden) |

---

## 5. Statistical Disclosure Limitation & Differencing Protection

1. **Small Group Suppression ($N = 5$):**
   Squads with fewer than 5 respondents return strictly `{ squad_id: "...", hidden: true }`. No scores, respondent counts, or comments are disclosed.
2. **Roll-Up Merging:**
   Below-threshold squads in a Business Unit are merged into a unified "Merged Delivery Squads" pool. If the combined pool reaches 5 respondents, it is reported as an aggregate. If not, it rolls into the parent unit.
3. **Complementary (Secondary) Suppression:**
   If exactly one squad in a unit is hidden, an adversary could theoretically subtract visible squad totals from the Business Unit total to derive the hidden squad's scores. When this condition occurs, Pulse automatically suppresses the Business Unit total (`total_suppressed: true`), mathematically preventing subtraction attacks.

---

## 6. Data Retention Schedule

| Data Entity | Retention Period | Action Upon Expiry |
| :--- | :--- | :--- |
| **Raw Survey Responses (`responses`)** | **90 days after cycle closes** | Permanently deleted. Squad averages for $N \ge 5$ squads are archived in `squad_historical_aggregates`. |
| **Freeform Comments** | **90 days after cycle closes** | Permanently deleted. |
| **Single-Use Invites (`invites`)** | **90 days after cycle closes** | Permanently deleted (hashes and consumption dates purged). |
| **Squad Historical Aggregates** | **24 months** | Retained for multi-year trend tracking; purged after 24 months. |
| **Audit Logs (`audit_log`)** | **12 months** | Retained for IT governance and compliance audits. |

---

## 7. Residual Risks & Technical Limitations

1. **Supabase Service-Role Key:**
   The PostgreSQL database employs Row Level Security (RLS) with `REVOKE ALL ON responses FROM anon, authenticated`. The Supabase service-role key bypasses RLS by design.
   *Mitigation:* The key is strictly confined to server-side Next.js route handlers and is never shipped to client bundles. Sponsoring IT teams must maintain dual-control access to production environment variables.
2. **Small Delivery Squads & Idiosyncratic Language:**
   Even in squads meeting $N \ge 5$, unique writing styles, specialized terminology, or distinct sprint roles can allow managers to deduce authors of freeform comments.
   *Mitigation:* Comments are never shown raw to anyone; they are processed strictly at the Business Unit level (minimum 10 respondents, 5 comments) with multi-pass PII stripping.

---

## 8. Open Legal & Governance Items Requiring Sign-Off

Prior to deploying Pulse with real employee data, the following items must receive formal sign-off:
1. **Digital Personal Data Protection Act (DPDP), 2023 Review:**
   - Formal confirmation from Corporate Legal/DPO on whether properly anonymized survey responses fall outside the scope of "personal data" under Section 2(t) of the Act.
   - Approval of employment-purpose processing notices under Section 7 and verification of the designated Grievance Officer contact details.
2. **Leave-Pattern Ratio Indicator Sign-Off:**
   - Because leave tracking (Monday/Friday patterns) is health-adjacent and touches employee wellness, it remains **disabled by default** and must not be activated without written HR and legal consent.
3. **Paid / Enterprise Tier Infrastructure Certification:**
   - Sponsoring IT leadership must approve production hosting on a paid Supabase and Vercel tier in the **Mumbai (`ap-south-1`)** region. Free/hobby tiers are not suitable for enterprise employee systems.
   - Sponsoring IT leadership must verify that the Gemini API is configured through a paid Google Cloud project with enterprise terms ensuring customer data is never used for model training.
