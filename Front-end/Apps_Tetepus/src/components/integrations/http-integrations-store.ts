export const HTTP_INTEGRATIONS_STORAGE_KEY = "tetepus-http-integrations"
const HTTP_INTEGRATION_CREDENTIALS_STORAGE_KEY = "tetepus-http-integration-credentials"

export const HTTP_METHODS = [
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "CONNECT",
  "TRACE",
] as const

export type HttpMethod = (typeof HTTP_METHODS)[number]

export interface HttpIntegration {
  id: string
  name: string
  url: string
  method: HttpMethod
  hasApiKey?: boolean
  createdAt: string
}

export interface HttpIntegrationCredential {
  integrationId: string
  apiKey: string
}

function isHttpIntegration(value: unknown): value is HttpIntegration {
  if (typeof value !== "object" || value === null) return false
  if (
    !("id" in value) ||
    !("name" in value) ||
    !("url" in value) ||
    !("method" in value) ||
    !("createdAt" in value)
  ) {
    return false
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.url === "string" &&
    isHttpMethod(value.method) &&
    (!("hasApiKey" in value) || typeof value.hasApiKey === "boolean") &&
    typeof value.createdAt === "string"
  )
}

export function isHttpMethod(value: unknown): value is HttpMethod {
  return typeof value === "string" && HTTP_METHODS.some((method) => method === value)
}

function isCredential(value: unknown): value is HttpIntegrationCredential {
  if (typeof value !== "object" || value === null) return false
  if (!("integrationId" in value) || !("apiKey" in value)) return false
  return typeof value.integrationId === "string" && typeof value.apiKey === "string"
}

export function loadHttpIntegrations(): HttpIntegration[] {
  const stored = localStorage.getItem(HTTP_INTEGRATIONS_STORAGE_KEY)
  if (!stored) return []

  const parsed: unknown = JSON.parse(stored)
  if (!Array.isArray(parsed) || !parsed.every(isHttpIntegration)) {
    throw new Error("Daftar integrasi HTTP memiliki format yang tidak valid.")
  }
  return parsed
}

export function saveHttpIntegrations(integrations: HttpIntegration[]) {
  localStorage.setItem(HTTP_INTEGRATIONS_STORAGE_KEY, JSON.stringify(integrations))
}

export function loadHttpIntegrationCredentials(): HttpIntegrationCredential[] {
  const stored = localStorage.getItem(HTTP_INTEGRATION_CREDENTIALS_STORAGE_KEY)
  if (!stored) return []

  const parsed: unknown = JSON.parse(stored)
  if (!Array.isArray(parsed) || !parsed.every(isCredential)) {
    throw new Error("Kredensial integrasi HTTP memiliki format yang tidak valid.")
  }
  return parsed
}

export function saveHttpIntegrationCredentials(credentials: HttpIntegrationCredential[]) {
  localStorage.setItem(
    HTTP_INTEGRATION_CREDENTIALS_STORAGE_KEY,
    JSON.stringify(credentials)
  )
}
