import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { FlowSection } from "@/components/flow/flow-canvas"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import data from "./data.json"

const titles: Record<string, string> = {
  dashboard: "Dashboard",
  flow: "Automation Flow",
  lifecycle: "Lifecycle",
  analytics: "Analytics",
  projects: "Projects",
  team: "Team",
}

export default function Page() {
  const [activeTab, setActiveTab] = React.useState("dashboard")

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar
          variant="inset"
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />
        <SidebarInset className="min-h-0 overflow-hidden">
          <SiteHeader title={titles[activeTab] ?? "Documents"} />
          {activeTab === "flow" ? (
            <div className="flex min-h-0 flex-1 flex-col p-4 md:p-6">
              <FlowSection />
            </div>
          ) : (
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <SectionCards />
                  <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                  </div>
                  <DataTable data={data} />
                </div>
              </div>
            </div>
          )}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

