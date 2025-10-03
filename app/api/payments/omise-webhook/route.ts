import { NextRequest, NextResponse } from "next/server";
import Omise from "omise";
import { adminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase/firestore";

const omise = Omise({ secretKey: process.env.OMISE_SECRET_KEY! });

// *** Omise จะส่ง Event มา เราจะดึง event.id -> call API ย้อนกลับเพื่อ verify ***
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // โครงสร้าง event: { id: 'evt_*', key: 'event', data: {...}, ... }
    const eventId = payload?.id;
    if (!eventId) {
      return NextResponse.json({ ok: true });
    }

    const event = await omise.events.retrieve(eventId);
    // สนใจ event "charge.complete"
    if (event.key === "event" && event.data?.object === "charge") {
      const charge = event.data;
      const chargeId = charge.id as string;
      const status = charge.status as string;

      // อัปเดตสถานะ payments
      const payRef = adminDb.collection("payments").doc(chargeId);
      const paySnap = await payRef.get();
      if (!paySnap.exists) {
        // ไม่รู้จักออเดอร์เรา แต่เพื่อความปลอดภัย log ไว้
        console.warn("Webhook: payment not found", chargeId);
        return NextResponse.json({ ok: true });
      }

      await payRef.update({
        status,
        updatedAt: Timestamp.now(),
      });

      if (status === "successful") {
        const userId = charge.metadata?.userId as string;
        const product = charge.metadata?.product as string;

        if (product === "tipyalek" && userId) {
          // สร้าง session 60 นาที
          const now = new Date();
          const end = new Date(now.getTime() + 60 * 60 * 1000);

          await adminDb.collection("sessions").add({
            userId,
            deity: "tipyalek",
            status: "active",
            amount: 299,
            startTime: Timestamp.fromDate(now),
            endTime: Timestamp.fromDate(end),
            createdAt: Timestamp.now(),
          });

          // (ออปชั่น) ส่ง notification/inbox ให้ user ทราบสิทธิ์พร้อมใช้งาน
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("webhook error:", e);
    return NextResponse.json({ error: e.message || "webhook failed" }, { status: 500 });
  }
}
