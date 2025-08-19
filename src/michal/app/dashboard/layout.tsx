"use client"

import type { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import styles from "@/components/no-scrollbar.module.css"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-svh overflow-hidden">
        {/* Fixed sidebar */}
        <AppSidebar />

        {/* Main content: full width with no unnecessary margins */}
        <main className="flex min-w-0 flex-1 flex-col bg-sky-50">
          <div className={`min-h-0 flex-1 overflow-y-auto ${styles.noScrollbar}`}>
            <div className="w-full p-4 md:p-6">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
