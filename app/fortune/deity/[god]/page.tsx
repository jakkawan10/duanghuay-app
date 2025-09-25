'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'

const defaultData = {
  oneDigit: '',
  onePair: '',
  twoDigit: '',
  threeDigit: '',
  fourDigit: '',
  fiveDigit: '',
}

export default function DeityPredictionPage() {
  const { god } = useParams() as { god: string }
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!god) return

    const loadData = async () => {
      try {
        const now = new Date()
        const month = `${now.getMonth() + 1}`.padStart(2, '0')
        const year = now.getFullYear()
        const date = `${now.getDate()}`.padStart(2, '0')

        // ใช้วันที่จริง เช่น 2025-09-25
        const roundKey = `${year}-${month}-${date}`

        const ref = doc(db, "predictions", god, "dates", roundKey)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setData(snap.data() as typeof defaultData)
        } else {
          setData(defaultData)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [god])

  if (loading) return <p className="text-center mt-10">⏳ กำลังโหลด...</p>

  if (!data.oneDigit && !data.onePair) {
    return <p className="text-center text-red-500 mt-10">❌ ไม่พบข้อมูล</p>
  }

  const now = new Date()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const year = now.getFullYear()
  const date = `${now.getDate()}`.padStart(2, '0')
  const roundKey = `${year}-${month}-${date}`

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-start pt-6 px-4">
      <h1 className="text-2xl font-bold mb-2">เลขเด็ดงวด {roundKey}</h1>

      <Image
        src={`/images/${god}.png`}
        alt={god}
        width={300}
        height={300}
        className="mb-4"
      />

      <div className="bg-white text-black p-4 rounded-xl w-full max-w-md">
        <p>1 ตัวตรงตัวเดียว</p>
        <input disabled value={data.oneDigit} className="w-full bg-gray-100 rounded p-2 mb-2" />

        <p>1 ตัวเด่นรอบ</p>
        <input disabled value={data.onePair} className="w-full bg-gray-100 rounded p-2 mb-2" />

        <p>2 ตัวเป้า</p>
        <input disabled value={data.twoDigit} className="w-full bg-gray-100 rounded p-2 mb-2" />

        <p>3 ตัวแม่</p>
        <input disabled value={data.threeDigit} className="w-full bg-gray-100 rounded p-2 mb-2" />

        <p>4 ตัวมหารวย</p>
        <input disabled value={data.fourDigit} className="w-full bg-gray-100 rounded p-2 mb-2" />

        <p>5 ตัวราชา</p>
        <input disabled value={data.fiveDigit} className="w-full bg-gray-100 rounded p-2 mb-4" />

        <Link href="/home">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black rounded p-2 w-full mt-2">
            🔮 กลับสู่หน้าเทพพาทายดวง
          </button>
        </Link>
      </div>
    </div>
  )
}
