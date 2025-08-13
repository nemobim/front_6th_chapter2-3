import { Route, Routes } from "react-router-dom"

import { PostsPage } from "@/pages"
import { BaseLayout } from "@/widgets/layout"

import { AppProvider } from "./providers"

const App = () => {
  return (
    <AppProvider>
      <BaseLayout>
        <Routes>
          <Route element={<PostsPage />} path="/" />
        </Routes>
      </BaseLayout>
    </AppProvider>
  )
}

export default App
