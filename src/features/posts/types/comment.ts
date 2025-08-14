import { PageData } from "./page"

/** 댓글 */
export interface Comment {
  body: string
  id: number
  likes: number
  postId: number
  user: CommentUser
}

/** 댓글 응답 */
export interface CommentResponse extends PageData {
  comments: Comment[]
}

/** 댓글 작성자 */
export interface CommentUser {
  fullName: string
  id: number
  username: string
}
