"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/lib/hooks/useAuth";

export default function TipyalekPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateQR = async () => {
    if (!user) {
      setError("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    setLoading(true);
    setError(null);
    setQrUrl(null);

    try {
      const res = await fetch("/api/payments/qr-tipyalek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      });

      if (!res.ok) {
        throw new Error("สร้าง QR ไม่สำเร็จ");
      }

      const data = await res.json();
      setQrUrl(data.qr); // 🟢 ได้ทั้ง QR จริงและ QR ปลอม
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md border-2 border-yellow-500 shadow-lg">
        <CardHeader>
          <h2 className="text-xl font-bold text-yellow-700 text-center">
            ซื้อสิทธิ์องค์ทิพยเลข
          </h2>
          <p className="text-center text-sm text-gray-600">
            299 บาท / 1 ชั่วโมง
          </p>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4">
          {loading && <p className="text-gray-500">กำลังสร้าง QR...</p>}
          {error && <p className="text-red-500">❌ {error}</p>}
          {qrUrl && (
            <div className="flex flex-col items-center">
              <p className="mb-2 text-sm text-gray-600">สแกนเพื่อจ่ายเงิน</p>
              <img src={qrUrl} alt="QR Code" className="w-64 h-64 border rounded-lg" />
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleCreateQR}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white w-full"
          >
            {loading ? "กำลังสร้าง..." : "สร้าง QR สำหรับชำระเงิน"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
