const tagQueryKeys = {
  all: ["tags"],
  list: () => [...tagQueryKeys.all, "list"],
}

export const postQueryKeys = {
  tags: tagQueryKeys,
}
