import { Handle, Position, type NodeProps } from "@xyflow/react"
import {
  Webhook,
  Sparkles,
  Database,
  Send,
  Code2,
  CheckCircle2,
  Play,
  Settings2,
  ArrowRight,
} from "lucide-react"

export interface FlowNodeData {
  title: string
  subtitle?: string
  icon?: string
  status?: "idle" | "running" | "success" | "error"
  description?: string
  tag?: string
  config?: Record<string, string | number | boolean>
  [key: string]: unknown
}

const getIcon = (type?: string) => {
  switch (type) {
    case "webhook":
    case "trigger":
      return <Webhook className="h-4 w-4 text-emerald-500" />
    case "ai":
    case "sparkles":
      return <Sparkles className="h-4 w-4 text-purple-500" />
    case "database":
    case "data":
      return <Database className="h-4 w-4 text-blue-500" />
    case "action":
    case "send":
      return <Send className="h-4 w-4 text-amber-500" />
    case "code":
      return <Code2 className="h-4 w-4 text-cyan-500" />
    default:
      return <Play className="h-4 w-4 text-primary" />
  }
}

export function WorkflowNode({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData

  return (
    <div
      className={`relative min-w-[240px] max-w-[320px] rounded-xl border bg-card/95 p-3 text-card-foreground shadow-sm backdrop-blur transition-all duration-200 ${
        selected
          ? "border-primary ring-2 ring-primary/20 shadow-lg"
          : "border-border hover:border-foreground/30 hover:shadow-md"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !rounded-full !border-2 !border-background !bg-primary transition hover:!scale-125"
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/80">
            {getIcon(nodeData.icon || "trigger")}
          </div>
          <div>
            <h4 className="text-xs font-semibold leading-none">{nodeData.title}</h4>
            {nodeData.subtitle && (
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {nodeData.subtitle}
              </p>
            )}
          </div>
        </div>

        {nodeData.tag && (
          <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[9px] font-medium text-secondary-foreground">
            {nodeData.tag}
          </span>
        )}
      </div>

      {/* Description / Content */}
      {nodeData.description && (
        <div className="mt-2.5 rounded-md bg-muted/50 p-2 text-[11px] text-muted-foreground">
          {nodeData.description}
        </div>
      )}

      {/* Footer / Status */}
      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          {nodeData.status === "running" ? (
            <>
              <Play className="h-3 w-3 animate-pulse text-amber-500" />
              <span className="text-amber-600">Running</span>
            </>
          ) : nodeData.status === "success" ? (
            <>
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span>Success</span>
            </>
          ) : nodeData.status === "error" ? (
            <>
              <CheckCircle2 className="h-3 w-3 text-destructive" />
              <span className="text-destructive">Error</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span>Ready</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground">
          <Settings2 className="h-3 w-3" />
          <span>Config</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !rounded-full !border-2 !border-background !bg-primary transition hover:!scale-125"
      />
    </div>
  )
}

export function ActionNode({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData

  return (
    <div
      className={`relative min-w-[200px] rounded-lg border bg-gradient-to-br from-card to-muted/30 p-2.5 text-card-foreground shadow-sm transition-all ${
        selected ? "border-purple-500 ring-2 ring-purple-500/20 shadow-md" : "border-border hover:border-purple-500/50"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !rounded-full !border-2 !border-background !bg-purple-500"
      />

      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/10 text-purple-500">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="truncate text-xs font-medium">{nodeData.title}</div>
          <div className="truncate text-[10px] text-muted-foreground">{nodeData.description}</div>
        </div>
        <ArrowRight className="h-3 w-3 text-muted-foreground opacity-60" />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !rounded-full !border-2 !border-background !bg-purple-500"
      />
    </div>
  )
}
