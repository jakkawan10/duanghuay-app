"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/useAuth";

type PredictionForm = {
  single: string;
  backup: string;
  double: string[];
  triple: string[];
  quad: string[];
  penta: string[];
};

export default function AdminPredictionPage() {
  const { god } = useParams<{ god: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const [formData, setFormData] = useState<PredictionForm>({
    single: "",
    backup: "",
    double: ["", ""],
    triple: ["", "", ""],
    quad: ["", "", "", ""],
    penta: ["", "", "", "", ""],
  });

  // ✅ โหลด role ของ user
  useEffect(() => {
    const checkRole = async () => {
      if (!user) return setIsAdmin(false);

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        router.push("/home"); // ❌ ไม่ใช่ admin → เด้งกลับ
      }
    };
    checkRole();
  }, [user, router]);

  // โหลดข้อมูลเก่าจาก Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (!god) return;
      const ref = doc(db, "predictions", god);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setFormData({
          single: data.oneDigit || "",
          backup: data.onePair || "",
          double: data.twoDigit ? data.twoDigit.split("") : ["", ""],
          triple: data.threeDigit ? data.threeDigit.split("") : ["", "", ""],
          quad: data.fourDigit ? data.fourDigit.split("") : ["", "", "", ""],
          penta: data.fiveDigit ? data.fiveDigit.split("") : ["", "", "", "", ""],
        });
      }
    };
    fetchData();
  }, [god]);

  const handleChange = (
    field: keyof PredictionForm,
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      if (Array.isArray(prev[field])) {
        const arr = [...(prev[field] as string[])];
        arr[index] = value;
        return { ...prev, [field]: arr };
      }
      return { ...prev, [field]: value as string };
    });
  };

  const handleSave = async () => {
    if (!god) return;
    setLoading(true);
    try {
      const ref = doc(db, "predictions", god);
      await setDoc(ref, {
        oneDigit: formData.single,
        onePair: formData.backup,
        twoDigit: formData.double.join(""),
        threeDigit: formData.triple.join(""),
        fourDigit: formData.quad.join(""),
        fiveDigit: formData.penta.join(""),
        updatedAt: serverTimestamp(),
      });
      toast.success("บันทึกเลขเด็ดเรียบร้อยแล้ว");
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  // 🟡 ถ้ายังโหลด role อยู่ → แสดงกำลังโหลด
  if (isAdmin === null) {
    return <div className="p-6 text-center">กำลังตรวจสอบสิทธิ์...</div>;
  }

  // ❌ ถ้าไม่ใช่ admin → แสดงข้อความ (กัน fallback)
  if (!isAdmin) {
    return <div className="p-6 text-center">คุณไม่มีสิทธิ์เข้าหน้านี้</div>;
  }

  // ✅ Admin เท่านั้น → render ฟอร์ม
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-xl font-bold mb-6">แก้ไขตัวเลขของ {god}</h1>

      {/* วิ่งโดดตัวเดียว */}
      <label className="block mb-1">วิ่งโดดตัวเดียว</label>
      <Input
        value={formData.single}
        onChange={(e) => handleChange("single", 0, e.target.value)}
        className="mb-4"
      />

      {/* ยิงเดี่ยวรอง */}
      <label className="block mb-1">ยิงเดี่ยวรอง</label>
      <Input
        value={formData.backup}
        onChange={(e) => handleChange("backup", 0, e.target.value)}
        className="mb-4"
      />

      {/* 2 ตัว */}
      <label className="block mb-1">เลข 2 ตัว</label>
      <div className="flex gap-2 mb-4">
        {formData.double.map((num, i) => (
          <Input
            key={i}
            value={num}
            onChange={(e) => handleChange("double", i, e.target.value)}
          />
        ))}
      </div>

      {/* 3 ตัว */}
      <label className="block mb-1">เลข 3 ตัว</label>
      <div className="flex gap-2 mb-4">
        {formData.triple.map((num, i) => (
          <Input
            key={i}
            value={num}
            onChange={(e) => handleChange("triple", i, e.target.value)}
          />
        ))}
      </div>

      {/* 4 ตัว */}
      <label className="block mb-1">เลข 4 ตัว</label>
      <div className="flex gap-2 mb-4">
        {formData.quad.map((num, i) => (
          <Input
            key={i}
            value={num}
            onChange={(e) => handleChange("quad", i, e.target.value)}
          />
        ))}
      </div>

      {/* 5 ตัว */}
      <label className="block mb-1">เลข 5 ตัว</label>
      <div className="flex gap-2 mb-6">
        {formData.penta.map((num, i) => (
          <Input
            key={i}
            value={num}
            onChange={(e) => handleChange("penta", i, e.target.value)}
          />
        ))}
      </div>

      <Button onClick={handleSave} disabled={loading} className="w-full">
        {loading ? "กำลังบันทึก..." : "บันทึกเลขเด็ด"}
      </Button>
    </div>
  );
}
