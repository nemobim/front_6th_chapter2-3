import { Dispatch, SetStateAction } from "react"

import { useDeletePost } from "@/entities/post/hook/usePost"
import { changePostSearchParams } from "@/entities/post/lib/postSearchUtils"
import { PostSearchParams, PostWithUser } from "@/entities/post/model"
import { PostTable } from "@/entities/post/ui"
import { EditDialogs } from "@/features/post-dialogs/ui"
import { useDialog } from "@/shared/hook/useDialog"

interface PostsTableProps {
  posts: PostWithUser[]
  searchCondition: PostSearchParams
  setSearchCondition: Dispatch<SetStateAction<PostSearchParams>>
  setSearchInput: Dispatch<SetStateAction<string>>
}

export const PostsTable = ({ posts, searchCondition, setSearchCondition, setSearchInput }: PostsTableProps) => {
  const { mutate: deletePost } = useDeletePost(changePostSearchParams(searchCondition))
  // 게시물 삭제
  const handleDeletePost = (id: number) => {
    deletePost(id)
  }

  const { open: openEditDialog, component: editDialog } = useDialog("post-edit")

  const handleEditPost = (post: PostWithUser) => {
    openEditDialog(<EditDialogs post={post} searchCondition={searchCondition} />)
  }

  // 태그 변경 핸들러
  const handleTagChange = (value: string) => {
    const tagValue = value === "all" ? "all" : value
    setSearchCondition((prev) => ({
      ...prev,
      tag: tagValue,
      skip: 0,
      // 태그 선택 시 검색어와 정렬 초기화
      search: tagValue !== "all" ? "" : prev.search,
      sortBy: tagValue !== "all" ? "none" : prev.sortBy,
      order: tagValue !== "all" ? "asc" : prev.order,
    }))
    // 태그 변경 시 검색 입력도 초기화
    if (tagValue !== "all") {
      setSearchInput("")
    }
  }

  return (
    <>
      <PostTable
        onDeletePost={handleDeletePost}
        onEditPost={handleEditPost}
        onPostDetail={() => {}}
        onTagClick={handleTagChange}
        onUserClick={() => {}}
        posts={posts}
        searchCondition={searchCondition}
      />
      {editDialog}
    </>
  )
}
