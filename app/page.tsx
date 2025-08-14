"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
  Mic,
  Camera,
  MessageSquare,
  ImageIcon,
  Music,
  Video,
  Stars,
  Rocket,
  Shield,
  Users,
} from "lucide-react"
import { useRef } from "react"
import Link from "next/link"

const aiTools = [
  {
    icon: Camera,
    title: "Instagram Caption AI",
    description: "Generate viral captions that boost engagement and reach",
    category: "Social Media",
    gradient: "from-teal-400 via-cyan-500 to-blue-500",
    href: "/tools/instagram-caption",
  },
  {
    icon: Mic,
    title: "Voice Synthesis Pro",
    description: "Clone voices with studio-quality AI technology",
    category: "Audio",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    href: "/tools/voice-cloning",
  },
  {
    icon: MessageSquare,
    title: "Smart Chatbot Builder",
    description: "Create intelligent conversational AI assistants",
    category: "Conversation",
    gradient: "from-cyan-400 via-blue-500 to-indigo-500",
    href: "/tools",
  },
  {
    icon: ImageIcon,
    title: "AI Art Studio",
    description: "Transform ideas into stunning visual masterpieces",
    category: "Visual",
    gradient: "from-blue-400 via-indigo-500 to-purple-500",
    href: "/tools",
  },
  {
    icon: Music,
    title: "Music Composer AI",
    description: "Compose original tracks across any genre",
    category: "Audio",
    gradient: "from-indigo-400 via-purple-500 to-pink-500",
    href: "/tools",
  },
  {
    icon: Video,
    title: "Video Magic Editor",
    description: "Professional video editing powered by AI",
    category: "Visual",
    gradient: "from-purple-400 via-pink-500 to-rose-500",
    href: "/tools",
  },
]

const stats = [
  { icon: Users, value: "5+", label: "Active Users" },
  { icon: Zap, value: "20+", label: "AI Generations" },
  { icon: Stars, value: "4.9", label: "User Rating" },
  { icon: Rocket, value: "90.9%", label: "Uptime" },
]

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white overflow-hidden"
    >
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Hero Section */}
      <motion.section style={{ y, opacity }} className="relative min-h-screen flex items-center justify-center px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-sm border border-teal-500/30 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span className="text-teal-300 font-medium">Next-Gen AI Platform</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-7xl md:text-9xl font-black mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              AIverse
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Unleash your creativity with our revolutionary AI ecosystem.
            <span className="text-teal-400"> Transform ideas into reality</span> with cutting-edge tools.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <Link href="/tools">
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105"
              >
                Start Creating
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/tools">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-teal-500/50 text-teal-400 hover:bg-teal-500/10 px-10 py-4 rounded-2xl text-lg font-semibold backdrop-blur-sm bg-transparent"
              >
                Explore Tools
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-xl mb-3">
                  <stat.icon className="w-6 h-6 text-teal-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* AI Tools Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Powerful AI Tools
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover our suite of AI-powered tools designed to amplify your creativity and productivity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Link href={tool.href}>
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
                      <div className="text-teal-400 hover:text-teal-300 font-semibold group-hover:translate-x-2 transition-transform duration-300 flex items-center">
                        Try Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 backdrop-blur-sm border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 group">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Lightning Speed</h3>
              <p className="text-gray-300 leading-relaxed">
                Experience instant AI processing with our optimized cloud infrastructure
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Advanced AI</h3>
              <p className="text-gray-300 leading-relaxed">
                Powered by state-of-the-art models for unmatched quality and accuracy
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Secure & Private</h3>
              <p className="text-gray-300 leading-relaxed">
                Your data is protected with enterprise-grade security measures
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-emerald-500/10" />
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Ready to Create Magic?
              </span>
            </h2>
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
