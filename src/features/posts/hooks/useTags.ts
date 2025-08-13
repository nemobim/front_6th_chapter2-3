import { useQuery } from "@tanstack/react-query"

import { tagsApi } from "../api"
import { postQueryKeys } from "../lib"

export const useGetTags = () => {
  return useQuery({
    queryKey: postQueryKeys.tags.all,
    queryFn: tagsApi.getTags,
  })
}
