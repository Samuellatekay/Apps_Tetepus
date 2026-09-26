import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { baseFlowNodeOptions, getFlowNodeOptions } from "./flow-node-options"

interface FlowPaletteProps {
  onAddNode: (
    type: string,
    title: string,
    icon: string,
    tag: string,
    desc: string,
    integrationId?: string
  ) => void
}

export function FlowPalette({ onAddNode }: FlowPaletteProps) {
  const [search, setSearch] = useState("")
  const [nodeOptions] = useState(() => {
    try {
      return { options: getFlowNodeOptions(), error: null as string | null }
    } catch (error) {
      return {
        options: baseFlowNodeOptions,
        error: error instanceof Error ? error.message : "Daftar step integrasi gagal dimuat.",
      }
    }
  })
  const query = search.trim().toLowerCase()
  const filteredOptions = useMemo(() => {
    const options = nodeOptions.options
    return query === "/all"
      ? options
      : options.filter((option) =>
        [option.label, option.title, option.tag, option.description]
          .some((value) => value.toLowerCase().includes(query))
      )
  }, [nodeOptions.options, query])

  return (
    <div className="relative flex w-fit max-w-full items-center gap-1.5 self-start rounded-lg border bg-muted/20 px-2 py-1.5">
      <label
        htmlFor="flow-node-search"
        className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase"
      >
        Add Step
      </label>
      <Input
        id="flow-node-search"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search nodes..."
        className="h-7 w-32 text-[11px]"
      />
      {nodeOptions.error && (
        <span className="max-w-48 text-[10px] text-destructive" role="alert">
          {nodeOptions.error}
        </span>
      )}
      {query && (
        <div className="absolute left-[4.5rem] top-full z-20 mt-1 flex max-h-56 min-w-36 flex-col gap-1 overflow-y-auto rounded-lg border bg-popover p-1.5 text-popover-foreground shadow-lg">
          {filteredOptions.map(({ type, title, icon, tag, description, label, Icon, iconClassName, integrationId }) => (
            <Button
              key={label}
              variant="outline"
              size="sm"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("application/reactflow", label)
                event.dataTransfer.effectAllowed = "move"
              }}
              onClick={() => onAddNode(type, title, icon, tag, description, integrationId)}
              className="h-7 w-full justify-start gap-1.5 px-2 text-[11px]"
            >
              <Icon className={`h-3.5 w-3.5 ${iconClassName}`} />
              {label}
            </Button>
          ))}
          {filteredOptions.length === 0 && (
            <span className="px-2 py-1 text-xs text-muted-foreground">No matching nodes</span>
          )}
        </div>
      )}
    </div>
  )
}
