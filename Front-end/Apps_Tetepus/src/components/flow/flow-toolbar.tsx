import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layers, RotateCcw, Trash2, Play } from "lucide-react"

interface FlowToolbarProps {
  hasSelectedNode: boolean
  isRunning: boolean
  onReset: () => void
  onDeleteSelected: () => void
  onRunFlow: () => void
}

export function FlowToolbar({
  hasSelectedNode,
  isRunning,
  onReset,
  onDeleteSelected,
  onRunFlow,
}: FlowToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between border-b bg-muted/40 px-4 py-2.5 backdrop-blur gap-2">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Layers className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Workflow Automation Flow</h3>
            <Badge variant="outline" className="text-[10px] font-normal">
              React Flow
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Interactive visual pipeline for triggers, AI prompts, and database workflows
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
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
