"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/home");
    } catch (err: any) {
      setError("เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลหรือรหัสผ่าน");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-blue-400">
      <form
        onSubmit={handleLogin}
        className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl shadow-xl p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center text-yellow-300 mb-4">
          เข้าสู่ระบบ
        </h1>
        <p className="text-center text-white mb-6">
          เข้าสู่โลกแห่งดวงและเลขเด็ด
        </p>
        {error && <p className="text-red-600 text-center mb-3">{error}</p>}
        <input
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-3 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
        <button
          type="submit"
          className="w-full py-2 rounded bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold hover:opacity-90 transition"
        >
          เข้าสู่ระบบ
        </button>
        <p className="text-center mt-4 text-white">
          ยังไม่มีบัญชี?{" "}
          <a href="/register" className="underline text-yellow-300">
            สมัครสมาชิก
          </a>
        </p>
      </form>
    </div>
  );
}
