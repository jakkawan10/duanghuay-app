export interface User {
  id: string
  name: string
  email: string
  isVIP: boolean
  createdAt: Date
  vipPlan?: "monthly" | "quarterly" | "yearly"
  vipStartDate?: Date
  vipEndDate?: Date
}

export interface LuckyNumber {
  id: string
  numbers: string[]
  date: string
  confidence: number
  type: "ai" | "traditional"
  reasoning?: string
  userId?: string
}

export interface News {
  id: string
  title: string
  content: string
  category: string
  date: string
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "lucky_number" | "news" | "vip" | "system"
  read: boolean
  createdAt: Date
}

export interface AIAnalysisRequest {
  question?: string
  type: "personal" | "news" | "statistical"
  userId: string
}

export interface AIAnalysisResponse {
  numbers: string[]
  confidence: number
  reasoning: string
  type: "personal" | "news" | "statistical"
}
