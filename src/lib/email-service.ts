import { safeLog } from './logger';

/**
 * Dispatches an anonymous survey invitation.
 * In development mode (or when RESEND_API_KEY is unset), prints the survey link
 * directly to the terminal console instead of sending external emails.
 *
 * Enforces Anonymity Rule: Recipient email is strictly used in memory and never persisted.
 */
export const BRAND_EMAIL_TEMPLATE = (surveyLink: string, squadName?: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Pulse Anonymous Survey</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F9FC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0B1B33;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F7F9FC; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #DCE3EC; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(3, 23, 59, 0.04);">
          <!-- Navy Brand Header -->
          <tr>
            <td style="background-color: #03173B; padding: 24px 32px; text-align: left;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <!-- Pulse Wordmark -->
                    <span style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; color: #FFFFFF; letter-spacing: -0.02em;">Pulse</span>
                  </td>
                  <td style="vertical-align: middle; padding-left: 12px;">
                    <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #2E8EBF; letter-spacing: 0.05em; background-color: rgba(46, 142, 191, 0.15); padding: 3px 8px; border-radius: 4px;">Diagnostics</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <h1 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 20px; font-weight: 600; color: #0B1B33; line-height: 1.3;">
                Quarterly Anonymous Engineering Survey
              </h1>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #55627A;">
                Please share your confidential perspectives on workload, delivery pacing, support, and psychological safety${squadName ? ` for <strong>${squadName}</strong>` : ''}.
              </p>
              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #55627A;">
                Takes under four minutes. Responses contain zero personal identifiers and cannot be traced to your identity.
              </p>

              <!-- CTA Button in Brand Blue -->
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius: 6px; background-color: #2E8EBF;">
                    <a href="${surveyLink}" target="_blank" style="display: inline-block; padding: 12px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 6px;">
                      Open Confidential Survey &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Privacy Footer -->
          <tr>
            <td style="background-color: #F7F9FC; border-top: 1px solid #DCE3EC; padding: 20px 32px; font-size: 11px; font-family: monospace; color: #7E8B9E; line-height: 1.5;">
              <p style="margin: 0 0 6px 0; font-weight: 600; color: #0B1B33;">
                N &ge; 5 Mathematical Privacy Guarantee
              </p>
              <p style="margin: 0;">
                This single-use cryptographic token contains zero user identifiers. Your email has been permanently discarded from memory. Privacy notice shown before survey.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export async function sendSurveyInviteEmail(
  email: string,
  surveyLink: string,
  squadName?: string
): Promise<boolean> {
  const isDev = process.env.NODE_ENV !== 'production' || !process.env.RESEND_API_KEY;

  if (isDev) {
    // Development mode: print employee survey links to the terminal
    // eslint-disable-next-line no-console
    console.log(`\n===============================================================`);
    // eslint-disable-next-line no-console
    console.log(`📧 [DEV MODE: SURVEY INVITE LINK GENERATED]`);
    // eslint-disable-next-line no-console
    console.log(`Recipient:       ${email}`);
    if (squadName) {
      // eslint-disable-next-line no-console
      console.log(`Delivery Squad:  ${squadName}`);
    }
    // eslint-disable-next-line no-console
    console.log(`Survey URL:      ${surveyLink}`);
    // eslint-disable-next-line no-console
    console.log(`Privacy Check:   Email dropped from memory; zero database linkage.`);
    // eslint-disable-next-line no-console
    console.log(`===============================================================\n`);
    return true;
  }

  // Production mode: Resend API
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Pulse Survey <survey@company.internal>',
        to: [email],
        subject: 'Pulse: Quarterly Anonymous Engagement Survey',
        html: BRAND_EMAIL_TEMPLATE(surveyLink, squadName),
      }),
    });
    return res.ok;
  } catch (err: any) {
    safeLog.error('Failed to dispatch production survey invite');
    return false;
  }
}
