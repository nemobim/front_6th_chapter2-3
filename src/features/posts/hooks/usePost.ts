import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import { postsApi, userApi } from "../api"
import { postQueryKeys } from "../lib"

export const useGetPosts = (params: { limit: number; search?: string; skip: number; tag?: string }) => {
  const queryKey = postQueryKeys.posts.listFilters(params)

  // 검색어에 따른 게시물 조회
  const queryFn = () => {
    if (params.search) return postsApi.searchPosts(params.search)
    if (params.tag && params.tag !== "all") return postsApi.getPostsByTag(params.tag)
    return postsApi.getPosts({ limit: params.limit, skip: params.skip })
  }

  //먼저 posts 가져오기
  const postsQuery = useQuery({
    queryKey,
    queryFn,
  })

  // posts가 성공한 후에 users 가져오기
  const usersQuery = useQuery({
    queryKey: postQueryKeys.users.basic(),
    queryFn: () => userApi.getAllUsers(),
    enabled: postsQuery.isSuccess, // posts 성공 후에만 실행
  })

  // 데이터 합치기
  const postsWithUsers = useMemo(() => {
    // posts와 users 모두 성공하고 데이터가 있을 때만 처리
    if (!postsQuery.isSuccess || !usersQuery.isSuccess) return []
    if (!postsQuery.data || !usersQuery.data) return []

    return postsQuery.data.posts.map((post) => ({
      ...post,
      author: usersQuery.data.users.find((user) => user.id === post.userId),
    }))
  }, [postsQuery.data, usersQuery.data, postsQuery.isSuccess, usersQuery.isSuccess])

  return {
    posts: postsWithUsers,
    total: postsQuery.data?.total || 0,
    isLoading: postsQuery.isLoading || usersQuery.isLoading,
    error: postsQuery.error || usersQuery.error,
  }
}
