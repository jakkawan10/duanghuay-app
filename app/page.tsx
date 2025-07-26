import { Suspense } from "react"
import Hero from "@/components/hero"
import Features from "@/components/features"
import CTA from "@/components/cta"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Hero />
        <Features />
        <CTA />
      </Suspense>
    </div>
  )
}
