'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function DeityPage({ params }: { params: { god: string } }) {
  const { god } = params
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'predictions', god))
        if (snap.exists()) setData(snap.data())
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [god])

  if (!data) return <p className="text-center text-red-500">❌ ไม่พบข้อมูล</p>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">คำทำนายจาก {god}</h1>
      <img src={`/images/${god}.png`} alt={god} className="mx-auto mb-4 w-60 rounded-xl shadow" />

      <p>วิ่งโดดตัวเดียว: {data.oneDigit}</p>
      <p>ยิงเดี่ยวรอง: {data.onePair}</p>
      <p>2 ตัวเป้า: {data.twoDigit?.join(' / ')}</p>
      <p>3 ตัว: {data.threeDigit?.join(' / ')}</p>
      <p>4 ตัว: {data.fourDigit?.join(' / ')}</p>
      <p>5 ตัว: {data.fiveDigit?.join(' / ')}</p>
    </div>
  )
}
