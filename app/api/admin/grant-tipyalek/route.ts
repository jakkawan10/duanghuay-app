import { NextResponse } from "next/server";
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // ใช้ client SDK ของ Firestore

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "missing email" }, { status: 400 });
    }

    const firestore = getFirestore();

    // 🔍 ค้นหาผู้ใช้ที่มีอีเมลตรงกับที่กรอก
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    // ✅ เจอผู้ใช้
    const userDoc = querySnapshot.docs[0];
    const uid = userDoc.id;

    // 🔹 บันทึกหรืออัปเดตสิทธิ์ใน payments/{uid}
    const paymentRef = doc(firestore, "payments", uid);
    const startTime = new Date().toISOString();

    await setDoc(paymentRef, {
      status: "paid",
      package: "tipyalek",
      startTime,
    });

    console.log(`✅ Granted TipyaLek access to ${email} (uid: ${uid})`);

    return NextResponse.json({
      success: true,
      message: `Granted access to ${email}`,
      uid,
      startTime,
    });
  } catch (error: any) {
    console.error("❌ Error granting TipyaLek access:", error);
    return NextResponse.json({ error: error.message || "unknown error" }, { status: 500 });
  }
}
