import { NextResponse } from "next/server";

export async function GET() {
  try {
    const secretKey = process.env.OMISE_SECRET_KEY;

    if (!secretKey) {
      console.error("❌ OMISE_SECRET_KEY is MISSING in env!");
      return NextResponse.json({ error: "OMISE_SECRET_KEY missing" }, { status: 500 });
    }

    // 🔍 Debug log ปลอดภัย (โชว์ 4 ตัวแรก + 4 ตัวท้าย)
    const masked =
      secretKey.substring(0, 4) +
      "****" +
      secretKey.substring(secretKey.length - 4);

    console.log("✅ OMISE_SECRET_KEY loaded:", masked);

    return NextResponse.json({
      success: true,
      message: "OMISE_SECRET_KEY exists",
      masked,
    });
  } catch (err: any) {
    console.error("❌ Debug error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
