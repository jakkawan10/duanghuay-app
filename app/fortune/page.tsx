"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/lib/hooks/useAuth";

export default function TipyalekPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    const checkAccess = async () => {
      try {
        const q = query(
          collection(db, "sessions"),
          where("userId", "==", user.uid),
          where("deity", "==", "tipyalek"),
          where("status", "==", "active")
        );

        const snap = await getDocs(q);

        if (!snap.empty) {
          // เจอ session ที่ active
          let valid = false;
          snap.forEach((doc) => {
            const d = doc.data();
            const expire = d.endTime?.toMillis?.() ?? 0;
            if (expire > Date.now()) {
              valid = true;
            }
          });

          if (valid) {
            setAllowed(true);
          } else {
            alert("สิทธิ์หมดอายุ กรุณาชำระเงินใหม่");
            router.replace("/home");
          }
        } else {
          alert("คุณยังไม่ได้ชำระสิทธิ์เข้าใช้งานองค์ทิพยเลข");
          router.replace("/home");
        }
      } catch (e) {
        console.error("Error checking access:", e);
        router.replace("/home");
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, router]);

  if (loading) return <div className="p-6 text-center">กำลังตรวจสอบสิทธิ์...</div>;
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
