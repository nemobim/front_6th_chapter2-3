import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import { postsApi, userApi } from "../api"
import { postQueryKeys } from "../lib"

export const useGetPosts = (params: {
  limit: number
  search?: string
  skip: number
  sortBy?: string
  sortOrder?: string
  tag?: string
}) => {
  const queryKey = postQueryKeys.posts.listFilters(params)

  const queryFn = () => {
    // 검색어가 있으면 검색 API 사용 (태그 무시)
    if (params.search && params.search.trim()) {
      return postsApi.searchPosts(params.search)
    }

    // 태그가 있고 "all"이 아니면 태그 API 사용
    if (params.tag && params.tag !== "all") {
      return postsApi.getPostsByTag(params.tag)
    }

    // 정렬이 있고 "none"이 아니면 정렬 API 사용
    if (params.sortBy && params.sortBy !== "none" && params.sortOrder) {
      return postsApi.getPostsSorted({
        limit: params.limit,
        skip: params.skip,
        sortBy: params.sortBy,
        order: params.sortOrder,
      })
    }

    // 기본 posts API 사용
    return postsApi.getPosts({ limit: params.limit, skip: params.skip })
  }

  const postsQuery = useQuery({
    queryKey,
    queryFn,
  })

  const usersQuery = useQuery({
    queryKey: postQueryKeys.users.basic(),
    queryFn: () => userApi.getAllUsers(),
    enabled: postsQuery.isSuccess,
  })

  const postsWithUsers = useMemo(() => {
    if (!postsQuery.isSuccess || !usersQuery.isSuccess) return []
    if (!postsQuery.data?.posts || !usersQuery.data?.users) return []

    return postsQuery.data.posts.map((post) => ({
      ...post,
      author: usersQuery.data.users.find((user) => user.id === post.userId),
    }))
  }, [postsQuery.isSuccess, postsQuery.data, usersQuery.isSuccess, usersQuery.data])

  return {
    posts: postsWithUsers,
    total: postsQuery.data?.total || 0,
    isLoading: postsQuery.isLoading || usersQuery.isLoading,
    error: postsQuery.error || usersQuery.error,
  }
}
