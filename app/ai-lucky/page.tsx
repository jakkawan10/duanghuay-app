"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Brain, Wand2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ProtectedRoute from "@/components/protected-route"

interface AIResponse {
  numbers: string[]
  confidence: number
  reasoning: string
  type: "personal" | "news" | "statistical"
}

export default function AILuckyPage() {
  const { user, userData } = useAuth()
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const { toast } = useToast()

  const handleAIAnalysis = async (type: "personal" | "news" | "statistical") => {
    if (!user) return

    // Check VIP access for advanced features
    if (type !== "personal" && !userData?.isVIP) {
      toast({
        title: "ต้องเป็นสมาชิก VIP",
        description: "คุณสมบัตินี้สำหรับสมาชิก VIP เท่านั้น",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // TODO: Integrate with AI service (OpenAI, Gemini, etc.)
      // Simulate AI response for now
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockResponse: AIResponse = {
        numbers: generateRandomNumbers(),
        confidence: Math.floor(Math.random() * 30) + 70,
        reasoning: getReasoningByType(type),
        type,
      }

      setAiResponse(mockResponse)

      // Save to user's history
      await addDoc(collection(db, "luckyHistory"), {
        userId: user.uid,
        numbers: mockResponse.numbers,
        date: new Date().toISOString().split("T")[0],
        type: "ai",
        confidence: mockResponse.confidence,
        reasoning: mockResponse.reasoning,
        question: question || `${type} analysis`,
      })

      toast({
        title: "AI วิเคราะห์เสร็จสิ้น",
        description: "ได้รับเลขเด็ดจาก AI แล้ว",
      })
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถวิเคราะห์ได้ในขณะนี้",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateRandomNumbers = (): string[] => {
    const numbers = []
    for (let i = 0; i < 6; i++) {
      numbers.push(String(Math.floor(Math.random() * 99)).padStart(2, "0"))
    }
    return numbers
  }

  const getReasoningByType = (type: string): string => {
    const reasonings = {
      personal: "จากการวิเคราะห์ข้อมูลส่วนตัวและพฤติกรรมของคุณ AI พบว่าเลขเหล่านี้มีความเข้ากันได้กับดวงชะตาของคุณ",
      news: "จากการวิเคราะห์ข่าวสารและเหตุการณ์ปัจจุบัน AI คำนวณแนวโน้มที่อาจส่งผลต่อผลหวย",
      statistical: "จากการวิเคราะห์สถิติผลหวยย้อนหลัง 10 ปี AI พบรูปแบบและแนวโน้มที่น่าสนใจ",
    }
    return reasonings[type as keyof typeof reasonings] || reasonings.personal
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen mystical-bg p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              <Brain className="w-10 h-10 inline-block mr-3 text-yellow-400" />
              AI เลขเด็ด
            </h1>
            <p className="text-white/80 text-lg">ให้ AI วิเคราะห์และแนะนำเลขเด็ดที่เหมาะกับคุณ</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Analysis Options */}
            <div className="space-y-6">
              <Card className="temple-shadow">
                <CardHeader>
                  <CardTitle className="text-yellow-600 flex items-center">
                    <Wand2 className="w-5 h-5 mr-2" />
                    วิเคราะห์ส่วนตัว
                  </CardTitle>
                  <CardDescription>ให้ AI วิเคราะห์จากข้อมูลและคำถามของคุณ</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="เล่าให้ AI ฟังเกี่ยวกับตัวคุณ เช่น วันเกิด, ความฝัน, เหตุการณ์พิเศษ..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                    className="mb-4"
                  />
                  <Button
                    onClick={() => handleAIAnalysis("personal")}
                    disabled={loading}
                    className="w-full gold-gradient"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        AI กำลังวิเคราะห์...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        วิเคราะห์เลขเด็ด
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* VIP Features */}
              <Card className="temple-shadow">
                <CardHeader>
                  <CardTitle className="text-yellow-600">คุณสมบัติ VIP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => handleAIAnalysis("news")}
                    disabled={loading || !userData?.isVIP}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    วิเคราะห์จากข่าวสาร
                    {!userData?.isVIP && <Badge className="ml-auto">VIP</Badge>}
                  </Button>
                  <Button
                    onClick={() => handleAIAnalysis("statistical")}
                    disabled={loading || !userData?.isVIP}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    วิเคราะห์เชิงสถิติ
                    {!userData?.isVIP && <Badge className="ml-auto">VIP</Badge>}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* AI Response */}
            <div>
              {aiResponse ? (
                <Card className="temple-shadow">
                  <CardHeader>
                    <CardTitle className="text-yellow-600 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      เลขเด็ดจาก AI
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant={aiResponse.type === "personal" ? "default" : "secondary"}>
                        {aiResponse.type === "personal" ? "ส่วนตัว" : aiResponse.type === "news" ? "ข่าวสาร" : "สถิติ"}
                      </Badge>
                      <Badge variant="outline">{aiResponse.confidence}% แม่นยำ</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Lucky Numbers */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {aiResponse.numbers.map((num, index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center"
                        >
                          <span className="text-white text-2xl font-bold">{num}</span>
                        </div>
                      ))}
                    </div>

                    {/* AI Reasoning */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">เหตุผลจาก AI:</h4>
                      <p className="text-gray-700 text-sm">{aiResponse.reasoning}</p>
                    </div>

                    <Button onClick={() => setAiResponse(null)} variant="outline" className="w-full mt-4">
                      วิเคราะห์ใหม่
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="temple-shadow">
                  <CardContent className="text-center py-12">
                    <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">เลือกวิธีการวิเคราะห์เพื่อให้ AI แนะนำเลขเด็ด</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <Card className="temple-shadow mt-8">
            <CardContent className="text-center py-4">
              <p className="text-sm text-gray-600">⚠️ การทำนายนี้เป็นเพียงการให้ความบันเทิงเท่านั้น ไม่รับประกันผลลัพธ์</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
