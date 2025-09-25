'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

const defaultData = {
  oneDigit: '',
  onePair: '',
  twoDigit: ['', ''],
  threeDigit: ['', '', ''],
  fourDigit: ['', '', '', ''],
  fiveDigit: ['', '', '', '', '']
}

export default function DeityPage() {
  const { god } = useParams() as { god: string }
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = doc(db, 'predictions', god)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setData({ ...defaultData, ...snap.data() })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (god) fetchData()
  }, [god])

  if (loading) return <p className="text-center mt-10">⏳ กำลังโหลด...</p>

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">คำทำนายจาก {god}</h1>

      <p>วิ่งโดดตัวเดียว: {data.oneDigit}</p>
      <p>ยิงเดี่ยวรอง: {data.onePair}</p>
      <p>2 ตัวเป้า: {data.twoDigit.join(', ')}</p>
      <p>3 ตัว: {data.threeDigit.join(', ')}</p>
      <p>4 ตัว: {data.fourDigit.join(', ')}</p>
      <p>5 ตัว: {data.fiveDigit.join(', ')}</p>
    </div>
  )
}
