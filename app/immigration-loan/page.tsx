"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ImmigrationLoanForm } from "@/components/immigration-loan-form"
import { useIsMobile } from "@/hooks/use-mobile"

export default function ImmigrationLoanPage() {
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
      <div className="desktop-layout">
        <BottomNavigation />
        <main className="desktop-main-content">
          <div className="desktop-card">
            <ImmigrationLoanForm />
          </div>
        </main>
      </div>
    )
  }

  return (
    <main className={`phone-frame min-h-screen flex flex-col p-4 ${isMobile ? 'pb-32' : 'pb-4'}`}>
      <ImmigrationLoanForm />
      <BottomNavigation />
    </main>
  )
}