import { http } from "@/shared/lib"

import { PostsResponse } from "../types"

export const postsApi = {
  getPosts: (params: { limit: number; skip: number }) =>
    http.get<PostsResponse>(`/posts?limit=${params.limit}&skip=${params.skip}`),

  searchPosts: (query: string) => http.get<PostsResponse>(`/posts/search?q=${query}`),

  getPostsByTag: (tag: string) => http.get<PostsResponse>(`/posts/tag/${tag}`),

  getPostsSorted: (params: { order: string; sortBy: string }) =>
    http.get<PostsResponse>(`/posts?sortBy=${params.sortBy}&order=${params.order}`),
}
