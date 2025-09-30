"use client";

import { useState, useEffect, useRef } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function TipyaLekPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "🙏 สวัสดี ข้าคือองค์ทิพยเลข ผู้ทำนายโชคชะตา คุณอยากถามเรื่องใด?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // เลื่อนอัตโนมัติลงล่างเมื่อมีข้อความใหม่
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tipyalek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo-user", // จริงๆควรผูกกับ uid ของ auth
          message: newMessage.content,
        }),
      });

      const data = await res.json();
      const reply: ChatMessage = { role: "assistant", content: data.reply };

      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ เกิดข้อผิดพลาดในการติดต่อกับองค์ทิพยเลข" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-yellow-400">
      {/* Header */}
      <header className="p-4 text-center border-b border-yellow-700">
        <h1 className="text-2xl font-bold">✨ ห้องสนทนา องค์ทิพยเลข ✨</h1>
        <p className="text-sm text-yellow-500">
          สนทนาได้ต่อเนื่อง 1 ชั่วโมง (299 บาท)
        </p>
      </header>

      {/* Chat messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 text-yellow-300"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>

      {/* Input box */}
      <footer className="p-4 border-t border-yellow-700 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-yellow-300 border border-yellow-600 focus:outline-none"
          placeholder="พิมพ์ข้อความของคุณ..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-bold disabled:opacity-50"
        >
          {loading ? "..." : "ส่ง"}
        </button>
      </footer>
    </div>
  );
}
