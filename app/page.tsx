'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomeRedirect() {
  const router = useRouter()

  useEffect(() => {
    const prayed = localStorage.getItem("prayed")
    if (!prayed) {
      router.replace("/landing")
    } else {
      router.replace("/home")
    }
  }, [])

  return null
}

