"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

interface LoanData {
  _id?: string
  amount?: number
  duration?: number
  monthlyInstallment?: number
  status?: string
  level?: string
  fees?: Record<string, number>
  customMessage?: string
  assignedTo?: string
  payoutNumber?: string
}

export function DashboardHome() {
  const [loanData, setLoanData] = useState<LoanData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useIsMobile()

  // Romantic slider data with Bangla text
  const sliderData = [
    {
      id: 1,
      title: "আপনার স্বপ্নের পথচলা",
      description: "আমরা আপনার আর্থিক সহযোগী, বন্ধু এবং পরিবার",
      image: "/placeholder-slide-1.jpg"
    },
    {
      id: 2,
      title: "নির্ভরযোগ্য সেবা",
      description: "আপনার ঋণের জন্য আমাদের দরজা সবসময় খোলা",
      image: "/placeholder-slide-2.jpg"
    },
    {
      id: 3,
      title: "সম্পৃক্ত সমাধান",
      description: "আপনার ভবিষ্যতের জন্য আমরা এখানে আছি",
      image: "/placeholder-slide-3.jpg"
    }
  ]

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (!userId) return

        const response = await fetch("/api/user/loan", {
          headers: { "x-user-id": userId },
        })

        if (response.ok) {
          const data = await response.json()
          setLoanData(data)
        }
      } catch (err) {
        console.error("Failed to fetch loan data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoan()
  }, [])

  // Function to get status label in Bangla
  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      pending: "অপেক্ষারত",
      pass: "অনুমদিত",
      pay_pending: "পেমেন্ট অপেক্ষারত",
      pay_pass: "পেমেন্ট সম্পন্ন",
      rejected: "প্রত্যাখ্যাত"
    }
    
    return statusLabels[status] || status
  }

  // Function to get level label in Bangla
  const getLevelLabel = (level: string) => {
    const levelLabels: Record<string, string> = {
      transfer: "ট্রান্সফার",
      insurance: "বীমা",
      vip: "ভিআইপি",
      maintenance: "রক্ষণাবেক্ষণ",
      fault: "ত্রুটি",
      custom: "কাস্টম"
    }
    
    return levelLabels[level] || level
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-foreground">লোড হচ্ছে...</p>
      </div>
    )
  }

  if (!isMobile) {
    // Desktop view - Normal website design
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Romantic Carousel */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
          <Carousel 
            className="w-full"
            opts={{
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
              }) as any,
            ]}
          >
            <CarouselContent className="h-[400px]">
              {sliderData.map((slide) => (
                <CarouselItem key={slide.id} className="relative h-full">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${slide.image})` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4 max-w-3xl animate-fadeIn">
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">{slide.title}</h2>
                      <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">{slide.description}</p>
                      <div className="mt-8 flex justify-center space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-3 h-3 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 bg-white/20 hover:bg-white/30 text-white border-none size-12" />
            <CarouselNext className="absolute right-4 bg-white/20 hover:bg-white/30 text-white border-none size-12" />
          </Carousel>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Loan Summary Card */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 shadow-xl rounded-2xl">
              <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">আপনার ঋণের বিবরণ</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 text-center transform transition-all hover:scale-105 duration-300">
                  <div className="inline-block p-3 rounded-full bg-blue-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">মোট ঋণের পরিমাণ</h3>
                  <p className="text-3xl font-bold text-blue-600">৳{loanData?.amount?.toLocaleString("en-US") || "0"}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100 text-center transform transition-all hover:scale-105 duration-300">
                  <div className="inline-block p-3 rounded-full bg-indigo-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-indigo-800 mb-2">ঋণের মেয়াদ</h3>
                  <p className="text-3xl font-bold text-indigo-600">{loanData?.duration || "0"} মাস</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100 text-center transform transition-all hover:scale-105 duration-300">
                  <div className="inline-block p-3 rounded-full bg-purple-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">উত্তোলন</h3>
                  <p className="text-3xl font-bold text-purple-600">৳{loanData?.monthlyInstallment?.toLocaleString("en-US") || "0"}</p>
                </div>
              </div>
            </Card>

            {/* Status Card */}
            <Card className="p-8 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border border-amber-200 shadow-xl rounded-2xl">
              <h2 className="text-3xl font-bold mb-6 text-center text-amber-900">আবেদনের অবস্থা</h2>
              <div className="max-w-2xl mx-auto">
                <div className="p-6 bg-white rounded-xl border border-amber-200 shadow-md mb-6">
                  <p className="text-amber-800 text-center text-xl font-medium">
                    আপনার ঋণ আবেদনটি পর্যালোচনার জন্য পাঠানো হয়েছে...
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-amber-100 text-center shadow-sm">
                    <p className="text-amber-700 font-medium">অবস্থা</p>
                    <p className="text-2xl font-bold text-amber-900 mt-2">{getStatusLabel(loanData?.status || "pending")}</p>
                  </div>
                  {loanData?.level && (
                    <div className="bg-white p-4 rounded-xl border border-amber-100 text-center shadow-sm">
                      <p className="text-amber-700 font-medium">স্তর</p>
                      <p className="text-2xl font-bold text-amber-900 mt-2">{getLevelLabel(loanData.level)}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Mobile view
  return (
    <Card className="p-6 w-full space-y-6 bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Romantic Slider for Mobile */}
      <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
        <Carousel 
          className="w-full"
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }) as any,
          ]}
        >
          <CarouselContent className="h-64">
            {sliderData.map((slide) => (
              <CarouselItem key={slide.id} className="relative h-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${slide.image})` }}
                />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="text-center animate-fadeIn">
                    <h2 className="text-xl font-bold text-white mb-2">{slide.title}</h2>
                    <p className="text-sm text-white/90">{slide.description}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="space-y-6">
        <Card className="p-6 bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">আপনার ঋণের বিবরণ</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200 flex items-center">
              <div className="mr-4 p-2 rounded-full bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-blue-600">মোট ঋণের পরিমাণ</p>
                <p className="text-xl font-bold text-blue-900">৳{loanData?.amount?.toLocaleString("en-US") || "0"}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200 flex items-center">
              <div className="mr-4 p-2 rounded-full bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-blue-600">ঋণের মেয়াদ</p>
                <p className="text-xl font-bold text-blue-900">{loanData?.duration || "0"} মাস</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200 flex items-center">
              <div className="mr-4 p-2 rounded-full bg-purple-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-blue-600">উত্তোলন</p>
                <p className="text-xl font-bold text-blue-900">৳{loanData?.monthlyInstallment?.toLocaleString("en-US") || "0"}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-center text-amber-900">আবেদনের অবস্থা</h2>
          <div className="p-4 bg-white rounded-lg border border-amber-200 mb-4">
            <p className="text-amber-800 text-center">
              আপনার ঋণ আবেদনটি পর্যালোচনার জন্য পাঠানো হয়েছে...
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white p-3 rounded-lg border border-amber-200 flex justify-between items-center">
              <span className="text-amber-700 font-medium">অবস্থা</span>
              <span className="font-bold text-amber-900">{getStatusLabel(loanData?.status || "pending")}</span>
            </div>
            {loanData?.level && (
              <div className="bg-white p-3 rounded-lg border border-amber-200 flex justify-between items-center">
                <span className="text-amber-700 font-medium">স্তর</span>
                <span className="font-bold text-amber-900">{getLevelLabel(loanData.level)}</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Card>
  )
}