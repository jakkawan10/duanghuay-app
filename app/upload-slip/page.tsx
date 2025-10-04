"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminDb } from "@/lib/firebaseAdmin";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";

export default function UploadSlipPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      router.push("/login");
      return;
    }

    if (!file) {
      alert("กรุณาเลือกไฟล์สลิปก่อน");
      return;
    }

    try {
      setLoading(true);

      // 🔹 อัปโหลดไฟล์ขึ้น Firebase Storage
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `slips/${user.uid}/${Date.now()}-${file.name}`
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // 🔹 บันทึกเข้า Firestore
      await addDoc(collection(db, "tipyalek_payment_requests"), {
        userId: user.uid,
        amount: 299,
        slipUrl: url,
        status: "pending", // admin จะมาเปลี่ยนเป็น approved/rejected
        createdAt: serverTimestamp(),
      });

      alert("อัปโหลดสลิปเรียบร้อย รอแอดมินตรวจสอบ");
      router.push("/home"); // กลับหน้า Home
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการอัปโหลดสลิป");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-xl font-bold mb-4 text-center">อัปโหลดสลิปการชำระเงิน</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <Button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        {loading ? "กำลังอัปโหลด..." : "ยืนยันการอัปโหลดสลิป"}
      </Button>
    </div>
  );
}
