import { NextResponse } from "next/server";

// Helper: encode key เป็น Basic Auth
function getAuthHeader() {
  const key = process.env.OMISE_SECRET_KEY || "";
  return "Basic " + Buffer.from(key + ":").toString("base64");
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "missing userId" }, { status: 400 });
    }

    console.log("🔑 Using Secret Key:", process.env.OMISE_SECRET_KEY?.slice(0, 6));

    // ✅ สร้าง Source
    const sourceRes = await fetch("https://api.omise.co/sources", {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 29900, // 299 บาท
        currency: "thb",
        type: "promptpay",
      }),
    });

    const source = await sourceRes.json();
    console.log("✅ Source response:", source);

    if (sourceRes.status !== 200) {
      return NextResponse.json(
        { error: "create source failed", detail: source },
        { status: 500 }
      );
    }

    // ✅ สร้าง Charge
    const chargeRes = await fetch("https://api.omise.co/charges", {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 29900,
        currency: "thb",
        source: source.id,
        metadata: { userId, session: "tipyalek" },
      }),
    });

    const charge = await chargeRes.json();
    console.log("✅ Charge response:", charge);

    if (chargeRes.status !== 200) {
      return NextResponse.json(
        { error: "create charge failed", detail: charge },
        { status: 500 }
      );
    }

    const qrImage = charge?.source?.scannable_code?.image?.download_uri || null;

    return NextResponse.json({
      chargeId: charge.id,
      qr: qrImage,
    });
  } catch (err: any) {
    console.error("❌ Payment error:", err);
    return NextResponse.json(
      { error: "payment failed", detail: err.message },
      { status: 500 }
    );
  }
}
