"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminPredictionPage() {
  const { god } = useParams();
  const [formData, setFormData] = useState({
    single: "",
    backup: "",
    double: ["", ""],
    triple: ["", "", ""],
    quad: ["", "", "", ""],
    penta: ["", "", "", "", ""],
  });

  useEffect(() => {
    const fetchData = async () => {
      const ref = doc(db, "predictions", god as string);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setFormData(snap.data() as any);
      }
    };
    fetchData();
  }, [god]);

  const handleChange = (field: string, index: number, value: string) => {
    setFormData((prev) => {
      if (Array.isArray(prev[field])) {
        const arr = [...prev[field]];
        arr[index] = value;
        return { ...prev, [field]: arr };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSave = async () => {
    const ref = doc(db, "predictions", god as string);
    await setDoc(ref, formData, { merge: true });
    alert("บันทึกสำเร็จ");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">แก้ไขตัวเลขของ {god}</h1>

      {/* วิ่งโดด + ยิงสำรอง */}
      <label className="block mb-2">วิ่งโดดตัวเดียว</label>
      <input
        value={formData.single}
        onChange={(e) => handleChange("single", 0, e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <label className="block mb-2">ยิงเดี่ยวรอง</label>
      <input
        value={formData.backup}
        onChange={(e) => handleChange("backup", 0, e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      {/* 2 ตัว */}
      <label className="block mb-2">เลข 2 ตัว</label>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {formData.double.map((v, i) => (
          <input
            key={i}
            value={v}
            onChange={(e) => handleChange("double", i, e.target.value)}
            className="border p-2 rounded"
          />
        ))}
      </div>

      {/* 3 ตัว */}
      <label className="block mb-2">เลข 3 ตัว</label>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {formData.triple.map((v, i) => (
          <input
            key={i}
            value={v}
            onChange={(e) => handleChange("triple", i, e.target.value)}
            className="border p-2 rounded"
          />
        ))}
      </div>

      {/* 4 ตัว */}
      <label className="block mb-2">เลข 4 ตัว</label>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {formData.quad.map((v, i) => (
          <input
            key={i}
            value={v}
            onChange={(e) => handleChange("quad", i, e.target.value)}
            className="border p-2 rounded"
          />
        ))}
      </div>

      {/* 5 ตัว */}
      <label className="block mb-2">เลข 5 ตัว</label>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {formData.penta.map((v, i) => (
          <input
            key={i}
            value={v}
            onChange={(e) => handleChange("penta", i, e.target.value)}
            className="border p-2 rounded"
          />
        ))}
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-teal-400 text-white py-2 rounded-lg"
      >
        บันทึก
      </button>
    </div>
  );
}
