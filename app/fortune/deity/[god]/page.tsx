'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'

// โครงสร้างข้อมูลเริ่มต้น
const defaultData = {
  oneDigit: [""],
  onePair: [""],
  twoDigit: ["", ""],
  threeDigit: ["", "", ""],
  fourDigit: ["", "", "", ""],
  fiveDigit: ["", "", "", "", ""],
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
        const day = now.getDate().toString().padStart(2, "0")
        const month = (now.getMonth() + 1).toString().padStart(2, "0")
        const year = now.getFullYear()
        const roundKey = `${year}-${month}-${day}`

        const ref = doc(db, "predictions", god, "dates", roundKey)
        const snap = await getDoc(ref)

        if (snap.exists()) {
          const snapData = snap.data()
          setData({
            oneDigit: snapData.oneDigit || [""],
            onePair: snapData.onePair || [""],
            twoDigit: snapData.twoDigit || ["", ""],
            threeDigit: snapData.threeDigit || ["", "", ""],
            fourDigit: snapData.fourDigit || ["", "", "", ""],
            fiveDigit: snapData.fiveDigit || ["", "", "", "", ""],
          })
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

  // ตรวจว่ามีข้อมูลจริงไหม
  const hasData =
    data.oneDigit.some((v) => v) ||
    data.onePair.some((v) => v) ||
    data.twoDigit.some((v) => v) ||
    data.threeDigit.some((v) => v) ||
    data.fourDigit.some((v) => v) ||
    data.fiveDigit.some((v) => v)

  if (!hasData) {
    return <p className="text-center text-red-500 mt-10">❌ ไม่พบข้อมูล</p>
  }

  const now = new Date()
  const day = now.getDate().toString().padStart(2, "0")
  const month = (now.getMonth() + 1).toString().padStart(2, "0")
  const year = now.getFullYear()
  const roundKey = `${year}-${month}-${day}`

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-start pt-6 px-4">
      <h1 className="text-2xl font-bold mb-2">เลขเด็ดงวด {roundKey}</h1>

      <Image
        src={`/images/${god}.png`}
        alt={god}
        width={300}
        height={300}
        className="mb-4 rounded-2xl shadow-lg"
      />

      <div className="bg-white text-black p-4 rounded-xl w-full max-w-md space-y-4">
        {/* 1 ตัวตรงตัวเดียว */}
        <div>
          <p>วิ่งโดดตัวเดียว</p>
          <div className="flex gap-2">
            {data.oneDigit.map((val, i) => (
              <input
                key={i}
                disabled
                value={val}
                className="w-12 bg-gray-100 text-center rounded p-2"
                maxLength={1}
              />
            ))}
          </div>
        </div>

        {/* 1 ตัวเด่นรอบ */}
        <div>
          <p>ยิงเดี่ยวรอง</p>
          <div className="flex gap-2">
            {data.onePair.map((val, i) => (
              <input
                key={i}
                disabled
                value={val}
                className="w-12 bg-gray-100 text-center rounded p-2"
                maxLength={1}
              />
            ))}
          </div>
        </div>

        {/* 2 ตัวเป้า */}
        <div>
          <p>2 ตัวเป้า</p>
          <div className="flex gap-2">
            {data.twoDigit.map((val, i) => (
              <input
                key={i}
                disabled
                value={val}
                className="w-12 bg-gray-100 text-center rounded p-2"
                maxLength={1}
              />
            ))}
          </div>
        </div>

        {/* 3 ตัวแม่ */}
        <div>
          <p>3 ตัวแม่</p>
          <div className="flex gap-2">
            {data.threeDigit.map((val, i) => (
              <input
                key={i}
                disabled
                value={val}
                className="w-12 bg-gray-100 text-center rounded p-2"
                maxLength={1}
              />
            ))}
          </div>
        </div>

        {/* 4 ตัวมหารวย */}
        <div>
          <p>4 ตัวมหารวย</p>
          <div className="flex gap-2">
            {data.fourDigit.map((val, i) => (
              <input
                key={i}
                disabled
                value={val}
                className="w-12 bg-gray-100 text-center rounded p-2"
                maxLength={1}
              />
            ))}
          </div>
        </div>

        {/* 5 ตัวรวยไว */}
        <div>
          <p>5 ตัวรวยไว</p>
          <div className="flex gap-2">
            {data.fiveDigit.map((val, i) => (
              <input
                key={i}
                disabled
                value={val}
                className="w-12 bg-gray-100 text-center rounded p-2"
                maxLength={1}
              />
            ))}
          </div>
        </div>

        <Link href="/home">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black rounded p-2 w-full mt-4">
            🔮 กลับสู่หน้าเทพพาทายดวง
          </button>
        </Link>
      </div>
    </div>
  )
}
