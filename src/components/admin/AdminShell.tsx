"use client";
import { useEffect, useState } from "react";
import { AdminSidebar, AdminMobileTop } from "./AdminSidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sabren-admin-rail");
    if (saved === "1") setCollapsed(true);
  }, []);

  const toggle = () => {
    setCollapsed((c) => {
      localStorage.setItem("sabren-admin-rail", c ? "0" : "1");
      return !c;
    });
  };

  return (
    <div className="min-h-screen bg-sabren-cream">
      <AdminSidebar collapsed={collapsed} onToggle={toggle} />
      <AdminMobileTop />
      <main className={`ml-14 transition-[margin] duration-300 min-h-screen ${collapsed ? "md:ml-[68px]" : "md:ml-64"}`}>
        <div className="px-4 md:px-8 py-6 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}