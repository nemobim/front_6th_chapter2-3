import { PostSearchParams, PostWithUser, User } from "@/features/posts/types"

export interface PostTableProps {
  onDeletePost: (id: number) => void
  onEditPost: (post: PostWithUser) => void
  onPostDetail: (post: PostWithUser) => void
  onTagClick: (tag: string) => void
  onUserClick: (user?: User) => void
  posts: PostWithUser[]
  searchCondition: PostSearchParams
}
