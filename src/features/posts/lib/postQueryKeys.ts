import { PostSearchParams } from "../types/post"

const tagQueryKeys = {
  all: ["tags"],
  list: () => [...tagQueryKeys.all, "list"],
}

const postsQueryKeys = {
  all: ["posts"],
  list: (filters: PostSearchParams) => [...postsQueryKeys.all, filters],
}

export const userQueryKeys = {
  all: ["users"],
  basic: () => [...userQueryKeys.all, "basic"],
}

export const commentQueryKeys = {
  all: ["comments"],
  list: (postId?: number) => [...commentQueryKeys.all, postId],
}

export const postQueryKeys = {
  tags: tagQueryKeys,
  posts: postsQueryKeys,
  users: userQueryKeys,
  comments: commentQueryKeys,
}
