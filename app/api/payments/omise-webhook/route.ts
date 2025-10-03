import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";

// 🚨 ต้องใช้ Secret Key ของ Omise
const OMISE_SECRET = process.env.OMISE_SECRET_KEY!;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Omise ส่ง event มา เช่น charge.complete
    const event = body.data || {};
    const chargeId = event.id;
    const status = event.status;
    const metadata = event.metadata || {};
    const userId = metadata.userId;
    const product = metadata.product;

    console.log("Webhook received:", { chargeId, status, userId, product });

    if (!userId || !product) {
      return NextResponse.json({ error: "Missing userId or product" }, { status: 400 });
    }

    if (status === "successful") {
      // ถ้าเป็น Tipyalek → เปิด session 1 ชั่วโมง
      if (product === "tipyalek") {
        const expireAt = Timestamp.fromMillis(Date.now() + 60 * 60 * 1000);

        await setDoc(
          doc(db, "users", userId, "sessions", "tipyalek"),
          {
            status: "active",
            expireAt,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      // 👉 เพิ่ม logic ถ้าเป็นแพ็กเกจ 4 เทพ (159/259/299)
      if (product.startsWith("god-")) {
        await setDoc(
          doc(db, "users", userId),
          {
            planTier: Number(product.replace("god-", "")),
            expireAt: Timestamp.fromMillis(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 วัน
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
