import { PageData } from "./page"

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

/**게시물 목록 응답 */
export interface PostsResponse extends PageData {
  posts: Post[]
}

/**게시물 추가 */
export interface AddPost {
  body: string
  title: string
  userId: number
}

/**게시물 목록 파라미터 */
export interface PostsParams {
  limit?: number
  order?: string
  skip?: number
  sortBy?: string
}

export interface PostSearchParams extends PostsParams {
  search?: string
  tag?: string
}
