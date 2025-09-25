"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";

type PredictionForm = {
  single: string;     // วิ่งโดดตัวเดียว
  backup: string;     // ยิงเดี่ยวรอง
  double: string[];   // 2 ตัวเป้า
  triple: string[];   // 3 ตัววิน
  quad: string[];     // 4 ตัวรับทรัพย์
  penta: string[];    // 5 ตัวรวยไว
};

const deityNames: Record<string, { name: string; desc: string }> = {
  sroiboon: {
    name: "เจ้าแม่สร้อยบุญ",
    desc: "ผู้ประทานโชคลาภและความมั่งมีศรีสุข",
  },
  maneewitch: {
    name: "เจ้ามณีเวทยมนต์",
    desc: "ผู้ครอบครองมนต์ศักดิ์สิทธิ์และพลังแห่งปัญญา",
  },
  intra: {
    name: "เจ้าองค์อินทร์แสนดี",
    desc: "ผู้ปกป้องคุ้มครองให้พ้นภัยอันตรายทั้งปวง",
  },
  dandok: {
    name: "เจ้าแม่ดานดอกษ์ศ์",
    desc: "ผู้มอบพลังแห่งความอุดมสมบูรณ์และความสำเร็จ",
  },
};

export default function DeityPage() {
  const { god } = useParams<{ god: string }>();

  const [formData, setFormData] = useState<PredictionForm>({
    single: "",
    backup: "",
    double: ["", ""],
    triple: ["", "", ""],
    quad: ["", "", "", ""],
    penta: ["", "", "", "", ""],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!god) return;
      const ref = doc(db, "predictions", god);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setFormData(snap.data() as PredictionForm);
      }
    };
    fetchData();
  }, [god]);

  const deity = deityNames[god] || { name: god, desc: "" };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6 text-center">
      {/* ชื่อเทพ */}
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">{deity.name}</h1>

      {/* ภาพเทพ */}
      <Image
        src={`/images/${god}.png`}
        alt={deity.name}
        width={400}
        height={400}
        className="mb-4 rounded-lg"
      />

      {/* คำบรรยาย */}
      <p className="text-gray-300 mb-8">{deity.desc}</p>

      {/* ช่องแสดงเลข (read-only) */}
      <div className="w-full max-w-md space-y-6 text-yellow-400">
        {/* วิ่งโดดตัวเดียว */}
        <div>
          <label className="block mb-1">วิ่งโดดตัวเดียว</label>
          <input
            type="text"
            value={formData.single}
            readOnly
            className="w-full border p-2 rounded bg-white text-black text-center"
          />
        </div>

        {/* ยิงเดี่ยวรอง */}
        <div>
          <label className="block mb-1">ยิ่งเดี่ยวรอง</label>
          <input
            type="text"
            value={formData.backup}
            readOnly
            className="w-full border p-2 rounded bg-white text-black text-center"
          />
        </div>

        {/* 2 ตัวเป้า */}
        <div>
          <label className="block mb-1">2 ตัวเป้า</label>
          <div className="grid grid-cols-2 gap-2">
            {formData.double.map((num, i) => (
              <input
                key={i}
                type="text"
                value={num}
                readOnly
                className="border p-2 rounded bg-white text-black text-center"
              />
            ))}
          </div>
        </div>

        {/* 3 ตัววิน */}
        <div>
          <label className="block mb-1">3 ตัววิน</label>
          <div className="grid grid-cols-3 gap-2">
            {formData.triple.map((num, i) => (
              <input
                key={i}
                type="text"
                value={num}
                readOnly
                className="border p-2 rounded bg-white text-black text-center"
              />
            ))}
          </div>
        </div>

        {/* 4 ตัวรับทรัพย์ */}
        <div>
          <label className="block mb-1">4 ตัวรับทรัพย์</label>
          <div className="grid grid-cols-4 gap-2">
            {formData.quad.map((num, i) => (
              <input
                key={i}
                type="text"
                value={num}
                readOnly
                className="border p-2 rounded bg-white text-black text-center"
              />
            ))}
          </div>
        </div>

        {/* 5 ตัวรวยไว */}
        <div>
          <label className="block mb-1">5 ตัวรวยไว</label>
          <div className="grid grid-cols-5 gap-2">
            {formData.penta.map((num, i) => (
              <input
                key={i}
                type="text"
                value={num}
                readOnly
                className="border p-2 rounded bg-white text-black text-center"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
