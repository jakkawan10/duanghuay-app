import { NextResponse } from "next/server";
import Omise from "omise";

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    // 1) สร้าง Source (PromptPay)
    const source = await omise.sources.create({
      type: "promptpay",
      amount: 29900,   // 299 บาท
      currency: "thb",
    });

    // 2) ใช้ source.id ไปสร้าง Charge
    const charge = await omise.charges.create({
      amount: 29900,
      currency: "thb",
      source: source.id,
      metadata: {
        userId,
        session: "tipyalek",
      },
    });

    return NextResponse.json({ charge });
  } catch (e: any) {
    console.error("Create QR failed:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
