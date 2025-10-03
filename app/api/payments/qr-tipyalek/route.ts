import { NextResponse } from "next/server";
import Omise from "omise";

const omise = Omise({
  secretKey: "skey_test_65969y1tpiq8samm8yf",
});


export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "missing userId" }, { status: 400 });
    }

    // 🔍 Debug Key
    console.log("🔑 Raw Secret Key:", JSON.stringify(process.env.OMISE_SECRET_KEY));
    console.log("🔑 Secret Key Prefix:", process.env.OMISE_SECRET_KEY?.slice(0, 10));

    // ✅ สร้าง Source
    const source = await omise.sources.create({
      amount: 29900, // 299 บาท (หน่วยเป็นสตางค์)
      currency: "thb",
      type: "promptpay",
    });

    console.log("✅ Source created:", source.id);

    // ✅ สร้าง Charge
    const charge = await omise.charges.create({
      amount: 29900,
      currency: "thb",
      source: source.id,
      metadata: { userId, session: "tipyalek" },
    });

    console.log("✅ Charge created:", charge.id);

    // ✅ ดึง QR
    const qrImage = charge?.source?.scannable_code?.image?.download_uri || null;

    return NextResponse.json({
      chargeId: charge.id,
      qr: qrImage,
    });
  } catch (err: any) {
    console.error("❌ Omise error:", err);
    return NextResponse.json(
      { error: "payment failed", detail: err.message },
      { status: 500 }
    );
  }
}
