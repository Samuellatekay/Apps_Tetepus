import {
  Activity,
  Clock3,
  GitBranch,
  Layers3,
  Play,
  Plus,
  Trash2,
  Workflow,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { type AutomationFlow } from "./flow-store"

interface FlowDashboardProps {
  flows: AutomationFlow[]
  onCreate: () => void
  onEdit: (flow: AutomationFlow) => void
  onToggleActive: (flow: AutomationFlow) => void
  onDelete: (flow: AutomationFlow) => void
}

function formatUpdatedAt(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "Waktu tidak diketahui"
    : `Diperbarui ${date.toLocaleDateString()}`
}

export function FlowDashboard({
  flows,
  onCreate,
  onEdit,
  onToggleActive,
  onDelete,
}: FlowDashboardProps) {
  const activeFlows = flows.filter((flow) => flow.isActive).length
  const totalSteps = flows.reduce((total, flow) => total + flow.nodes.length, 0)

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Automation Flows</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola flow otomatisasi, status, dan langkah-langkahnya.
          </p>
        </div>
        <Button onClick={onCreate} className="gap-2">
          <Plus className="size-4" />
          Buat Flow
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard label="Total Flow" value={flows.length} icon={Layers3} />
        <SummaryCard label="Flow Aktif" value={activeFlows} icon={Activity} />
        <SummaryCard label="Total Step" value={totalSteps} icon={GitBranch} />
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Semua Flow</h3>
          <span className="text-sm text-muted-foreground">{flows.length} flow</span>
        </div>

        {flows.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Workflow className="size-6" />
              </div>
              <div>
                <h4 className="font-medium">Belum ada Automation Flow</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Buat flow pertama, tambahkan step, lalu simpan untuk melihat ringkasannya di sini.
                </p>
              </div>
              <Button onClick={onCreate} variant="outline" className="mt-1 gap-2">
                <Plus className="size-4" />
                Buat Flow Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {flows.map((flow) => (
              <Card key={flow.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <button
                    type="button"
                    onClick={() => onEdit(flow)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Workflow className="size-5" />
                    </div>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{flow.name}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <GitBranch className="size-3.5" />
                          {flow.nodes.length} step
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="size-3.5" />
                          {formatUpdatedAt(flow.updatedAt)}
                        </span>
                      </span>
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        flow.isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          flow.isActive ? "bg-emerald-500" : "bg-muted-foreground/50"
                        }`}
                      />
                      {flow.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleActive(flow)}
                      className="gap-1.5"
                    >
                      <Play className="size-3.5" />
                      {flow.isActive ? "Nonaktifkan" : "Aktifkan"}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Hapus ${flow.name}`}
                      title={`Hapus ${flow.name}`}
                      onClick={() => onDelete(flow)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: typeof Layers3
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between py-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">{value}</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}
