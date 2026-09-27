import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar role="participant" />

      <div className="flex min-h-screen flex-1 flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}