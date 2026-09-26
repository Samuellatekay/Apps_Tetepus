import { useState, useCallback, useMemo, useRef, useEffect } from "react"
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
  type ConnectionLineComponentProps,
  type Edge,
  type Node,
  type XYPosition,
  type OnSelectionChangeParams,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  ConnectionLineType,
  Position,
  getSmoothStepPath,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { WorkflowNode, ActionNode, IfElseNode, type FlowNodeData } from "./custom-nodes"
import { initialNodes, initialEdges } from "./flow-data"
import { FlowToolbar } from "./flow-toolbar"
import { FlowPalette } from "./flow-palette"
import { flowNodeOptions } from "./flow-node-options"
import { FlowInspector } from "./flow-inspector"
import type { AutomationFlow } from "./flow-store"

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function ConnectionPreview({
  fromX,
  fromY,
  fromPosition,
  toX,
  toY,
  toPosition,
  connectionStatus,
}: ConnectionLineComponentProps) {
  const [path] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  })

  return (
    <path
      d={path}
      fill="none"
      stroke={connectionStatus === "invalid" ? "#ef4444" : "#22c55e"}
      strokeWidth={2}
      className="react-flow__connection-path"
    />
  )
}

interface FlowCanvasProps {
  initialFlow: AutomationFlow
  onExitFlow: () => void
  onSaveFlow: (flow: AutomationFlow) => void
}

export function FlowCanvas({ initialFlow, onExitFlow, onSaveFlow }: FlowCanvasProps) {
  const [flowName, setFlowName] = useState(initialFlow.name)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow.nodes ?? initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow.edges ?? initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition, flowToScreenPosition, getViewport, fitView } = useReactFlow()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let frame = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        void fitView({ padding: 0.18, duration: 200 })
      })
    })

    observer.observe(canvas)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [fitView])

  const nodeTypes = useMemo(
    () => ({
      workflow: WorkflowNode,
      action: ActionNode,
      decision: IfElseNode,
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
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  )

  const isValidConnection = useCallback(
    (connection: Edge | Connection) =>
      connection.source !== connection.target &&
      !edges.some(
        (edge) =>
          edge.source === connection.source &&
          edge.sourceHandle === connection.sourceHandle &&
          edge.target === connection.target &&
          edge.targetHandle === connection.targetHandle
      ),
    [edges]
  )

  const onSelectionChange = useCallback(({ nodes: selected, edges: selectedEdges }: OnSelectionChangeParams) => {
    setSelectedNode(selected[0] ?? null)
    setSelectedEdge(selectedEdges[0] ?? null)
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

  const addCustomNode = (
    type: string,
    title: string,
    icon: string,
    tag: string,
    desc: string,
    dropPosition?: XYPosition
  ) => {
    const newNodeId = `node-${Date.now()}`
    const canvasBounds = canvasRef.current?.getBoundingClientRect()
    const nodeWidth = type === "action" ? 200 : type === "decision" ? 240 : 280
    const nodeHeight = type === "action" ? 56 : type === "decision" ? 120 : 124
    const spacingX = nodeWidth + 40
    const spacingY = nodeHeight + 32
    const offsets = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ]
    const centerX = canvasBounds
      ? canvasBounds.left + canvasBounds.width / 2
      : window.innerWidth / 2
    const centerY = canvasBounds
      ? canvasBounds.top + canvasBounds.height / 2
      : window.innerHeight / 2
    const center = screenToFlowPosition({ x: centerX, y: centerY })
    const zoom = getViewport().zoom
    const position = dropPosition
      ? {
          x: dropPosition.x - nodeWidth / 2,
          y: dropPosition.y - nodeHeight / 2,
        }
      : offsets
          .map(([column, row]) => ({
            x: center.x + column * spacingX - nodeWidth / 2,
            y: center.y + row * spacingY - nodeHeight / 2,
          }))
          .find((candidate) => {
            if (canvasBounds) {
              const screenPosition = flowToScreenPosition(candidate)
              if (
                screenPosition.x < canvasBounds.left + 8 ||
                screenPosition.x + nodeWidth * zoom > canvasBounds.right - 8 ||
                screenPosition.y < canvasBounds.top + 8 ||
                screenPosition.y + nodeHeight * zoom > canvasBounds.bottom - 8
              ) {
                return false
              }
            }

            return nodes.every((node) => {
              const existingWidth =
                node.measured?.width ??
                node.width ??
                (node.type === "action" ? 200 : node.type === "decision" ? 240 : 280)
              const existingHeight =
                node.measured?.height ??
                node.height ??
                (node.type === "action" ? 56 : node.type === "decision" ? 120 : 124)
              return (
                candidate.x + nodeWidth + 24 <= node.position.x ||
                node.position.x + existingWidth + 24 <= candidate.x ||
                candidate.y + nodeHeight + 24 <= node.position.y ||
                node.position.y + existingHeight + 24 <= candidate.y
              )
            })
          }) ?? {
          x: center.x - nodeWidth / 2,
          y: center.y - nodeHeight / 2,
        }
    const newNode: Node = {
      id: newNodeId,
      type: type === "decision" || type === "action" ? type : "workflow",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      position,
      data: {
        title,
        subtitle: type === "decision" ? "Condition" : `${type.toUpperCase()} Node`,
        icon,
        tag,
        description: desc,
        status: "idle",
      },
    }

    setNodes((nds) => [...nds, newNode])
    if (!dropPosition) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          void fitView({ padding: 0.18, duration: 250 })
        })
      })
    }
  }

  const resetFlow = () => {
    setNodes(initialNodes)
    setEdges(initialEdges)
    setSelectedNode(null)
    setSelectedEdge(null)
  }

  const saveFlow = () => {
    const name = flowName.trim()
    if (!name) return

    onSaveFlow({
      ...initialFlow,
      name,
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
    })
  }

  const deleteSelected = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
      setEdges((eds) =>
        eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
      )
      setSelectedNode(null)
    }
  }

  const deleteSelectedConnection = () => {
    if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id))
      setSelectedEdge(null)
    }
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
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-card">
      <FlowToolbar
        flowName={flowName}
        onFlowNameChange={setFlowName}
        hasSelectedNode={!!selectedNode}
        hasSelectedEdge={!!selectedEdge}
        isRunning={isRunning}
        onExitFlow={onExitFlow}
        onSaveFlow={saveFlow}
        onReset={resetFlow}
        onDeleteSelected={deleteSelected}
        onDeleteSelectedConnection={deleteSelectedConnection}
        onRunFlow={handleRunFlow}
      />

      <div
        ref={canvasRef}
        className="relative min-h-0 min-w-0 flex-1"
        onDragOver={(event) => {
          event.preventDefault()
          event.dataTransfer.dropEffect = "move"
        }}
        onDrop={(event) => {
          event.preventDefault()
          const label = event.dataTransfer.getData("application/reactflow")
          const option = flowNodeOptions.find((nodeOption) => nodeOption.label === label)
          if (!option) return

          addCustomNode(
            option.type,
            option.title,
            option.icon,
            option.tag,
            option.description,
            screenToFlowPosition({ x: event.clientX, y: event.clientY })
          )
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          isValidConnection={isValidConnection}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          minZoom={0.25}
          maxZoom={2}
          defaultEdgeOptions={{ type: "smoothstep" }}
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionLineComponent={ConnectionPreview}
          deleteKeyCode={["Backspace", "Delete"]}
          attributionPosition="bottom-left"
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls className="!bg-card !border-border !shadow-md" />
          <MiniMap
            nodeColor={(node) => node.type === "action" ? "#c084fc" : "#3b82f6"}
            className="!bottom-4 !right-4 !h-24 !w-36 !rounded-lg !border !border-border/50 !bg-card/60 !shadow-sm !backdrop-blur-sm opacity-0 transition-opacity duration-200 hover:opacity-100 [&_svg]:!h-full [&_svg]:!w-full"
            maskColor="rgba(0, 0, 0, 0.12)"
          />
          <Panel position="top-left" className="!m-2">
            <FlowPalette onAddNode={addCustomNode} />
          </Panel>

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

type FlowSectionProps = FlowCanvasProps

export function FlowSection({ initialFlow, onExitFlow, onSaveFlow }: FlowSectionProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvas
        initialFlow={initialFlow}
        onExitFlow={onExitFlow}
        onSaveFlow={onSaveFlow}
      />
    </ReactFlowProvider>
  )
}
