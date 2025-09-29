import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import OpenAI from "openai";

// โหลด API KEY จาก Environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    // 1) ดึงสถิติย้อนหลังจาก Firestore (ล่าสุด 10 งวด)
    const q = query(
      collection(db, "predictions", "tipyalek", "history"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const snap = await getDocs(q);
    const history: any[] = [];
    snap.forEach((doc) => history.push(doc.data()));

    // 2) เตรียมข้อความสถิติ
    const statsText =
      history.length > 0
        ? history
            .map(
              (h, i) =>
                `งวด ${i + 1}: เลขเด่น ${h.main || "-"}, รอง ${h.sub || "-"}, 2ตัว ${h.two || "-"}, 3ตัว ${h.three || "-"}`
            )
            .join("\n")
        : "ไม่มีข้อมูลสถิติ";

    // 3) สร้าง Prompt สำหรับ AI
    const prompt = `
คุณคือ "องค์ทิพยเลข" เทพผู้ใช้สถิติและ AI วิเคราะห์แนวโน้มตัวเลขลอตเตอรี่
ข้อมูลสถิติย้อนหลัง (สูงสุด 10 งวด):
${statsText}

จงคาดการณ์เลขเด็ดสำหรับงวดถัดไป โดยให้ผลลัพธ์ในโครงสร้างนี้:
- เด่นตัวเดียว: x
- เด่นรอง: x
- เลข 2 ตัว: xx, xx, xx
- เลข 3 ตัว: xxx, xxx
(ห้ามเกินโครงสร้างนี้ และอย่าใส่คำอธิบายเพิ่ม) 
    `;

    // 4) เรียก OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 300,
      temperature: 0.8,
    });

    const message =
      completion.choices[0].message?.content || "❌ ไม่สามารถสร้างผลลัพธ์ได้";

    // 5) ส่งกลับ client
    return NextResponse.json({ success: true, message });
  } catch (err: any) {
    console.error("TipyaLek API Error:", err);
    return NextResponse.json(
      { success: false, error: "API error", details: err.message },
      { status: 500 }
    );
  }
}
