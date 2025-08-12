import PostsManagerPage from "@/features/posts/PostsManagerPage"
import { BaseLayout } from "@/widgets/layout"

import { AppProvider } from "./providers"

const App = () => {
  return (
    <AppProvider>
      <BaseLayout>
        <PostsManagerPage />
      </BaseLayout>
    </AppProvider>
  )
}

export default App
