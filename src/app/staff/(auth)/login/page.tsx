"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { loginSchema } from "@/lib/validations";
import { actionLogin } from "@/lib/actions";
import { DEMO_EMAIL, DEMO_PASSWORD, isDemoMode } from "@/lib/demo-mode";
import { DEMO_ACCOUNTS } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginForm = z.infer<typeof loginSchema>;

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/staff/dashboard";
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const demo = isDemoMode();

  async function onSubmit(values: LoginForm) {
    setLoading(true);
    const result = await actionLogin(values);
    setLoading(false);
    if (result.success) {
      toast.success("Welcome back!");
      router.push(next);
      router.refresh();
    } else {
      toast.error(result.error ?? "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {demo ? (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs leading-relaxed">
          <p className="font-semibold text-primary">Demo mode is ON — no backend required.</p>
          <p className="mt-1 text-muted-foreground">
            Use a demo account below (email / password) or tap the button to fill the admin.
          </p>
          <div className="mt-2 max-h-40 overflow-auto rounded-lg bg-background/70 p-2 font-mono text-[10px]">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                type="button"
                onClick={() => {
                  setValue("email", a.email);
                  setValue("password", a.password);
                }}
                className="flex w-full items-center justify-between gap-2 rounded px-2 py-1 text-left hover:bg-primary/10"
              >
                <span className="truncate">
                  <span className="font-semibold">{a.name}</span>
                  <span className="text-muted-foreground"> · {a.role}</span>
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {a.email} / {a.password}
                </span>
              </button>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              setValue("email", DEMO_EMAIL);
              setValue("password", DEMO_PASSWORD);
            }}
          >
            Fill demo admin credentials
          </Button>
        </div>
      ) : null}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="email" type="email" placeholder="you@marketadigitalit.com" className="pl-9" {...register("email")} />
        </div>
        {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/staff/forgot-password" className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="password" type="password" placeholder="••••••••" className="pl-9" {...register("password")} />
        </div>
        {errors.password ? <p className="text-xs text-destructive">{errors.password.message}</p> : null}
      </div>
      <Button type="submit" className="w-full" variant="gradient" size="lg" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New employee?{" "}
        <Link href="/staff/signup" className="font-semibold text-primary hover:underline">
          Create account
        </Link>
      </p>
    </form>
  );
}

export default function StaffLoginPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy">Staff Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to your employee account</p>
      </div>
      <Suspense>
        <LoginFormInner />
      </Suspense>
    </div>
  );
}