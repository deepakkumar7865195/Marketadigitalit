"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { websiteLeadSchema } from "@/lib/validations";
import { actionSubmitWebsiteLead } from "@/lib/actions";
import { COMPANY, SERVICES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type LeadForm = z.infer<typeof websiteLeadSchema>;

export function ContactSection() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadForm>({ resolver: zodResolver(websiteLeadSchema) });

  async function onSubmit(values: LeadForm) {
    setSubmitting(true);
    const result = await actionSubmitWebsiteLead(values);
    setSubmitting(false);
    if (result.success) {
      setDone(true);
      reset();
      toast.success("Enquiry sent!", { description: "Our team will contact you within 24 hours." });
      setTimeout(() => setDone(false), 3500);
    } else {
      toast.error(result.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <section id="contact" className="bg-muted/40 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Info */}
          <div className="lg:col-span-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              Contact Us
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Let's Build Your <span className="text-gradient">Growth Plan</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Tell us where you want to go. We'll tell you exactly how to get there and what it
              will cost. No pressure, no jargon.
            </p>

            <div className="mt-8 space-y-4">
              <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition hover:border-primary/30">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Email us</p>
                  <p className="text-sm font-semibold">{COMPANY.email}</p>
                </div>
              </a>
              <a href="tel:+917870241157" className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition hover:border-primary/30">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Call us</p>
                  <p className="text-sm font-semibold">{COMPANY.phoneDisplay}</p>
                </div>
              </a>
              <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Reach us</p>
                  <p className="text-sm font-semibold">{COMPANY.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-2xl border bg-card p-6 shadow-lg sm:p-8"
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" placeholder="Your full name" {...register("name")} />
                  {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
                  {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" {...register("phone")} />
                  {errors.phone ? <p className="text-xs text-destructive">{errors.phone.message}</p> : null}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Your company name" {...register("company")} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="service">Service</Label>
                  <Select id="service" defaultValue="" {...register("service")}>
                    <option value="">Select a service</option>
                    {SERVICES.map((s) => (
                      <option key={s.slug} value={s.title}>{s.title}</option>
                    ))}
                    <option value="Multiple / Not sure">Multiple / Not sure</option>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="budget">Monthly Budget</Label>
                  <Select id="budget" defaultValue="" {...register("budget")}>
                    <option value="">Select a budget range</option>
                    <option>Under ₹25,000</option>
                    <option>₹25,000 – ₹50,000</option>
                    <option>₹50,000 – ₹1,00,000</option>
                    <option>₹1,00,000+</option>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us about your business and goals..."
                    {...register("message")}
                  />
                  {errors.message ? <p className="text-xs text-destructive">{errors.message.message}</p> : null}
                </div>
              </div>

              <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <Button type="submit" variant="gradient" size="lg" disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : done ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Enquiry Sent!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Enquiry
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">We reply within 24 hours. Guaranteed.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}