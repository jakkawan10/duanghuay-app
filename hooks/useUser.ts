'use client'

import { useAuth } from './useAuth'
import { useUserRole } from './useUserRole'

export function useUser() {
  const { user, loading: authLoading } = useAuth()
  const { role, loading: roleLoading } = useUserRole()

  return {
    user: user ? { ...user, role } : null,
    loading: authLoading || roleLoading,
  }
}
