import { Plus } from "lucide-react"
import { useState } from "react"

import { PostTable } from "@/entities/post/ui"
import { CommentManagement } from "@/features/comment-management/ui/CommentManagement"
import { PostDialogs } from "@/features/post-management/ui"
import { useGetTags } from "@/features/posts/hooks"
import { useAddPost, useDeletePost, useGetPosts, useUpdatePost } from "@/features/posts/hooks/usePost"
import { changePostSearchParams, DEFAULT_POST_SEARCH_PARAMS } from "@/features/posts/lib/postSearchUtils"
import { AddPost, PostSearchParams, UpdatePost } from "@/features/posts/types/post"
import { useSearchQuery } from "@/shared/hook"
import { highlightText } from "@/shared/lib/utils"
import { Button } from "@/shared/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"

import { PostPagination } from "../../features/pagination-management/ui"
import { ActiveFilters, SearchControls } from "../../features/search-management/ui"
import { useUser } from "../../features/user-management/hooks"
import { UserModal } from "../../features/user-management/ui"

const PostsManager = () => {
  // URL 파라미터 관리
  const { searchCondition, setSearchCondition } = useSearchQuery<PostSearchParams>(DEFAULT_POST_SEARCH_PARAMS)

  // 검색어 입력 상태
  const [searchInput, setSearchInput] = useState(searchCondition.search)

  // Post 관련 상태만 (Comment 관련 제거)
  const [newPost, setNewPost] = useState<AddPost | null>(null)
  const [selectedPost, setSelectedPost] = useState<UpdatePost | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  // User 관련 상태 제거하고 useUser 훅 사용
  const { selectedUser, showUserModal, openUserModal, closeUserModal } = useUser()

  // React Query 훅 사용
  const { posts, total, isLoading } = useGetPosts(changePostSearchParams(searchCondition))

  const { data: tags } = useGetTags()

  // 검색어 변경 핸들러 (엔터 시에만 적용)
  const handleSearchSubmit = () => {
    setSearchCondition((prev) => ({
      ...prev,
      search: searchInput,
      skip: 0,
      // 검색 시 다른 모든 필터 초기화 (DummyJSON에서 검색과 다른 필터들은 동시에 지원하지 않음)
      tag: searchInput.trim() ? "all" : prev.tag,
      sortBy: searchInput.trim() ? "none" : prev.sortBy,
      order: searchInput.trim() ? "asc" : prev.order,
    }))
  }

  // 검색어 입력 핸들러
  const handleSearchInputChange = (value: string) => {
    setSearchInput(value)
  }

  // 엔터키 핸들러
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit()
    }
  }

  // 태그 변경 핸들러
  const handleTagChange = (value: string) => {
    const tagValue = value === "all" ? "all" : value
    setSearchCondition((prev) => ({
      ...prev,
      tag: tagValue,
      skip: 0,
      // 태그 선택 시 검색어와 정렬 초기화
      search: tagValue !== "all" ? "" : prev.search,
      sortBy: tagValue !== "all" ? "none" : prev.sortBy,
      order: tagValue !== "all" ? "asc" : prev.order,
    }))
    // 태그 변경 시 검색 입력도 초기화
    if (tagValue !== "all") {
      setSearchInput("")
    }
  }

  // 정렬 변경 핸들러
  const handleSortByChange = (value: string) => {
    const sortValue = value === "none" ? "none" : value
    setSearchCondition((prev) => ({
      ...prev,
      sortBy: sortValue,
      skip: 0,
      // 정렬 선택 시 검색어와 태그 초기화
      search: sortValue !== "none" ? "" : prev.search,
      tag: sortValue !== "none" ? "all" : prev.tag,
    }))
    // 정렬 변경 시 검색 입력도 초기화
    if (sortValue !== "none") {
      setSearchInput("")
    }
  }

  // 정렬 순서 변경 핸들러
  const handleSortOrderChange = (value: string) => {
    setSearchCondition((prev) => ({
      ...prev,
      order: value,
      skip: 0,
    }))
  }

  // 페이지네이션 핸들러
  const handleSkipChange = (skip: number) => {
    setSearchCondition((prev) => ({ ...prev, skip }))
  }

  // 페이지 크기 변경 핸들러
  const handleLimitChange = (limit: number) => {
    setSearchCondition((prev) => ({ ...prev, limit, skip: 0 }))
  }

  const { mutate: addPost } = useAddPost(changePostSearchParams(searchCondition))
  // 게시물 추가
  const handleAddPost = () => {
    if (!newPost) return
    addPost(newPost, {
      onSuccess: () => {
        setShowAddDialog(false)
        setNewPost({ title: "", body: "", userId: 1 })
      },
    })
  }

  const { mutate: updatePost } = useUpdatePost(changePostSearchParams(searchCondition))

  // 게시물 업데이트
  const handleUpdatePost = () => {
    if (!selectedPost) return
    updatePost(selectedPost, {
      onSuccess: () => {
        setShowEditDialog(false)
      },
    })
  }

  const { mutate: deletePost } = useDeletePost(changePostSearchParams(searchCondition))

  // 게시물 삭제
  const handleDeletePost = (id: number) => {
    deletePost(id, {
      onSuccess: () => {
        setShowEditDialog(false)
      },
    })
  }

  // 게시물 상세 보기
  const openPostDetail = (post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  // 게시물 수정 다이얼로그 열기 (테이블에서 수정 버튼 클릭 시)
  const openEditDialog = (post: UpdatePost) => {
    setSelectedPost(post)
    setShowEditDialog(true)
  }

  // 게시물 테이블 렌더링 - onEditPost를 openEditDialog로 변경
  const renderPostTable = () => (
    <PostTable
      onDeletePost={handleDeletePost}
      onEditPost={openEditDialog}
      onPostDetail={openPostDetail}
      onTagClick={handleTagChange}
      onUserClick={openUserModal}
      posts={posts}
      searchCondition={searchCondition}
    />
  )

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <SearchControls
            onKeyPress={handleKeyPress}
            onSearchInputChange={handleSearchInputChange}
            onSearchSubmit={handleSearchSubmit}
            onSortByChange={handleSortByChange}
            onSortOrderChange={handleSortOrderChange}
            onTagChange={handleTagChange}
            searchCondition={searchCondition}
            searchInput={searchInput}
            tags={tags}
          />

          {/* 현재 활성화된 필터 표시 */}
          <ActiveFilters searchCondition={searchCondition} />

          {/* 게시물 테이블 */}
          {isLoading ? <div className="flex justify-center p-4">로딩 중...</div> : renderPostTable()}

          {/* 페이지네이션 */}
          <PostPagination
            onLimitChange={handleLimitChange}
            onSkipChange={handleSkipChange}
            searchCondition={searchCondition}
            total={total}
          />
        </div>
      </CardContent>

      {/* PostDialogs 컴포넌트 사용 */}
      <PostDialogs
        newPost={newPost}
        onAddPost={handleAddPost}
        onUpdatePost={handleUpdatePost}
        selectedPost={selectedPost}
        setNewPost={setNewPost}
        setSelectedPost={setSelectedPost}
        setShowAddDialog={setShowAddDialog}
        setShowEditDialog={setShowEditDialog}
        showAddDialog={showAddDialog}
        showEditDialog={showEditDialog}
      />

      {/* 게시물 상세 보기 대화상자 - CommentManagement 사용 */}
      <Dialog onOpenChange={setShowPostDetailDialog} open={showPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title, searchCondition.search)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body, searchCondition.search)}</p>
            <CommentManagement postId={selectedPost?.id} searchTerm={searchCondition.search} />
          </div>
        </DialogContent>
      </Dialog>

      {/* UserModal 컴포넌트 사용 */}
      <UserModal onOpenChange={closeUserModal} open={showUserModal} user={selectedUser} />
    </Card>
  )
}

export default PostsManager
