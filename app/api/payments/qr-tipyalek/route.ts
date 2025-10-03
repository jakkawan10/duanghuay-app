// /app/api/payments/qr-tipyalek/route.ts
import { NextResponse } from "next/server";
import Omise from "omise";

export async function POST(req: Request) {
  try {
    // เช็คว่า secret key อ่านได้ไหม
    if (!process.env.OMISE_SECRET_KEY) {
      console.error("❌ OMISE_SECRET_KEY is missing");
      return NextResponse.json({ error: "Server config error" }, { status: 500 });
    }

    const omise = Omise({
      secretKey: process.env.OMISE_SECRET_KEY,
    });

    // รับ userId จาก body
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // สร้าง Source PromptPay
    const source = await omise.sources.create({
      type: "promptpay",
      amount: 29900, // 299 บาท (หน่วยเป็นสตางค์)
      currency: "thb",
    });

    // สร้าง Charge ผูกกับ source
    const charge = await omise.charges.create({
      amount: 29900,
      currency: "thb",
      source: source.id,
      metadata: { userId, session: "tipyalek" },
    });

    console.log("✅ Charge created:", charge.id);

    return NextResponse.json({
      id: charge.id,
      status: charge.status,
      authorizeUri: charge.authorize_uri,
      source: charge.source,
    });
  } catch (err: any) {
    console.error("❌ Error creating QR charge:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
