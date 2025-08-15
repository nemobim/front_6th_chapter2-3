import { UsersResponse } from "@/entities/post/model"
import { http } from "@/shared/lib"

export const userApi = {
  getAllUsers: () => http.get<UsersResponse>(`/users?limit=0&select=username,image`),
}
