const tagQueryKeys = {
  all: ["tags"],
  list: () => [...tagQueryKeys.all, "list"],
}

const postsQueryKeys = {
  all: ["posts"],
  list: () => [...postsQueryKeys.all, "list"],
  listFilters: (filters: { limit: number; search?: string; skip: number; tag?: string }) => [
    ...postsQueryKeys.list(),
    filters,
  ],
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
