import SideNavBar from "@/components/SideNavBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full h-full">
      <header className="h-12 mb-10 bg-slate-500"></header>
      <div className="flex flex-1">
        <SideNavBar />
        <main className="flex-1 p-8">{children}</main>
      </div>
      <footer className="h-20"></footer>
    </div>
  );
}
