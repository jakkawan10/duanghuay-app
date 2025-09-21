'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { db } from '@/lib/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore'
import { useAuth } from '@/lib/hooks/useAuth';
import Image from 'next/image'

const deities = [
  {
    id: 'sroiboon',
    name: 'เจ้าแม่สร้อยบุญ',
    desc: 'เทพแห่งการเปิดทางและความโชคดี',
    img: '/images/deities/sroiboon.png',
  },
  {
    id: 'maneewitch',
    name: 'เจ้ามณีเวทยมนต์',
    desc: 'ผู้หยั่งรู้อนาคตจากเวทมนต์ลี้ลับ',
    img: '/images/deities/maneewitch.png',
  },
  {
    id: 'intra',
    name: 'เจ้าองค์อินทร์แสนดี',
    desc: 'เทพแห่งความเมตตาและความยุติธรรม',
    img: '/images/deities/intra.png',
  },
  {
    id: 'dandok',
    name: 'เจ้าแม่ดานดอกษ์ศ์',
    desc: 'ผู้หยั่งรู้โชคชะตาในดอกไม้ทั้งห้า',
    img: '/images/deities/dandok.png',
  },
]

export default function SelectDeityPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSelect = async (deityId: string) => {
    if (!user?.uid) return toast.error('กรุณาเข้าสู่ระบบ')

    setLoading(true)

    try {
      const ref = doc(db, 'users', user.uid)
      await setDoc(ref, {
        selectedDeity: deityId,
        tier: 'free', // ได้สิทธิ์เบิกญาณฟรีจากเทพที่เลือก
      }, { merge: true })

      toast.success('เลือกเทพเบิกญาณสำเร็จ!')
      router.push('/home') // ส่งไปหน้า Home ถัดไป
    } catch (err) {
      console.error(err)
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">เลือกเทพเบิกญาณ</h1>

      {deities.map((deity) => (
        <div key={deity.id} className="border p-4 rounded-xl shadow bg-white">
          <div className="flex items-center gap-4">
            <Image
              src={deity.img}
              alt={deity.name}
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <h2 className="text-xl font-semibold">{deity.name}</h2>
              <p className="text-sm text-gray-600">{deity.desc}</p>
            </div>
          </div>

          <Button
            disabled={loading}
            onClick={() => handleSelect(deity.id)}
            className="mt-4 w-full"
          >
            เลือก {deity.name}
          </Button>
        </div>
      ))}
    </div>
  )
}
