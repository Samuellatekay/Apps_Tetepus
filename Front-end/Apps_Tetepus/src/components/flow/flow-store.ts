import type { Edge, Node } from "@xyflow/react"

const STORAGE_KEY = "tetepus-automation-flows"

function isAutomationFlow(value: unknown): value is AutomationFlow {
  if (typeof value !== "object" || value === null) return false
  if (
    !("id" in value) ||
    !("name" in value) ||
    !("isActive" in value) ||
    !("nodes" in value) ||
    !("edges" in value) ||
    !("updatedAt" in value)
  ) {
    return false
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.isActive === "boolean" &&
    Array.isArray(value.nodes) &&
    Array.isArray(value.edges) &&
    typeof value.updatedAt === "string"
  )
}

export interface AutomationFlow {
  id: string
  name: string
  isActive: boolean
  nodes: Node[]
  edges: Edge[]
  updatedAt: string
}

export function loadAutomationFlows(): AutomationFlow[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []

  const flows: unknown = JSON.parse(stored)
  if (!Array.isArray(flows) || !flows.every(isAutomationFlow)) {
    throw new Error("Saved automation flows have an invalid format.")
  }

  return flows as AutomationFlow[]
}

export function saveAutomationFlows(flows: AutomationFlow[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flows))
}
