"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Users, Rocket, Shield } from "lucide-react"

const values = [
  {
    icon: Brain,
    title: "Innovation",
    description:
      "We're at the forefront of AI technology, constantly pushing boundaries to bring you the most advanced tools.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a vibrant community of creators, developers, and innovators who shape the future together.",
  },
  {
    icon: Rocket,
    title: "Performance",
    description: "Lightning-fast processing and reliable infrastructure ensure your creative workflow never stops.",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Your data and privacy are our top priority. We implement industry-leading security measures.",
  },
]

export default function AboutPage() {
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
            About AIverse
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We're on a mission to democratize AI and make powerful creative tools accessible to everyone, from
            individual creators to large enterprises.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="prose prose-lg prose-invert mx-auto"
          >
            <div className="text-gray-300 space-y-6 text-lg leading-relaxed">
              <p>
                Founded in 2024, AIverse emerged from a simple yet powerful vision: to create a platform where
                artificial intelligence serves as a creative partner, not a replacement. We believe that AI should
                amplify human creativity, making it easier for anyone to bring their ideas to life.
              </p>
              <p>
                Our team of AI researchers, engineers, and designers work tirelessly to develop tools that are not only
                powerful but also intuitive and accessible. From Instagram caption generation to voice cloning, each
                tool is crafted with precision and care.
              </p>
              <p>
                Today, AIverse serves thousands of creators, marketers, developers, and businesses worldwide, helping
                them unlock new possibilities and push the boundaries of what's possible with AI.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 text-center h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                    <p className="text-gray-400">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
