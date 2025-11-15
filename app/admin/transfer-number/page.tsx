"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import toast, { Toaster } from "react-hot-toast"

export default function TransferNumberPage() {
  const router = useRouter()
  const [transferNumber, setTransferNumber] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const adminId = localStorage.getItem("adminId")
    if (!adminId) {
      router.push("/admin-login")
      return
    }

    fetchTransferNumber()
  }, [router])

  const fetchTransferNumber = async () => {
    try {
      const response = await fetch("/api/admin/transfer-number")
      if (response.ok) {
        const data = await response.json()
        setTransferNumber(data.transferNumber || "")
      }
    } catch (error) {
      toast.error("Failed to fetch transfer number")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!transferNumber.trim()) {
      toast.error("Please enter a valid transfer number")
      return
    }

    try {
      setIsSaving(true)
      const response = await fetch("/api/admin/transfer-number", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transferNumber }),
      })

      if (response.ok) {
        toast.success("Transfer number updated successfully!")
      } else {
        toast.error("Failed to update transfer number")
      }
    } catch (error) {
      toast.error("Error updating transfer number")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <Toaster position="top-center" />
      <main className="flex-1 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Transfer Number Management</h1>
          <p className="text-gray-600 mt-2">Manage the transfer number for final withdrawal page</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Transfer Number Settings</CardTitle>
            <CardDescription>Update the transfer number that appears on the final withdrawal page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Transfer Number</label>
              <Input
                value={transferNumber}
                onChange={(e) => setTransferNumber(e.target.value)}
                placeholder="Enter transfer number (e.g., 01700-000000)"
                className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">This number will appear on the final withdrawal page for users to transfer money</p>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}