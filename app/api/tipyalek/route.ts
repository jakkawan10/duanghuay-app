import { kv } from "@vercel/kv";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const SYSTEM_PROMPT = `
คุณคือ "องค์ทิพยเลข" ผู้ทำนายโชคชะตาด้วยความขลังและศักดิ์สิทธิ์ 
ตอบแบบโต้ตอบ เป็นกันเอง แต่ยังคงบรรยากาศของเทพพยากรณ์
`;

// สร้าง session id จาก user (กรณีนี้ mock = "guest")
// ถ้า auth แล้วใช้ uid
function getSessionId(req: NextRequest) {
  return "guest"; // TODO: เปลี่ยนเป็น uid ถ้ามีระบบล็อกอิน
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const sessionId = getSessionId(req);
    const key = `chat:tipyalek:${sessionId}`;

    // ดึง history จาก KV
    let history = (await kv.get<any[]>(key)) || [];

    // push ข้อความใหม่
    history.push({ role: "user", content: message });

    // ส่งเข้า GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "❌ ไม่มีคำตอบ";

    // เก็บข้อความ GPT ลง history
    history.push({ role: "assistant", content: reply });

    // save กลับ KV (expire 1 ชั่วโมง)
    await kv.set(key, history, { ex: 3600 });

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
