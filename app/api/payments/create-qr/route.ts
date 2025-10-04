import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "missing userId" }, { status: 400 });
    }

    // 🔑 ตรวจสอบว่า key มีจริงไหม
    if (!process.env.OMISE_SECRET_KEY) {
      console.error("❌ Missing OMISE_SECRET_KEY");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    // 🔹 สร้าง Source → PromptPay
    const sourceRes = await fetch("https://api.omise.co/sources", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(process.env.OMISE_SECRET_KEY + ":").toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 29900, // 299 บาท → หน่วยสตางค์
        currency: "thb",
        type: "promptpay",
      }),
    });

    const source = await sourceRes.json();
    if (source.object === "error") {
      console.error("❌ Source error:", source);
      return NextResponse.json(source, { status: 500 });
    }

    // 🔹 สร้าง Charge
    const chargeRes = await fetch("https://api.omise.co/charges", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(process.env.OMISE_SECRET_KEY + ":").toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 29900,
        currency: "thb",
        source: source.id,
        metadata: { userId, deity: "tipyalek" },
      }),
    });

    const charge = await chargeRes.json();
    if (charge.object === "error") {
      console.error("❌ Charge error:", charge);
      return NextResponse.json(charge, { status: 500 });
    }

    // 🔹 สร้าง Session ใน Firestore (pending)
    const sessionDoc = await addDoc(collection(db, "sessions"), {
      userId,
      deity: "tipyalek",
      status: "pending",
      amount: 299,
      chargeId: charge.id,
      createdAt: new Date(),
    });

    const qrImage = charge?.source?.scannable_code?.image?.download_uri || null;

    return NextResponse.json({
      sessionId: sessionDoc.id,
      chargeId: charge.id,
      qr: qrImage,
    });
  } catch (err: any) {
    console.error("❌ Create QR error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
