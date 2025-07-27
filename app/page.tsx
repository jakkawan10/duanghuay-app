"use client"

import { Suspense } from "react"
import Hero from "@/components/hero"
import Features from "@/components/features"
import CTA from "@/components/cta"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Hero />
        <Features />
        <CTA />
        <div className="text-center mt-8">
          <Link href="/ai">
            <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition">
              รับเลขเด็ดจาก AI 🔮
            </button>
          </Link>
        </div>
      </Suspense>
    </div>
  )
}
