"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Camera, Upload, Sparkles, Copy, RefreshCw, Music, Hash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const vibes = [
  { name: "Motivational", color: "from-orange-500 to-red-500", emoji: "💪" },
  { name: "Funny", color: "from-yellow-500 to-orange-500", emoji: "😂" },
  { name: "Romantic", color: "from-pink-500 to-rose-500", emoji: "💕" },
  { name: "Professional", color: "from-blue-500 to-indigo-500", emoji: "💼" },
  { name: "Casual", color: "from-green-500 to-teal-500", emoji: "😎" },
  { name: "Inspirational", color: "from-purple-500 to-pink-500", emoji: "✨" },
]

const sampleCaptions = [
  "Living my best life, one adventure at a time! ✨ What's your next adventure? #AdventureTime #LiveYourBestLife",
  "Sometimes you need to step outside, get some air, and remind yourself of who you are and where you want to be 🌟 #Mindfulness #SelfCare",
  "Coffee in hand, dreams in heart ☕️💫 Ready to conquer this beautiful day! #MondayMotivation #CoffeeLovers",
]

const musicSuggestions = [
  { title: "Good 4 U", artist: "Olivia Rodrigo", genre: "Pop" },
  { title: "Levitating", artist: "Dua Lipa", genre: "Dance Pop" },
  { title: "Blinding Lights", artist: "The Weeknd", genre: "Synth Pop" },
  { title: "Watermelon Sugar", artist: "Harry Styles", genre: "Pop Rock" },
]

export default function InstagramCaptionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedVibe, setSelectedVibe] = useState<string>("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showMusicSuggestions, setShowMusicSuggestions] = useState(false)

  const { toast } = useToast()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully!",
      })
    }
  }

  const generateCaptions = async () => {
    if (!selectedImage || !selectedVibe) {
      toast({
        title: "Missing requirements",
        description: "Please upload an image and select a vibe.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setShowMusicSuggestions(false)

    // Simulate AI caption generation
    setTimeout(() => {
      const vibeBasedCaptions = {
        Motivational: [
          "Every step forward is a step toward achieving something bigger and better than your current situation 💪 #MotivationMonday #GrowthMindset",
          "The only impossible journey is the one you never begin ✨ Ready to start yours? #JourneyBegins #BelieveInYourself",
          "Success isn't just about what you accomplish in your life, it's about what you inspire others to do 🌟 #Inspiration #Leadership",
        ],
        Funny: [
          "When life gives you lemons, make lemonade. When life gives you Monday, make coffee ☕️😂 #MondayMood #CoffeeAddict",
          "I'm not lazy, I'm on energy saving mode 😴⚡️ #LazyDay #EnergyConservation #Relatable",
          "My bed and I have a special relationship. We're perfect for each other 🛏️💕 #BedTime #Comfort #Mood",
        ],
        Romantic: [
          "In a world full of temporary things, you are a perpetual feeling 💕✨ #Love #Romance #Forever",
          "You're the reason I look down at my phone and smile, then walk into a pole 😍📱 #LoveStruck #Romance #Clumsy",
          "Every love story is beautiful, but ours is my favorite 💖 #LoveStory #Romance #Soulmate",
        ],
        Professional: [
          "Excellence is not a skill, it's an attitude 💼✨ Bringing my A-game every single day #ProfessionalLife #Excellence #WorkEthic",
          "Innovation distinguishes between a leader and a follower 🚀 #Innovation #Leadership #BusinessMindset",
          "Success is where preparation and opportunity meet 📈 #Success #Preparation #Opportunity",
        ],
        Casual: [
          "Just vibing and thriving 😎✨ Sometimes the best moments are the unplanned ones #Vibes #CasualLife #GoodTimes",
          "Living for these simple moments 🌟 Life doesn't have to be perfect to be wonderful #SimpleJoys #Grateful #Life",
          "Keeping it real, keeping it simple 💫 #KeepItReal #Authentic #SimpleLife",
        ],
        Inspirational: [
          "Be yourself; everyone else is already taken ✨ Your uniqueness is your superpower #BeYourself #Authentic #Inspiration",
          "The future belongs to those who believe in the beauty of their dreams 🌟 #Dreams #Future #Believe",
          "You are never too old to set another goal or to dream a new dream 💫 #NewGoals #Dreams #NeverTooLate",
        ],
      }

      setGeneratedCaptions(vibeBasedCaptions[selectedVibe as keyof typeof vibeBasedCaptions] || sampleCaptions)
      setIsGenerating(false)
      setShowMusicSuggestions(true)

      toast({
        title: "Captions generated!",
        description: "Your Instagram captions are ready to use.",
      })
    }, 2000)
  }

  const copyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption)
    toast({
      title: "Caption copied!",
      description: "The caption has been copied to your clipboard.",
    })
  }

  const regenerateCaptions = () => {
    generateCaptions()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-sm border border-teal-500/30 rounded-full px-6 py-3 mb-6">
            <Camera className="w-5 h-5 text-teal-400" />
            <span className="text-teal-300 font-medium">Instagram Caption AI</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Viral Caption Generator
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Upload your image, choose a vibe, and get AI-generated captions that boost engagement
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-teal-400" />
                  Upload Image
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Upload your Instagram photo to generate relevant captions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedImage ? (
                  <div className="space-y-4">
                    <div className="relative aspect-square rounded-xl overflow-hidden">
                      <Image
                        src={selectedImage || "/placeholder.svg"}
                        alt="Uploaded image"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                      onClick={() => setSelectedImage(null)}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-teal-500/50 transition-colors">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Drag and drop your image here, or click to browse</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Image
                      </Button>
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Vibe Selection Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  Choose Your Vibe
                </CardTitle>
                <CardDescription className="text-gray-400">Select the mood and tone for your caption</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {vibes.map((vibe) => (
                    <button
                      key={vibe.name}
                      onClick={() => setSelectedVibe(vibe.name)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedVibe === vibe.name
                          ? "border-teal-500 bg-teal-500/10"
                          : "border-gray-600 hover:border-gray-500 bg-gray-800/50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-r ${vibe.color} flex items-center justify-center mx-auto mb-2`}
                      >
                        <span className="text-lg">{vibe.emoji}</span>
                      </div>
                      <p className="text-white font-medium text-sm">{vibe.name}</p>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Custom Prompt (Optional)</label>
                  <Input
                    placeholder="Add specific details about your post..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500"
                  />
                </div>

                <Button
                  onClick={generateCaptions}
                  disabled={!selectedImage || !selectedVibe || isGenerating}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating Captions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Captions
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Generated Captions */}
        {generatedCaptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 backdrop-blur-xl border border-teal-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Hash className="w-5 h-5 text-teal-400" />
                    Generated Captions
                  </CardTitle>
                  <Button
                    onClick={regenerateCaptions}
                    variant="outline"
                    size="sm"
                    className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10 bg-transparent"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
                <CardDescription className="text-gray-300">
                  AI-generated captions tailored to your image and vibe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedCaptions.map((caption, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-teal-500/30 transition-colors"
                  >
                    <p className="text-gray-300 mb-3 leading-relaxed">{caption}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-gray-600 text-gray-400">
                          {selectedVibe}
                        </Badge>
                        <span className="text-xs text-gray-500">{caption.split(" ").length} words</span>
                      </div>
                      <Button
                        onClick={() => copyCaption(caption)}
                        size="sm"
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Music Suggestions */}
        {showMusicSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Music className="w-5 h-5 text-purple-400" />
                  Music Suggestions
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Perfect tracks to complement your {selectedVibe.toLowerCase()} post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {musicSuggestions.map((song, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Music className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{song.title}</p>
                          <p className="text-gray-400 text-sm">{song.artist}</p>
                        </div>
                        <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                          {song.genre}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
