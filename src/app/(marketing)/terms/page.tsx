import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for marketadigitalit.com and Marketa Digital IT services.",
};

export default function TermsPage() {
  const items = [
    [
      "Agreement",
      "By using this website or engaging Marketa Digital IT services, you agree to these terms. If you do not agree, please do not use our services.",
    ],
    [
      "Services",
      "Marketa Digital IT provides digital marketing and web development services under mutually agreed scopes, deliverables and timelines documented in a contract or proposal.",
    ],
    [
      "Payments",
      "Payments are due as per the agreed schedule. We may pause services if invoices remain unpaid beyond the agreed credit period.",
    ],
    [
      "Client Responsibilities",
      "Clients agree to provide timely access to required accounts, materials and approvals to enable delivery of services.",
    ],
    [
      "Intellectual Property",
      "Final deliverables become the client's property upon full payment. We retain the right to showcase work in our portfolio unless a confidentiality agreement states otherwise.",
    ],
    [
      "Limitation of Liability",
      "Marketa Digital IT is not liable for indirect or consequential damages. Our aggregate liability is limited to fees paid for the services in question over the preceding 3 months.",
    ],
    [
      "Suspension & Termination",
      "Either party may terminate with notice as per the contract. Refunds are provided for unused pre-paid services on a pro-rata basis.",
    ],
    [
      "Contact",
      "For questions about these terms, contact deepak.marketadigitalit@gmail.com or +91 78702 41157.",
    ],
  ];

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative mx-auto max-w-3xl px-4 py-32 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">Terms &amp; Conditions</h1>
        <p className="mt-3 text-muted-foreground">Effective date: September 1, 2026</p>
        <div className="mt-10 space-y-8">
          {items.map(([title, body]) => (
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