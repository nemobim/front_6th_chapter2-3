import { Tag } from "@/entities/tag/types"
import { http } from "@/shared/lib"

export const tagsApi = {
  getTags: () => http.get<Tag[]>("/posts/tags"),
}
