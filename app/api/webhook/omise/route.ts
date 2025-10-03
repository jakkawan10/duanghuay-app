import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

// ⚠️ ต้องไปตั้งค่า Webhook URL ใน Omise Dashboard
// เช่น https://duanghuay-app-seven.vercel.app/api/webhook/omise

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook Event:", body);

    if (body.object === "event" && body.key === "charge.complete") {
      const charge = body.data;

      if (charge.status === "successful") {
        const userId = charge.metadata?.userId;
        const session = charge.metadata?.session;

        if (userId && session) {
          // สร้างสิทธิ์ 1 ชั่วโมง
          const expireAt = new Date(Date.now() + 60 * 60 * 1000);

          await setDoc(doc(db, "users", userId, "sessions", session), {
            status: "active",
            expireAt,
            updatedAt: new Date(),
          });

          console.log(`✅ อัปเดตสิทธิ์ให้ user=${userId} session=${session}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
