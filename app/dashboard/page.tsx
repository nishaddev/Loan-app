"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DashboardHome } from "@/components/dashboard-home"
import { useIsMobile } from "@/hooks/use-mobile"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    const userId = localStorage.getItem("userId")

    if (!userId) {
      router.push("/login")
      return
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className={isMobile ? "phone-frame" : ""}>
        {isMobile ? (
          <main className={`min-h-screen flex items-center justify-center p-4 ${isMobile ? '' : 'pb-4'} bg-gradient-to-br from-blue-50 to-indigo-50`}>
            <div className="text-center">
              <p className="text-foreground">লোড হচ্ছে...</p>
            </div>
          </main>
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <BottomNavigation />
            <main className="max-w-6xl mx-auto px-4 py-8">
              <div className="text-center">
                <p className="text-foreground">Loading...</p>
              </div>
            </main>
          </div>
        )}
      </div>
    )
  }

  if (!isMobile) {
    // Desktop view - Normal website design
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <BottomNavigation />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <DashboardHome />
        </main>
      </div>
    )
  }

  // Mobile view (unchanged)
  return (
    <main className={`phone-frame min-h-screen flex flex-col p-4 ${isMobile ? 'pb-32' : 'pb-4'} bg-gradient-to-br from-blue-50 to-indigo-50`}>
      <DashboardHome />
      <BottomNavigation />
    </main>
  )
}