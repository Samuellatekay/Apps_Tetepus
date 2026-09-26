import { Position, type Node, type Edge } from "@xyflow/react"

const ltr = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
}

export const initialNodes: Node[] = [
  {
    id: "node-1",
    type: "workflow",
    ...ltr,
    position: { x: 0, y: 140 },
    data: {
      title: "Webhook Trigger",
      subtitle: "POST /api/v1/event",
      icon: "webhook",
      tag: "Trigger",
      description: "Listens for incoming webhook events from external systems.",
    },
  },
  {
    id: "node-2",
    type: "workflow",
    ...ltr,
    position: { x: 380, y: 0 },
    data: {
      title: "AI Processing",
      subtitle: "OpenAI GPT-4o",
      icon: "ai",
      tag: "AI Task",
      description: "Extracts metadata, categorizes sentiment and generates summary.",
    },
  },
  {
    id: "node-3",
    type: "workflow",
    ...ltr,
    position: { x: 380, y: 280 },
    data: {
      title: "Database Sync",
      subtitle: "PostgreSQL Upsert",
      icon: "database",
      tag: "Storage",
      description: "Writes verified customer records into primary database.",
    },
  },
  {
    id: "node-4",
    type: "action",
    ...ltr,
    position: { x: 760, y: 48 },
    data: {
      title: "Slack Alert",
      description: "Notify ops team on errors",
    },
  },
  {
    id: "node-5",
    type: "workflow",
    ...ltr,
    position: { x: 760, y: 280 },
    data: {
      title: "Dispatch Action",
      subtitle: "Email & Webhook",
      icon: "action",
      tag: "Notification",
      description: "Sends customized emails and triggers downstream jobs.",
    },
  },
]

export const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "node-1",
    target: "node-2",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#8b5cf6", strokeWidth: 2 },
  },
  {
    id: "e1-3",
    source: "node-1",
    target: "node-3",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#3b82f6", strokeWidth: 2 },
  },
  {
    id: "e2-4",
    source: "node-2",
    target: "node-4",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#a855f7", strokeWidth: 2 },
  },
  {
    id: "e3-5",
    source: "node-3",
    target: "node-5",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#10b981", strokeWidth: 2 },
  },
]
