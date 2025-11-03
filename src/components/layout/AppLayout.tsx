"use client";

import AppSidebar from "./AppSidebar";
import { ModeToggle } from "@/components/modeToggle";
import { UserMenu } from "@/components/auth/UserMenu";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <main className="flex-1 overflow-y-auto">
        {(title || subtitle) && (
          <header className="flex justify-between items-center p-6 border-b">
            <div>
              {title && <h1 className="text-3xl font-bold text-foreground">{title}</h1>}
              {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <UserMenu />
            </div>
          </header>
        )}
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
