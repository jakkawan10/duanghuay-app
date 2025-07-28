'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function Step2Page() {
  const [showFlames, setShowFlames] = useState(false)
  const [showIncense, setShowIncense] = useState(false)

  return (
    <div className="relative w-full h-screen">
      <Image
        src="/step2-bg.jpg"
        alt="bg"
        fill
        className="object-cover"
        priority
      />

      {/* ปุ่มจิ้มเทียน */}
      <button
        onClick={() => setShowFlames(true)}
        className="absolute left-[22%] bottom-[32%] w-[20%] h-[15%]"
      />
      <button
        onClick={() => setShowFlames(true)}
        className="absolute right-[22%] bottom-[32%] w-[20%] h-[15%]"
      />

      {/* ปุ่มจิ้มกระถางธูป */}
      <button
        onClick={() => setShowIncense(true)}
        className="absolute left-[42%] bottom-[28%] w-[16%] h-[15%]"
      />

      {/* เอฟเฟกต์ไฟเทียน */}
      {showFlames && (
        <>
          <img
            src="/effects/flame.gif"
            alt="flame-left"
            className="absolute left-[24%] bottom-[32%] w-[32px]"
          />
          <img
            src="/effects/flame.gif"
            alt="flame-right"
            className="absolute right-[24%] bottom-[32%] w-[32px]"
          />
        </>
      )}

      {/* เอฟเฟกต์ธูป */}
      {showIncense && (
        <img
          src="/effects/incense.gif"
          alt="incense"
          className="absolute left-[45%] bottom-[28%] w-[60px]"
        />
      )}
    </div>
  )
}
