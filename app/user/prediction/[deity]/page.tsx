'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import Image from 'next/image'

export default function UserPredictionPage() {
  const { deity } = useParams()
  const [data, setData] = useState({
    oneDigit: '', onePair: '', twoDigit: '',
    threeDigit: '', fourDigit: '', fiveDigit: '',
  })

  useEffect(() => {
    if (!deity || typeof deity !== 'string') return

    const ref = doc(db, deity, getTodayKey())
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) setData(snap.data() as typeof data)
    })
    return () => unsubscribe()
  }, [deity])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6">
      <Image
        src={`/images/${deity}.png`}
        alt="ไม่มีผลคำทำนาย"
        width={300}
        height={300}
        className="rounded-2xl shadow-xl mb-6"
      />
      <div className="space-y-4 text-xl font-medium text-center">
        <div>1 ตัวเน้น: <strong>{data.oneDigit || '-'}</strong></div>
        <div>2 ตัวเด่นตัววน: <strong>{data.onePair || '-'}</strong></div>
        <div>2 ตัวเน้น: <strong>{data.twoDigit || '-'}</strong></div>
        <div>3 ตัวเน้นสุด: <strong>{data.threeDigit || '-'}</strong></div>
        <div>4 ตัววิเศษ: <strong>{data.fourDigit || '-'}</strong></div>
        <div>5 ตัวศักดิ์สิทธิ์: <strong>{data.fiveDigit || '-'}</strong></div>
      </div>
    </div>
  )
}

function getTodayKey() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
