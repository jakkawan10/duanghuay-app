import { NextResponse } from "next/server";
import Omise from "omise";

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    const { amount, userId } = await req.json();

    // สร้าง charge แบบ QR PromptPay
    const charge = await omise.charges.create({
      amount, // เช่น 29900 (299 บาท)
      currency: "thb",
      source: {
        type: "promptpay",
      },
      metadata: { userId, session: "tipyalek" },
    });

    return NextResponse.json({
      qr: charge.source.scannable_code.image.download_uri,
      chargeId: charge.id,
    });
  } catch (error: any) {
    console.error("Omise Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
