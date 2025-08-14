import { useState } from "react"

import { User } from "@/entities/post/model/types"

export function useUser() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  const openUserModal = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
      // 에러 처리: 기본 사용자 정보로 모달 열기
      setSelectedUser(user)
      setShowUserModal(true)
    }
  }

  const closeUserModal = () => {
    setShowUserModal(false)
    setSelectedUser(null)
  }

  return {
    selectedUser,
    showUserModal,
    openUserModal,
    closeUserModal,
  }
}
