# Pulse: Privacy-Sensitive Corporate Wellbeing & Engineering Diagnostic Platform

Pulse helps companies understand and improve employee emotional wellbeing and psychological safety through an anonymous survey (< 4 minutes), guided support, and role-based analytics.

---

## Quick Start Guide (Beginner Friendly)

If you have never used Node.js, Firebase, or a terminal before, follow these numbered steps in order.

### Step 1: Install Required Tools
1. **Node.js (LTS Version)**:
   - Download and run the official installer from [nodejs.org](https://nodejs.org/) (Choose LTS, e.g. v20+).
   - Verify in your terminal (PowerShell or Bash) by running:
     ```bash
     node --version
     npm --version
     ```
2. **Git**:
   - Download and install Git from [git-scm.com](https://git-scm.com/).
3. **Firebase CLI**:
   - Install the Firebase command line tools globally:
     ```bash
     npm install -g firebase-tools
     ```

---

### Step 2: Set Up the Project Locally
1. Open your terminal and navigate to the project directory:
   ```bash
   cd c:\Users\Yash Gaurav\Desktop\SHADOWFAX\pulse
   ```
2. Install all project dependencies:
   ```bash
   npm install
   ```

---

### Step 3: Create a Free Firebase Project
1. Open your web browser and go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Enter a project name, e.g. `pulse-wellbeing-demo`.
4. Turn off Google Analytics (optional for local development) and click **Create project**.
5. Once your project is ready, click **Continue**.

---

### Step 4: Enable Authentication Providers
1. In the Firebase Console left sidebar, click **Build** > **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab:
   - Click **Email/Password** > Toggle **Enable** to ON > Click **Save**.
   - Click **Google** > Toggle **Enable** to ON > Select your support email > Click **Save**.

---

### Step 5: Enable Cloud Firestore
1. In the left sidebar, click **Build** > **Firestore Database**.
2. Click **Create database**.
3. Choose a location (e.g. `asia-south1` Mumbai for India or `us-central1`).
4. Select **Start in production mode** (our security rules will govern access) > Click **Create**.

---

### Step 6: Configure Your Environment File (`.env.local`)
1. In the Firebase Console, click the **Gear icon (Project Settings)** in the top left.
2. Scroll down to the **Your apps** card and click the **Web icon (`</>`)**.
3. Register your app (e.g. `Pulse Web`). You do not need Firebase Hosting checked right now. Click **Register app**.
4. Firebase will display your `firebaseConfig` object.
5. In your code editor, copy `.env.example` to `.env.local`:
   ```bash
   copy .env.example .env.local
   ```
6. Paste the corresponding values into `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pulse-wellbeing-demo.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=pulse-wellbeing-demo
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pulse-wellbeing-demo.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
   NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef
   ```

> **Note for Local Offline Testing**: If you do not have Firebase credentials yet, you can leave the defaults or set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true`. Pulse includes a complete offline Demo Mode with 12 seeded corporate scenarios that runs with zero cloud setup!

---

### Step 7: (Optional) Run the Local Firebase Emulator Suite
To run Firestore, Auth, and Cloud Functions completely offline on your computer:
```bash
firebase emulators:start
```
The Firebase Emulator UI will be accessible at `http://localhost:4000`.

---

### Step 8: Start the Pulse Application
Run the Next.js development server:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

---

### Step 9: Logging In & Exploring Role Perspectives

Pulse features two ways to log in:

#### Option A: One-Click Instant Sandbox (Zero Cloud Writes)
Click **Explore Live Demo** or press **⌘K** / click the user menu:
1. Select any role:
   - **Employee**: Explore the anonymous survey, 24/7 AI Companion Chat (Aarav, Maya, Priya, Kabir, Ananya), and the private HRBP support request form.
   - **Delivery Manager**: View squad scorecards, 14-day action commitments, and Section 18 ($N < 5$) privacy lock panels.
   - **HR Business Partner**: Multi-squad scorecards, safe CSV export, role approval queue, and the firewalled support request triage inbox.
   - **Senior Leadership**: Company overview trends, 6 drivers deep-dive, and printable executive summaries.
   - **Company Admin**: Company code management (`PULSE-ACME-4182`), role elevation queue, and emergency AI kill-switch.
2. Select any of the **12 realistic corporate scenarios** (including healthy squads, high-burnout on-call pods, and protected privacy pods with $N < 5$).

#### Option B: Real Firebase Authentication
Sign in using pre-seeded test accounts or register a new corporate email:
- **Employee**: `ananya.sharma@acme.corp` (Password: `PulsePass2026!`)
- **Delivery Manager**: `rajesh.nair@acme.corp` (Password: `PulsePass2026!`)
- **HRBP**: `kavita.menon@acme.corp` (Password: `PulsePass2026!`)
- **Senior Leadership**: `vikram.rao@acme.corp` (Password: `PulsePass2026!`)
- **Company Admin**: `siddharth.varma@acme.corp` (Password: `PulsePass2026!`)

> **Development Mode Behavior**: When survey invitation tokens are generated in development mode, they are printed directly to the terminal stdout rather than dispatched via SMTP email.

---

### Step 10: Running the Verification Test Suite
Run the full automated test suite (Unit, Privacy Invariants, Governance, and Security):
```bash
npm test
```
All 59 verification tests will run via Vitest, verifying:
- $N < 5$ statistical disclosure suppression
- Differencing protection
- Companion chat Tele-MANAS crisis intercept (`14416` / `1800-891-4416`)
- PII scrubbing before AI inference
- Role hierarchy and approval gating
- Reduced motion compliance

---

### Step 11: Firebase Auth Email Branding (Console Setup)
To apply the official brand identity to Firebase Authentication system emails:
1. In the Firebase Console, navigate to **Build** > **Authentication** > **Templates**.
2. Select **Password reset** or **Email address verification**.
3. Click the pencil icon to edit.
4. Set Sender name to: `Pulse Support`
5. Switch to **HTML** mode and paste the following template:

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #F7F9FC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0B1B33;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #FFFFFF; border: 1px solid #DCE3EC; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background-color: #03173B; padding: 24px 32px;">
              <span style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; color: #FFFFFF;">Pulse</span>
              <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #2E8EBF; margin-left: 10px; background: rgba(46, 142, 191, 0.2); padding: 3px 8px; border-radius: 4px;">Security</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #0B1B33;">Reset Your Pulse Password</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #55627A; margin: 0 0 24px;">
                We received a request to reset the password for your Pulse workspace account. Click the button below to choose a new password.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius: 6px; background-color: #2E8EBF;">
                    <a href="%LINK%" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 13px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 6px;">
                      Reset Password &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size: 12px; line-height: 1.5; color: #7E8B9E; margin: 24px 0 0;">
                If you did not request this, you can safely ignore this email. This link will expire shortly.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F7F9FC; border-top: 1px solid #DCE3EC; padding: 16px 32px; font-size: 11px; font-family: monospace; color: #7E8B9E;">
              Pulse Wellbeing Platform &bull; Privacy notice shown before the survey. Legal review required before real use.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Crisis Helplines & Safety Protocols
Pulse has a built-in crisis detection layer. If an employee enters language indicating acute distress or despair, the application immediately surfaces:
- **Government of India 24/7 Tele-MANAS Toll-Free**: `14416` and `1800-891-4416`
- **KIRAN Mental Health Line**: `1800-599-0019`
- **Vandrevala Foundation**: `+91 9999 666 555`

---

## Architecture & Privacy Notice
- **Section 18 & Anonymity**: Groups with $< 5$ respondents are suppressed from managers and directors.
- **Support Firewall**: Confidential wellbeing support tickets are strictly firewalled to assigned HRBPs. Managers and executives have zero read access.
- **Legal Notice**: *Privacy notice shown before the survey. Legal review required before real use.*
