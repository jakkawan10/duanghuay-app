"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type PredictionForm = {
  single: string;     // วิ่งโดดตัวเดียว
  backup: string;     // ยิงเดี่ยวรอง
  double: string[];   // 2 ตัวเป้า
  triple: string[];   // 3 ตัววิน
  quad: string[];     // 4 ตัวรับทรัพย์
  penta: string[];    // 5 ตัวรวยไว
};

export default function AdminPredictionPage() {
  const { god } = useParams<{ god: string }>();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PredictionForm>({
    single: "",
    backup: "",
    double: ["", ""],
    triple: ["", "", ""],
    quad: ["", "", "", ""],
    penta: ["", "", "", "", ""],
  });

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

  // handleChange
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

  // save to Firestore (ใช้ field ตรงกับ Firestore จริง)
  const handleSave = async () => {
    if (!god) return;
    setLoading(true);
    try {
      const ref = doc(db, "predictions", god);
      await setDoc(ref, {
        oneDigit: formData.single,           // วิ่งโดดตัวเดียว
        onePair: formData.backup,            // ยิงเดี่ยวรอง
        twoDigit: formData.double.join(""),  // 2 ตัวเป้า
        threeDigit: formData.triple.join(""),// 3 ตัววิน
        fourDigit: formData.quad.join(""),   // 4 ตัวรับทรัพย์
        fiveDigit: formData.penta.join(""),  // 5 ตัวรวยไว
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
      <label className="block mb-1">ยิ่งเดี่ยวรอง</label>
      <Input
        value={formData.backup}
        onChange={(e) => handleChange("backup", 0, e.target.value)}
        className="mb-4"
      />

      {/* 2 ตัวเป้า */}
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

      {/* 3 ตัววิน */}
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

      {/* 4 ตัวรับทรัพย์ */}
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

      {/* 5 ตัวรวยไว */}
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
