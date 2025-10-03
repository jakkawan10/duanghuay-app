import { NextRequest, NextResponse } from "next/server";
import Omise from "omise";

const omise = Omise({ secretKey: process.env.OMISE_SECRET_KEY! });

export async function GET(req: NextRequest) {
  const chargeId = req.nextUrl.searchParams.get("chargeId");
  if (!chargeId) {
    return NextResponse.json({ error: "Missing chargeId" }, { status: 400 });
  }

  try {
    const charge = await omise.charges.retrieve(chargeId);
    // สถานะที่มักใช้: pending | successful | failed | reversed
    return NextResponse.json({ status: charge.status });
  } catch (e: any) {
    console.error("check charge error:", e);
    return NextResponse.json({ error: e.message || "check failed" }, { status: 500 });
  }
}
