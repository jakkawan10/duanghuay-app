'use client'

import { useParams } from 'next/navigation'

const godData: Record<string, { name: string, description: string }> = {
  sroiboon: {
    name: 'เจ้าแม่สร้อยบุญ',
    description: 'เทพแห่งความเมตตา ความรัก และการให้อภัย'
  },
  dandok: {
    name: 'เจ้าแม่ดานดอกษ์ศ์',
    description: 'เทพีแห่งดอกไม้และพลังธรรมชาติ ที่มีฤทธิ์สงบใจคน'
  },
  maneewitch: {
    name: 'เจ้ามณีเวทยมนต์',
    description: 'เทพแห่งเวทมนต์ คำทำนาย และพลังลี้ลับ'
  },
  intra: {
    name: 'เจ้าองค์อินทร์แสนดี',
    description: 'เทพผู้ปกป้อง ผู้เปี่ยมด้วยธรรมะและความยุติธรรม'
  },
}

export default function GodPage() {
  const params = useParams()
  const godKey = params?.god as string

  const god = godData[godKey]

  if (!god) {
    return <div className="p-4 text-red-500">ไม่พบเทพที่คุณเลือก</div>
  }

  return (
    <main className="min-h-screen bg-white text-black p-6">
      <h1 className="text-2xl font-bold mb-2">{god.name}</h1>
      <p className="text-lg mb-4">{god.description}</p>

      <button className="bg-yellow-400 px-4 py-2 rounded">
        🔮 เริ่มพิธีขอคำทำนาย
      </button>
    </main>
  )
}
