"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Phone, 
  Calendar, 
  MapPin, 
  CreditCard, 
  FileText, 
  LogOut, 
  Briefcase,
  Users,
  FileBadge,
  Building,
  Landmark,
  Wallet,
  Edit3
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EditPersonalInfoModal } from "./edit-personal-info-modal"
import { toast } from "react-hot-toast"

interface UserData {
  name?: string;
  phone?: string;
  personalInfo?: {
    fullName?: string;
    mobileNumber?: string;
    birthDate?: string;
    presentAddress?: string;
    nidNumber?: string;
    occupation?: string;
    permanentAddress?: string;
    loanPurpose?: string;
    nomineeRelation?: string;
    nomineeName?: string;
    nomineePhone?: string;
    profilePhoto?: string;
  };
  bankInfo?: {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
  };
}

export function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [activeMenu, setActiveMenu] = useState("ব্যক্তিগত তথ্য")
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    accountName: "",
    accountNumber: ""
  })
  const [isUploading, setIsUploading] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (!userId) {
          router.push("/login")
          return
        }

        const response = await fetch("/api/user/profile", {
          headers: { "x-user-id": userId },
        })

        if (response.ok) {
          const data = await response.json()
          setUserData(data)
          // Initialize bank info for editing
          if (data.bankInfo) {
            setBankInfo({
              bankName: data.bankInfo.bankName || "",
              accountName: data.bankInfo.accountName || "",
              accountNumber: data.bankInfo.accountNumber || ""
            })
          }
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("selectedLoan")
    router.push("/login")
  }

  const handleBankInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBankInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBankInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({
          bankInfo: {
            bankName: bankInfo.bankName,
            accountName: bankInfo.accountName,
            accountNumber: bankInfo.accountNumber
          }
        })
      })

      if (response.ok) {
        // Update local state
        setUserData(prev => ({
          ...prev,
          bankInfo: bankInfo
        }))
        toast.success("ব্যাঙ্ক তথ্য সফলভাবে আপডেট হয়েছে")
      } else {
        toast.error("ব্যাঙ্ক তথ্য আপডেট করতে ব্যর্থ হয়েছে")
      }
    } catch (error) {
      console.error("Error updating bank info:", error)
      toast.error("ত্রুটি দেখা দিয়েছে")
    }
  }

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      
      // Update user profile with new profile photo - only send the profilePhoto field
      const updateResponse = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({
          personalInfo: {
            profilePhoto: data.secure_url
          }
        })
      })

      if (updateResponse.ok) {
        // Update local state
        setUserData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            profilePhoto: data.secure_url
          }
        }))
        toast.success("প্রোফাইল ছবি সফলভাবে আপলোড হয়েছে")
      } else {
        toast.error("প্রোফাইল ছবি আপডেট করতে ব্যর্থ হয়েছে")
      }
    } catch (error) {
      console.error("Error uploading profile image:", error)
      toast.error("প্রোফাইল ছবি আপলোড করতে ব্যর্থ হয়েছে")
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveProfileImage = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      // Update user profile with empty profile photo - only send the profilePhoto field
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({
          personalInfo: {
            profilePhoto: ""
          }
        })
      })

      if (response.ok) {
        // Update local state
        setUserData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            profilePhoto: ""
          }
        }))
        toast.success("প্রোফাইল ছবি সফলভাবে সরানো হয়েছে")
      } else {
        toast.error("প্রোফাইল ছবি সরাতে ব্যর্থ হয়েছে")
      }
    } catch (error) {
      console.error("Error removing profile image:", error)
      toast.error("প্রোফাইল ছবি সরাতে ব্যর্থ হয়েছে")
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSavePersonalInfo = async (updatedData: any) => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({
          personalInfo: updatedData
        })
      })

      if (response.ok) {
        // Update local state with the new personal info
        setUserData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            ...updatedData
          }
        }))
        toast.success("ব্যক্তিগত তথ্য সফলভাবে আপডেট হয়েছে")
      } else {
        toast.error("তথ্য আপডেট করতে ব্যর্থ হয়েছে")
      }
    } catch (error) {
      console.error("Error updating personal info:", error)
      toast.error("ত্রুটি দেখা দিয়েছে")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-foreground">লোড হচ্ছে...</p>
      </div>
    )
  }

  // Format birth date
  const formatBirthDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    
    const banglaMonths = [
      "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
      "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ]
    
    return `${day} ${banglaMonths[month]} ${year}`
  }

  // Terms and Conditions Content
  const termsAndConditionsContent = `
    <div class="space-y-4 text-gray-700">
      <h3 class="text-lg font-semibold text-gray-900">নিয়মাবলী</h3>
      <p>আমাদের সাথে থাকার জন্য ধন্যবাদ! আমাদের কাছ থেকে খুব সহজে আপনি ঘরে বসে ঋণ নিতে পারেন। আমাদের কাছ থেকে ৫০ হাজার থেকে ২০ লক্ষ টাকা পর্যন্ত ঋণ নিতে পারবেন। আপনাকে প্রতিমাসের ১-১০ তারিখের মধ্যে আমাদের কোম্পানির বিকাশ/নগদ কিস্তি দিতে হবে। আপনি যদি কোনো মাসে কিস্তি দিতে সক্ষম না হন তাহলে আপনি ২ মাসের কিস্তি এক সাথে দিতে পারবেন যদি ২ মাস এর বেশি হয়ে যায়, তাহলে আপনাকে অল্প কিছু পরিমান জরিমানা দিতে হতে পারে প্রয়োজন ছাড়া ফোন/মেসেজ করা থেকে বিরত থাকুন।</p>
      <p>আপনার যদি কোনো অভিযোগ থাকে বা আপনি যদি অন্য কোথাও থেকে প্রতারণার শিকার হয়ে থাকেন, তাহলে আপনি আমাদের অভিযোগ জানাতে পারেন। আমরা এর বিরুদ্ধে কঠোর ব্যবস্থা নিবো।</p>
      <p>ভুল তথ্য দেওয়া থেকে বিরত থাকুন, ভুল বা ভুয়া তথ্য দিলে ব্যাংক অ্যাকশন নিতে বাধ্য থাকিবে।</p>
      
      <h3 class="text-lg font-semibold text-gray-900 mt-6">কোন জামানত বা অগ্রিম টাকা দিতে হবে নাকি?</h3>
      <p>আপনার ঋণ নেওয়ার ক্ষমতা আছে নাকি সেটা যাচাই করতে আপনাকে সাময়িক সময়ের জন্য কিছু পরিমাণ ট্রান্সফার ফি দেওয়ার প্রয়োজন হতে পারে বা বীমা করার প্রয়োজন হতে পারে। আপনাকে ট্র্যান্সফার ফি যাচাইকরণের পর ফেরত দেওয়া হবে, এবং বীমার টাকা কিস্তি পরিশোধ করার পর ফেরত দেওয়া হবে।</p>
      
      <h3 class="text-lg font-semibold text-gray-900 mt-6">একাউন্ট নম্বর বা ব্যক্তিগত তথ্য ভুল হলে করণীয় কি?</h3>
      <p>একাউন্ট নম্বর বা ব্যক্তিগত তথ্য ভুল হলে সংশোধন ফি দিতে হবে।</p>
      
      <h3 class="text-lg font-semibold text-gray-900 mt-6">পাসওয়ার্ড ভুলে গেলে করণীয় কি?</h3>
      <p>পাসওয়ার্ড ভুলে গেলে আমাদের গ্রাহক প্রতিনিধির সাথে যোগাযোগ করুন।</p>
      
      <h3 class="text-lg font-semibold text-gray-900 mt-6">লোন পেতে কতদিন লাগতে পারে?</h3>
      <p>আপনার লোন টি কতদিনে সম্পূর্ণ হবে এটি আপনার লোনের পরিমাণ এর উপর ভিত্তি করছে, তবে এটি ঘন্টাখানিক বা বেশি পরিমাণ হলে ১-৫ দিন সময় লাগতে পারে।</p>
    </div>
  `

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-primary mb-6">প্রোফাইল</h1>
      
      {/* Personal Info Edit Modal */}
      <EditPersonalInfoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        personalInfo={userData.personalInfo || {}}
        onSave={handleSavePersonalInfo}
      />
      
      {/* TOP PROFILE CARD */}
      <Card className="p-6 mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-4 relative">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              {userData.personalInfo?.profilePhoto ? (
                <img 
                  src={userData.personalInfo.profilePhoto} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              ) : (
                <User className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-6 h-6 p-0 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-50"
                onClick={triggerFileInput}
                disabled={isUploading}
              >
                {isUploading ? (
                  <svg className="animate-spin h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{userData.personalInfo?.fullName || userData.name || "N/A"}</h2>
            <p className="text-gray-600 mt-1">{userData.personalInfo?.mobileNumber || userData.phone || "N/A"}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                সক্রিয়
              </span>
            </div>
          </div>
        </div>
      </Card>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfileImageUpload}
        className="hidden"
      />
      
      {userData.personalInfo?.profilePhoto && (
        <div className="flex justify-end mb-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveProfileImage}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            ছবি সরান
          </Button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT SIDEBAR (VERTICAL MENU) */}
        <Card className="lg:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveMenu("ব্যক্তিগত তথ্য")}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeMenu === "ব্যক্তিগত তথ্য"
                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <User className="w-5 h-5 mr-3" />
              <span className="font-medium">ব্যক্তিগত তথ্য</span>
            </button>
            
            <button
              onClick={() => setActiveMenu("ব্যাঙ্ক একাউন্ট")}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeMenu === "ব্যাঙ্ক একাউন্ট"
                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <CreditCard className="w-5 h-5 mr-3" />
              <span className="font-medium">ব্যাঙ্ক একাউন্ট</span>
            </button>
            
            <button
              onClick={() => setActiveMenu("নিয়মানুবলী ও শর্তাবলী")}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeMenu === "নিয়মানুবলী ও শর্তাবলী"
                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FileText className="w-5 h-5 mr-3" />
              <span className="font-medium">নিয়মানুবলী ও শর্তাবলী</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">লগ আউট</span>
            </button>
          </nav>
        </Card>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1">
          {/* PERSONAL INFO CONTENT */}
          {activeMenu === "ব্যক্তিগত তথ্য" && (
            <>
              <Card className="p-6 mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">ব্যক্তিগত তথ্য</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    সম্পাদনা
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">নাম</p>
                      <p className="font-medium text-gray-900">{userData.personalInfo?.fullName || userData.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">মোবাইল</p>
                      <p className="font-medium text-gray-900">{userData.personalInfo?.mobileNumber || userData.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">জন্ম তারিখ</p>
                      <p className="font-medium text-gray-900">{formatBirthDate(userData.personalInfo?.birthDate) || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">ঠিকানা</p>
                      <p className="font-medium text-gray-900">{userData.personalInfo?.presentAddress || "N/A"}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">এনআইডি নম্বর</p>
                      <p className="font-medium text-gray-900">{userData.personalInfo?.nidNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">পেশা</p>
                      <p className="font-medium text-gray-900">{userData.personalInfo?.occupation || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">স্থায়ী ঠিকানা</p>
                      <p className="font-medium text-gray-900">{userData.personalInfo?.permanentAddress || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">অন্যান্য তথ্য</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">লোনের উদ্দেশ্য</p>
                      <p className="font-medium text-gray-900">{userData.personalInfo?.loanPurpose || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">নমিনি সম্পর্ক</p>
                      <p className="font-medium text-gray-900">{userData.personalInfo?.nomineeRelation || "N/A"}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">নমিনি নাম</p>
                      <p className="font-medium text-gray-900">{userData.personalInfo?.nomineeName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">নমিনি মোবাইল নম্বর</p>
                      <p className="font-medium text-gray-900">{userData.personalInfo?.nomineePhone || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* BANK ACCOUNT CONTENT */}
          {activeMenu === "ব্যাঙ্ক একাউন্ট" && (
            <Card className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">ব্যাঙ্ক একাউন্ট</h2>
              <form onSubmit={handleBankInfoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bankName" className="text-sm text-gray-700">ব্যাংকের নাম</Label>
                      <div className="relative mt-1">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="bankName"
                          name="bankName"
                          value={bankInfo.bankName}
                          onChange={handleBankInfoChange}
                          className="pl-10"
                          placeholder="ব্যাংকের নাম লিখুন"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="accountName" className="text-sm text-gray-700">অ্যাকাউন্ট নাম</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="accountName"
                          name="accountName"
                          value={bankInfo.accountName}
                          onChange={handleBankInfoChange}
                          className="pl-10"
                          placeholder="অ্যাকাউন্ট নাম লিখুন"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="accountNumber" className="text-sm text-gray-700">অ্যাকাউন্ট নম্বর</Label>
                      <div className="relative mt-1">
                        <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="accountNumber"
                          name="accountNumber"
                          value={bankInfo.accountNumber}
                          onChange={handleBankInfoChange}
                          className="pl-10"
                          placeholder="অ্যাকাউন্ট নম্বর লিখুন"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="px-6">
                    আপডেট করুন
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TERMS AND CONDITIONS CONTENT */}
          {activeMenu === "নিয়মানুবলী ও শর্তাবলী" && (
            <Card className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">নিয়মানুবলী ও শর্তাবলী</h2>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: termsAndConditionsContent }}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}