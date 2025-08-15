import { PageData } from "@/shared/types"

/**사용자 정보 */
export interface User {
  id: number
  image: string
  username: string
}
export type UserInfo = {
  address: {
    address: string
    city: string
    coordinates: {
      lat: number
      lng: number
    }
    country: string
    postalCode: string
    state: string
    stateCode: string
  }
  age: number
  bank: {
    cardExpire: string
    cardNumber: string
    cardType: string
    currency: string
    iban: string
  }
  birthDate: string
  bloodGroup: string
  company: {
    address: {
      address: string
      city: string
      coordinates: {
        lat: number
        lng: number
      }
      country: string
      postalCode: string
      state: string
      stateCode: string
    }
    department: string
    name: string
    title: string
  }
  crypto: {
    coin: string
    network: string
    wallet: string
  }
  ein: string
  email: string
  eyeColor: string
  firstName: string
  gender: string
  hair: {
    color: string
    type: string
  }
  height: number
  id: number
  image: string
  ip: string
  lastName: string
  macAddress: string
  maidenName: string
  password: string
  phone: string
  role: string
  ssn: string
  university: string
  userAgent: string
  username: string
  weight: number
}

/**게시물 좋아요, 싫어요 수 */
export interface Reactions {
  dislikes: number
  likes: number
}

/**게시물 정보 */
export interface Post {
  body: string
  id: number
  reactions: Reactions
  tags: string[]
  title: string
  userId: number
  views: number
}

/**게시물 작성자 정보 */
export interface PostWithUser extends Post {
  author?: User
}

/**게시물 목록 응답 */
export interface PostsResponse extends PageData {
  posts: Post[]
}

/**게시물 목록 파라미터 */
export interface PostsParams {
  limit?: number
  order?: string
  skip?: number
  sortBy?: string
}

/**게시물 검색 파라미터 */
export interface PostSearchParams extends PostsParams {
  search?: string
  tag?: string
}

/**게시물 추가 파라미터 */
export interface AddPost {
  body: string
  title: string
  userId: number
}

/**게시물 수정 파라미터 */
export interface UpdatePost {
  body: string
  id: number
  title: string
}

/**게시물 테이블 */
export interface PostTableProps {
  onDeletePost: (id: number) => void
  onEditPost: (post: UpdatePost) => void
  onPostDetail: (post: PostWithUser) => void
  onTagClick: (tag: string) => void
  onUserClick: (user: User) => void
  posts: PostWithUser[]
  searchCondition: PostSearchParams
}
