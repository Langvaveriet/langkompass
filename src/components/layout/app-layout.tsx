import type { ReactNode } from "react";

import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-surface">
      <TopBar />
      <MobileNavigation />

      <div className="flex min-h-[calc(100vh-72px)] w-full">
        <Sidebar />

        <main className="min-w-0 flex-1 px-6 py-10 md:px-8 lg:px-12 xl:px-14 2xl:px-16">
          {children}
        </main>
      </div>
    </div>
  );
}
