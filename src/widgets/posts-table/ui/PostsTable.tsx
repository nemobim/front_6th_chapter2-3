import { useDeletePost } from "@/entities/post/hook/usePost"
import { changePostSearchParams } from "@/entities/post/lib/postSearchUtils"
import { PostSearchParams, PostWithUser } from "@/entities/post/model"
import { PostTable } from "@/entities/post/ui"

interface PostsTableProps {
  posts: PostWithUser[]
  searchCondition: PostSearchParams
}

export const PostsTable = ({ posts, searchCondition }: PostsTableProps) => {
  const { mutate: deletePost } = useDeletePost(changePostSearchParams(searchCondition))
  // 게시물 삭제
  const handleDeletePost = (id: number) => {
    deletePost(id)
  }

  return (
    <PostTable
      onDeletePost={handleDeletePost}
      onEditPost={() => {}}
      onPostDetail={() => {}}
      onTagClick={() => {}}
      onUserClick={() => {}}
      posts={posts}
      searchCondition={searchCondition}
    />
  )
}
