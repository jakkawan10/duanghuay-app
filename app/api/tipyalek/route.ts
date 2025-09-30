import { NextResponse } from "next/server";
import client from "@/lib/redis";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SESSION_TTL = 60 * 60; // 1 ชั่วโมง

export async function POST(req: Request) {
  try {
    const { sessionId, message } = await req.json();

    const key = `tipyalek:${sessionId}`;

    // ดึงประวัติการสนทนา
    const historyRaw = await client.get(key);
    const history = historyRaw ? JSON.parse(historyRaw) : [];

    // เพิ่มข้อความใหม่เข้าไป
    history.push({ role: "user", content: message });

    // ส่งให้ GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: history,
    });

    const reply = completion.choices[0].message.content || "❌ ไม่มีคำตอบ";

    // เก็บข้อความ assistant ลง history
    history.push({ role: "assistant", content: reply });

    // เซฟกลับ Redis พร้อม TTL
    await client.set(key, JSON.stringify(history), { EX: SESSION_TTL });

    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
