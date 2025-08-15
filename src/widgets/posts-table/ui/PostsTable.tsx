import { useDeletePost } from "@/entities/post/hook/usePost"
import { changePostSearchParams } from "@/entities/post/lib/postSearchUtils"
import { PostSearchParams, PostWithUser } from "@/entities/post/model"
import { PostTable } from "@/entities/post/ui"
import { EditDialogs } from "@/features/post-dialogs/ui"
import { useDialog } from "@/shared/hook/useDialog"

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

  const { open: openEditDialog, component: editDialog } = useDialog("post-edit")

  const handleEditPost = (post: PostWithUser) => {
    openEditDialog(<EditDialogs post={post} searchCondition={searchCondition} />)
  }

  return (
    <>
      <PostTable
        onDeletePost={handleDeletePost}
        onEditPost={handleEditPost}
        onPostDetail={() => {}}
        onTagClick={() => {}}
        onUserClick={() => {}}
        posts={posts}
        searchCondition={searchCondition}
      />
      {editDialog}
    </>
  )
}
