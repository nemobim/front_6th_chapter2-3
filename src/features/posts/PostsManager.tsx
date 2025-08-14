import { Edit2, MessageSquare, Plus, Search, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useState } from "react"

import { useSearchQuery } from "@/shared/hook"
import { Button, Input, Textarea } from "@/shared/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"

import { useGetTags } from "./hooks"
import { useAddComment, useGetComments } from "./hooks/useComment"
import { useAddPost, useDeletePost, useGetPosts, useUpdatePost } from "./hooks/usePost"
import { changePostSearchParams, DEFAULT_POST_SEARCH_PARAMS } from "./lib/postSearchUtils"
import { PostSearchParams, UpdatePost } from "./types/post"

const PostsManager = () => {
  // URL 파라미터 관리 - 초기값을 기본값으로 설정
  const { searchCondition, setSearchCondition } = useSearchQuery<PostSearchParams>(DEFAULT_POST_SEARCH_PARAMS)

  // 검색어 입력 임시 상태 (엔터 전까지)
  const [searchInput, setSearchInput] = useState(searchCondition.search)

  // 기타 상태 관리
  const [selectedPost, setSelectedPost] = useState<UpdatePost | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 })
  const [selectedComment, setSelectedComment] = useState(null)
  const [newComment, setNewComment] = useState({ body: "", postId: null, userId: 1 })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

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
      sortOrder: value,
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

  // 댓글 목록 가져오기
  const { data: commentsList } = useGetComments(selectedPost?.id)

  const { mutate: addComment } = useAddComment()
  // 댓글 추가
  const handleAddComment = async () => {
    addComment(newComment, {
      onSuccess: () => {
        setShowAddCommentDialog(false)
        setNewComment({ body: "", postId: null, userId: 1 })
      },
    })
  }

  // 댓글 업데이트
  const updateComment = async () => {
    try {
      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment.body }),
      })
      const data = await response.json()
      // setComments((prev) => ({
      //   ...prev,
      //   [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      // }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const deleteComment = async (id, postId) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      })
      // setComments((prev) => ({
      //   ...prev,
      //   [postId]: prev[postId].filter((comment) => comment.id !== id),
      // }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (id, postId) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: comments[postId].find((c) => c.id === id).likes + 1 }),
      })
      const data = await response.json()
      // setComments((prev) => ({
      //   ...prev,
      //   [postId]: prev[postId].map((comment) =>
      //     comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
      //   ),
      // }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (user) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  // 하이라이트 함수 추가
  const highlightText = (text: string, highlight: string) => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  // 게시물 테이블 렌더링
  const renderPostTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, searchCondition.search)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        searchCondition.tag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      key={tag}
                      onClick={() => handleTagChange(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => openUserModal(post.author)}>
                <img alt={post.author?.username} className="w-8 h-8 rounded-full" src={post.author?.image} />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button onClick={() => openPostDetail(post)} size="sm" variant="ghost">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    setSelectedPost(post)
                    setShowEditDialog(true)
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button onClick={() => handleDeletePost(post.id)} size="sm" variant="ghost">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  // 댓글 렌더링
  const renderComments = (postId) => (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId }))
            setShowAddCommentDialog(true)
          }}
          size="sm"
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {commentsList?.comments?.map((comment) => (
          <div className="flex items-center justify-between text-sm border-b pb-1" key={comment.id}>
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchCondition.search)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button onClick={() => likeComment(comment.id, postId)} size="sm" variant="ghost">
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                onClick={() => {
                  setSelectedComment(comment)
                  setShowEditCommentDialog(true)
                }}
                size="sm"
                variant="ghost"
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button onClick={() => deleteComment(comment.id, postId)} size="sm" variant="ghost">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
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
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="게시물 검색... (엔터로 검색)"
                  value={searchInput}
                />
              </div>
            </div>

            {/* 검색 중일 때 태그 선택 비활성화 */}
            <Select disabled={!!searchCondition.search} onValueChange={handleTagChange} value={searchCondition.tag}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags?.map((tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 검색 중이거나 태그 필터링 중일 때 정렬 비활성화 */}
            <Select
              disabled={!!searchCondition.search || searchCondition.tag !== "all"}
              onValueChange={handleSortByChange}
              value={searchCondition.sortBy || "none"}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>

            {/* 정렬 기준이 없거나 다른 필터가 활성화된 경우 정렬 순서 비활성화 */}
            <Select
              disabled={
                !!searchCondition.search ||
                searchCondition.tag !== "all" ||
                !searchCondition.sortBy ||
                searchCondition.sortBy === "none"
              }
              onValueChange={handleSortOrderChange}
              value={searchCondition.sortOrder}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 현재 활성화된 필터 표시--------------------------- */}
          {(searchCondition.search ||
            searchCondition.tag !== "all" ||
            (searchCondition.sortBy && searchCondition.sortBy !== "none")) && (
            <div className="flex gap-2 text-sm">
              {searchCondition.search && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">검색: "{searchCondition.search}"</span>
              )}
              {searchCondition.tag !== "all" && !searchCondition.search && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">태그: {searchCondition.tag}</span>
              )}
              {searchCondition.sortBy &&
                searchCondition.sortBy !== "none" &&
                !searchCondition.search &&
                searchCondition.tag === "all" && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                    정렬: {searchCondition.sortBy} ({searchCondition.sortOrder})
                  </span>
                )}
            </div>
          )}

          {/* 게시물 테이블 */}
          {isLoading ? <div className="flex justify-center p-4">로딩 중...</div> : renderPostTable()}

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select
                onValueChange={(value) => handleLimitChange(Number(value))}
                value={searchCondition.limit.toString()}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className="flex gap-2">
              <Button
                disabled={Number(searchCondition.skip) === 0}
                onClick={() =>
                  handleSkipChange(Math.max(0, Number(searchCondition.skip) - Number(searchCondition.limit)))
                }
              >
                이전
              </Button>
              <Button
                disabled={Number(searchCondition.skip) + Number(searchCondition.limit) >= total}
                onClick={() => handleSkipChange(Number(searchCondition.skip) + Number(searchCondition.limit))}
              >
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <Dialog onOpenChange={setShowAddDialog} open={showAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="제목"
              value={newPost.title}
            />
            <Textarea
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
              placeholder="내용"
              rows={30}
              value={newPost.body}
            />
            <Input
              onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
              placeholder="사용자 ID"
              type="number"
              value={newPost.userId}
            />
            <Button onClick={handleAddPost}>게시물 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 대화상자 */}
      <Dialog onOpenChange={setShowEditDialog} open={showEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
              placeholder="제목"
              value={selectedPost?.title || ""}
            />
            <Textarea
              onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })}
              placeholder="내용"
              rows={15}
              value={selectedPost?.body || ""}
            />
            <Button onClick={handleUpdatePost}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
      <Dialog onOpenChange={setShowAddCommentDialog} open={showAddCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
              placeholder="댓글 내용"
              value={newComment.body}
            />
            <Button onClick={handleAddComment}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog onOpenChange={setShowEditCommentDialog} open={showEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
            />
            <Button onClick={updateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog onOpenChange={setShowPostDetailDialog} open={showPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title, searchCondition.search)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body, searchCondition.search)}</p>
            {renderComments(selectedPost?.id)}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog onOpenChange={setShowUserModal} open={showUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img alt={selectedUser?.username} className="w-24 h-24 rounded-full mx-auto" src={selectedUser?.image} />
            <h3 className="text-xl font-semibold text-center">{selectedUser?.username}</h3>
            <div className="space-y-2">
              <p>
                <strong>이름:</strong> {selectedUser?.firstName} {selectedUser?.lastName}
              </p>
              <p>
                <strong>나이:</strong> {selectedUser?.age}
              </p>
              <p>
                <strong>이메일:</strong> {selectedUser?.email}
              </p>
              <p>
                <strong>전화번호:</strong> {selectedUser?.phone}
              </p>
              <p>
                <strong>주소:</strong> {selectedUser?.address?.address}, {selectedUser?.address?.city},{" "}
                {selectedUser?.address?.state}
              </p>
              <p>
                <strong>직장:</strong> {selectedUser?.company?.name} - {selectedUser?.company?.title}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PostsManager
