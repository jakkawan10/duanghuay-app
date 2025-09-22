'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'

export default function UserPredictionPage() {
  const [luckyNumber, setLuckyNumber] = useState('')

  useEffect(() => {
    const ref = doc(db, 'predictions', 'latest')
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setLuckyNumber(snap.data().luckyNumber)
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center bg-yellow-100 p-6 rounded-xl shadow-lg">
        <h1 className="text-xl font-semibold mb-2">เลขนำโชคงวดนี้</h1>
        <p className="text-5xl font-bold text-red-500">{luckyNumber || '...'}</p>
      </div>
    </div>
  )
}
