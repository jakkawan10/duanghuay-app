"use client";

import { useState } from "react";

export default function TipyaLekPage() {
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createQR = async () => {
    setLoading(true);
    setError(null);
    setQr(null);

    try {
      const res = await fetch("/api/payments/qr-tipyalek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "mock-user" }), // เปลี่ยนเป็น userId จริงภายหลัง
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "สร้าง QR ไม่สำเร็จ");

      setQr(data.qr);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-center">
        <h2 className="text-xl font-bold mb-4">
          ซื้อสิทธิ์คุยกับองค์ทิพยเลข
        </h2>
        <p className="mb-4">299 บาท / 1 ชั่วโมง</p>

        {loading && <p className="text-blue-500">กำลังสร้าง QR...</p>}
        {error && <p className="text-red-500">❌ {error}</p>}

        {/* แสดง QR */}
        {qr && (
          <div className="flex justify-center mb-4">
            <img src={qr} alt="QR Code" className="w-48 h-48" />
          </div>
        )}

        <button
          onClick={createQR}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
        >
          สร้าง QR สำหรับชำระเงิน
        </button>
      </div>
    </div>
  );
}
