import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // ✅ ตรวจสอบ Secret Key
    if (!process.env.OMISE_SECRET_KEY) {
      console.error("❌ OMISE_SECRET_KEY is missing!");
      return NextResponse.json(
        { error: "Server config error: missing OMISE_SECRET_KEY" },
        { status: 500 }
      );
    }

    // ✅ สร้าง Charge ผ่าน Omise API
    const omiseRes = await fetch("https://api.omise.co/charges", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(process.env.OMISE_SECRET_KEY + ":").toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 29900, // หน่วย satang → 299 บาท = 29900
        currency: "thb",
        return_uri: "https://duanghuay-app-seven.vercel.app/home",
        source: {
          type: "promptpay",
        },
      }),
    });

    const charge = await omiseRes.json();

    if (charge.object === "error") {
      console.error("❌ Omise API error:", charge);
      return NextResponse.json(
        { error: charge.message || "Omise API error" },
        { status: 500 }
      );
    }

    // ✅ ดึง QR Code image
    const qrImage = charge.source?.scannable_code?.image?.download_uri || null;

    // ✅ บันทึก session (pending) ใน Firestore
    const sessionRef = await adminDb.collection("sessions").add({
      userId,
      deity: "tipyalek",
      status: "pending",
      amount: 299,
      chargeId: charge.id,
      createdAt: new Date(),
    });

    console.log("✅ Session created:", sessionRef.id);

    // ✅ ส่งข้อมูลกลับไป frontend
    return NextResponse.json({
      sessionId: sessionRef.id,
      chargeId: charge.id,
      qr: qrImage,
    });
  } catch (err) {
    console.error("❌ Error in create-qr:", err);
    return NextResponse.json(
      { error: "Internal server error", details: String(err) },
      { status: 500 }
    );
  }
}
