import { PageData } from "@/shared/types"

/**사용자 정보 */
export interface User {
  id: number
  image: string
  username: string
}

/**사용자 목록 응답 */
export interface UsersResponse extends PageData {
  users: User[]
}
