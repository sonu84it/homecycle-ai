"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, Recycle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Input } from "@/components/input";
import { createClient } from "@/lib/supabase-browser";

const schema = z.object({
  email: z.string().email("Enter a valid email.")
});

type LoginForm = z.infer<typeof schema>;

export function LoginFormCard({ configured, next }: { configured: boolean; next: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginForm>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  async function signInWithGoogle() {
    if (!configured) return;
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      }
    });
  }

  async function signInWithEmail(values: LoginForm) {
    if (!configured) return;
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      }
    });
    setLoading(false);
    setMessage(error ? error.message : "Magic link sent. Check your inbox.");
  }

  return (
    <main className="aurora flex min-h-screen items-center justify-center px-5 py-10">
      <Card className="glass w-full max-w-md shadow-glass">
        <CardHeader>
          <Link href="/" className="mb-6 flex items-center gap-2 font-bold">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Recycle className="size-5" />
            </span>
            HomeCycle AI
          </Link>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <p className="text-sm text-muted-foreground">Sign in to scan items and track your home impact.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!configured && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
              Supabase environment variables are missing. Configure `.env.local` or Vercel env vars before signing in.
            </div>
          )}
          <Button className="w-full" disabled={!configured} onClick={signInWithGoogle} type="button">
            Continue with Google <ArrowRight className="size-4" />
          </Button>
          <p className="text-xs leading-5 text-muted-foreground">
            Google login requires the Google provider to be enabled in Supabase Auth. Email magic link can be used as a
            fallback during local testing.
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>
          <form className="space-y-3" onSubmit={form.handleSubmit(signInWithEmail)}>
            <Input placeholder="you@example.com" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
            )}
            <Button className="w-full" disabled={loading || !configured} type="submit" variant="secondary">
              <Mail className="size-4" />
              {loading ? "Sending..." : "Email magic link"}
            </Button>
          </form>
          {message && <p className="rounded-lg bg-white/70 p-3 text-sm text-muted-foreground">{message}</p>}
        </CardContent>
      </Card>
    </main>
  );
}
