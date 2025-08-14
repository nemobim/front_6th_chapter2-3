import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { commentApi } from "../api/commentApi"
import { postQueryKeys } from "../lib"
import { AddComment, CommentResponse } from "../types/comment"

/** 댓글 가져오기 */
export const useGetComments = (postId?: number) => {
  return useQuery({
    queryKey: postQueryKeys.comments.list(postId),
    queryFn: () => commentApi.getComments(postId),
    enabled: !!postId,
  })
}

/** 댓글 추가 */
export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (comment: AddComment) => commentApi.addComment(comment),
    onSuccess: (commentData) => {
      queryClient.setQueryData(postQueryKeys.comments.list(commentData.postId), (oldData: CommentResponse) => {
        return {
          ...oldData,
          comments: [...oldData.comments, commentData],
        }
      })
    },
    onError: (error) => {
      console.error("댓글 추가 실패:", error)
    },
  })
}
