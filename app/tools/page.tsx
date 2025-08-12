"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Mic, MessageSquare, ImageIcon, Music, Video, ArrowRight } from "lucide-react"
import Link from "next/link"

// Update the tools array to have proper navigation links
const tools = [
  {
    icon: Camera,
    title: "Instagram Caption AI",
    description: "Generate viral captions that boost engagement and reach",
    category: "Social Media",
    gradient: "from-teal-400 via-cyan-500 to-blue-500",
    href: "/tools/instagram-caption",
    status: "Available",
  },
  {
    icon: Mic,
    title: "Voice Synthesis Pro",
    description: "Clone voices with studio-quality AI technology",
    category: "Audio",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    href: "/tools/voice-cloning",
    status: "Available",
  },
  {
    icon: MessageSquare,
    title: "Smart Chatbot Builder",
    description: "Create intelligent conversational AI assistants",
    category: "Conversation",
    gradient: "from-cyan-400 via-blue-500 to-indigo-500",
    href: "#",
    status: "Coming Soon",
  },
  {
    icon: ImageIcon,
    title: "AI Art Studio",
    description: "Transform ideas into stunning visual masterpieces",
    category: "Visual",
    gradient: "from-blue-400 via-indigo-500 to-purple-500",
    href: "#",
    status: "Coming Soon",
  },
  {
    icon: Music,
    title: "Music Composer AI",
    description: "Compose original tracks across any genre",
    category: "Audio",
    gradient: "from-indigo-400 via-purple-500 to-pink-500",
    href: "#",
    status: "Beta",
  },
  {
    icon: Video,
    title: "Video Magic Editor",
    description: "Professional video editing powered by AI",
    category: "Visual",
    gradient: "from-purple-400 via-pink-500 to-rose-500",
    href: "#",
    status: "Coming Soon",
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            AI Tools
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore our comprehensive collection of AI-powered tools designed to enhance your creativity and
            productivity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Update the card rendering to handle navigation properly */}
              <Link href={tool.href} className={tool.status === "Available" ? "" : "pointer-events-none"}>
                <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 hover:border-teal-500/50 transition-all duration-500 h-full overflow-hidden relative cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="relative">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <tool.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-white text-xl font-bold">{tool.title}</CardTitle>
                    </div>
                    <Badge variant="outline" className="border-gray-600 text-gray-400 w-fit">
                      {tool.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-gray-300 mb-6 text-base leading-relaxed">
                      {tool.description}
                    </CardDescription>
                    <div
                      className={`font-semibold group-hover:translate-x-2 transition-transform duration-300 flex items-center ${
                        tool.status === "Available" ? "text-teal-400 hover:text-teal-300" : "text-gray-500"
                      }`}
                    >
                      {tool.status === "Available" ? "Try Now" : tool.status}
                      {tool.status === "Available" && <ArrowRight className="ml-2 w-4 h-4" />}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
