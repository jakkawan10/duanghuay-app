// /app/api/payments/webhook/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import * as admin from "firebase-admin";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("📩 Webhook payload:", JSON.stringify(payload));

    // สนใจเฉพาะ charge.complete เท่านั้น
    if (payload?.object === "event" && payload?.key === "charge.complete") {
      const charge = payload?.data;
      const chargeId: string | undefined = charge?.id;
      const status: string | undefined = charge?.status;

      if (status === "successful" && chargeId) {
        const start = new Date();
        const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 ชม.

        // แนะนำ: ถ้าเราใส่ metadata.sessionId ตอน create-qr จะอัปเดตได้ตรงๆ เร็วกว่า
        const sessionIdFromMeta: string | undefined = charge?.metadata?.sessionId;

        if (sessionIdFromMeta) {
          await adminDb.collection("sessions").doc(sessionIdFromMeta).set(
            {
              status: "active",
              startTime: start,
              endTime: end,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
          console.log("✅ Session updated by metadata:", sessionIdFromMeta);
          return NextResponse.json({ received: true, sessionId: sessionIdFromMeta });
        }

        // กรณีไม่มี sessionId ใน metadata → fallback ค้นหาด้วย chargeId
        const snap = await adminDb
          .collection("sessions")
          .where("chargeId", "==", chargeId)
          .get();

        if (snap.empty) {
          console.warn("⚠️ No session found for chargeId:", chargeId);
        } else {
          const batch = adminDb.batch();
          snap.forEach((docSnap) => {
            batch.set(
              docSnap.ref,
              {
                status: "active",
                startTime: start,
                endTime: end,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          });
          await batch.commit();
          console.log("✅ Sessions updated by chargeId:", chargeId, "count:", snap.size);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook error:", err);
    return NextResponse.json({ error: err?.message || "webhook failed" }, { status: 500 });
  }
}
