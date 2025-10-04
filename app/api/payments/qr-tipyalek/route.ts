import { NextResponse } from "next/server";
import Omise from "omise";
import { adminDb } from "@/lib/firebaseAdmin"; // ✅ path ที่ถูกต้องของโปรเจ็กต์พี่

export const runtime = "nodejs"; // firebase-admin & omise ต้องรันบน Node.js

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    // 1) สร้าง source promptpay ก่อน
    const source = await omise.sources.create({
      amount: 29900,
      currency: "thb",
      type: "promptpay",
    });

    // 2) เอา source.id ไปสร้าง charge
    const charge = await omise.charges.create({
      amount: 29900,
      currency: "thb",
      source: source.id,
      return_uri: "https://duanghuay-app-seven.vercel.app/home",
    });

    // 3) ดึง URL ของ QR
    const qr = charge?.source?.scannable_code?.image?.download_uri;
    if (!qr) {
      throw new Error("ไม่พบ QR image จาก Omise");
    }

    // 4) บันทึก session ลง Firestore ด้วย Admin SDK
    await adminDb.collection("sessions").doc(charge.id).set({
      userId,
      deity: "tipyalek",
      status: "pending",
      amount: 299,
      chargeId: charge.id,
      createdAt: new Date(),
    });

    return NextResponse.json({
      sessionId: charge.id,
      chargeId: charge.id,
      qr, // ให้หน้า UI <img src={qr}> ได้เลย
    });
  } catch (err: any) {
    console.error("❌ Error /qr-tipyalek:", err);
    return NextResponse.json({ error: err.message ?? "unknown error" }, { status: 400 });
  }
}
