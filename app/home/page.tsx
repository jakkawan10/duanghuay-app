// /app/home/page.tsx (updated to handle deity selection)
'use client'

import { useRouter } from 'next/navigation'
import { chooseDeity } from '@/app/actions/chooseDeity'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const deities = [
  { id: 'sroiboon', label: 'เจ้าแม่สร้อยบุญ', color: 'bg-pink-100' },
  { id: 'saifah', label: 'เจ้าแม่สายฟ้า', color: 'bg-blue-100' },
  { id: 'intree', label: 'เจ้าพ่ออินทรีเหล็ก', color: 'bg-yellow-100' },
  { id: 'samdaeng', label: 'เจ้าแม่สามแดงฤทธิ์', color: 'bg-green-100' }
]

export default function HomePage() {
  const router = useRouter()
  const [uid, setUid] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid)
      }
    })
    return () => unsub()
  }, [])

  const handleChoose = async (id: string) => {
    if (!uid) return alert('กรุณาเข้าสู่ระบบก่อนใช้งาน')
    const ok = confirm(`ยืนยันเลือกเทพฟรี: ${id} ?`)
    if (!ok) return
    await chooseDeity(id)
    router.push(`/fortune/deity/${id}`)
  }

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      <p className="col-span-2 text-center text-md text-gray-600">
        คุณเลือกได้ฟรีเพียง 1 เทพ หากต้องการดูเทพเพิ่ม กรุณาสมัคร VIP
      </p>
      {deities.map((deity) => (
        <button
          key={deity.id}
          onClick={() => handleChoose(deity.id)}
          className={`w-full p-5 rounded-xl shadow hover:scale-105 transition text-center ${deity.color}`}
        >
          🧘 {deity.label}
        </button>
      ))}
      <button
        onClick={() => router.push('/fortune/ai')}
        className="bg-gradient-to-r from-yellow-400 to-red-400 w-full p-6 rounded-xl text-white font-bold text-center shadow"
      >
        🤖 เทพ AI เลขเด็ดสุดล้ำ
      </button>
    </main>
  )
}
