import { BrowserRouter as Router } from "react-router-dom"

import PostsManagerPage from "@/features/posts/PostsManagerPage"
import Footer from "@/widgets/layout/Footer"
import Header from "@/widgets/layout/Header"

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <PostsManagerPage />
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
