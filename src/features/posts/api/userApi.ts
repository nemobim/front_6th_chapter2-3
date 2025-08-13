import { http } from "@/shared/lib"

import { UsersResponse } from "../types"

export const userApi = {
  getAllUsers: () => http.get<UsersResponse>(`/users?limit=0&select=username,image`),
}
