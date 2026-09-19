export type LeadEmailPayload = {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  budget: string | null;
  message: string | null;
};

/**
 * Fire-and-forget lead alert. Posts the enquiry to a configured webhook so the
 * team gets an email. Works with Resend, Brevo, Zapier/Make/n8n, Slack, etc.
 *
 * Env vars (all optional — no-op until configured):
 *   LEAD_ALERT_WEBHOOK_URL — endpoint that turns the payload into an email
 *   LEAD_ALERT_WEBHOOK_KEY  — optional Bearer token for that endpoint
 *   LEAD_ALERT_EMAILS       — comma-separated recipients forwarded in the payload
 *
 * Example Resend setup (Vercel → simple workflow webhook, or any wrapper):
 *   curl -X POST https://api.resend.com/emails \
 *     -H "Authorization: Bearer $RESEND_KEY" \
 *     -d '{ from,to,subject,text }'
 * Point LEAD_ALERT_WEBHOOK_URL at a tiny route/function that does exactly that.
 */
export async function sendLeadAlertEmail(lead: LeadEmailPayload): Promise<void> {
  const url = process.env.LEAD_ALERT_WEBHOOK_URL?.trim();
  if (!url) return;

  const key = process.env.LEAD_ALERT_WEBHOOK_KEY?.trim();
  const recipients = (process.env.LEAD_ALERT_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const body = {
    event: "lead.created",
    source: "marketata-www",
    to: recipients,
    subject: `New enquiry from ${lead.name}`,
    lead: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      service: lead.service,
      budget: lead.budget,
      message: lead.message,
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(key ? { Authorization: `Bearer ${key}` } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[lead-alert] webhook responded ${res.status}`, await res.text().catch(() => ""));
    }
  } catch (error) {
    // Never break the enquiry submission because email delivery failed.
    console.error("[lead-alert] webhook call failed:", error);
  }
}

export type LeaveStatusPayload = {
  employeeName: string;
  employeeEmail: string | null;
  employeePhone: string | null;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number | null;
  reason: string | null;
  status: "Approved" | "Rejected";
  note: string | null;
  reviewerName: string | null;
};

/**
 * Notifies an employee about a leave decision. Two optional webhooks:
 *  - LEAVE_EMAIL_WEBHOOK_URL  → email the employee
 *  - WHATSAPP_WEBHOOK_URL      → WhatsApp the employee (Twilio/Gupshup/360dialog/...)
 *
 * Both are no-ops until configured. Each receives the same payload so one small
 * route/function can fan out, or you point them at any chat/CRM/Zapier endpoint.
 * Env vars:
 *   LEAVE_EMAIL_WEBHOOK_URL / LEAVE_EMAIL_WEBHOOK_KEY
 *   WHATSAPP_WEBHOOK_URL / WHATSAPP_WEBHOOK_KEY / WHATSAPP_FROM_NUMBER (optional)
 */
export async function sendLeaveStatusMessage(payload: LeaveStatusPayload): Promise<void> {
  const targets: { url?: string; key?: string; channel: string }[] = [
    { url: process.env.LEAVE_EMAIL_WEBHOOK_URL?.trim(), key: process.env.LEAVE_EMAIL_WEBHOOK_KEY?.trim(), channel: "email" },
    { url: process.env.WHATSAPP_WEBHOOK_URL?.trim(), key: process.env.WHATSAPP_WEBHOOK_KEY?.trim(), channel: "whatsapp" },
  ];

  const fromNumber = process.env.WHATSAPP_FROM_NUMBER?.trim() ?? null;
  const verb = payload.status === "Approved" ? "approved" : "rejected";
  const subject = `Your ${payload.leaveType} request was ${verb}`;
  const text =
    `Hi ${payload.employeeName},\n\n` +
    `Your ${payload.leaveType} request (${payload.startDate}${payload.endDate !== payload.startDate ? " to " + payload.endDate : ""}) ` +
    `has been ${verb}${payload.note ? `. Note: ${payload.note}` : ""}.\n\n` +
    `— ${payload.reviewerName ?? "HR Team"}, Marketa Digital IT`;

  for (const t of targets) {
    if (!t.url) continue;
    const body = {
      event: "leave.status_changed",
      source: "marketata-staff",
      channel: t.channel,
      toEmail: t.channel === "email" ? payload.employeeEmail : undefined,
      toPhone: t.channel === "whatsapp" ? payload.employeePhone : undefined,
      fromNumber,
      subject,
      text,
      leave: {
        employeeName: payload.employeeName,
        employeeEmail: payload.employeeEmail,
        employeePhone: payload.employeePhone,
        leaveType: payload.leaveType,
        startDate: payload.startDate,
        endDate: payload.endDate,
        totalDays: payload.totalDays,
        reason: payload.reason,
        status: payload.status,
        note: payload.note,
      },
    };
    try {
      const res = await fetch(t.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(t.key ? { Authorization: `Bearer ${t.key}` } : {}),
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) {
        console.error(`[leave-notify:${t.channel}] webhook responded ${res.status}`, await res.text().catch(() => ""));
      }
    } catch (error) {
      console.error(`[leave-notify:${t.channel}] webhook call failed:`, error);
    }
  }
}