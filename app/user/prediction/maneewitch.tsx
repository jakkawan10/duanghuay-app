'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import Image from 'next/image'

export default function ManeewitchPage() {
  const [data, setData] = useState({
    oneDigit: '',
    onePair: '',
    twoDigit: '',
    threeDigit: '',
    fourDigit: '',
    fiveDigit: '',
  })

  useEffect(() => {
    const ref = doc(db, 'predictions', 'maneewitch', getTodayKey())
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) setData(snap.data() as typeof data)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6">
      <Image
        src="/images/maneewitch.png"
        alt="เจ้ามณีเวทยมนต์"
        width={300}
        height={300}
        className="rounded-2xl shadow-xl mb-6"
      />
      <div className="space-y-4 text-xl font-medium text-center">
        <div>วิ่งโดดตัวเดียว: <strong>{data.oneDigit || '-'}</strong></div>
        <div>ยิงเดี่ยวรอง: <strong>{data.onePair || '-'}</strong></div>
        <div>2 ตัวเทพมณี: <strong>{data.twoDigit || '-'}</strong></div>
        <div>3 ตัวขลังเวทย์: <strong>{data.threeDigit || '-'}</strong></div>
        <div>4 ตัวลึกลับ: <strong>{data.fourDigit || '-'}</strong></div>
        <div>5 ตัวประทานพร: <strong>{data.fiveDigit || '-'}</strong></div>
      </div>
    </div>
  )
}

function getTodayKey() {
  const now = new Date()
  const day = now.getDate().toString().padStart(2, '0')
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const year = now.getFullYear()
  return `${year}-${month}-${day}`
}
