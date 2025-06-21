import { ReactNode } from "react";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-center">
      <SidebarTrigger size="lg" />

      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
}
