import Page from "./app/dashboard/page.tsx"
import { ThemeProvider } from "@/components/theme-provider"

export default function App() {
  return (
    <ThemeProvider>
      <Page />
    </ThemeProvider>
  )
}
