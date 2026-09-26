import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { AppsIntegrations } from "@/components/integrations/apps-integrations"
import { FlowSection } from "@/components/flow/flow-canvas"
import { FlowDashboard } from "@/components/flow/flow-dashboard"
import {
  loadAutomationFlows,
  saveAutomationFlows,
  type AutomationFlow,
} from "@/components/flow/flow-store"
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
  integrations: "Integrasi Apps",
  analytics: "Analytics",
  projects: "Projects",
  team: "Team",
}

export default function Page() {
  const [activeTab, setActiveTab] = React.useState("dashboard")
  const [flowState, setFlowState] = React.useState(() => {
    try {
      return { flows: loadAutomationFlows(), error: null as string | null }
    } catch (error) {
      return {
        flows: [],
        error: error instanceof Error ? error.message : "Flow tidak dapat dimuat.",
      }
    }
  })
  const { flows, error: flowLoadError } = flowState
  const [editingFlow, setEditingFlow] = React.useState<AutomationFlow | null>(null)

  const refreshFlows = React.useCallback(() => {
    try {
      setFlowState({ flows: loadAutomationFlows(), error: null })
    } catch (error) {
      setFlowState({
        flows: [],
        error: error instanceof Error ? error.message : "Flow tidak dapat dimuat.",
      })
    }
  }, [])

  const persistFlows = (nextFlows: AutomationFlow[]) => {
    try {
      saveAutomationFlows(nextFlows)
      setFlowState({ flows: nextFlows, error: null })
      return true
    } catch (error) {
      window.alert(
        error instanceof Error
          ? `Flow tidak dapat disimpan: ${error.message}`
          : "Flow tidak dapat disimpan."
      )
      return false
    }
  }

  const handleCreateFlow = () => {
    setEditingFlow({
      id: `flow-${Date.now()}`,
      name: `Automation Flow ${flows.length + 1}`,
      isActive: false,
      nodes: [],
      edges: [],
      updatedAt: new Date().toISOString(),
    })
  }

  const handleSaveFlow = (flow: AutomationFlow) => {
    const nextFlows = [
      flow,
      ...flows.filter((existingFlow) => existingFlow.id !== flow.id),
    ]
    if (persistFlows(nextFlows)) setEditingFlow(null)
  }

  const handleToggleFlow = (flow: AutomationFlow) => {
    persistFlows(
      flows.map((existingFlow) =>
        existingFlow.id === flow.id
          ? { ...existingFlow, isActive: !existingFlow.isActive }
          : existingFlow
      )
    )
  }

  const handleDeleteFlow = (flow: AutomationFlow) => {
    if (!window.confirm(`Hapus flow "${flow.name}"?`)) return
    persistFlows(flows.filter((existingFlow) => existingFlow.id !== flow.id))
  }

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab)
    setEditingFlow(null)
  }

  return (
    <TooltipProvider>
      {activeTab === "flow" && editingFlow ? (
        <div className="fixed inset-0 z-50 flex h-dvh w-screen min-h-0 flex-col overflow-hidden bg-background p-0">
          <FlowSection
            key={editingFlow.id}
            initialFlow={editingFlow}
            onExitFlow={() => setEditingFlow(null)}
            onSaveFlow={handleSaveFlow}
          />
        </div>
      ) : (
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
            onSelectTab={handleSelectTab}
          />
          <SidebarInset className="min-h-0 overflow-hidden">
            <SiteHeader title={titles[activeTab] ?? "Documents"} />
            <div className="flex flex-1 flex-col overflow-y-auto">
              <div className="@container/main flex flex-1 flex-col gap-2">
                {activeTab === "flow" ? (
                  flowLoadError ? (
                    <div className="flex flex-col items-start gap-3 px-6 py-10">
                      <p className="text-sm text-destructive">{flowLoadError}</p>
                      <button
                        type="button"
                        onClick={refreshFlows}
                        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        Coba lagi
                      </button>
                    </div>
                  ) : (
                    <FlowDashboard
                      flows={flows}
                      onCreate={handleCreateFlow}
                      onEdit={setEditingFlow}
                      onToggleActive={handleToggleFlow}
                      onDelete={handleDeleteFlow}
                    />
                  )
                ) : activeTab === "integrations" ? (
                  <AppsIntegrations />
                ) : (
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards />
                    <div className="px-4 lg:px-6">
                      <ChartAreaInteractive />
                    </div>
                    <DataTable data={data} />
                  </div>
                )}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      )}
    </TooltipProvider>
  )
}
