import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("DEBUG: เริ่มต้นสร้าง QR...");

    // 👀 ตรวจสอบว่า key มีจริงไหม
    console.log("DEBUG: typeof OMISE_SECRET_KEY =", typeof process.env.OMISE_SECRET_KEY);
    console.log("DEBUG: OMISE_SECRET_KEY length =", process.env.OMISE_SECRET_KEY?.length || 0);

    if (!process.env.OMISE_SECRET_KEY) {
      throw new Error("❌ Missing OMISE_SECRET_KEY in environment variables");
    }

    const body = await req.json();
    console.log("DEBUG: Request body =", body);

    const res = await fetch("https://api.omise.co/charges", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(process.env.OMISE_SECRET_KEY + ":").toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: body.amount,
        currency: "thb",
        source: { type: "promptpay" },
      }),
    });

    const data = await res.json();
    console.log("DEBUG: Omise response =", data);

    if (!res.ok) {
      throw new Error("Omise API error: " + JSON.stringify(data));
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("ERROR in create-qr:", err.message || err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
