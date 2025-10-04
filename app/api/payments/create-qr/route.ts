import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("DEBUG: Request body =", body);

    if (!process.env.OMISE_SECRET_KEY) {
      throw new Error("❌ Missing OMISE_SECRET_KEY");
    }

    // ✅ แปลงจากบาท → satang
    const amountInSatang = body.amount * 100;
    console.log("DEBUG: amount (baht) =", body.amount, " → (satang) =", amountInSatang);

    const res = await fetch("https://api.omise.co/charges", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(process.env.OMISE_SECRET_KEY + ":").toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInSatang,
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
