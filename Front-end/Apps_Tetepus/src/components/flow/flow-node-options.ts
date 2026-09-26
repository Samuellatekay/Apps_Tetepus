import { Code2, Database, GitBranch, Send, Sparkles, Webhook } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { appCatalog, loadInstalledAppIds } from "@/components/integrations/app-catalog"
import { loadHttpIntegrations } from "@/components/integrations/http-integrations-store"

export interface FlowNodeOption {
  type: string
  title: string
  icon: string
  tag: string
  description: string
  label: string
  Icon: LucideIcon
  iconClassName: string
  integrationId?: string
}

export const baseFlowNodeOptions: FlowNodeOption[] = [
  {
    type: "decision",
    title: "If & Else",
    icon: "branch",
    tag: "Condition",
    description: "Route the flow based on a condition.",
    label: "If & Else",
    Icon: GitBranch,
    iconClassName: "text-amber-500",
  },
  {
    type: "workflow",
    title: "Webhook Hook",
    icon: "webhook",
    tag: "Trigger",
    description: "Receive real-time external HTTP payload.",
    label: "Trigger",
    Icon: Webhook,
    iconClassName: "text-emerald-500",
  },
  {
    type: "workflow",
    title: "AI Transform",
    icon: "ai",
    tag: "AI Task",
    description: "Process content with LLM model.",
    label: "AI Prompt",
    Icon: Sparkles,
    iconClassName: "text-purple-500",
  },
  {
    type: "workflow",
    title: "Database Store",
    icon: "database",
    tag: "Storage",
    description: "Persist records into database.",
    label: "Database",
    Icon: Database,
    iconClassName: "text-blue-500",
  },
  {
    type: "action",
    title: "Quick Action",
    icon: "send",
    tag: "Action",
    description: "Send notification or webhook.",
    label: "Action",
    Icon: Send,
    iconClassName: "text-amber-500",
  },
]

export function getFlowNodeOptions(): FlowNodeOption[] {
  const installedAppIds = new Set(loadInstalledAppIds())
  const installedAppOptions = appCatalog
    .filter((app) => installedAppIds.has(app.id))
    .map((app): FlowNodeOption => ({
      type: "workflow",
      title: app.name,
      icon: app.id,
      tag: "Installed App",
      description: app.description,
      label: app.name,
      Icon: app.icon,
      iconClassName: app.color.split(" ")[0],
    }))
  const httpOptions = loadHttpIntegrations().map((integration): FlowNodeOption => ({
    type: "action",
    title: integration.name,
    icon: "code",
    tag: `HTTP ${integration.method}${integration.hasApiKey ? " · API Key" : ""}`,
    description: `${integration.method} ${integration.url}${integration.hasApiKey ? " · Authorization: Bearer (key disimpan pada integrasi)" : ""}`,
    label: `HTTP: ${integration.name}`,
    Icon: Code2,
    iconClassName: "text-sky-500",
    integrationId: integration.id,
  }))

  return [...baseFlowNodeOptions, ...httpOptions, ...installedAppOptions]
}
