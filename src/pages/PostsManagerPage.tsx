import { Card } from "@/shared/ui/card"
import PostsManager from "@/widgets/post/PostsManager"
import { PostsPagination, PostsTable, PostsTableFilters, PostsTableHeader } from "@/widgets/posts-table/ui"

export const PostsManagerPage = () => {
  return (
    <>
      <PostsManager />
      <Card className="w-full max-w-6xl mx-auto">
        <PostsTableHeader />
        <PostsTableFilters />
        <PostsTable />
        <PostsPagination />
      </Card>
    </>
  )
}
