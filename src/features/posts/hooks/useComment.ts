import { useQuery } from "@tanstack/react-query"

import { commentApi } from "../api/commentApi"
import { postQueryKeys } from "../lib"

/** 댓글 가져오기 */
export const useGetComments = (postId?: number) => {
  return useQuery({
    queryKey: postQueryKeys.comments.list(postId),
    queryFn: () => commentApi.getComments(postId),
    enabled: !!postId,
  })
}
