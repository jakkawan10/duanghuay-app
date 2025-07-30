import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return redirect("/auth");
  }

  const uid = session.user.uid;
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  const data = userSnap.data();
  const step1 = data?.step1Done;
  const step2 = data?.step2Done;
  const step3 = data?.step3Done;

  // เช็คว่าทำครบ 3 ขั้นหรือยัง
  if (!step1) return redirect("/step1");
  if (!step2) return redirect("/step2");
  if (!step3) return redirect("/step3");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">🎉 ยินดีต้อนรับ VIP!</h1>
      <p className="mt-4 text-green-600">ตอนนี้คุณสามารถเข้าถึงฟีเจอร์วิเคราะห์เลขเด็ดได้แล้ว!</p>
    </main>
  );
}
