"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import Link from "next/link"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push("/home")
    }
  })

  return () => unsubscribe()
}, [])

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: "ยินดีต้อนรับกลับสู่ดวงหวย",
      })
      router.push("/home")
    } catch (error: any) {
      toast({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen mystical-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md temple-shadow">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-yellow-600">เข้าสู่ระบบ</CardTitle>
          <CardDescription>เข้าสู่โลกแห่งดวงและเลขเด็ด</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="อีเมล"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full gold-gradient" disabled={loading}>
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ยังไม่มีบัญชี?{" "}
              <Link href="/register" className="text-yellow-600 hover:underline">
                สมัครสมาชิก
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
