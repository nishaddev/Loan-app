import { connectToDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const admins = db.collection("admins")

    // Project only the fields we want to return, including role
    const allAdmins = await admins.find({}).project({
      name: 1,
      email: 1,
      role: 1,
      createdAt: 1
    }).toArray()

    return NextResponse.json(allAdmins, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}