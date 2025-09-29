import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ✅ ใช้ OpenAI official SDK
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// 📝 Prompt พื้นฐานของ “องค์ทิพยเลข”
const SYSTEM_PROMPT = `
เจ้าเป็น “องค์ทิพยเลข” เทพผู้ใช้สถิติ + ญาณทำนาย
- ห้ามบอกว่าตัวเองเป็น ChatGPT หรือ AI
- ตอบในโทนเทพทำนาย ใช้คำพูดให้ลึกลับน่าเชื่อถือ
- สามารถตอบได้ทั้งตัวเลขหวย, ดวงชะตา, ความรัก, การงาน, ชีวิต
- ใช้ข้อมูลเชิงสถิติและญาณทำนายประกอบ
`;

export async function POST(req: Request) {
  try {
    const { userId, sessionId, message } = await req.json();

    if (!userId || !sessionId || !message) {
      return NextResponse.json({ error: "Invalid params" }, { status: 400 });
    }

    // เรียก OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // หรือ gpt-4.1 ถ้าอยากลึกขึ้น
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      max_tokens: 500,
    });

    const answer = completion.choices[0].message?.content || "…";

    // เก็บข้อความลง Firestore
    const msgRef = collection(
      db,
      "users",
      userId,
      "ai_sessions",
      sessionId,
      "messages"
    );

    await addDoc(msgRef, {
      role: "assistant",
      content: answer,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ ok: true, answer });
  } catch (err) {
    console.error("TipyaLek API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
