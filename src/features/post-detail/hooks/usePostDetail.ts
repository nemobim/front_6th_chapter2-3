import { useState } from "react"

import { UpdatePost } from "@/entities/post/model/types"

export function usePostDetail() {
  const [selectedPost, setSelectedPost] = useState<UpdatePost | null>(null)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)

  const openPostDetail = (post: UpdatePost) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  const closePostDetail = () => {
    setShowPostDetailDialog(false)
    setSelectedPost(null)
  }

  return {
    selectedPost,
    showPostDetailDialog,
    openPostDetail,
    closePostDetail,
  }
}
