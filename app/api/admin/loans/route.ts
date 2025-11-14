import { connectToDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const loans = db.collection("loans")
    
    // Simply fetch all loans without joining with users
    const allLoans = await loans.find({}).toArray()
    
    // Format the loan data for the frontend
    const formattedLoans = allLoans.map(loan => ({
      ...loan,
      _id: loan._id.toString(),
      userId: loan.userId ? loan.userId.toString() : (loan._id.toString()),
      fees: loan.fees || {},
      customMessage: loan.customMessage || "",
      level: loan.level || "",
      assignedTo: loan.assignedTo || "",
      payoutNumber: loan.payoutNumber || "",
      applicationDate: loan.applicationDate || null,
      statusUpdatedAt: loan.statusUpdatedAt || null,
      loanEndDate: loan.loanEndDate || null,
      monthlyPaymentDates: loan.monthlyPaymentDates || [],
    }));
    
    return NextResponse.json(formattedLoans, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { loanId, amount, duration, monthlyInstallment, status, level, assignedTo, payoutNumber, fees, customMessage, personalInfo, bankInfo } = await request.json()

    if (!loanId) {
      return NextResponse.json({ error: "Loan ID required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const loans = db.collection("loans")

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    }

    // Add the new fields
    if (amount !== undefined) updateData.amount = amount
    if (duration !== undefined) updateData.duration = duration
    if (monthlyInstallment !== undefined) updateData.monthlyInstallment = monthlyInstallment
    
    if (level) updateData.level = level
    if (assignedTo) updateData.assignedTo = assignedTo
    if (payoutNumber) updateData.payoutNumber = payoutNumber
    if (fees) updateData.fees = fees
    if (customMessage) updateData.customMessage = customMessage
    
    // Status Update Date, Monthly Payment Dates, Loan End Date - these 3 dates after admin update it create
    if (status) {
      updateData.status = status
      
      // Only set status update date for payment-related statuses
      if (status === "pay_pass" || status === "pay_pending") {
        updateData.statusUpdatedAt = new Date() // Add status update timestamp
        
        // Calculate monthly payment dates and loan end date for payment-related statuses
        const loan = await loans.findOne({ _id: new ObjectId(loanId as string) })
        if (loan) {
          // Calculate monthly payment dates array
          const monthlyPaymentDates: Date[] = []
          const startDate = new Date() // Start from current date
          for (let i = 0; i < loan.duration; i++) {
            const paymentDate = new Date(startDate)
            paymentDate.setMonth(startDate.getMonth() + i)
            monthlyPaymentDates.push(paymentDate)
          }
          updateData.monthlyPaymentDates = monthlyPaymentDates
          
          // Calculate loan end date based on duration
          const loanEndDate = new Date(startDate);
          loanEndDate.setMonth(loanEndDate.getMonth() + loan.duration);
          updateData.loanEndDate = loanEndDate;
        }
      }
    }
    
    // If personalInfo or bankInfo is provided, update them in the loan document
    if (personalInfo) updateData.personalInfo = personalInfo
    if (bankInfo) updateData.bankInfo = bankInfo

    await loans.updateOne({ _id: new ObjectId(loanId as string) }, { $set: updateData })

    return NextResponse.json({ message: "Loan updated" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}