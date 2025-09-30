"use client";

import { useState } from "react";

export default function TipyaLekPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "system", content: "✨ ยินดีต้อนรับสู่ห้องสนทนา องค์ทิพยเลข ✨" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tipyalek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ เกิดข้อผิดพลาด" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-yellow-400">
      {/* Header */}
      <header className="p-4 text-center border-b border-yellow-700">
        <h1 className="text-2xl font-bold">✨ ห้องสนทนา องค์ทิพยเลข ✨</h1>
      </header>

      {/* Chat */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-lg ${
              msg.role === "user" ? "ml-auto bg-yellow-600 text-black" : "mr-auto bg-gray-800"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <p className="text-center text-gray-400">กำลังพิมพ์...</p>}
      </main>

      {/* Input */}
      <footer className="p-4 border-t border-yellow-700 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 rounded-lg p-2 text-black"
          placeholder="พิมพ์ข้อความ..."
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600"
        >
          ส่ง
        </button>
      </footer>
    </div>
  );
}
