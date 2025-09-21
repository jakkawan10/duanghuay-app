'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import { useUser } from '@/hooks/useUser'
import { toast } from 'sonner'

const fields = [
  { label: 'หวยรัฐบาลงวดถัดไป', name: 'nextGov' },
  { label: 'หวยรัฐบาลงวดล่าสุด', name: 'lastGov' },
  { label: 'หวยออมสินงวดล่าสุด', name: 'lastGSB' },
  { label: 'หวยธกส.งวดล่าสุด', name: 'lastBAAC' },
]

export default function LotteryPage() {
  const { user } = useUser()
  const isAdmin = user?.role === 'admin'

  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(collection(db, 'lottery'), 'latest')
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        setValues(snap.data() as Record<string, string>)
      }
    }
    fetchData()
  }, [])

  const save = async () => {
    const docRef = doc(collection(db, 'lottery'), 'latest')
    await setDoc(docRef, values, { merge: true })
    toast.success('บันทึกสำเร็จแล้ว')
  }

  const updateField = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">เลขหวยล่าสุด</h1>

      {fields.map((field) => (
        <div key={field.name} className="mb-4">
          <label className="block text-sm font-medium mb-1">{field.label}</label>
          <input
            type="text"
            value={values?.[field.name] ?? ''}
            onChange={(e) => updateField(field.name, e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            readOnly={!isAdmin}
          />
        </div>
      ))}

      {isAdmin && (
        <button
          onClick={save}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          บันทึก
        </button>
      )}
    </div>
  )
}
