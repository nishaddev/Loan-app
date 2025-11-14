import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const admins = db.collection("admins")

    // Check if admin already exists
    const existingAdmin = await admins.findOne({ email: "admin@loan.com" })
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Demo admin account already exists", email: "admin@loan.com", password: "admin123" },
        { status: 200 },
      )
    }

    // Create new admin account
    const hashedPassword = await bcrypt.hash("admin123", 10)

    const result = await admins.insertOne({
      email: "admin@loan.com",
      password: hashedPassword,
      name: "Demo Admin",
      createdAt: new Date(),
      role: "admin",
    })

    return NextResponse.json(
      {
        message: "Demo admin account created successfully",
        email: "admin@loan.com",
        password: "admin123",
        adminId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
