import { http } from "@/shared/lib"

import { AddComment, AddCommentResponse, CommentResponse } from "../types/comment"

export const commentApi = {
  getComments: (postId?: number) => http.get<CommentResponse>(`/comments/post/${postId}`),
  addComment: (comment: AddComment) => http.post<AddComment, AddCommentResponse>(`/comments/add`, comment),
}
