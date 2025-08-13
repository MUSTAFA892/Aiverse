import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI!
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    const client = new MongoClient(MONGO_URI)
    await client.connect()

    const db = client.db("aiverse")
    const users = db.collection("users")

    const user = await users.findOne({ email })
    if (!user) {
      await client.close()
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      await client.close()
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    await users.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } })
    await client.close()

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
        },
        token,
      },
      { status: 200 }
    )

    response.cookies.set("auth-token", token, {
      httpOnly: false, // Allow js-cookie access
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    })

    console.log("Cookie set:", {
      name: "auth-token",
      value: token,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}