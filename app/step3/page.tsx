'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Step3Page() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home') // หรือเปลี่ยน path ถ้าหน้าหลักใช้ชื่ออื่น
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-black text-white text-center px-4">
      <h1 className="text-3xl font-bold mb-4">🎉 ดวงดีรับทรัพย์ทุกงวด!</h1>
      <p className="text-lg">ตัวเลขมันขึ้นอยู่กับดวงคุณ</p>
    </main>
  )
}
