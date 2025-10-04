"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export default function TipyalekPage() {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateQR = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/create-qr", {
        method: "POST",
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      console.log("📌 API data:", data);

      if (data.qr) {
        setQrUrl(data.qr);
      } else {
        setError("❌ ไม่พบ QR จาก API");
      }
    } catch (err) {
      console.error("❌ สร้าง QR ล้มเหลว:", err);
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 border-2 border-yellow-500 shadow-lg">
      <CardHeader>
        <h2 className="text-xl font-bold text-yellow-700 text-center">
          ซื้อสิทธิ์คุยกับองค์ทิพยเลข
        </h2>
        <p className="text-center text-sm text-gray-500">299 บาท / 1 ชั่วโมง</p>
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-4">
        {loading && <p className="text-gray-500">⏳ กำลังสร้าง QR...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {qrUrl && (
          <div className="flex flex-col items-center">
            <img
              src={qrUrl}
              alt="QR สำหรับจ่ายเงิน"
              className="w-56 h-56 border rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-600 mt-2">
              สแกน QR นี้ด้วยแอปธนาคารเพื่อชำระเงิน
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button
          onClick={handleCreateQR}
          disabled={loading}
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          {loading ? "กำลังสร้าง QR..." : "สร้าง QR สำหรับจ่ายเงิน"}
        </Button>
      </CardFooter>
    </Card>
  );
}
