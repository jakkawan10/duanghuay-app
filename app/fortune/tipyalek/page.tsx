"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function TipyaLekPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 สวัสดี เราคือองค์ทิพยเลข ผู้ประมวลผลจากสถิติจริงและพลัง AI คุณอยากถามเรื่องเลขอะไร?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tipyalek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();
      const aiMessage: Message = {
        role: "assistant",
        content: data.message || "❌ ไม่สามารถตอบได้",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ เกิดข้อผิดพลาด กรุณาลองใหม่" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-yellow-400">
      {/* Header */}
      <div className="p-4 text-center border-b border-yellow-600">
        <h1 className="text-2xl font-bold">✨ องค์ทิพยเลข ✨</h1>
        <p className="text-sm text-gray-400">
          ผู้ประมวลผลจากสถิติจริงและพลัง AI
        </p>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-yellow-700 text-black"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="mr-auto p-3 rounded-lg bg-yellow-700 text-black">
            กำลังคิดเลขให้คุณ...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-yellow-600 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="พิมพ์คำถามของคุณ..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-white focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-bold disabled:opacity-50"
        >
          ส่ง
        </button>
      </div>
    </div>
  );
}
