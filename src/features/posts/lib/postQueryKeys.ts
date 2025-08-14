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

export const postQueryKeys = {
  tags: tagQueryKeys,
  posts: postsQueryKeys,
  users: userQueryKeys,
}
