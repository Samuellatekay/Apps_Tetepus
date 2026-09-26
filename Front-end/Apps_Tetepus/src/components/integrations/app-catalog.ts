import {
  Code2,
  GitBranch,
  Headset,
  MessageSquare,
  Shield,
  Table2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const INSTALLED_APPS_STORAGE_KEY = "tetepus-installed-apps"

export interface AppDefinition {
  id: string
  name: string
  description: string
  category: string
  icon: LucideIcon
  color: string
}

export const appCatalog: AppDefinition[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Kirim notifikasi dan koordinasikan respons insiden.",
    category: "Komunikasi",
    icon: MessageSquare,
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    description: "Hubungkan playbook dengan kanal dan pesan Teams.",
    category: "Komunikasi",
    icon: MessageSquare,
    color: "text-indigo-500 bg-indigo-500/10",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Otomatiskan tugas repository, issue, dan pull request.",
    category: "Developer Tools",
    icon: GitBranch,
    color: "text-foreground bg-muted",
  },
  {
    id: "jira",
    name: "Jira",
    description: "Buat dan perbarui tiket dari workflow otomatis.",
    category: "Developer Tools",
    icon: Code2,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Baca dan tulis data spreadsheet dari workflow.",
    category: "Produktivitas",
    icon: Table2,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    id: "servicenow",
    name: "ServiceNow",
    description: "Kelola insiden dan permintaan layanan secara otomatis.",
    category: "Keamanan",
    icon: Headset,
    color: "text-teal-500 bg-teal-500/10",
  },
  {
    id: "splunk",
    name: "Splunk",
    description: "Gunakan data keamanan dan alert dalam playbook.",
    category: "Keamanan",
    icon: Shield,
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    id: "crowdstrike",
    name: "CrowdStrike",
    description: "Hubungkan respons endpoint ke otomasi keamanan.",
    category: "Keamanan",
    icon: Shield,
    color: "text-red-500 bg-red-500/10",
  },
]

export function loadInstalledAppIds(): string[] {
  const raw = localStorage.getItem(INSTALLED_APPS_STORAGE_KEY)
  if (!raw) return []

  const parsed: unknown = JSON.parse(raw)
  if (
    !Array.isArray(parsed) ||
    !parsed.every(
      (id) => typeof id === "string" && appCatalog.some((app) => app.id === id)
    )
  ) {
    throw new Error("Daftar aplikasi terpasang memiliki format yang tidak valid.")
  }
  return parsed
}

export function saveInstalledAppIds(installedAppIds: string[]) {
  localStorage.setItem(INSTALLED_APPS_STORAGE_KEY, JSON.stringify(installedAppIds))
}
