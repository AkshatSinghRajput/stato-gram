import MainNav from "@/components/navbar/Navbar";
import { AppSidebar } from "@/components/sidebar/Sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
