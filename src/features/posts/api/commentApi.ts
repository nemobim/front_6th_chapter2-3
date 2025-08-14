import { http } from "@/shared/lib"

import { CommentResponse } from "../types/comment"

export const commentApi = {
  getComments: (postId?: number) => http.get<CommentResponse>(`/comments/post/${postId}`),
}
