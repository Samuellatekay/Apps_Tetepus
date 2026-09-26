import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Layers, RotateCcw, Trash2, Play, Minimize2, Save } from "lucide-react"

interface FlowToolbarProps {
  flowName: string
  onFlowNameChange: (name: string) => void
  hasSelectedNode: boolean
  hasSelectedEdge: boolean
  isRunning: boolean
  onExitFlow: () => void
  onSaveFlow: () => void
  onReset: () => void
  onDeleteSelected: () => void
  onDeleteSelectedConnection: () => void
  onRunFlow: () => void
}

export function FlowToolbar({
  flowName,
  onFlowNameChange,
  hasSelectedNode,
  hasSelectedEdge,
  isRunning,
  onExitFlow,
  onSaveFlow,
  onReset,
  onDeleteSelected,
  onDeleteSelectedConnection,
  onRunFlow,
}: FlowToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between border-b bg-muted/40 px-4 py-2.5 backdrop-blur gap-2">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Layers className="h-4 w-4" />
        </div>
        <div>
          <input
            aria-label="Nama flow"
            value={flowName}
            onChange={(event) => onFlowNameChange(event.target.value)}
            className="h-6 w-52 max-w-full bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Nama flow"
          />
          <p className="text-xs text-muted-foreground">
            Susun step dan koneksi flow otomatisasi
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          size="sm"
          variant="outline"
          onClick={onExitFlow}
          className="h-8 gap-1.5 text-xs"
        >
          <Minimize2 className="h-3.5 w-3.5" />
          Kembali ke Flow
        </Button>

        <Button
          size="sm"
          onClick={onSaveFlow}
          disabled={isRunning || !flowName.trim()}
          className="h-8 gap-1.5 text-xs"
        >
          <Save className="h-3.5 w-3.5" />
          Simpan Flow
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onReset}
          className="h-8 gap-1.5 text-xs"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Canvas
        </Button>

        {hasSelectedNode && (
          <Button
            size="sm"
            variant="destructive"
            onClick={onDeleteSelected}
            className="h-8 gap-1.5 text-xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Node
          </Button>
        )}

        {hasSelectedEdge && (
          <Button
            size="sm"
            variant="destructive"
            onClick={onDeleteSelectedConnection}
            className="h-8 gap-1.5 text-xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Connection
          </Button>
        )}

        <Button
          size="sm"
          onClick={onRunFlow}
          disabled={isRunning}
          className={`h-8 gap-1.5 text-xs ${
            isRunning ? "bg-amber-600 hover:bg-amber-700" : ""
          }`}
        >
          <Play className={`h-3.5 w-3.5 ${isRunning ? "animate-spin" : ""}`} />
          {isRunning ? "Running Flow..." : "Execute Flow"}
        </Button>
      </div>
    </div>
  )
}
