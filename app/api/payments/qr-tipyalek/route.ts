import { NextResponse } from "next/server";
import Omise from "omise";

// ✅ init Omise ด้วย Secret Key จาก env
const secretKey = process.env.OMISE_SECRET_KEY || "";

const omise = Omise({
  secretKey,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    console.log("===== [DEBUG LOG] /api/payments/qr-tipyalek =====");
    console.log("📩 Request body:", JSON.stringify(body, null, 2));
    console.log("🔑 Raw Secret Key:", JSON.stringify(process.env.OMISE_SECRET_KEY));
    console.log("🔑 Secret Key slice:", process.env.OMISE_SECRET_KEY?.slice(0, 10));

    if (!userId) {
      console.error("❌ Missing userId in request");
      return NextResponse.json({ error: "missing userId" }, { status: 400 });
    }

    // ✅ สร้าง Source
    const source = await omise.sources.create({
      amount: 29900, // 299 บาท → หน่วยเป็นสตางค์
      currency: "thb",
      type: "promptpay",
    });

    console.log("✅ Source created:", JSON.stringify(source, null, 2));

    // ✅ สร้าง Charge
    const charge = await omise.charges.create({
      amount: 29900,
      currency: "thb",
      source: source.id,
      metadata: { userId, session: "tipyalek" },
    });

    console.log("✅ Charge created:", JSON.stringify(charge, null, 2));

    // ✅ ดึง QR image
    const qrImage = charge?.source?.scannable_code?.image?.download_uri || null;

    console.log("📷 QR Image URL:", qrImage);

    return NextResponse.json({
      chargeId: charge.id,
      qr: qrImage,
    });
  } catch (err: any) {
    console.error("❌ Omise error:", JSON.stringify(err, null, 2));
    return NextResponse.json(
      {
        error: "payment failed",
        detail: err.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
