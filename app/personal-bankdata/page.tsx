"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CombinedInfoForm } from "@/components/combined-info-form"
import { useIsMobile } from "@/hooks/use-mobile"

export default function CombinedInfoPage() {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700">
        {/* Header with more compact size but maintaining large logo - only for web view */}
        <header className="bg-gradient-to-br from-blue-600 to-indigo-700 py-2 px-8 shadow-md">
          <div className="container mx-auto flex items-center justify-center">
            <div className="flex items-center">
              <img 
                src="/The World Bank.png" 
                alt="The World Bank Logo" 
                className="h-24 filter brightness-0 invert drop-shadow-lg"
              />
            </div>
          </div>
        </header>
        
        {/* Main content area with form */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Updated to match login form style */}
            <div className="p-6 w-full shadow-xl border-0 bg-white rounded-2xl">
              <CombinedInfoForm />
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <main className={`phone-frame min-h-screen flex flex-col bg-gradient-to-br from-blue-600 to-indigo-700`}>
      {/* Logo section at the top - only for mobile */}
      <div className="w-full p-4 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-indigo-600/20 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-indigo-600/30 to-blue-400/30 animate-float"></div>
        
        <div className="text-center p-4 relative z-10">
          <img 
            src="/The World Bank.png" 
            alt="The World Bank Logo" 
            className="max-w-full max-h-48 object-contain mx-auto filter brightness-0 invert drop-shadow-xl"
          />
        </div>
      </div>
      
      {/* Combined info form section below - matching login form style */}
      <div className="flex-1 flex items-center justify-center p-4 bg-white rounded-t-3xl -mt-6 z-10">
        <div className="w-full max-w-2xl">
          {/* Updated to match login form style */}
          <div className="p-6 w-full shadow-xl border-0 bg-white rounded-2xl">
            <CombinedInfoForm />
          </div>
        </div>
      </div>
    </main>
  )
}