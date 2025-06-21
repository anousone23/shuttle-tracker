import { getAuthUser } from "@/api/server/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthUser();

  if (user) return redirect("/");

  return <div>{children}</div>;
}
