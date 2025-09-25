'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const defaultData = {
  oneDigit: [""],
  onePair: [""],
  twoDigit: ["", ""],
  threeDigit: ["", "", ""],
  fourDigit: ["", "", "", ""],
  fiveDigit: ["", "", "", "", ""],
}

export default function AdminPredictionPage() {
  const { god } = useParams() as { god: string }
  const [form, setForm] = useState(defaultData)
  const [roundKey, setRoundKey] = useState("") // ✅ ให้ admin กรอกเอง
  const [loading, setLoading] = useState(false)

  // โหลดข้อมูลงวดที่กรอก
  const fetchCurrent = async () => {
    if (!god || !roundKey) return
    const ref = doc(db, "predictions", god, "dates", roundKey)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      setForm({
        oneDigit: snap.data().oneDigit || [""],
        onePair: snap.data().onePair || [""],
        twoDigit: snap.data().twoDigit || ["", ""],
        threeDigit: snap.data().threeDigit || ["", "", ""],
        fourDigit: snap.data().fourDigit || ["", "", "", ""],
        fiveDigit: snap.data().fiveDigit || ["", "", "", "", ""],
      })
    } else {
      setForm(defaultData)
    }
  }

  const handleChange = (field: keyof typeof defaultData, index: number, value: string) => {
    setForm((prev) => {
      const updated = [...prev[field]]
      updated[index] = value
      return { ...prev, [field]: updated }
    })
  }

  const handleSave = async () => {
    if (!god || !roundKey) return alert("⚠️ กรุณากรอกวันที่ก่อนบันทึก")
    setLoading(true)

    try {
      const ref = doc(db, "predictions", god, "dates", roundKey)
      await setDoc(ref, {
        ...form,
        updatedAt: serverTimestamp(),
      })

      alert(`✅ บันทึกเลขของ "${god}" สำหรับงวด ${roundKey} เรียบร้อยแล้ว`)
    } catch (e) {
      console.error(e)
      alert("❌ เกิดข้อผิดพลาด")
    } finally {
      setLoading(false)
    }
  }

  const renderInputs = (field: keyof typeof defaultData, label: string) => (
    <div>
      <p className="mb-1 font-medium">{label}</p>
      <div className="flex gap-2">
        {form[field].map((val, i) => (
          <Input
            key={i}
            value={val}
            onChange={(e) => handleChange(field, i, e.target.value)}
            className="w-12 text-center"
            maxLength={1}
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow space-y-4">
      <h1 className="text-2xl font-bold mb-4">กรอกเลขสำหรับเทพ {god}</h1>

      <div>
        <p className="mb-1 font-medium">📅 วันที่ (เช่น 2025-09-25)</p>
        <Input
          value={roundKey}
          onChange={(e) => setRoundKey(e.target.value)}
          placeholder="YYYY-MM-DD"
          className="mb-2"
        />
        <Button onClick={fetchCurrent} className="mb-4">🔍 โหลดเลขงวดนี้</Button>
      </div>

      {renderInputs("oneDigit", "วิ่งโดดตัวเดียว")}
      {renderInputs("onePair", "ยิงเดี่ยวรอง")}
      {renderInputs("twoDigit", "2 ตัวเป้า")}
      {renderInputs("threeDigit", "3 ตัวแม่")}
      {renderInputs("fourDigit", "4 ตัวมหารวย")}
      {renderInputs("fiveDigit", "5 ตัวรวยไว")}

      <Button
        onClick={handleSave}
        disabled={loading}
        className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600"
      >
        {loading ? "⏳ กำลังบันทึก..." : "💾 บันทึกเลข"}
      </Button>
    </div>
  )
}
