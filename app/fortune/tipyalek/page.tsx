"use client";

import { useState } from "react";

export default function TipyaLekPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/tipyalek", { method: "POST" });
      if (!res.ok) {
        throw new Error("API request failed");
      }
      const data = await res.json();
      setResult(data.message || "❌ ไม่มีผลลัพธ์");
    } catch (err) {
      console.error("Error:", err);
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-yellow-400 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-4">✨ องค์ทิพยเลข ✨</h1>
      <img
        src="/images/tipyalek.png"
        alt="องค์ทิพยเลข"
        className="w-40 h-40 mb-6 rounded-full border-4 border-yellow-500 shadow-lg"
      />
      <p className="mb-6 text-center text-lg max-w-xl">
        ผู้ประทานโชคจากการคำนวณสถิติจริงและพลัง AI อันชาญฉลาด
      </p>

      <button
        onClick={handlePredict}
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? "กำลังคำนวณ..." : "🔮 ทำนายเลขเด็ด"}
      </button>

      {/* แสดงผลลัพธ์ */}
      {result && (
        <div className="mt-8 p-6 bg-gray-900 rounded-xl w-full max-w-lg text-center shadow-lg">
          <h2 className="font-bold text-xl mb-3">ผลการทำนาย</h2>
          <p className="text-lg whitespace-pre-line">{result}</p>
        </div>
      )}

      {/* แสดง error */}
      {error && (
        <div className="mt-6 text-red-400 font-semibold">{error}</div>
      )}
    </div>
  );
}
