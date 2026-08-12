// app/dashboard/layout.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { Toaster } from "@/components/ui/toast";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <section className="container py-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar
          user={{
            name: session.user?.name ?? "کاربر",
          }}
        />

        <main className="min-w-0 rounded-2xl border bg-card p-6">
          {children}
        </main>
        <Toaster />

      </div>
    </section>
  );
}