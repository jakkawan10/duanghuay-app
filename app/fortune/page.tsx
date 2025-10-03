"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/lib/hooks/useAuth";

export default function TipyalekPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const checkAccess = async () => {
      try {
        const ref = doc(db, "users", user.uid, "sessions", "tipyalek");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const d = snap.data();
          const now = Date.now();
          const expire = d.expireAt?.toMillis?.() ?? 0;

          if (d.status === "active" && expire > now) {
            setAllowed(true);
          } else {
            router.push("/home");
            alert("สิทธิ์หมดอายุ กรุณาชำระเงินใหม่");
          }
        } else {
          router.push("/home");
          alert("คุณยังไม่ได้ชำระสิทธิ์เข้าใช้งานองค์ทิพยเลข");
        }
      } catch (e) {
        console.error(e);
        router.push("/home");
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, router]);

  if (loading) {
    return <div className="p-6 text-center">กำลังตรวจสอบสิทธิ์...</div>;
  }

  if (!allowed) return null;

  return (
    <div className="p-6">
      <h1 className="text-center text-2xl font-bold mb-6">
        ✨ ห้องสนทนา องค์ทิพยเลข ✨
      </h1>
      {/* เนื้อหาห้องสนทนาจริง */}
    </div>
  );
}
