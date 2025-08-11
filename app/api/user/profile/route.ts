import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"
import jwt from "jsonwebtoken"

const MONGO_URI =
  "mongodb+srv://mustafatinwala6:mustafa5253TINWALA@learningmongo.lof7x.mongodb.net/?retryWrites=true&w=majority&appName=LearningMongo"
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

async function verifyToken(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    throw new Error("No token provided")
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    throw new Error("Invalid token")
  }
}

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyToken(request)

    const client = new MongoClient(MONGO_URI)
    await client.connect()

    const db = client.db("aiverse")
    const users = db.collection("users")

    const user = await users.findOne({ _id: new ObjectId(decoded.userId) }, { projection: { password: 0 } })

    await client.close()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Format user data properly
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      plan: user.plan || "Free",
      joinDate: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "January 2024",
      totalGenerations: user.totalGenerations || 0,
      preferences: user.preferences || {
        emailNotifications: true,
        marketingEmails: false,
        usageAlerts: true,
        darkMode: true,
        animations: true,
      },
      profile: user.profile || {
        bio: "",
        location: "",
        website: "",
      },
    }

    return NextResponse.json({ user: userData }, { status: 200 })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const decoded = await verifyToken(request)
    const updateData = await request.json()

    const client = new MongoClient(MONGO_URI)
    await client.connect()

    const db = client.db("aiverse")
    const users = db.collection("users")

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password
    delete updateData._id
    delete updateData.createdAt

    const result = await users.updateOne(
      { _id: new ObjectId(decoded.userId) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    await client.close()

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
