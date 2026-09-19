import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for marketadigitalit.com and Marketa Digital IT services.",
};

export default function PrivacyPolicyPage() {
  const sections = [
    [
      "Information We Collect",
      "We collect information you provide directly — such as your name, email, phone number, company and enquiry details when you contact us or use our services. We also collect basic analytics data (pages visited, device, approximate location) to improve our website.",
    ],
    [
      "How We Use Your Information",
      "Your information is used to respond to enquiries, deliver services you request, send relevant updates with your consent, and improve our products and website experience. We never sell your personal data to third parties.",
    ],
    [
      "Data Storage & Security",
      "Data is stored securely on Supabase infrastructure with encryption in transit and at rest. Access to your data is restricted to authorised staff only. Attendance photos, employee documents and work proofs are stored in private, access-controlled storage.",
    ],
    [
      "Cookies & Analytics",
      "We use minimal cookies and privacy-respecting analytics to understand how visitors use our site. You can disable cookies in your browser at any time.",
    ],
    [
      "Your Rights",
      "You may request access to, correction of, or deletion of your personal data at any time by emailing support@marketadigitalit.com. We will respond within 30 days.",
    ],
    [
      "Contact",
      "For any privacy questions, contact Marketa Digital IT at support@marketadigitalit.com or +91 78702 41157. This policy was last updated in September 2026.",
    ],
  ];

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative mx-auto max-w-3xl px-4 py-32 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-muted-foreground">Effective date: September 1, 2026</p>
        <div className="mt-10 space-y-8">
          {sections.map(([title, body]) => (
            <div key={title}>
              <h2 className="font-display text-xl font-semibold">{title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}