import { NextResponse } from "next/server";
import Omise from "omise";

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "missing userId" }, { status: 400 });
    }

    console.log("🔑 Using Secret Key:", process.env.OMISE_SECRET_KEY?.slice(0, 6));

    // สร้าง Source สำหรับ PromptPay
    const source = await omise.sources.create({
      amount: 29900, // หน่วยเป็นสตางค์ → 299 บาท
      currency: "thb",
      type: "promptpay",
    });

    console.log("✅ Source created:", source.id);

    // สร้าง Charge
    const charge = await omise.charges.create({
      amount: 29900,
      currency: "thb",
      source: source.id,
      metadata: { userId, session: "tipyalek" },
    });

    console.log("✅ Charge created:", charge.id);

    // ส่ง QR กลับไปให้ฝั่ง Client
    return NextResponse.json({
      chargeId: charge.id,
      qr: charge.source.scannable_code.image.download_uri,
    });
  } catch (err: any) {
    console.error("❌ Omise error:", err);
    return NextResponse.json({ error: "payment failed", detail: err.message }, { status: 500 });
  }
}
