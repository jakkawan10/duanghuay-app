import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("📩 Webhook received:", JSON.stringify(payload));

    // ✅ สนใจเฉพาะ charge.completed
    if (payload.object === "event" && payload.key === "charge.complete") {
      const charge = payload.data;

      if (charge.status === "successful") {
        const chargeId = charge.id;

        // หา session ที่ chargeId ตรงกัน
        const q = query(collection(db, "sessions"), where("chargeId", "==", chargeId));
        const snap = await getDocs(q);

        if (!snap.empty) {
          for (const docSnap of snap.docs) {
            const sessionRef = doc(db, "sessions", docSnap.id);

            const start = new Date();
            const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 ชั่วโมง

            await updateDoc(sessionRef, {
              status: "active",
              startTime: start,
              endTime: end,
            });

            console.log("✅ Session updated:", docSnap.id);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
