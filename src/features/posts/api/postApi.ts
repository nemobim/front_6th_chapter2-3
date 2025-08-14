import { http } from "@/shared/lib"

import { PostsResponse } from "../types"

interface GetPostsParams {
  limit?: number
  order?: string
  skip?: number
  sortBy?: string
}

export const postsApi = {
  getPosts: (params?: GetPostsParams) =>
    http.get<PostsResponse>(`/posts`, {
      params,
    }),

  searchPosts: (query: string, params?: GetPostsParams) =>
    http.get<PostsResponse>(`/posts/search`, {
      params: {
        q: query,
        ...params,
      },
    }),

  getPostsByTag: (tag: string, params?: GetPostsParams) =>
    http.get<PostsResponse>(`/posts/tag/${tag}`, {
      params,
    }),
}
