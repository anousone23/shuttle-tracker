import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import dayjs from "dayjs";

import { getAuthUser } from "@/api/server/auth";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) return redirect("/sign-in");

  const isActive = dayjs().isBefore(user.active_until);

  if (!isActive)
    throw new Error(
      "Your account is not active\n Please continue the subscription."
    );

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full h-screen">{children}</main>
      <Toaster />
    </SidebarProvider>
  );
}
