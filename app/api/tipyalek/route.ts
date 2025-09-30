import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // ต้องมี lib/firebase.ts สำหรับ init Firebase
import { doc, getDoc } from "firebase/firestore";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST() {
  try {
    // 1. ดึงเลขจาก Firestore
    const ref = doc(db, "predictions/tipyalek/stats", "all");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json(
        { message: "❌ ไม่พบข้อมูลเลขจาก Firestore" },
        { status: 404 }
      );
    }

    const data = snap.data();

    // แยกเลขออกมา
    const one = data.one || [];
    const two = data.two || [];
    const three = data.three || [];
    const four = data.four || [];
    const five = data.five || [];

    // 2. สร้างข้อความ prompt ส่งให้ OpenAI
    const prompt = `
คุณคือเทพพยากรณ์เลขเด็ดชื่อ "องค์ทิพยเลข"
ข้อมูลสถิติจากฐานข้อมูล:
- เลข 1 ตัว: ${JSON.stringify(one)}
- เลข 2 ตัว: ${JSON.stringify(two)}
- เลข 3 ตัว: ${JSON.stringify(three)}
- เลข 4 ตัว: ${JSON.stringify(four)}
- เลข 5 ตัว: ${JSON.stringify(five)}

จงเลือกเลข "เด่นที่สุด" โดยอ้างอิงจากสถิติ + ความเป็นไปได้สูงสุด
ให้ตอบสั้นๆ เช่น:
เลขเด่น 3 ตัว คือ 752
เลขเด่น 2 ตัว คือ 57
เลขเด่น 1 ตัว คือ 5
    `;

    // 3. ประมวลผลด้วย OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // เล็ก ประหยัด และเร็ว
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    });

    const result =
      completion.choices[0]?.message?.content?.trim() ||
      "❌ ไม่สามารถทำนายเลขได้";

    // 4. ตอบกลับหน้า TipyaLekPage
    return NextResponse.json({ message: result });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { message: "❌ เกิดข้อผิดพลาดที่ server" },
      { status: 500 }
    );
  }
}
