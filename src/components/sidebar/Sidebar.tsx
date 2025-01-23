"use client";
import {
  Home,
  BadgeAlert,
  Cog,
  CalendarSyncIcon,
  BadgeCheckIcon,
  ExternalLink,
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
    title: "Services",
    url: "/dashboard/services",
    icon: Cog,
  },
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
      {/* Sidebar Header */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-5">
          <BadgeCheckIcon color="green" />
          <h1 className="text-2xl">Stato-gram</h1>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        {/* Organization Switcher */}
        <SidebarGroup>
          <SidebarGroupLabel>Select Organization</SidebarGroupLabel>
          <SidebarContent>
            <OrganizationSwitcher />
          </SidebarContent>
        </SidebarGroup>

        {/* Home Section */}
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

        {/* Conditional Sections based on Organization */}
        {organizationId && (
          <>
            {/* Services and Incidents Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Services and Incidents</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items?.map((item) => (
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

            {/* Public Page Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Public Page</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/status/${organization?.slug}`}
                        target="blank"
                      >
                        <ExternalLink />
                        <span>Public Status Page</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
