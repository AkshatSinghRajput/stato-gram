"use client";
import {
  Home,
  BadgeAlert,
  Cog,
  CalendarSyncIcon,
  BadgeCheckIcon,
} from "lucide-react";

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
    title: "Maintenance",
    url: "/dashboard/maintenance",
    icon: CalendarSyncIcon,
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
    <Sidebar className="bg-zinc-900">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-5">
          <BadgeCheckIcon color="green" />
          <h1 className="text-2xl">Stato-gram</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Select Organization</SidebarGroupLabel>
          <SidebarContent>
            <OrganizationSwitcher />
          </SidebarContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Home</SidebarGroupLabel>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Services and Incidents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
