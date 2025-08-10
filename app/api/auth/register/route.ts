import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const MONGO_URI =
  "mongodb+srv://mustafatinwala6:mustafa5253TINWALA@learningmongo.lof7x.mongodb.net/?retryWrites=true&w=majority&appName=LearningMongo"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGO_URI)
    await client.connect()

    const db = client.db("aiverse")
    const users = db.collection("users")

    // Check if user already exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      await client.close()
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      avatar: "",
      plan: "Free",
      totalGenerations: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        emailNotifications: true,
        marketingEmails: false,
        usageAlerts: true,
        darkMode: true,
        animations: true,
      },
      profile: {
        bio: "",
        location: "",
        website: "",
      },
    }

    const result = await users.insertOne(newUser)
    await client.close()

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
