import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function HomeLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return redirect("/auth");
  }

  const uid = (session.user as { uid: string }).uid;
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  const data = userSnap.data();
  const step1 = data?.step1Done;
  const step2 = data?.step2Done;
  const step3 = data?.step3Done;

  // ห้ามเข้าหน้า home layout ถ้ายังทำ step ไม่ครบ
  if (!step1) return redirect("/step1");
  if (!step2) return redirect("/step2");
  if (!step3) return redirect("/step3");

  return <>{children}</>;
}
