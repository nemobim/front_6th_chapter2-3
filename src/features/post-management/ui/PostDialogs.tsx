import { AddPost, UpdatePost } from "@/entities/post/model/types"
import { Button, Input, Textarea } from "@/shared/ui"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"

interface PostDialogsProps {
  newPost: AddPost | null
  onAddPost: () => void
  onUpdatePost: () => void
  selectedPost: UpdatePost | null
  setNewPost: (post: AddPost | null) => void

  setSelectedPost: (post: UpdatePost | null) => void
  setShowAddDialog: (show: boolean) => void
  setShowEditDialog: (show: boolean) => void
  // Add Post Dialog
  showAddDialog: boolean
  // Edit Post Dialog
  showEditDialog: boolean
}

export function PostDialogs({
  showAddDialog,
  setShowAddDialog,
  newPost,
  setNewPost,
  onAddPost,
  showEditDialog,
  setShowEditDialog,
  selectedPost,
  setSelectedPost,
  onUpdatePost,
}: PostDialogsProps) {
  // 핸들러 함수들
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (newPost) {
      setNewPost({ ...newPost, title: e.target.value })
    }
  }

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (newPost) {
      setNewPost({ ...newPost, body: e.target.value })
    }
  }

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (newPost) {
      setNewPost({ ...newPost, userId: Number(e.target.value) })
    }
  }

  const handleEditTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPost) {
      setSelectedPost({ ...selectedPost, title: e.target.value })
    }
  }

  const handleEditBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedPost) {
      setSelectedPost({ ...selectedPost, body: e.target.value })
    }
  }

  return (
    <>
      {/* 게시물 추가 대화상자 */}
      <Dialog onOpenChange={setShowAddDialog} open={showAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {newPost && (
              <>
                <Input onChange={handleTitleChange} placeholder="제목" value={newPost.title || ""} />
                <Textarea onChange={handleBodyChange} placeholder="내용" rows={30} value={newPost.body || ""} />
                <Input
                  onChange={handleUserIdChange}
                  placeholder="사용자 ID"
                  type="number"
                  value={newPost.userId || ""}
                />
                <Button onClick={onAddPost}>게시물 추가</Button>
              </>
            )}
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
            {selectedPost && (
              <>
                <Input onChange={handleEditTitleChange} placeholder="제목" value={selectedPost.title || ""} />
                <Textarea
                  onChange={handleEditBodyChange}
                  placeholder="내용"
                  rows={15}
                  value={selectedPost.body || ""}
                />
                <Button onClick={onUpdatePost}>게시물 업데이트</Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
