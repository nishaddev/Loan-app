"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BottomNavigation } from "@/components/bottom-navigation"
import { HelpPage } from "@/components/help-page"
import { useIsMobile } from "@/hooks/use-mobile"

export default function HelpPageComponent() {
  const router = useRouter()
  const isMobile = useIsMobile()

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/login")
    }
  }, [router])

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <BottomNavigation />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
            <HelpPage />
          </div>
        </main>
      </div>
    )
  }

  return (
    <main className={`phone-frame min-h-screen flex flex-col p-4 ${isMobile ? 'pb-32' : 'pb-4'} bg-gradient-to-br from-blue-50 to-indigo-50`}>
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow border border-white/50 flex-grow">
        <HelpPage />
      </div>
      <BottomNavigation />
    </main>
  )
}