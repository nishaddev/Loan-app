"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ImageUploadForm } from "@/components/image-upload-form"
import { useIsMobile } from "@/hooks/use-mobile"

export default function ImageUploadsPage() {
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
      <div className="min-h-screen bg-background">
        <div className="desktop-form-container py-8">
          <div className="desktop-card">
            <ImageUploadForm />
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className={`phone-frame min-h-screen flex items-center justify-center p-4 ${isMobile ? 'pb-20' : 'pb-4'}`}>
      <ImageUploadForm />
    </main>
  )
}