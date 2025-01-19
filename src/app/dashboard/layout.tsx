import MainNav from "@/components/navbar/Navbar";
import { AppSidebar } from "@/components/sidebar/Sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main>
          <MainNav />
          <Toaster />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
