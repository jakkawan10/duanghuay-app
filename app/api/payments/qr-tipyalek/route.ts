import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // ต้องมีไฟล์ config firebase client/admin
import { doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";

// Helper: encode key เป็น Basic Auth
function getAuthHeader() {
  const key = process.env.OMISE_SECRET_KEY || "";
  return "Basic " + Buffer.from(key + ":").toString("base64");
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "missing userId" }, { status: 400 });
    }

    console.log("🔑 Raw Key JSON:", JSON.stringify(process.env.OMISE_SECRET_KEY));

    // ✅ สร้าง Source
    const sourceRes = await fetch("https://api.omise.co/sources", {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 29900,
        currency: "thb",
        type: "promptpay",
      }),
    });

    const source = await sourceRes.json();
    if (!source?.id) {
      return NextResponse.json({ error: "create source failed", detail: source }, { status: 500 });
    }

    // ✅ สร้าง Charge
    const chargeRes = await fetch("https://api.omise.co/charges", {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 29900,
        currency: "thb",
        source: source.id,
        metadata: { userId, session: "tipyalek" },
      }),
    });

    const charge = await chargeRes.json();
    if (!charge?.id) {
      return NextResponse.json({ error: "create charge failed", detail: charge }, { status: 500 });
    }

    console.log("✅ Charge created:", charge.id);

    // ✅ บันทึกสิทธิ์เข้า Firestore
    const expireAt = Timestamp.fromMillis(Date.now() + 60 * 60 * 1000); // อายุ 1 ชั่วโมง
    const ref = doc(db, "users", userId, "sessions", "tipyalek");

    await setDoc(ref, {
      status: "active",
      chargeId: charge.id,
      expireAt,
      createdAt: serverTimestamp(),
    });

    const qrImage = charge?.source?.scannable_code?.image?.download_uri || null;

    return NextResponse.json({
      chargeId: charge.id,
      qr: qrImage,
    });
  } catch (err: any) {
    console.error("❌ Payment error:", err);
    return NextResponse.json(
      { error: "payment failed", detail: err.message },
      { status: 500 }
    );
  }
}
