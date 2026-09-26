import { useState, useCallback, useMemo } from "react"
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type OnSelectionChangeParams,
  ReactFlowProvider,
  Panel,
  ConnectionLineType,
  Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { WorkflowNode, ActionNode, type FlowNodeData } from "./custom-nodes"
import { initialNodes, initialEdges } from "./flow-data"
import { FlowToolbar } from "./flow-toolbar"
import { FlowPalette } from "./flow-palette"
import { FlowInspector } from "./flow-inspector"

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const nodeTypes = useMemo(
    () => ({
      workflow: WorkflowNode,
      action: ActionNode,
    }),
    []
  )

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#6366f1", strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  )

  const onSelectionChange = useCallback(({ nodes: selected }: OnSelectionChangeParams) => {
    setSelectedNode(selected[0] ?? null)
  }, [])

  const handleRunFlow = async () => {
    if (isRunning) return
    setIsRunning(true)

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, status: "idle" },
      }))
    )

    for (const node of nodes) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, data: { ...n.data, status: "running" } } : n
        )
      )
      await delay(450)
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, data: { ...n.data, status: "success" } } : n
        )
      )
    }

    setIsRunning(false)
  }

  const addCustomNode = (type: string, title: string, icon: string, tag: string, desc: string) => {
    const newNodeId = `node-${Date.now()}`
    const maxX = nodes.reduce((max, n) => Math.max(max, n.position.x), 0)
    const newNode: Node = {
      id: newNodeId,
      type: type === "action" ? "action" : "workflow",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      position: {
        x: maxX + 360,
        y: 80 + Math.random() * 180,
      },
      data: {
        title,
        subtitle: `${type.toUpperCase()} Node`,
        icon,
        tag,
        description: desc,
        status: "idle",
      },
    }

    setNodes((nds) => [...nds, newNode])
  }

  const resetFlow = () => {
    setNodes(initialNodes)
    setEdges(initialEdges)
    setSelectedNode(null)
  }

  const deleteSelected = () => {
    if (!selectedNode) return
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
    )
    setSelectedNode(null)
  }

  const updateNodeData = (nodeId: string, patch: Partial<FlowNodeData>) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n
      )
    )
    setSelectedNode((current) =>
      current && current.id === nodeId
        ? { ...current, data: { ...current.data, ...patch } }
        : current
    )
  }

  return (
    <div className="relative flex h-full min-h-[560px] w-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
      <FlowToolbar
        hasSelectedNode={!!selectedNode}
        isRunning={isRunning}
        onReset={resetFlow}
        onDeleteSelected={deleteSelected}
        onRunFlow={handleRunFlow}
      />
      <FlowPalette onAddNode={addCustomNode} />

      <div className="relative flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          minZoom={0.25}
          maxZoom={2}
          defaultEdgeOptions={{ type: "smoothstep" }}
          connectionLineType={ConnectionLineType.SmoothStep}
          deleteKeyCode={["Backspace", "Delete"]}
          attributionPosition="bottom-left"
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls className="!bg-card !border-border !shadow-md" />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === "action") return "#c084fc"
              return "#3b82f6"
            }}
            className="!rounded-lg !border !border-border !bg-card/90 !shadow-sm"
          />

          {selectedNode && (
            <Panel position="top-right" className="m-3">
              <FlowInspector
                nodeId={selectedNode.id}
                data={selectedNode.data as FlowNodeData}
                onChange={updateNodeData}
                onClose={() => setSelectedNode(null)}
              />
            </Panel>
          )}

          {isRunning && (
            <Panel position="bottom-center" className="m-3">
              <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600 shadow-sm backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
                </span>
                Processing flow pipeline...
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>
    </div>
  )
}

export function FlowSection() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  )
}
