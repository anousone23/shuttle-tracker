import Link from "next/link";
import { FaCoins } from "react-icons/fa6";
import { MdInventory, MdPeopleAlt } from "react-icons/md";
import { RiCoinFill, RiLogoutBoxFill } from "react-icons/ri";

import { logoutAction } from "@/actions/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    url: "/",
    icon: <FaCoins color="#fafafa" />,
    title: "Sales",
  },
  {
    url: `/sales/${new Date()}`,
    icon: <RiCoinFill color="#fafafa" />,
    title: "Today sales",
  },
  {
    url: "/customers",
    icon: <MdPeopleAlt color="#fafafa" />,
    title: "Customers",
  },
  {
    url: "/inventory",
    icon: <MdInventory color="#fafafa" />,
    title: "Inventory",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-sm">
            Shuttle Tracker
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-y-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      {item.icon}
                      <span className="font-medium text-base">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mb-20">
          <SidebarGroupLabel className="text-sm">Setting</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-y-4">
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={logoutAction}>
                  <div>
                    <RiLogoutBoxFill />
                    <span className="font-medium text-base">Logout</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
