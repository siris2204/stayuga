import { env } from "../config/env";

interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

/**
 * Phase 1 stub: logs instead of sending. Once RESEND_API_KEY is set, replace
 * the body of this function with a real Resend API call — callers (booking
 * and lead handlers) don't need to change.
 */
export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (!env.resendApiKey) {
    console.log(`[notify:stub] to=${payload.to} subject="${payload.subject}"`);
    return;
  }
  // TODO: call Resend API once RESEND_API_KEY is configured.
  console.log(`[notify] would send via Resend to=${payload.to}`);
}
