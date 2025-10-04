import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    console.log("📩 Omise Webhook payload:", payload);

    // ✅ สนใจเฉพาะ charge.completed
    if (payload.object === "event" && payload.key === "charge.complete") {
      const charge = payload.data;

      if (charge.status === "successful") {
        const chargeId = charge.id;

        // หา session ที่ chargeId ตรงกัน
        const snap = await adminDb
          .collection("sessions")
          .where("chargeId", "==", chargeId)
          .get();

        if (!snap.empty) {
          for (const doc of snap.docs) {
            const ref = adminDb.collection("sessions").doc(doc.id);

            const start = new Date();
            const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 ชั่วโมง

            await ref.update({
              status: "active",
              startTime: start,
              endTime: end,
              updatedAt: new Date(),
            });

            console.log("✅ Session updated:", doc.id);
          }
        } else {
          console.warn("⚠️ No session found for chargeId:", chargeId);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
