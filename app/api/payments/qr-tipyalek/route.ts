import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // 🕒 เวลาหมดอายุ +1 ชั่วโมง
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    // 🔹 สร้าง Session ใหม่ใน collection "sessions"
    const sessionRef = adminDb.collection("sessions").doc();
    await sessionRef.set({
      userId,
      deity: "tipyalek",
      status: "active", // ตรงนี้จะเปลี่ยนเป็น active หลังจาก webhook จ่ายเงินก็ได้
      amount: 299,
      startTime,
      endTime,
      createdAt: new Date(),
    });

    console.log("✅ Session created:", sessionRef.id);

    return NextResponse.json({
      message: "Session created",
      sessionId: sessionRef.id,
    });
  } catch (err: any) {
    console.error("❌ Error in qr-tipyalek route:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
