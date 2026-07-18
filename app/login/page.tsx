import { LoginFormCard } from "./login-form-card";
import { hasSupabasePublicEnv } from "@/lib/env";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return <LoginFormCard configured={hasSupabasePublicEnv()} next={params.next ?? "/dashboard"} />;
}
