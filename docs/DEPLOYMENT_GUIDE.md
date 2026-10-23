# PULSE: Production Deployment & Hosting Guide

> **Important IT Compliance Note:** Free or hobby tiers on cloud providers are **NOT suitable** for production enterprise employee data. Hobby tiers lack contractual data protection agreements, regional data residency guarantees, point-in-time recovery (PITR), and enterprise SLAs.

---

## 1. Approved Hosting Architecture & Tier Specifications

| Component | Recommended Production Provider | Minimum Approved Tier | Recommended Region |
| :--- | :--- | :--- | :--- |
| **Relational Database** | **Supabase (PostgreSQL)** | **Pro Tier** (or Enterprise self-hosted) | **Mumbai (`ap-south-1`)** |
| **Application Server** | **Vercel** | **Pro / Enterprise Tier** | **Mumbai (`bom1`) / Global Edge** |
| **Email Dispatch** | **Resend** or Corporate SMTP | Production Tier with dedicated IP | India / Global |
| **AI Summarization** | **Google Cloud (Gemini API)** | **Enterprise Vertex AI / Paid Google AI Studio** | Contractual Non-Training Agreement |

---

## 2. Gemini API Tier & Confidentiality Requirement

> ⚠️ **MANDATORY SECURITY GATE:**
> Unpaid or free tiers of the Google Gemini API may retain user inputs and use submitted content to train or improve Google models. 
> 
> In accordance with Section 5 and Section 15 of the engineering brief:
> 1. The AI comment summary feature is **OFF by default** (`ENABLE_AI_SUMMARY=false`).
> 2. The pilot lead and IT sponsor must confirm that the configured API key belongs to a **paid Google Cloud / Vertex AI enterprise account** that contractually guarantees customer data is **never used for model training**.
> 3. Do not set `ENABLE_AI_SUMMARY=true` until this contractual guarantee has been validated in writing with the organization's Data Protection Officer.

---

## 3. Step-by-Step Deployment Instructions

### Step 1: Provision Supabase Database
1. Create a new Supabase project on the **Pro Tier**.
2. Select **AWS Mumbai (`ap-south-1`)** as the deployment region to guarantee Indian data residency.
3. Open the **SQL Editor** in the Supabase Dashboard.
4. Execute migration files in sequence:
   - Run `src/db/migrations/001_initial_schema.sql` (Creates tables, locks down `responses`, creates `SECURITY DEFINER` functions).
   - Run `src/db/migrations/002_retention.sql` (Creates historical aggregate tables and retention purge function).
5. Confirm that `REVOKE ALL ON responses FROM PUBLIC, anon, authenticated;` executed successfully.

### Step 2: Configure Supabase Authentication (Magic Links)
1. Go to **Authentication > Providers > Email**.
2. Enable **Email (Magic Link)** passwordless sign-in.
3. Disable public self-signup (only staff roles pre-provisioned by the Pilot Lead may authenticate).
4. Configure SMTP settings using your corporate email provider or verified Resend account.

### Step 3: Configure Automated Retention Purge
Set up a recurring cron trigger to run the retention purge function daily:
- **Option A (Supabase `pg_cron`):**
  ```sql
  SELECT cron.schedule(
    'daily-retention-purge',
    '0 2 * * *', -- Runs every day at 02:00 AM UTC
    $$SELECT run_retention_purge(90);$$
  );
  ```
- **Option B (Vercel Cron Job):**
  Call a protected route `/api/cron/retention` with a secret bearer token once daily.

### Step 4: Deploy to Vercel
1. Link the repository to your Vercel project.
2. Configure Environment Variables in **Project Settings > Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public anonymous key.
   - `SUPABASE_SERVICE_ROLE_KEY`: Your private Supabase service-role key (**Production only**).
   - `ENABLE_AI_SUMMARY`: Set to `false` initially until enterprise tier is confirmed.
   - `GEMINI_API_KEY`: Enterprise Google Cloud API key.
   - `GEMINI_MODEL`: `gemini-1.5-flash` (or current GA model).
   - `RESEND_API_KEY`: Resend API key for magic link dispatch.
   - `NEXT_PUBLIC_APP_URL`: Production domain (e.g. `https://pulse.company.internal`).
3. Deploy to production.

---

## 4. Verification Checklist Before Launch

- [ ] Database region confirmed in **Mumbai (`ap-south-1`)**.
- [ ] Direct `SELECT * FROM responses` fails for unprivileged application roles.
- [ ] No email addresses are saved in the `invites` table.
- [ ] Sponsoring DPO has reviewed the DPDP Act 2023 employee consent notice.
- [ ] Operational indicators module is disabled by default.
- [ ] AI Summary is confirmed disabled or connected to a certified non-training enterprise tier.
- [ ] Point-in-time recovery (PITR) is active on the Supabase Pro database.
