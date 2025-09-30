import { NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import OpenAI from "openai";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// init Firebase (กัน init ซ้ำ)
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getFirestore();

// ✅ OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question } = body; // เช่น "เลข 3 ตัวเด่นคืออะไร"

    // 🔹 ดึงข้อมูลจาก Firestore
    const ref = doc(db, "predictions", "tipyalek", "stats", "all");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json({ error: "ไม่พบข้อมูลจาก Firestore" }, { status: 404 });
    }

    const data = snap.data();

    // 🔹 ใช้ OpenAI วิเคราะห์และสร้างคำตอบ
    const prompt = `
คุณคือเทพ Tipyalek ผู้เชี่ยวชาญการวิเคราะห์ตัวเลข
นี่คือข้อมูลจากสถิติ:
- เลข 1 ตัว: ${JSON.stringify(data.one)}
- เลข 2 ตัว: ${JSON.stringify(data.two)}
- เลข 3 ตัว: ${JSON.stringify(data.three)}
- เลข 4 ตัว: ${JSON.stringify(data.four)}
- เลข 5 ตัว: ${JSON.stringify(data.five)}

ผู้ใช้ถามว่า: "${question}"
โปรดตอบเป็นภาษาธรรมชาติสั้นๆ เช่น:
"เลข 3 ตัวเด่นคือ 752"
`;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    const answer = aiRes.choices[0]?.message?.content || "ไม่สามารถวิเคราะห์ได้";

    return NextResponse.json({
      question,
      answer,
      raw: data, // ส่งดิบกลับไปด้วย เผื่อ debug
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
