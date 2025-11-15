"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User } from "@/components/ui/user"
import toast, { Toaster } from "react-hot-toast"

interface Customer {
  _id: string
  name: string
  phone: string
  personalInfo?: Record<string, any>
  bankInfo?: Record<string, any>
  applicationDate?: string
}

export default function CustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalCustomers, setTotalCustomers] = useState(0)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const adminId = localStorage.getItem("adminId")
        if (!adminId) {
          router.push("/admin-login")
          return
        }

        const response = await fetch("/api/admin/customers")
        const data = await response.json()
        
        if (response.ok) {
          // Sort customers by application date (newest first)
          const sortedCustomers = [...data].sort((a: Customer, b: Customer) => {
            const dateA = a.applicationDate ? new Date(a.applicationDate).getTime() : 0
            const dateB = b.applicationDate ? new Date(b.applicationDate).getTime() : 0
            return dateB - dateA
          })
          
          setCustomers(sortedCustomers)
          setFilteredCustomers(sortedCustomers)
          setTotalCustomers(sortedCustomers.length)
          setError(null)
        } else {
          const errorData = await response.json()
          setError("Failed to fetch customers")
        }
      } catch (err) {
        setError("Error loading customers")
      } finally {
        setIsLoading(false)
      }
    };

    fetchCustomers()
  }, [router])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
    
    if (value.trim() === "") {
      setFilteredCustomers(customers)
      setTotalCustomers(customers.length)
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(value.toLowerCase()) ||
          customer.phone.includes(value) ||
          customer.personalInfo?.nidNumber?.includes(value),
      )
      setFilteredCustomers(filtered)
      setTotalCustomers(filtered.length)
    }
  }

  const handleDelete = async (customerId: string) => {
    // Show confirmation toast instead of window.confirm
    toast((t) => (
      <div className="flex flex-col gap-4">
        <p>Delete this customer and all their data?</p>
        <div className="flex gap-2 justify-end">
          <button 
            className="px-3 py-1 bg-gray-200 rounded-md text-gray-800"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button 
            className="px-3 py-1 bg-red-600 rounded-md text-white"
            onClick={() => {
              toast.dismiss(t.id);
              performDelete(customerId);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 10000 }); // Auto-dismiss after 10 seconds
  }

  const performDelete = async (customerId: string) => {
    // Show loading toast
    const toastId = toast.loading("Deleting customer...")
    
    try {
      // Immediately update UI to remove the customer from display
      const updatedCustomers = customers.filter((c) => c._id !== customerId)
      setCustomers(updatedCustomers)
      
      // Update filtered customers based on current search
      if (searchTerm.trim() === "") {
        setFilteredCustomers(updatedCustomers)
        setTotalCustomers(updatedCustomers.length)
      } else {
        const filtered = updatedCustomers.filter(
          (customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm) ||
            customer.personalInfo?.nidNumber?.includes(searchTerm),
        )
        setFilteredCustomers(filtered)
        setTotalCustomers(filtered.length)
      }
      
      // Perform the actual deletion in the background
      const response = await fetch("/api/admin/customers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      })
      
      if (response.ok) {
        toast.success("Customer deleted successfully!", { id: toastId })
      } else {
        toast.error("Failed to delete customer", { id: toastId })
      }
    } catch (err) {
      toast.error("Error deleting customer", { id: toastId })
    }
  }

  const handleProfileClick = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const handleSaveProfile = async () => {
    if (!selectedCustomer) return;

    try {
      setIsSaving(true);
      
      // Find the customer to update
      const customerToUpdate = customers.find(c => c._id === selectedCustomer._id);
      if (!customerToUpdate) {
        return;
      }

      // Prepare the data to send
      const profileData = {
        personalInfo: selectedCustomer.personalInfo,
        bankInfo: selectedCustomer.bankInfo
      };

      const response = await fetch(`/api/admin/customers/${customerToUpdate._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        // Refresh the customer list
        const refreshResponse = await fetch("/api/admin/customers");
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          setCustomers(data);
          setFilteredCustomers(data);
          
          // Update the selected customer with the new data
          const updatedSelectedCustomer = data.find((c: any) => c._id === selectedCustomer._id);
          if (updatedSelectedCustomer) {
            setSelectedCustomer(updatedSelectedCustomer);
          }
        }
      } else {
        const errorData = await response.json();
      }
    } catch (err) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCustomer(null)
  }
  
  // Pagination functions
  const totalPages = Math.ceil(totalCustomers / itemsPerPage)
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    
    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 mr-1"
        >
          Previous
        </button>
      )
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md border text-sm font-medium mr-1 ${
            currentPage === i
              ? "border-blue-500 bg-blue-50 text-blue-600"
              : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      )
    }
    
    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ml-1"
        >
          Next
        </button>
      )
    }
    
    return (
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalCustomers)}
              </span>{" "}
              of <span className="font-medium">{totalCustomers}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              {pages}
            </nav>
          </div>
        </div>
      </div>
    )
  }

  // Get current page customers
  const indexOfLastCustomer = currentPage * itemsPerPage
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <Toaster position="top-center" />
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
          <p className="text-gray-600 mt-2">Manage and view all registered customers</p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Customer List</h2>
                  <p className="text-gray-600 text-sm mt-1">{totalCustomers} customers found</p>
                </div>
                <div className="w-full md:w-80">
                  <Input
                    placeholder="Search by name, phone or NID"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {currentCustomers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No customers found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search criteria to find what you're looking for.</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Date</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentCustomers.map((customer, index) => (
                          <tr 
                            key={customer._id} 
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{indexOfFirstCustomer + index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.personalInfo?.fullName || customer.name || "N/A"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.personalInfo?.mobileNumber || customer.phone || "N/A"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.personalInfo?.nidNumber || "N/A"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.personalInfo?.occupation || "N/A"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {customer.applicationDate 
                                ? new Date(customer.applicationDate).toLocaleDateString('en-GB') 
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-blue-600 hover:text-blue-900 border-blue-200 hover:bg-blue-50 transition-colors duration-150"
                                  onClick={() => handleProfileClick(customer)}
                                >
                                  View Profile
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-900 border-red-200 hover:bg-red-50 transition-colors duration-150"
                                  onClick={() => handleDelete(customer._id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {renderPagination()}
              </>
            )}
          </div>
        )}

        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">Customer Profile</DialogTitle>
            </DialogHeader>
            {selectedCustomer && <User customer={selectedCustomer} onSave={handleSaveProfile} />}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}