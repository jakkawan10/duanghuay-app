"use client";
import { useState } from "react";

export default function TipyaLekPage() {
  const [loading, setLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateQR = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/payments/qr-tipyalek", {
        method: "POST",
        body: JSON.stringify({ userId: "demo_user" }),
      });

      const data = await res.json();
      if (res.ok) {
        setQrUrl(data.qr); // ✅ เก็บ URL QR จาก backend
      } else {
        setError(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err: any) {
      setError("ไม่สามารถสร้าง QR ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-center mb-2">
        ซื้อสิทธิ์คุยกับองค์ทิพยเลข
      </h2>
      <p className="text-center mb-4">299 บาท / 1 ชั่วโมง</p>

      {loading && <p className="text-center">กำลังสร้าง QR...</p>}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {qrUrl && (
        <div className="flex justify-center mb-4">
          <img src={qrUrl} alt="QR Code" className="w-48 h-48 border rounded-lg" />
        </div>
      )}

      <div className="flex justify-center gap-2">
        <button
          onClick={handleCreateQR}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          สร้าง QR สำหรับชำระเงิน
        </button>
      </div>
    </div>
  );
}
