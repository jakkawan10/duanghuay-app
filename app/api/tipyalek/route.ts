import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "redis";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// 🔑 Connect Redis
const redis = createClient({
  url: process.env.REDIS_URL!,
});
redis.connect();

const SESSION_KEY = "chat:tipyalek";
const EXPIRY_SECONDS = 60 * 60; // 1 ชั่วโมง

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1) ดึงประวัติการสนทนาจาก Redis
    const historyStr = await redis.get(SESSION_KEY);
    let history: { role: string; content: string }[] = historyStr
      ? JSON.parse(historyStr)
      : [];

    // 2) รวมข้อความใหม่
    const updatedHistory = [...history, ...messages];

    // 3) เรียก OpenAI (ChatGPT)
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: updatedHistory,
      max_tokens: 500,
    });

    const reply = response.choices[0].message?.content || "❌ ไม่มีคำตอบ";

    // 4) อัปเดต history กลับไป Redis
    const newHistory = [...updatedHistory, { role: "assistant", content: reply }];
    await redis.set(SESSION_KEY, JSON.stringify(newHistory), {
      EX: EXPIRY_SECONDS, // เก็บ 1 ชั่วโมง
    });

    // 5) ส่งกลับไปหา client
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Tipyalek API Error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการติดต่อองค์ทิพยเลข" },
      { status: 500 }
    );
  }
}
