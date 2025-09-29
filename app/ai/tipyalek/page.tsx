"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDocs,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Message = {
  role: "user" | "assistant";
  content: string;
  createdAt: any;
};

export default function TipyaLekChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [expireAt, setExpireAt] = useState<Date | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // โหลด session ล่าสุด
  useEffect(() => {
    if (!user) return;
    const fetchSession = async () => {
      const q = query(
        collection(db, "users", user.uid, "ai_sessions"),
        where("status", "==", "active")
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const s = snap.docs[0];
        setSessionId(s.id);
        setExpireAt(s.data().expireAt?.toDate());
      } else {
        alert("ยังไม่มีสิทธิ์ใช้งาน กรุณาซื้อสิทธิ์ก่อน");
        router.push("/");
      }
    };
    fetchSession();
  }, [user, router]);

  // โหลดข้อความจาก Firestore realtime
  useEffect(() => {
    if (!sessionId || !user) return;
    const msgRef = collection(db, "users", user.uid, "ai_sessions", sessionId, "messages");
    const q = query(msgRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const msgs: Message[] = snap.docs.map((d) => d.data() as Message);
      setMessages(msgs);
    });
    return () => unsub();
  }, [sessionId, user]);

  // ตรวจเวลา expire
  const expired = expireAt ? new Date() > expireAt : false;
  const remainingMinutes = expireAt
    ? Math.max(0, Math.floor((expireAt.getTime() - Date.now()) / 60000))
    : 0;

  // ส่งข้อความ
  const sendMessage = async () => {
    if (!user || !sessionId || !input.trim() || expired) return;

    const msgRef = collection(db, "users", user.uid, "ai_sessions", sessionId, "messages");

    // เก็บข้อความ user
    await addDoc(msgRef, {
      role: "user",
      content: input.trim(),
      createdAt: serverTimestamp(),
    });

    const userMsg = input.trim();
    setInput("");

    // 🚀 เรียก API Route
    await fetch("/api/tipyalek", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.uid,
        sessionId,
        message: userMsg,
      }),
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 bg-yellow-700 text-white flex justify-between items-center">
        <h1 className="font-bold">องค์ทิพยเลข</h1>
        {expireAt && (
          <span className="text-sm">
            ⏳ เหลือเวลา {remainingMinutes} นาที
          </span>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[70%] ${
              m.role === "user"
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-yellow-200 text-gray-800"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        {expired ? (
          <div className="text-center text-red-600">
            ⏰ หมดเวลาการสนทนา หากต้องการคุยต่อ โปรดซื้อสิทธิ์ใหม่
          </div>
        ) : (
          <div className="flex space-x-2">
            <input
              className="flex-1 border rounded px-2 py-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์คำถามของคุณ..."
            />
            <Button onClick={sendMessage}>ส่ง</Button>
          </div>
        )}
      </div>
    </div>
  );
}
