import { useGetPosts } from "@/entities/post/hook/usePost"
import { changePostSearchParams, DEFAULT_POST_SEARCH_PARAMS } from "@/entities/post/lib/postSearchUtils"
import { PostSearchParams } from "@/entities/post/model"
import { useSearchQuery } from "@/shared/hook"
import { Card } from "@/shared/ui/card"
import PostsManager from "@/widgets/post/PostsManager"
import { PostsPagination, PostsTable, PostsTableFilters, PostsTableHeader } from "@/widgets/posts-table/ui"

export const PostsManagerPage = () => {
  const { searchCondition, setSearchCondition } = useSearchQuery<PostSearchParams>(DEFAULT_POST_SEARCH_PARAMS)

  const { posts, total, isLoading } = useGetPosts(changePostSearchParams(searchCondition))

  return (
    <>
      <PostsManager />
      <Card className="w-full max-w-6xl mx-auto">
        <PostsTableHeader searchCondition={searchCondition} />
        <PostsTableFilters />
        <PostsTable posts={posts} searchCondition={searchCondition} />
        <PostsPagination />
      </Card>
    </>
  )
}
