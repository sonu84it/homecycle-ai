import { CheckCircle2, ExternalLink, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { hasServerEnv, hasSupabasePublicEnv } from "@/lib/env";

const envRows = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "OPENAI_MODEL"
];

export default function SetupPage() {
  const publicReady = hasSupabasePublicEnv();
  const serverReady = hasServerEnv();

  return (
    <main className="aurora flex min-h-screen items-center justify-center px-5 py-10">
      <Card className="glass w-full max-w-2xl shadow-glass">
        <CardHeader>
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Settings className="size-6" />
          </div>
          <CardTitle className="text-3xl">Finish setup</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            HomeCycle AI is built and ready, but protected routes need Supabase and OpenAI environment variables before
            the live demo flow can run.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-2">
            {envRows.map((name) => (
              <div key={name} className="flex items-center justify-between rounded-lg bg-white/70 p-3 text-sm">
                <code>{name}</code>
                <span className="font-semibold text-muted-foreground">
                  {process.env[name] ? "configured" : "missing"}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-white/70 p-4 text-sm leading-6 text-muted-foreground">
            <p className="flex items-center gap-2 font-semibold text-foreground">
              <CheckCircle2 className="size-4 text-primary" />
              Current status
            </p>
            <p className="mt-2">
              Supabase public env: {publicReady ? "ready" : "missing"} · Full server env:{" "}
              {serverReady ? "ready" : "missing"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/">
                Back to landing <ExternalLink className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="https://supabase.com/dashboard" target="_blank">
                Supabase dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
