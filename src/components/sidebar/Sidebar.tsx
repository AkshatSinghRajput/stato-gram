"use client";
import { Home, BadgeAlert, Cog } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Menu items.
const items = [
  {
    title: "Incidents",
    url: "/dashboard/incidents",
    icon: BadgeAlert,
  },
  {
    title: "Services",
    url: "/dashboard/services",
    icon: Cog,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { organization } = useOrganization();
  const [organizationId, setOrganizationId] = useState(organization?.id);

  useEffect(() => {
    setOrganizationId(organization?.id);
  }, [organization]);

  return (
    <Sidebar>
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem
                className={`${pathname === "/dashboard" ? "bg-zinc-800" : ""}`}
              >
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {organizationId &&
                items?.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    className={`${
                      pathname.includes(item.url.toLocaleLowerCase()) &&
                      pathname !== "/"
                        ? "bg-zinc-800"
                        : ""
                    }`}
                  >
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
