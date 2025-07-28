'use client'

import { useState } from 'react'

export default function AiLuckyPage() {
  const [luckyNumbers, setLuckyNumbers] = useState<number[] | null>(null)
  const [loading, setLoading] = useState(false)

  const generateLuckyNumbers = () => {
    setLoading(true)
    // สุ่มเลข 6 ตัวระหว่าง 1-99 ไม่ซ้ำ
    const nums = Array.from({ length: 6 }, () => Math.floor(Math.random() * 99) + 1)
    const unique = [...new Set(nums)]
    setTimeout(() => {
      setLuckyNumbers(unique)
      setLoading(false)
    }, 1500) // จำลองรอ AI
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 text-center px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">เลขเด็ด AI ประจำวันนี้</h1>

      {loading ? (
        <p className="text-lg text-gray-500">🧠 กำลังวิเคราะห์...</p>
      ) : luckyNumbers ? (
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {luckyNumbers.map((num, i) => (
            <div
              key={i}
              className="w-16 h-16 flex items-center justify-center text-xl font-bold rounded-full bg-red-500 text-white shadow"
            >
              {num}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-2">กดปุ่มด้านล่างเพื่อเริ่ม</p>
      )}

      <button
        onClick={generateLuckyNumbers}
        className="mt-10 px-6 py-3 bg-green-600 text-white rounded-lg text-lg shadow hover:bg-green-700"
      >
        เรียกเลขเด็ดจาก AI 🔮
      </button>
    </div>
  )
}

