import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { commentApi } from "../api/commentApi"
import { postQueryKeys } from "../lib"
import { AddComment, CommentResponse, UpdateComment } from "../types/comment"

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

/** 댓글 업데이트 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentData: UpdateComment) => commentApi.updateComment(commentData),
    onSuccess: (updatedComment) => {
      // 해당 게시물의 댓글 목록 캐시 업데이트
      queryClient.setQueryData(postQueryKeys.comments.list(updatedComment.postId), (oldData: CommentResponse) => {
        console.log(updatedComment, oldData)
        return {
          ...oldData,
          comments: oldData.comments.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment)),
        }
      })
    },
    onError: (error) => {
      console.error("댓글 업데이트 실패:", error)
    },
  })
}

/** 댓글 삭제 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number; postId: number }) => commentApi.deleteComment(id),
    onSuccess: ({ id, postId }: { id: number; postId: number }) => {
      queryClient.setQueryData(postQueryKeys.comments.list(postId), (oldData: CommentResponse) => {
        return {
          ...oldData,
          comments: oldData.comments.filter((comment) => comment.id !== id),
        }
      })
    },
    onError: (error) => {
      console.error("댓글 삭제 실패:", error)
    },
  })
}
