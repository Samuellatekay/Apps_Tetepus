import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import {
  Check,
  Code2,
  GitBranch,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Webhook,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  appCatalog,
  loadInstalledAppIds,
  saveInstalledAppIds,
  type AppDefinition,
} from "./app-catalog"
import {
  loadHttpIntegrationCredentials,
  loadHttpIntegrations,
  saveHttpIntegrationCredentials,
  saveHttpIntegrations,
  HTTP_METHODS,
  type HttpIntegration,
} from "./http-integrations-store"

export function AppsIntegrations() {
  const [initialState] = useState(() => {
    try {
      return {
        installedApps: loadInstalledAppIds(),
        httpIntegrations: loadHttpIntegrations(),
        credentialIntegrationIds: loadHttpIntegrationCredentials().map(
          (credential) => credential.integrationId
        ),
        error: null as string | null,
      }
    } catch (error) {
      return {
        installedApps: [] as string[],
        httpIntegrations: [] as HttpIntegration[],
        credentialIntegrationIds: [] as string[],
        error: error instanceof Error ? error.message : "Data integrasi tidak dapat dimuat.",
      }
    }
  })
  const [installedApps, setInstalledApps] = useState(initialState.installedApps)
  const [httpIntegrations, setHttpIntegrations] = useState(initialState.httpIntegrations)
  const [credentialIntegrationIds, setCredentialIntegrationIds] = useState(
    initialState.credentialIntegrationIds
  )
  const [storageError, setStorageError] = useState<string | null>(initialState.error)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("Semua")
  const [integrationName, setIntegrationName] = useState("")
  const [integrationUrl, setIntegrationUrl] = useState("")
  const [integrationMethod, setIntegrationMethod] =
    useState<HttpIntegration["method"]>("GET")
  const [integrationApiKey, setIntegrationApiKey] = useState("")

  const categories = ["Semua", ...new Set(appCatalog.map((app) => app.category))]
  const filteredApps = useMemo(() => {
    const query = search.trim().toLowerCase()
    return appCatalog.filter((app) => {
      const matchesQuery =
        !query ||
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query)
      return matchesQuery && (activeCategory === "Semua" || app.category === activeCategory)
    })
  }, [activeCategory, search])

  const toggleInstall = (appId: string) => {
    const nextApps = installedApps.includes(appId)
      ? installedApps.filter((id) => id !== appId)
      : [...installedApps, appId]

    try {
      saveInstalledAppIds(nextApps)
      setInstalledApps(nextApps)
      setStorageError(null)
    } catch (error) {
      setStorageError(
        error instanceof Error
          ? `Status instalasi tidak dapat disimpan: ${error.message}`
          : "Status instalasi tidak dapat disimpan."
      )
    }
  }

  const addHttpIntegration = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = integrationName.trim()
    const url = integrationUrl.trim()
    if (!name || !url) return

    try {
      const parsedUrl = new URL(url)
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        setStorageError("URL integrasi harus menggunakan HTTP atau HTTPS.")
        return
      }
      if (parsedUrl.username || parsedUrl.password) {
        setStorageError("Jangan masukkan username atau password di URL endpoint.")
        return
      }
      if ([...parsedUrl.searchParams.keys()].some((key) => /token|secret|api.?key|auth|password/i.test(key))) {
        setStorageError("Jangan masukkan token atau secret sebagai query URL.")
        return
      }

      const nextIntegrations = [
        {
          id: `http-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name,
          url: parsedUrl.toString(),
          method: integrationMethod,
          hasApiKey: integrationApiKey.length > 0,
          createdAt: new Date().toISOString(),
        },
        ...httpIntegrations,
      ]

      const integration = nextIntegrations[0]
      const currentCredentials = loadHttpIntegrationCredentials()
      const nextCredentials = integrationApiKey
        ? [
            ...currentCredentials,
            { integrationId: integration.id, apiKey: integrationApiKey },
          ]
        : currentCredentials

      if (integrationApiKey) saveHttpIntegrationCredentials(nextCredentials)
      try {
        saveHttpIntegrations(nextIntegrations)
      } catch (error) {
        if (integrationApiKey) saveHttpIntegrationCredentials(currentCredentials)
        throw error
      }
      setHttpIntegrations(nextIntegrations)
      if (integrationApiKey) {
        setCredentialIntegrationIds((ids) => [...ids, integration.id])
      }
      setIntegrationName("")
      setIntegrationUrl("")
      setIntegrationApiKey("")
      setStorageError(null)
    } catch (error) {
      setStorageError(
        error instanceof Error
          ? `Integrasi tidak dapat disimpan: ${error.message}`
          : "URL tidak valid atau integrasi tidak dapat disimpan."
      )
    }
  }

  const deleteHttpIntegration = (integration: HttpIntegration) => {
    const nextIntegrations = httpIntegrations.filter((item) => item.id !== integration.id)
    try {
      const currentCredentials = loadHttpIntegrationCredentials()
      const nextCredentials = currentCredentials.filter(
        (credential) => credential.integrationId !== integration.id
      )
      saveHttpIntegrations(nextIntegrations)
      saveHttpIntegrationCredentials(nextCredentials)
      setHttpIntegrations(nextIntegrations)
      setCredentialIntegrationIds((ids) =>
        ids.filter((id) => id !== integration.id)
      )
      setStorageError(null)
    } catch (error) {
      setStorageError(
        error instanceof Error
          ? `Integrasi tidak dapat dihapus: ${error.message}`
          : "Integrasi tidak dapat dihapus."
      )
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            App Marketplace
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Integrasi Apps</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Hubungkan layanan melalui HTTP/Webhook, atau pasang aplikasi untuk
            digunakan sebagai step di Flow.
          </p>
        </div>
      </div>

      {storageError && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {storageError}
        </p>
      )}

      <Tabs defaultValue="http">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="http" className="gap-2 px-3 py-2">
            <Code2 className="size-4" />
            Integrasi HTTP
          </TabsTrigger>
          <TabsTrigger value="apps" className="gap-2 px-3 py-2">
            <GitBranch className="size-4" />
            Install Apps (Docker)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="http" className="mt-5 flex flex-col gap-5">
          <div>
            <h3 className="text-lg font-semibold">HTTP API & Webhook</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Daftarkan endpoint HTTP untuk dipakai sebagai step request di Flow.
            Trigger Webhook dapat menerima event HTTP masuk. Pengiriman request
            dari flow memerlukan runtime backend.
            </p>
          </div>

          <Card>
            <CardContent className="p-5">
              <form onSubmit={addHttpIntegration} className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_2fr_140px_1fr_auto]">
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Nama integrasi
                  <Input
                    value={integrationName}
                    onChange={(event) => setIntegrationName(event.target.value)}
                    placeholder="Contoh: Threat Intelligence API"
                    required
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Endpoint URL
                  <Input
                    type="url"
                    value={integrationUrl}
                    onChange={(event) => setIntegrationUrl(event.target.value)}
                    placeholder="https://api.example.com/v1/events"
                    required
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  HTTP method
                  <select
                    value={integrationMethod}
                    onChange={(event) =>
                      setIntegrationMethod(event.target.value as HttpIntegration["method"])
                    }
                    className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {HTTP_METHODS.map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  API Key (opsional)
                  <Input
                    type="password"
                    autoComplete="new-password"
                    value={integrationApiKey}
                    onChange={(event) => setIntegrationApiKey(event.target.value)}
                    placeholder="Bearer token / API key"
                  />
                </label>
                <div className="flex items-end">
                  <Button type="submit" className="w-full gap-2">
                    <Plus className="size-4" />
                    Tambah HTTP
                  </Button>
                </div>
              </form>
              <p className="mt-3 text-xs text-muted-foreground">
                Jika diisi, API Key dikirim sebagai header Authorization: Bearer.
                URL dan kredensial masih disimpan di browser dan hanya untuk prototipe;
                gunakan backend secret vault sebelum production.
              </p>
            </CardContent>
          </Card>

          {httpIntegrations.length ? (
            <div className="grid gap-3">
              {httpIntegrations.map((integration) => (
                <Card key={integration.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
                        <Code2 className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{integration.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          <span className="mr-2 font-semibold">{integration.method}</span>
                          {integration.url}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                        {credentialIntegrationIds.includes(integration.id)
                          ? "API Key · Bearer"
                          : "Tanpa autentikasi"}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Hapus ${integration.name}`}
                        onClick={() => deleteHttpIntegration(integration)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-3 py-9 text-center">
                <Code2 className="size-8 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Belum ada integrasi HTTP</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tambahkan endpoint API di atas. Untuk event masuk, gunakan step Trigger Webhook.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-sky-500/20 bg-sky-500/5">
            <CardContent className="flex items-start gap-3 p-4">
              <Webhook className="mt-0.5 size-5 shrink-0 text-sky-600" />
              <div>
                <h4 className="text-sm font-medium">Webhook masuk</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tambahkan step <strong>Trigger</strong> di Flow untuk memulai workflow
                  dari webhook HTTP. URL penerima akan disediakan saat backend tersedia.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apps" className="mt-5 flex flex-col gap-5">
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-muted-foreground">
            Status pemasangan saat ini disimpan di browser dan belum menjalankan
            container Docker. Integrasi Docker sungguhan memerlukan backend/worker.
            Aplikasi yang ditandai terpasang akan tersedia sebagai step Flow.
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <label className="relative block w-full max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Cari aplikasi"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari aplikasi..."
                  className="pl-9"
                />
              </label>
              <div className="shrink-0 rounded-lg border bg-card px-4 py-2 text-sm">
                <span className="font-semibold tabular-nums">{installedApps.length}</span>
                <span className="ml-1.5 text-muted-foreground">terpasang</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Filter kategori">
              {categories.map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {filteredApps.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredApps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  isInstalled={installedApps.includes(app.id)}
                  onToggleInstall={() => toggleInstall(app.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed py-12 text-center">
              <p className="font-medium">Aplikasi tidak ditemukan</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Coba kata kunci atau kategori yang berbeda.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AppCard({
  app,
  isInstalled,
  onToggleInstall,
}: {
  app: AppDefinition
  isInstalled: boolean
  onToggleInstall: () => void
}) {
  const Icon = app.icon
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className={`flex size-11 items-center justify-center rounded-xl ${app.color}`}>
            <Icon className="size-5" />
          </div>
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            {app.category}
          </span>
        </div>
        <h3 className="mt-4 font-semibold">{app.name}</h3>
        <p className="mt-1 min-h-10 flex-1 text-sm leading-relaxed text-muted-foreground">
          {app.description}
        </p>
        <Button
          variant={isInstalled ? "outline" : "default"}
          className="mt-5 w-full gap-2"
          onClick={onToggleInstall}
        >
          {isInstalled && <Check className="size-4" />}
          {isInstalled ? "Terpasang" : "Install"}
        </Button>
      </CardContent>
    </Card>
  )
}
