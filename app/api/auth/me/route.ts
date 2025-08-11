import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any

    // In a real app, you'd fetch user data from database
    const user = {
      id: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      avatar: "",
      plan: "Free",
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
