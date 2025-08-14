import { http } from "@/shared/lib"

import { PostsResponse } from "../types"
import { AddPost, AddPostResponse, PostsParams, UpdatePost, UpdatePostResponse } from "../types/post"

export const postsApi = {
  getPosts: (params?: PostsParams) =>
    http.get<PostsResponse>(`/posts`, {
      params,
    }),

  searchPosts: (query: string, params?: PostsParams) =>
    http.get<PostsResponse>(`/posts/search`, {
      params: {
        q: query,
        ...params,
      },
    }),

  getPostsByTag: (tag: string, params?: PostsParams) =>
    http.get<PostsResponse>(`/posts/tag/${tag}`, {
      params,
    }),
  addPost: (postData: AddPost) => http.post<AddPost, AddPostResponse>(`/posts/add`, postData),
  updatePost: (postData: UpdatePost) => http.put<UpdatePost, UpdatePostResponse>(`/posts/${postData.id}`, postData),
}
