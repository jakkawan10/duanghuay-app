"use client";

import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function TipyaLekPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "system", content: "✨ ยินดีต้อนรับสู่ห้องสนทนา องค์ทิพยเลข ✨" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ ตรวจสิทธิ์จาก Firestore + จับเวลา
  useEffect(() => {
    const checkAccess = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if (!user) {
        setAllowed(false);
        return;
      }

      const docRef = doc(db, "payments", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === "paid" && data.startTime) {
          const startTime = new Date(data.startTime);
          const expireTime = new Date(startTime.getTime() + 60 * 60 * 1000); // ✅ หมดอายุใน 1 ชม.
          const now = new Date();

          if (now < expireTime) {
            setAllowed(true);
            setRemainingTime(Math.floor((expireTime.getTime() - now.getTime()) / 1000)); // วินาที
          } else {
            setAllowed(false);
          }
        } else {
          setAllowed(false);
        }
      } else {
        setAllowed(false);
      }
    };

    checkAccess();
  }, []);

  // ⏳ ตัวจับเวลานับถอยหลัง
  useEffect(() => {
    if (!remainingTime) return;
    const interval = setInterval(() => {
      setRemainingTime((prev) => (prev !== null ? prev - 1 : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingTime]);

  // ⚠️ เตือนก่อนหมดเวลา 10 นาที
  useEffect(() => {
    if (remainingTime === 600) {
      alert("⏳ เหลือเวลาอีก 10 นาที หากต้องการคุยต่อ กรุณาชำระเงินใหม่อีกครั้ง");
    }
    if (remainingTime === 0) {
      setAllowed(false);
      alert("❌ หมดเวลาแล้ว กรุณาชำระเงินใหม่เพื่อเข้าใช้งานต่อ");
    }
  }, [remainingTime]);

  // ระหว่างตรวจสอบสิทธิ์
  if (allowed === null) return <div className="text-center p-10">กำลังตรวจสอบสิทธิ์...</div>;

  // ❌ ยังไม่จ่าย หรือหมดเวลา
  if (!allowed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-yellow-400 text-center">
        <h2 className="text-xl font-bold mb-3">⚠️ ยังไม่ได้ชำระสิทธิ์ หรือสิทธิ์หมดเวลาแล้ว</h2>
        <p className="mb-4">กรุณาติดต่อผ่าน LINE เพื่อเปิดสิทธิ์ใหม่</p>
        <img
          src="/images/line-qr.png"
          alt="QR LINE"
          className="w-56 h-56 mb-4 rounded-lg border border-yellow-600"
        />
        <a
          href="https://line.me/ti/p/gKRMcAhruD"
          target="_blank"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          ติดต่อผ่าน LINE
        </a>
      </div>
    );
  }

  // ✅ ถ้าเข้าสิทธิ์ได้
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

  // 🕒 แปลงเวลาที่เหลือเป็นนาที
  const minutes = remainingTime ? Math.floor(remainingTime / 60) : 0;
  const seconds = remainingTime ? remainingTime % 60 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-black text-yellow-400">
      {/* Header */}
      <header className="p-4 text-center border-b border-yellow-700">
        <h1 className="text-2xl font-bold">✨ ห้องสนทนา องค์ทิพยเลข ✨</h1>
        <p className="text-sm text-gray-400 mt-1">
          เหลือเวลา {minutes}:{seconds.toString().padStart(2, "0")} นาที
        </p>
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
