import { NextRequest, NextResponse } from "next/server";
import Omise from "omise";
import { Timestamp } from "firebase/firestore";
import { adminDb } from "@/lib/firebaseAdmin"; // <- ไฟล์ admin เดิมของโปรเจ็กต์คุณ

const omise = Omise({ secretKey: process.env.OMISE_SECRET_KEY! });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, product, amount } = body as {
      userId: string;
      product: "tipyalek";
      amount: number; // 299
    };

    if (!userId || product !== "tipyalek" || amount !== 299) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 1) สร้าง Source สำหรับ PromptPay
    const source = await omise.sources.create({
      type: "promptpay",
      amount: amount * 100,   // เป็นสตางค์
      currency: "thb",
    });

    // 2) สร้าง Charge จาก Source (สถานะจะ pending จนกว่าจ่ายจริง)
    const charge = await omise.charges.create({
      amount: amount * 100,
      currency: "thb",
      source: source.id,
      description: `Tipyalek 1 hour session for ${userId}`,
      metadata: { userId, product, minutes: 60 },
      // ผู้ใช้จ่ายเสร็จเราจะไม่ redirect ก็ได้ (จะแจ้งด้วย webhook)
      return_uri: `${process.env.APP_URL}/fortune/tipyalek`,
    });

    // 3) เก็บ Payment Request (pending) ไว้ใน Firestore
    const payRef = adminDb.collection("payments").doc(charge.id);
    await payRef.set({
      id: charge.id,
      userId,
      product,
      amount,
      provider: "omise",
      sourceId: source.id,
      status: "pending",
      createdAt: Timestamp.now(),
    });

    // 4) ดึงรูป QR (จาก charge.source.scannable_code.image)
    // หมายเหตุ: บาง account/เวอร์ชัน โค้ดจะอยู่ที่ charge.source.scannable_code.image.download_uri
    const qrImage =
      (charge as any)?.source?.scannable_code?.image?.download_uri ||
      (charge as any)?.source?.scannable_code?.image?.uri ||
      null;

    return NextResponse.json({
      chargeId: charge.id,
      amount,
      currency: charge.currency,
      qrImage,
      expiresAt: (charge as any)?.source?.expires_at || null,
    });
  } catch (e: any) {
    console.error("create-qr error:", e);
    return NextResponse.json({ error: e.message || "create-qr failed" }, { status: 500 });
  }
}
