import { http } from "@/shared/lib"

import { Tag } from "../types"

export const tagsApi = {
  getTags: () => http.get<Tag[]>("/posts/tags"),
}
