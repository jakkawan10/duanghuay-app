import { NextResponse } from "next/server";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    let qrImage: string;
    let chargeId: string;

    if (process.env.OMISE_MODE === "test") {
      // 🟢 สร้าง QR ปลอม
      qrImage = "https://api.qrserver.com/v1/create-qr-code/?data=mock-payment";
      chargeId = "test_charge_" + Date.now();
    } else {
      // 🟢 เรียก Omise จริง
      const omise = require("omise")({
        secretKey: process.env.OMISE_SECRET_KEY,
      });

      const charge = await omise.charges.create({
        amount: 29900,
        currency: "thb",
        return_uri: "https://duanghuay-app-seven.vercel.app/home",
        source: "src_allpromptpay_th", // ❗️ ต้องใส่ source id string
      });

      qrImage = charge.source.scannable_code.image.download_uri;
      chargeId = charge.id;
    }

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
      chargeId,
      qr: qrImage,
    });
  } catch (err: any) {
    console.error("❌ Error create QR:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
