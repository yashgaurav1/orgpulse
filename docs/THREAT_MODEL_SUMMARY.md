# PULSE: Threat Model Summary Note on Re-Identification

> **Scope:** This threat model analyzes vectors where survey respondents in small engineering squads could be re-identified, and details the specific cryptographic, architectural, and behavioral defenses engineered into **Pulse**.

---

## 1. Re-Identification by Small Groups ($N < 5$)

### The Threat
In delivery squads of 6–9 engineers, if only 2–4 respond, the aggregate score becomes dominated by individual answers. A manager familiar with the team can deduce who provided a negative score by deductive elimination or cross-referencing known team tensions.

### Defense in Pulse
- **Hard Database Barrier:** Enforced inside PostgreSQL `SECURITY DEFINER` functions, never in the frontend.
- **Strict Suppression:** If `COUNT(*) < 5`, `get_squad_results` returns `{ "squad_id": "...", "hidden": true }` with all scores, respondent counts, comments, and flags stripped to `NULL`.
- **Automated Roll-Up:** Below-threshold squads are pooled together into a Business Unit summary before results are shared.

---

## 2. Differencing & Subtraction Attacks

### The Threat
If a Business Unit consists of three squads:
- Squad A ($n=8$): visible
- Squad B ($n=7$): visible
- Squad C ($n=3$): hidden ($N < 5$)

If the system publishes Squad A, Squad B, and the Business Unit Total ($n=18$), an attacker can compute Squad C’s exact scores by arithmetic subtraction:
$$\text{Sum}_C = \text{Sum}_{\text{Total}} - (\text{Sum}_A + \text{Sum}_B)$$

### Defense in Pulse
- **Complementary (Secondary) Suppression:** When evaluating Business Unit results (`get_unit_results_with_rollup`), the system checks if exactly one squad in the unit is hidden.
- If so, the Business Unit total aggregate is automatically suppressed (`total_suppressed: true`), rendering subtraction attacks mathematically impossible.

---

## 3. Freeform Comment Content De-Anonymization

### The Threat
Employees may inadvertently disclose their identity or colleagues' identities by naming individuals, referring to specific Jira tickets, quoting unique client interactions, or using distinct linguistic habits.

### Defense in Pulse
1. **Strict Non-Display:** Raw comments are **never displayed** to delivery managers, directors, HRBPs, or pilot leads on any screen or export.
2. **Business Unit Gate:** Comments are processed exclusively at the Business Unit level (never squad level), and only when the unit has $\ge 10$ respondents and $\ge 5$ comments.
3. **Multi-Pass Regex PII Scrubber:**
   - Strips email addresses (`[EMAIL]`).
   - Strips Indian and international phone numbers (`[PHONE]`).
   - Strips ticket links and URLs (`[URL]`).
   - Strips honorifics and proper names (`[NAME]`).
4. **Order Randomization & Cap:** Comments are shuffled using random ordering and capped at 40 before ingestion.
5. **Prompt Constraints:** The LLM is instructed at temperature 0.2 to synthesize at most 5 themes, omit verbatim quotes, and never evaluate individuals.

---

## 4. Manager Defensiveness & Behavioral Exploitation

### The Threat
A manager who receives a low psychological safety score or workload flag may react with hostility, conduct retaliatory 1:1 interrogations, or attempt to game future survey cycles.

### Defense in Pulse
1. **Appraisal Decoupling:** Pulse scores are strictly barred from performance appraisals, compensation reviews, or promotion decisions.
2. **Follow-Through Evaluation Only:** The only manager metrics visible to directors are operational compliance: *Stay interviews completed (count)*, *Action plan logged within 14 days (yes/no)*, and *Actions closed on time (%)*.
3. **Alphabetical Sorting (No League Tables):** All squad views and exports are strictly alphabetical. No sorted leaderboards, rankings, or "worst-performing" tables exist.
4. **Embedded Conduct Guides:** Directs managers toward operational discovery (fixing sprint handoffs and tooling) rather than evaluating employee attitudes.

---

## 5. Items Disclosed as Assumptions to Validate / Unverified Inputs

In accordance with Section 0 and Section 24 of the brief:
1. **Gallup 2026 Global Workplace Figures:** Sourced from research but noted as subject to confirmation against final published country reports.
2. **Indian Workplace Demographics:** Assumption that roughly 60% of pilot engineers are Gen Z/Millennial to be verified with sponsoring HR.
3. **High-Performer Definition for Regretted Attrition:** Formula documented, but organizational definition of "high performer" must be set by sponsoring leadership.
4. **Indian Holiday Calendar:** Business day due dates calculated on standard working calendar; national/state holiday calendar to be calibrated with sponsor HR.
