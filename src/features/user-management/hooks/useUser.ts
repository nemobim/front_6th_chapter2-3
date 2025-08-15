import { useState } from "react"

import { User, UserInfo } from "@/entities/post/model/types"
import { api } from "@/shared/lib"

export function useUser() {
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  const openUserModal = async (user: User) => {
    try {
      const response = await api.get<UserInfo>(`/users/${user.id}`)
      setSelectedUser(response.data)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
      // 에러 처리: 기본 사용자 정보로 모달 열기
      setSelectedUser(user as UserInfo)
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
