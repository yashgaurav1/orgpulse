/**
 * Haven Platform: Firebase Firestore Emulator Seed Script
 * 
 * Populates:
 * 1. Demo Company Tenant (`/companies/company-acme`)
 * 2. 12 Complete Delivery Squad Aggregates across 4 survey cycles
 * 3. 5 Companion Voice Bot Personas (`/companion_bots`)
 * 4. Sample Firewalled Wellbeing Support Requests (`/companies/company-acme/support_requests`)
 * 5. Pre-seeded Users with Distinct IAM Roles (`/users`)
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { COMPANION_BOTS } from '../lib/companion-bots-data';
import { ENTERPRISE_SQUADS, ENTERPRISE_CYCLES } from '../lib/enterprise-data';

// Connect to Emulator if active
if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log(`[SEED] Using Firestore Emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
}

if (!getApps().length) {
  initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'haven-wellbeing-demo',
  });
}

const db = getFirestore();

export async function seedHavenDemoData() {
  console.log('[SEED] Starting Haven Firestore Seed...');

  const batch = db.batch();
  const companyId = 'company-acme';

  // 1. Company Tenant
  const companyRef = db.doc(`companies/${companyId}`);
  batch.set(companyRef, {
    name: 'Acme Corporation',
    companyCode: 'HAVEN-ACME-4182',
    domain: 'acme.corp',
    createdAt: new Date().toISOString(),
    aiKillSwitch: false,
    retentionDays: 90,
  });

  // 2. Pre-seeded Users with Roles
  const sampleUsers = [
    {
      uid: 'user-employee-ananya',
      email: 'ananya.sharma@acme.corp',
      displayName: 'Ananya Sharma',
      requestedRole: 'employee',
      approvedRole: 'employee',
      isApproved: true,
      teamId: 'squad-01',
      teamName: 'Squad 01 (Payments & Ledger)',
      companyId,
    },
    {
      uid: 'user-manager-rajesh',
      email: 'rajesh.nair@acme.corp',
      displayName: 'Rajesh Nair',
      requestedRole: 'manager',
      approvedRole: 'manager',
      isApproved: true,
      teamId: 'squad-01',
      teamName: 'Squad 01 (Payments & Ledger)',
      companyId,
    },
    {
      uid: 'user-hrbp-kavita',
      email: 'kavita.menon@acme.corp',
      displayName: 'Kavita Menon',
      requestedRole: 'hrbp',
      approvedRole: 'hrbp',
      isApproved: true,
      teamId: 'squad-hr',
      teamName: 'People Operations',
      companyId,
    },
    {
      uid: 'user-director-vikram',
      email: 'vikram.rao@acme.corp',
      displayName: 'Vikramaditya Rao',
      requestedRole: 'senior_leadership',
      approvedRole: 'senior_leadership',
      isApproved: true,
      teamId: 'squad-leadership',
      teamName: 'Engineering Leadership',
      companyId,
    },
    {
      uid: 'user-admin-siddharth',
      email: 'siddharth.varma@acme.corp',
      displayName: 'Siddharth Varma',
      requestedRole: 'company_admin',
      approvedRole: 'company_admin',
      isApproved: true,
      teamId: 'squad-admin',
      teamName: 'IT Governance',
      companyId,
    },
  ];

  for (const u of sampleUsers) {
    const userRef = db.doc(`users/${u.uid}`);
    batch.set(userRef, {
      ...u,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // 3. Companion Bots Catalog
  for (const bot of COMPANION_BOTS) {
    const botRef = db.doc(`companion_bots/${bot.id}`);
    batch.set(botRef, bot);
  }

  // 4. Squad Aggregates across 12 squads
  for (const squad of ENTERPRISE_SQUADS) {
    for (const cycle of ENTERPRISE_CYCLES) {
      const cycleData = squad.cycles[cycle.id];
      if (cycleData) {
        const aggRef = db.doc(`companies/${companyId}/cycles/${cycle.id}/aggregates/${squad.id}`);
        const isSuppressed = cycleData.respondents < 5;

        batch.set(aggRef, {
          squadId: squad.id,
          squadName: squad.name,
          businessUnit: squad.businessUnit,
          leadManager: squad.leadManager,
          cycleId: cycle.id,
          respondents: cycleData.respondents,
          participationPct: cycleData.participationPct,
          overallScore: isSuppressed ? null : cycleData.overallScore,
          isSuppressed,
          riskLevel: cycleData.riskLevel,
          status: cycleData.status,
          statusVariant: cycleData.statusVariant,
          items: isSuppressed ? [] : cycleData.items,
          actionCommitted: cycleData.actionCommitted,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }

  // 5. Firewalled Wellbeing Support Request
  const supportRef = db.doc(`companies/${companyId}/support_requests/req-2026-081`);
  batch.set(supportRef, {
    requestId: 'req-2026-081',
    companyId,
    employeeUid: 'user-employee-ananya',
    category: 'Workload & On-Call Strain',
    urgency: 'elevated',
    isAnonymous: true,
    subject: 'Continuous weekend on-call pages without recovery time',
    description: 'Our squad has had 3 consecutive weeks of high on-call volume due to legacy migrations.',
    status: 'assigned',
    assignedHrbpUid: 'user-hrbp-kavita',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 'msg-01',
        senderRole: 'employee',
        senderUid: 'user-employee-ananya',
        text: 'I submitted this confidentially. Pager duty rotation has not had a compensatory day off.',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'msg-02',
        senderRole: 'hrbp',
        senderUid: 'user-hrbp-kavita',
        text: 'Thank you for reaching out. We are working on mandatory 24-hr post-call recovery.',
        timestamp: new Date().toISOString(),
      },
    ],
  });

  await batch.commit();
  console.log('[SEED] Successfully committed Haven Firestore seed data!');
}

if (require.main === module) {
  seedHavenDemoData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[SEED_ERROR]', err);
      process.exit(1);
    });
}
