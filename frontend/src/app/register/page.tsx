import type { Metadata } from "next";
import { RegisterPage } from "@/features/auth/RegisterPage";

export const metadata: Metadata = {
  title: "Create participant account | DOGFOOD 2026",
  description: "Register a participant account for the DOGFOOD 2026 portal.",
  robots: { index: false, follow: false },
};

export default function RegisterRoute() {
  return <RegisterPage />;
}
