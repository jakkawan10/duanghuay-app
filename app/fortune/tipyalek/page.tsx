"use client";

import { useState } from "react";

export default function TipyaLekPage() {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(null);
    setError(null);

    try {
      const res = await fetch("/api/tipyalek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const data = await res.json();
      setAnswer(data.message || "❌ ไม่มีคำตอบจากองค์ทิพยเลข");
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-yellow-400 flex flex-col items-center p-8">
      {/* หัวเรื่อง */}
      <h1 className="text-3xl font-bold mb-4">🔮 เทพองค์ทิพยเลข 🔮</h1>
      <img
        src="/images/tipyalek.png"
        alt="องค์ทิพยเลข"
        className="w-40 h-40 mb-6 rounded-full border-4 border-yellow-500 shadow-lg"
      />
      <p className="mb-6 text-center text-lg max-w-xl">
        ผู้ประทานเลขเด็ดจากการวิเคราะห์สถิติจริงผสานพลัง AI อันชาญฉลาด
      </p>

      {/* ช่องให้ผู้ใช้ถาม */}
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="พิมพ์คำถาม เช่น เลข 3 ตัวเด่นคืออะไร..."
        className="w-full max-w-lg p-4 rounded-lg border border-yellow-500 bg-black text-yellow-400 placeholder-gray-500 mb-4"
        rows={3}
      />

      {/* ปุ่มทำนาย */}
      <button
        onClick={handleAsk}
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? "กำลังถามองค์ทิพยเลข..." : "✨ ถามองค์ทิพยเลข"}
      </button>

      {/* แสดงคำตอบ */}
      {answer && (
        <div className="mt-8 p-6 bg-gray-900 rounded-xl w-full max-w-lg text-center shadow-lg">
          <h2 className="font-bold text-xl mb-3">คำตอบจากองค์ทิพยเลข</h2>
          <p className="text-lg whitespace-pre-line">{answer}</p>
        </div>
      )}

      {/* แสดง error */}
      {error && (
        <div className="mt-6 text-red-400 font-semibold">{error}</div>
      )}
    </div>
  );
}
