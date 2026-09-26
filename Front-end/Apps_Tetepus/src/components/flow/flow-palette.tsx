import { Button } from "@/components/ui/button"
import { Webhook, Sparkles, Database, Send } from "lucide-react"

interface FlowPaletteProps {
  onAddNode: (type: string, title: string, icon: string, tag: string, desc: string) => void
}

export function FlowPalette({ onAddNode }: FlowPaletteProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b bg-muted/20 px-4 py-2">
      <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
        Add Step
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onAddNode(
              "workflow",
              "Webhook Hook",
              "webhook",
              "Trigger",
              "Receive real-time external HTTP payload."
            )
          }
          className="h-7 justify-start gap-1.5 px-2 text-[11px]"
        >
          <Webhook className="h-3.5 w-3.5 text-emerald-500" />
          Trigger
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onAddNode(
              "workflow",
              "AI Transform",
              "ai",
              "AI Task",
              "Process content with LLM model."
            )
          }
          className="h-7 justify-start gap-1.5 px-2 text-[11px]"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-500" />
          AI Prompt
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onAddNode(
              "workflow",
              "Database Store",
              "database",
              "Storage",
              "Persist records into database."
            )
          }
          className="h-7 justify-start gap-1.5 px-2 text-[11px]"
        >
          <Database className="h-3.5 w-3.5 text-blue-500" />
          Database
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onAddNode(
              "action",
              "Quick Action",
              "send",
              "Action",
              "Send notification or webhook."
            )
          }
          className="h-7 justify-start gap-1.5 px-2 text-[11px]"
        >
          <Send className="h-3.5 w-3.5 text-amber-500" />
          Action
        </Button>
      </div>
    </div>
  )
}
