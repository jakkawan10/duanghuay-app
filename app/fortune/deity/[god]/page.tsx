'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

export default function FortunePage() {
  const { god } = useParams() as { god: string }
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 👉 ไปที่ /predictions/{god}/dates/ เอา document ล่าสุด
        const ref = collection(db, 'predictions', god, 'dates')
        const q = query(ref, orderBy('__name__', 'desc'), limit(1))
        const snap = await getDocs(q)

        if (!snap.empty) {
          setData(snap.docs[0].data())
        } else {
          setData(null)
        }
      } catch (e) {
        console.error(e)
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [god])

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">📿 คำทำนายจาก {god}</h1>

      {loading && <p>⏳ กำลังโหลด...</p>}
      {!loading && !data && <p className="text-red-500">❌ ไม่พบข้อมูล</p>}

      {data && (
        <div className="space-y-2">
          <p>1 ตัวตรง: {data.oneDigit}</p>
          <p>1 คู่: {data.onePair}</p>
          <p>2 ตัว: {Array.isArray(data.twoDigit) ? data.twoDigit.join(', ') : data.twoDigit}</p>
          <p>3 ตัว: {Array.isArray(data.threeDigit) ? data.threeDigit.join(', ') : data.threeDigit}</p>
          <p>4 ตัว: {Array.isArray(data.fourDigit) ? data.fourDigit.join(', ') : data.fourDigit}</p>
          <p>5 ตัว: {Array.isArray(data.fiveDigit) ? data.fiveDigit.join(', ') : data.fiveDigit}</p>
        </div>
      )}
    </div>
  )
}
