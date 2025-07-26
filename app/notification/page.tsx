"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Bell, BellRing, Settings, Sparkles, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ProtectedRoute from "@/components/protected-route"

interface Notification {
  id: string
  title: string
  message: string
  type: "lucky_number" | "news" | "vip" | "system"
  read: boolean
  createdAt: Date
}

interface NotificationSettings {
  luckyNumbers: boolean
  news: boolean
  vip: boolean
  system: boolean
}

export default function NotificationPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    luckyNumbers: true,
    news: true,
    vip: true,
    system: true,
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchNotifications()
  }, [user])

  const fetchNotifications = async () => {
    if (!user) return

    try {
      // TODO: In production, create proper notification system
      // For now, create mock notifications
      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "เลขเด็ดใหม่มาแล้ว!",
          message: "AI ได้วิเคราะห์เลขเด็ดใหม่สำหรับวันนี้ มาดูกันเลย",
          type: "lucky_number",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        },
        {
          id: "2",
          title: "ข่าวหวยล่าสุด",
          message: "มีข่าวสารใหม่เกี่ยวกับการออกรางวัลในรอบถัดไป",
          type: "news",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        },
        {
          id: "3",
          title: "โปรโมชั่น VIP พิเศษ",
          message: "อัพเกรด VIP วันนี้ รับส่วนลด 20% สำหรับแพ็คเกจรายปี",
          type: "vip",
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
      ]

      setNotifications(mockNotifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      // TODO: Update notification in Firestore
      setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const updateSettings = async (key: keyof NotificationSettings, value: boolean) => {
    if (!user) return

    try {
      const newSettings = { ...settings, [key]: value }
      setSettings(newSettings)

      // TODO: Save settings to Firestore
      await updateDoc(doc(db, "users", user.uid), {
        notificationSettings: newSettings,
      })

      toast({
        title: "บันทึกการตั้งค่าแล้ว",
        description: "การตั้งค่าการแจ้งเตือนได้รับการอัพเดต",
      })
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกการตั้งค่าได้",
        variant: "destructive",
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "lucky_number":
        return <Sparkles className="w-5 h-5 text-yellow-500" />
      case "news":
        return <TrendingUp className="w-5 h-5 text-blue-500" />
      case "vip":
        return <BellRing className="w-5 h-5 text-purple-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationTypeText = (type: string) => {
    switch (type) {
      case "lucky_number":
        return "เลขเด็ด"
      case "news":
        return "ข่าวสาร"
      case "vip":
        return "VIP"
      default:
        return "ระบบ"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen mystical-bg flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen mystical-bg p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              <Bell className="w-10 h-10 inline-block mr-3 text-yellow-400" />
              การแจ้งเตือน
            </h1>
            <p className="text-white/80 text-lg">ติดตามข่าวสารและเลขเด็ดใหม่ๆ</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notifications List */}
            <div className="lg:col-span-2">
              <Card className="temple-shadow">
                <CardHeader>
                  <CardTitle className="text-yellow-600">
                    การแจ้งเตือนทั้งหมด ({notifications.filter((n) => !n.read).length} ใหม่)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            !notification.read ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
                          }`}
                          onClick={() => !notification.read && markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3
                                  className={`font-semibold ${!notification.read ? "text-gray-900" : "text-gray-600"}`}
                                >
                                  {notification.title}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">{getNotificationTypeText(notification.type)}</Badge>
                                  {!notification.read && <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>}
                                </div>
                              </div>
                              <p className={`text-sm ${!notification.read ? "text-gray-700" : "text-gray-500"}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {notification.createdAt.toLocaleString("th-TH")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p>ยังไม่มีการแจ้งเตือน</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notification Settings */}
            <div>
              <Card className="temple-shadow">
                <CardHeader>
                  <CardTitle className="text-yellow-600 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    ตั้งค่าการแจ้งเตือน
                  </CardTitle>
                  <CardDescription>เลือกประเภทการแจ้งเตือนที่ต้องการรับ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">เลขเด็ดใหม่</p>
                        <p className="text-sm text-gray-500">แจ้งเตือนเมื่อมีเลขเด็ดใหม่</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.luckyNumbers}
                      onCheckedChange={(checked) => updateSettings("luckyNumbers", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">ข่าวสาร</p>
                        <p className="text-sm text-gray-500">แจ้งเตือนข่าวหวยใหม่</p>
                      </div>
                    </div>
                    <Switch checked={settings.news} onCheckedChange={(checked) => updateSettings("news", checked)} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BellRing className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium">โปรโมชั่น VIP</p>
                        <p className="text-sm text-gray-500">แจ้งเตือนข้อเสนอพิเศษ</p>
                      </div>
                    </div>
                    <Switch checked={settings.vip} onCheckedChange={(checked) => updateSettings("vip", checked)} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">ระบบ</p>
                        <p className="text-sm text-gray-500">แจ้งเตือนจากระบบ</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.system}
                      onCheckedChange={(checked) => updateSettings("system", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="temple-shadow mt-6">
                <CardHeader>
                  <CardTitle className="text-yellow-600">การดำเนินการด่วน</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => {
                      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                      toast({
                        title: "อ่านทั้งหมดแล้ว",
                        description: "ทำเครื่องหมายการแจ้งเตือนทั้งหมดว่าอ่านแล้ว",
                      })
                    }}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    อ่านทั้งหมด
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
