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
          <main className={`min-h-screen flex items-center justify-center p-4 ${isMobile ? '' : 'pb-4'} bg-gradient-to-br from-blue-50 to-indigo-100`}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 mb-6 mx-auto">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-foreground text-xl font-medium">লোড হচ্ছে...</p>
              <p className="text-gray-500 mt-2">আপনার ড্যাশবোর্ড ডেটা আনা হচ্ছে</p>
            </div>
          </main>
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
            <BottomNavigation />
            <main className="max-w-7xl mx-auto px-4 py-10">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 mb-6 mx-auto">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-foreground text-xl font-medium">Loading...</p>
                  <p className="text-gray-500 mt-2">Fetching your dashboard data</p>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>
    )
  }

  if (!isMobile) {
    // Desktop view - Professional modern design
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <BottomNavigation />
        <main className="max-w-7xl mx-auto px-4 py-10">
          <DashboardHome />
        </main>
      </div>
    )
  }

  // Mobile view - Professional modern design
  return (
    <main className={`phone-frame min-h-screen flex flex-col p-4 ${isMobile ? 'pb-32' : 'pb-4'} bg-gradient-to-br from-blue-50 to-indigo-100`}>
      <DashboardHome />
      <BottomNavigation />
    </main>
  )
}