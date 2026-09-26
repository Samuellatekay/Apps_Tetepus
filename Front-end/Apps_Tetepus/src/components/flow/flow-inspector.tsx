import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FlowNodeData } from "./custom-nodes"
import { X } from "lucide-react"

interface FlowInspectorProps {
  nodeId: string
  data: FlowNodeData
  onChange: (nodeId: string, patch: Partial<FlowNodeData>) => void
  onClose: () => void
}

export function FlowInspector({ nodeId, data, onChange, onClose }: FlowInspectorProps) {
  return (
    <div className="flex w-72 flex-col gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Node Inspector
          </p>
          <p className="text-xs font-medium">{nodeId}</p>
        </div>
        <Button size="icon" variant="ghost" className="size-7" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Close inspector</span>
        </Button>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="flow-node-title" className="text-[11px]">
          Title
        </Label>
        <Input
          id="flow-node-title"
          value={data.title ?? ""}
          onChange={(e) => onChange(nodeId, { title: e.target.value })}
          className="h-8 text-xs"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="flow-node-subtitle" className="text-[11px]">
          Subtitle
        </Label>
        <Input
          id="flow-node-subtitle"
          value={data.subtitle ?? ""}
          onChange={(e) => onChange(nodeId, { subtitle: e.target.value })}
          className="h-8 text-xs"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="flow-node-desc" className="text-[11px]">
          Description
        </Label>
        <textarea
          id="flow-node-desc"
          value={data.description ?? ""}
          onChange={(e) => onChange(nodeId, { description: e.target.value })}
          rows={3}
          className="min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
    </div>
  )
}
