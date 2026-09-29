import type { Metadata } from "next";
import { LoginPage } from "@/features/auth/LoginPage";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function LoginRoute() {
  return <LoginPage />;
}
