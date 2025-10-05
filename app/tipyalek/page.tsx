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
      setQrUrl(null);

      const res = await fetch("/api/payments/qr-tipyalek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "demo_user" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      if (data.qr) {
        setQrUrl(data.qr);
      } else {
        setError("ไม่พบ QR code จาก server");
      }
    } catch (err: any) {
      setError("เกิดข้อผิดพลาดระหว่างสร้าง QR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold mb-2">
        ซื้อสิทธิ์คุยกับองค์ทิพยเลข
      </h2>
      <p className="mb-4">299 บาท / 1 ชั่วโมง</p>

      {loading && <p className="text-gray-500">กำลังสร้าง QR...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {qrUrl && (
        <div className="flex justify-center mb-4">
          <img
            src={qrUrl}
            alt="QR Code"
            className="w-56 h-56 border rounded-lg shadow"
          />
        </div>
      )}

      <button
        onClick={handleCreateQR}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        สร้าง QR สำหรับชำระเงิน
      </button>
    </div>
  );
}
