import { connectToDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const admins = db.collection("admins")

    const allAdmins = await admins.find({}).toArray()

    return NextResponse.json(allAdmins, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}