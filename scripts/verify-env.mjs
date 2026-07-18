import { existsSync, readFileSync } from "node:fs";

for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith("#") || !line.includes("=")) continue;
    const [key, ...valueParts] = line.split("=");
    if (!process.env[key]) {
      process.env[key] = valueParts.join("=").trim();
    }
  }
}

const required = [
  "OPENAI_API_KEY",
  "OPENAI_MODEL"
];

const missing = required.filter((key) => !process.env[key] || process.env[key]?.includes("..."));

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  console.error("Create .env.local for local development or add these values in Vercel Project Settings.");
  process.exit(1);
}

try {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log("Supabase env is optional in no-login demo mode.");
    console.log("Environment verification passed.");
    process.exit(0);
  }

  const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (!supabaseUrl.hostname.endsWith(".supabase.co")) {
    console.warn("NEXT_PUBLIC_SUPABASE_URL does not look like a hosted Supabase URL.");
  }
} catch {
  console.error("NEXT_PUBLIC_SUPABASE_URL must be a valid URL.");
  process.exit(1);
}

console.log("Environment verification passed.");
