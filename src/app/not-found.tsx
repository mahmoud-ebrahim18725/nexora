import Link from "next/link";
import { buttonClass } from "@/frontend/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
      <Link href="/" className={buttonClass()}>
        Back to Nexora
      </Link>
    </main>
  );
}
