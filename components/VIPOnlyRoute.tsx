"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function VIPOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, userData } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && userData && userData.isVIP === false) {
      router.push("/vip")
    }
  }, [user, userData, router])

  if (!user || !userData) return null
  if (userData.isVIP === false) return null

  return <>{children}</>
}
