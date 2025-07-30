'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/home') // ✅ ชี้ไปหน้าใหม่ที่มีอยู่จริง เช่น /home
    } catch (err: any) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-blue-400">
      <div className="bg-white/10 border border-white/30 p-8 rounded-xl w-full max-w-md text-center shadow-xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">เข้าสู่ระบบ</h1>
        <p className="text-black mb-6">เข้าสู่โลกแห่งดวงและเลขเด็ด</p>
        <input
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-3 rounded-lg border"
        />
        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-3 rounded-lg border"
        />
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold"
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
        <p className="mt-4 text-sm text-black">
          ยังไม่มีบัญชี?{' '}
          <a href="/register" className="text-yellow-400 underline">
            สมัครสมาชิก
          </a>
        </p>
      </div>
    </div>
  )
}
