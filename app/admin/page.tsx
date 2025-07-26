"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Users, FileText, TrendingUp, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ProtectedRoute from "@/components/protected-route"

interface News {
  id: string
  title: string
  content: string
  category: string
  date: string
}

interface LuckyNumber {
  id: string
  numbers: string[]
  date: string
  confidence: number
  type: "ai" | "traditional"
}

// Simple admin check - in production, use proper role-based access
const ADMIN_EMAILS = ["admin@duanghuay.com", "owner@duanghuay.com"]

export default function AdminPage() {
  const { user } = useAuth()
  const [news, setNews] = useState<News[]>([])
  const [luckyNumbers, setLuckyNumbers] = useState<LuckyNumber[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // News form state
  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    category: "ข่าวหวย",
  })

  // Lucky numbers form state
  const [numbersForm, setNumbersForm] = useState({
    numbers: ["", "", "", "", "", ""],
    confidence: 85,
    type: "traditional" as "ai" | "traditional",
  })

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email)

  useEffect(() => {
    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin])

  const fetchData = async () => {
    try {
      // Fetch news
      const newsQuery = query(collection(db, "news"), orderBy("date", "desc"))
      const newsSnapshot = await getDocs(newsQuery)
      const newsData = newsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as News[]

      // Fetch lucky numbers
      const numbersQuery = query(collection(db, "luckyNumbers"), orderBy("date", "desc"))
      const numbersSnapshot = await getDocs(numbersQuery)
      const numbersData = numbersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LuckyNumber[]

      setNews(newsData)
      setLuckyNumbers(numbersData)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addDoc(collection(db, "news"), {
        ...newsForm,
        date: new Date().toISOString().split("T")[0],
        createdAt: new Date(),
      })

      setNewsForm({ title: "", content: "", category: "ข่าวหวย" })
      fetchData()

      toast({
        title: "เพิ่มข่าวสำเร็จ",
        description: "ข่าวใหม่ได้รับการเผยแพร่แล้ว",
      })
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มข่าวได้",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddLuckyNumbers = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate numbers
    const validNumbers = numbersForm.numbers.filter((num) => num.trim() !== "")
    if (validNumbers.length < 3) {
      toast({
        title: "ข้อมูลไม่ครบ",
        description: "กรุณากรอกเลขอย่างน้อย 3 ตัว",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await addDoc(collection(db, "luckyNumbers"), {
        numbers: validNumbers,
        confidence: numbersForm.confidence,
        type: numbersForm.type,
        date: new Date().toISOString().split("T")[0],
        createdAt: new Date(),
      })

      setNumbersForm({
        numbers: ["", "", "", "", "", ""],
        confidence: 85,
        type: "traditional",
      })
      fetchData()

      toast({
        title: "เพิ่มเลขเด็ดสำเร็จ",
        description: "เลขเด็ดใหม่ได้รับการเผยแพร่แล้ว",
      })
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มเลขเด็ดได้",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNews = async (id: string) => {
    try {
      await deleteDoc(doc(db, "news", id))
      fetchData()
      toast({
        title: "ลบข่าวสำเร็จ",
        description: "ข่าวได้รับการลบแล้ว",
      })
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบข่าวได้",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLuckyNumbers = async (id: string) => {
    try {
      await deleteDoc(doc(db, "luckyNumbers", id))
      fetchData()
      toast({
        title: "ลบเลขเด็ดสำเร็จ",
        description: "เลขเด็ดได้รับการลบแล้ว",
      })
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบเลขเด็ดได้",
        variant: "destructive",
      })
    }
  }

  if (!isAdmin) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen mystical-bg flex items-center justify-center">
          <Card className="temple-shadow">
            <CardContent className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
              <p className="text-gray-600">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen mystical-bg p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              <Settings className="w-10 h-10 inline-block mr-3 text-yellow-400" />
              ระบบจัดการ
            </h1>
            <p className="text-white/80 text-lg">จัดการข่าวสาร เลขเด็ด และข้อมูลระบบ</p>
          </div>

          <Tabs defaultValue="news" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="news">ข่าวสาร</TabsTrigger>
              <TabsTrigger value="numbers">เลขเด็ด</TabsTrigger>
              <TabsTrigger value="users">ผู้ใช้</TabsTrigger>
              <TabsTrigger value="analytics">สถิติ</TabsTrigger>
            </TabsList>

            {/* News Management */}
            <TabsContent value="news" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add News Form */}
                <Card className="temple-shadow">
                  <CardHeader>
                    <CardTitle className="text-yellow-600 flex items-center">
                      <Plus className="w-5 h-5 mr-2" />
                      เพิ่มข่าวใหม่
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddNews} className="space-y-4">
                      <Input
                        placeholder="หัวข้อข่าว"
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        required
                      />
                      <select
                        className="w-full p-2 border rounded-md"
                        value={newsForm.category}
                        onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                      >
                        <option value="ข่าวหวย">ข่าวหวย</option>
                        <option value="ผลรางวัล">ผลรางวัล</option>
                        <option value="เทคนิค">เทคนิค</option>
                        <option value="ทั่วไป">ทั่วไป</option>
                      </select>
                      <Textarea
                        placeholder="เนื้อหาข่าว"
                        value={newsForm.content}
                        onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                        rows={6}
                        required
                      />
                      <Button type="submit" className="w-full gold-gradient" disabled={loading}>
                        {loading ? "กำลังเพิ่ม..." : "เพิ่มข่าว"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* News List */}
                <Card className="temple-shadow">
                  <CardHeader>
                    <CardTitle className="text-yellow-600 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      ข่าวทั้งหมด ({news.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {news.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-sm">{item.title}</h3>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteNews(item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{item.content.substring(0, 100)}...</p>
                          <div className="flex justify-between items-center">
                            <Badge variant="outline">{item.category}</Badge>
                            <span className="text-xs text-gray-500">{item.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Lucky Numbers Management */}
            <TabsContent value="numbers" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Lucky Numbers Form */}
                <Card className="temple-shadow">
                  <CardHeader>
                    <CardTitle className="text-yellow-600 flex items-center">
                      <Plus className="w-5 h-5 mr-2" />
                      เพิ่มเลขเด็ดใหม่
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddLuckyNumbers} className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {numbersForm.numbers.map((num, index) => (
                          <Input
                            key={index}
                            placeholder={`เลข ${index + 1}`}
                            value={num}
                            onChange={(e) => {
                              const newNumbers = [...numbersForm.numbers]
                              newNumbers[index] = e.target.value
                              setNumbersForm({ ...numbersForm, numbers: newNumbers })
                            }}
                            maxLength={2}
                          />
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">ความแม่นยำ (%)</label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={numbersForm.confidence}
                          onChange={(e) =>
                            setNumbersForm({ ...numbersForm, confidence: Number.parseInt(e.target.value) })
                          }
                        />
                      </div>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={numbersForm.type}
                        onChange={(e) =>
                          setNumbersForm({ ...numbersForm, type: e.target.value as "ai" | "traditional" })
                        }
                      >
                        <option value="traditional">แบบดั้งเดิม</option>
                        <option value="ai">AI วิเคราะห์</option>
                      </select>
                      <Button type="submit" className="w-full gold-gradient" disabled={loading}>
                        {loading ? "กำลังเพิ่ม..." : "เพิ่มเลขเด็ด"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Lucky Numbers List */}
                <Card className="temple-shadow">
                  <CardHeader>
                    <CardTitle className="text-yellow-600 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      เลขเด็ดทั้งหมด ({luckyNumbers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {luckyNumbers.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant={item.type === "ai" ? "default" : "secondary"}>
                              {item.type === "ai" ? "AI วิเคราะห์" : "แบบดั้งเดิม"}
                            </Badge>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteLuckyNumbers(item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{item.confidence}% แม่นยำ</span>
                            <span className="text-xs text-gray-500">{item.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Management */}
            <TabsContent value="users">
              <Card className="temple-shadow">
                <CardHeader>
                  <CardTitle className="text-yellow-600 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    จัดการผู้ใช้
                  </CardTitle>
                  <CardDescription>TODO: เพิ่มระบบจัดการผู้ใช้ ดูสถิติสมาชิก VIP และการใช้งาน</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">ระบบจัดการผู้ใช้จะพัฒนาในเฟสถัดไป</div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics">
              <Card className="temple-shadow">
                <CardHeader>
                  <CardTitle className="text-yellow-600 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    สถิติและการวิเคราะห์
                  </CardTitle>
                  <CardDescription>TODO: เพิ่มระบบสถิติการใช้งาน ความแม่นยำของเลขเด็ด และรายงานต่างๆ</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">ระบบสถิติจะพัฒนาในเฟสถัดไป</div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
