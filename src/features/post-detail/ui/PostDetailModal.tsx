import { UpdatePost } from "@/entities/post/model/types"
import { CommentManagement } from "@/features/comment-management/ui/CommentManagement"
import { highlightText } from "@/shared/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"

interface PostDetailModalProps {
  onOpenChange: (open: boolean) => void
  open: boolean
  post: UpdatePost | null
  searchTerm?: string
}

export function PostDetailModal({ open, onOpenChange, post, searchTerm }: PostDetailModalProps) {
  if (!post) return null

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title, searchTerm ?? "")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post.body, searchTerm ?? "")}</p>
          <CommentManagement postId={post.id} searchTerm={searchTerm} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
