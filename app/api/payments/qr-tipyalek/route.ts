import { NextResponse } from "next/server";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import omise from "omise";

// Init Omise
const omiseClient = omise({
  secretKey: process.env.OMISE_SECRET_KEY as string,
});

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) throw new Error("Missing userId");

    // เรียก Omise Charge
    const charge = await omiseClient.charges.create({
      amount: 29900, // 299 บาท = 29900 สตางค์
      currency: "thb",
      return_uri: "https://duanghuay-app-seven.vercel.app/home",
      source: {
        type: "promptpay",
      } as any, // 👈 บังคับ cast เป็น any
    });


    // ตรวจโหมด
    const isTestMode = process.env.OMISE_SECRET_KEY?.startsWith("skey_test");

    // ถ้า Test Mode → ใช้ QR ปลอมแทน
    const qrImage = isTestMode
      ? "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MOCK_PROMPTPAY_299"
      : charge.source?.scannable_code?.image?.download_uri;

    if (!qrImage) throw new Error("ไม่พบ QR Image");

    // เก็บ session ลง Firestore ด้วย Admin SDK
    const sessionRef = adminDb.collection("sessions").doc(charge.id);
    await sessionRef.set({
      userId,
      deity: "tipyalek",
      status: "pending",
      amount: 299,
      chargeId: charge.id,
      createdAt: new Date(),
    });


    return NextResponse.json({
      sessionId: sessionRef.id,
      chargeId: charge.id,
      qr: qrImage,
    });
  } catch (err: any) {
    console.error("❌ Error in qr-tipyalek:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
