"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { doc, updateDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Crown, History, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ProtectedRoute from "@/components/protected-route"

interface LuckyHistory {
  id: string
  numbers: string[]
  date: string
  result?: string
  type: "ai" | "traditional"
}

export default function ProfilePage() {
  const { user, userData } = useAuth()
  const [name, setName] = useState(user?.displayName || "")
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<LuckyHistory[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName)
    }
  }, [user])

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return

      try {
        const historyQuery = query(
          collection(db, "luckyHistory"),
          where("userId", "==", user.uid),
          orderBy("date", "desc"),
        )
        const historySnapshot = await getDocs(historyQuery)
        const historyData = historySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as LuckyHistory[]

        setHistory(historyData)
      } catch (error) {
        console.error("Error fetching history:", error)
      }
    }

    fetchHistory()
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: name,
        updatedAt: new Date(),
      })

      toast({
        title: "อัพเดตโปรไฟล์สำเร็จ",
        description: "ข้อมูลของคุณได้รับการอัพเดตแล้ว",
      })
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพเดตโปรไฟล์ได้",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen mystical-bg p-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <Card className="temple-shadow">
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarFallback className="text-2xl">{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-yellow-600">{user?.displayName}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                  {userData?.isVIP && (
                    <Badge className="gold-gradient mt-2">
                      <Crown className="w-4 h-4 mr-1" />
                      สมาชิก VIP
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>สมัครเมื่อ:</span>
                      <span>{userData?.createdAt?.toDate?.()?.toLocaleDateString("th-TH") || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ประวัติดวง:</span>
                      <span>{history.length} ครั้ง</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Settings & History */}
            <div className="lg:col-span-2 space-y-6">
              {/* Edit Profile */}
              <Card className="temple-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-600">
                    <Settings className="w-5 h-5 mr-2" />
                    แก้ไขโปรไฟล์
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">ชื่อ-นามสกุล</label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="กรอกชื่อ-นามสกุล" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">อีเมล</label>
                      <Input value={user?.email || ""} disabled className="bg-gray-100" />
                    </div>
                    <Button type="submit" className="gold-gradient" disabled={loading}>
                      {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Lucky History */}
              <Card className="temple-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-600">
                    <History className="w-5 h-5 mr-2" />
                    ประวัติดวงย้อนหลัง
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {history.length > 0 ? (
                      history.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant={item.type === "ai" ? "default" : "secondary"}>
                              {item.type === "ai" ? "AI วิเคราะห์" : "แบบดั้งเดิม"}
                            </Badge>
                            <span className="text-sm text-gray-500">{item.date}</span>
                          </div>
                          <div className="flex space-x-2 mb-2">
                            {item.numbers.map((num, index) => (
                              <div
                                key={index}
                                className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold"
                              >
                                {num}
                              </div>
                            ))}
                          </div>
                          {item.result && (
                            <div className="text-sm">
                              <span className="font-medium">ผลลัพธ์: </span>
                              <span className={item.result === "win" ? "text-green-600" : "text-red-600"}>
                                {item.result === "win" ? "ถูกรางวัล" : "ไม่ถูกรางวัล"}
                              </span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">ยังไม่มีประวัติดวง</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
