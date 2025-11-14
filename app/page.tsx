"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()
  const isMobile = useIsMobile()

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (userId) {
      router.push("/dashboard")
    }
  }, [router])

  const handleRegister = () => {
    router.push("/register")
  }

  const handleLogin = () => {
    router.push("/login")
  }

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4 animate-fadeIn">
        <div className="max-w-4xl w-full text-center animate-slideUp">
          <div className="mb-8 animate-fadeIn delay-150">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4">
              আইসিসি ঋণ সেবা
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              আপনার স্বপ্নের ঋণ পূরণ করুন সহজেই এবং নিরাপদে
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fadeIn delay-300">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">দ্রুত ঋণ প্রক্রিয়া</h3>
              <p className="text-gray-600">২৪ ঘন্টার মধ্যে ঋণ অনুমোদন</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">নিরাপদ লেনদেন</h3>
              <p className="text-gray-600">আপনার তথ্য সম্পূর্ণ নিরাপদ</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">সহজ অ্যাপ্লিকেশন</h3>
              <p className="text-gray-600">কয়েক মিনিটে ঋণের জন্য আবেদন</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn delay-500">
            <Button 
              onClick={handleRegister}
              className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              নতুন একাউন্ট তৈরি করুন
            </Button>
            <Button 
              onClick={handleLogin}
              variant="outline"
              className="px-8 py-6 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              লগইন করুন
            </Button>
          </div>

          <div className="mt-12 text-gray-500 text-sm">
            <p>© ২০২৫ আইসিসি ঋণ সেবা। সর্বসত্ত্ব সংরক্ষিত।</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className={`phone-frame min-h-screen flex flex-col items-center justify-center p-4 ${isMobile ? '' : 'pb-4'} bg-gradient-to-br from-blue-50 to-indigo-50`}>
      <div className="text-center w-full max-w-sm">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4">
            আইসিসি ঋণ সেবা
          </h1>
          <p className="text-lg text-gray-600">
            আপনার স্বপ্নের ঋণ পূরণ করুন
          </p>
        </div>

        <div className="space-y-4 mb-8 animate-fadeIn delay-150">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow border border-white/50">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-semibold">দ্রুত ঋণ প্রক্রিয়া</h3>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow border border-white/50">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-semibold">নিরাপদ লেনদেন</h3>
          </div>
        </div>

        <div className="space-y-4 animate-fadeIn delay-300">
          <Button 
            onClick={handleRegister}
            className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full shadow-lg"
          >
            নতুন একাউন্ট তৈরি করুন
          </Button>
          <Button 
            onClick={handleLogin}
            variant="outline"
            className="w-full py-6 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full shadow-lg"
          >
            লগইন করুন
          </Button>
        </div>
      </div>
    </main>
  )
}