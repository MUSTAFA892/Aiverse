"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Mic, MessageSquare, ImageIcon, Music, Video, ArrowRight } from "lucide-react"

const tools = [
  {
    icon: Camera,
    title: "Instagram Caption Generator",
    description: "Generate engaging captions for your Instagram posts with AI",
    category: "Social Media",
    color: "from-pink-500 to-purple-600",
    status: "Available",
  },
  {
    icon: Mic,
    title: "Voice Cloning",
    description: "Clone any voice with advanced AI technology",
    category: "Audio",
    color: "from-blue-500 to-cyan-600",
    status: "Coming Soon",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot",
    description: "Intelligent conversational AI for any purpose",
    category: "Conversation",
    color: "from-green-500 to-emerald-600",
    status: "Available",
  },
  {
    icon: ImageIcon,
    title: "Image Generator",
    description: "Create stunning images from text descriptions",
    category: "Visual",
    color: "from-orange-500 to-red-600",
    status: "Available",
  },
  {
    icon: Music,
    title: "Music Composer",
    description: "Generate original music tracks with AI",
    category: "Audio",
    color: "from-purple-500 to-indigo-600",
    status: "Beta",
  },
  {
    icon: Video,
    title: "Video Editor",
    description: "AI-powered video editing and enhancement",
    category: "Visual",
    color: "from-teal-500 to-blue-600",
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
              <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 group hover:scale-105 h-full">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-white text-lg">{tool.title}</CardTitle>
                    <Badge
                      variant={
                        tool.status === "Available" ? "default" : tool.status === "Beta" ? "secondary" : "outline"
                      }
                      className={
                        tool.status === "Available"
                          ? "bg-green-600 text-white"
                          : tool.status === "Beta"
                            ? "bg-yellow-600 text-white"
                            : "border-gray-600 text-gray-400"
                      }
                    >
                      {tool.status}
                    </Badge>
                  </div>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300 w-fit">
                    {tool.category}
                  </Badge>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="text-gray-400 mb-4 flex-1">{tool.description}</CardDescription>
                  <Button
                    variant="ghost"
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 p-0 justify-start"
                    disabled={tool.status === "Coming Soon"}
                  >
                    {tool.status === "Coming Soon" ? "Coming Soon" : "Try Now"}
                    {tool.status !== "Coming Soon" && <ArrowRight className="ml-2 w-4 h-4" />}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
