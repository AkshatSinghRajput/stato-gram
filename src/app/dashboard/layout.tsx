import MainNav from "@/components/navbar/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainNav></MainNav>
      <div className="h-screen p-2">{children}</div>
    </>
  );
}
