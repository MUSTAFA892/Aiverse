"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mic, Play, Pause, Download, AudioWaveformIcon as Waveform, Volume2, MicOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function VoiceCloningPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [voiceFilePath, setVoiceFilePath] = useState(null)
  const [text, setText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef(null)
  const audioRef = useRef(null)
  const { toast } = useToast()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Use audio/webm for broader browser compatibility
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/wav"
      console.log(`Using mimeType: ${mimeType}`)
      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder

      const chunks = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        } else {
          console.warn("Received empty audio chunk")
        }
      }

      mediaRecorder.onstop = async () => {
        if (chunks.length === 0) {
          toast({
            title: "Recording failed",
            description: "No audio data recorded. Please try again.",
            variant: "destructive",
          })
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        const blob = new Blob(chunks, { type: "audio/wav" })
        stream.getTracks().forEach((track) => track.stop())

        // Verify blob size
        if (blob.size < 1000) {
          console.error("Audio blob is too small:", blob.size, "bytes")
          toast({
            title: "Recording failed",
            description: "Recorded audio is too short or empty. Please record for 10-30 seconds.",
            variant: "destructive",
          })
          return
        }

        // Send audio to backend for saving
        try {
          const formData = new FormData()
          formData.append("voice", blob, "voice-sample.wav")

          console.log("Uploading voice sample to /upload...")
          const response = await fetch("http://127.0.0.1:5000/upload", {
            method: "POST",
            body: formData,
            signal: AbortSignal.timeout(10000),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error("Upload error:", {
              status: response.status,
              statusText: response.statusText,
              error: errorData.error || "No error message provided",
            })
            throw new Error(errorData.error || `Failed to upload voice sample (HTTP ${response.status})`)
          }

          const { file_path } = await response.json()
          setVoiceFilePath(file_path)

          // Download for verification
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = "recorded-voice.wav"
          link.click()
          URL.revokeObjectURL(url)

          toast({
            title: "Recording uploaded",
            description: `Voice sample saved at ${file_path}. Check the downloaded 'recorded-voice.wav' file.`,
          })
        } catch (error) {
          console.error("Voice upload error:", error)
          toast({
            title: "Upload failed",
            description: error.message || "Failed to upload voice sample to the server. Check the console for details.",
            variant: "destructive",
          })
        }
      }

      mediaRecorder.start()
      setIsRecording(true)

      toast({
        title: "Recording started",
        description: "Speak clearly for 10-30 seconds. The audio will be uploaded and downloaded for verification.",
      })
    } catch (error) {
      console.error("Microphone access error:", {
        name: error.name,
        message: error.message,
      })
      let description = "Unable to access microphone. Please check permissions."
      if (error.name === "NotAllowedError") {
        description = "Microphone access denied. Please allow microphone access in your browser settings."
      } else if (error.name === "NotFoundError") {
        description = "No microphone detected. Please ensure a microphone is connected."
      } else if (error.name === "NotReadableError") {
        description = "Microphone is in use by another application. Please close other apps using the microphone."
      }
      toast({
        title: "Recording failed",
        description,
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const generateVoice = async () => {
    if (!voiceFilePath || !text.trim()) {
      toast({
        title: "Missing requirements",
        description: "Please record your voice and enter text to generate.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      console.log("Sending generation request to /generate...", {
        text,
        language: "en",
        voice_path: voiceFilePath,
      })
      const response = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "audio/wav",
        },
        body: JSON.stringify({
          text,
          language: "en",
          voice_path: voiceFilePath,
        }),
        signal: AbortSignal.timeout(30000),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Generation error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData.error || "No error message provided",
        })
        throw new Error(errorData.error || `Failed to generate voice (HTTP ${response.status})`)
      }

      const audioBlob = await response.blob()
      if (audioBlob.type !== "audio/wav") {
        throw new Error("Received invalid audio format from server")
      }
      const audioUrl = URL.createObjectURL(audioBlob)
      setGeneratedAudioUrl(audioUrl)

      toast({
        title: "Voice generated!",
        description: "Your AI voice has been created successfully.",
      })
    } catch (error) {
      console.error("Voice generation error:", error)
      toast({
        title: "Generation failed",
        description: error.message || "An error occurred while generating the voice. Check the console for details.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const playGeneratedAudio = () => {
    if (generatedAudioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play().catch((error) => {
          toast({
            title: "Playback failed",
            description: "Unable to play audio: " + error.message,
            variant: "destructive",
          })
        })
        setIsPlaying(true)
      }
    }
  }

  const downloadAudio = () => {
    if (generatedAudioUrl) {
      const link = document.createElement("a")
      link.href = generatedAudioUrl
      link.download = "ai-voice-output.wav"
      link.click()

      toast({
        title: "Download started",
        description: "Your AI voice file is being downloaded.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-6 py-3 mb-6">
            <Mic className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-300 font-medium">Voice Synthesis Pro</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Clone Your Voice
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Record your voice and generate AI speech with studio-quality results
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Recording Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mic className="w-5 h-5 text-emerald-400" />
                  Voice Input
                </CardTitle>
                <CardDescription className="text-gray-400">Record a 10-30 second sample of your voice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div
                    className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center transition-all duration-300 ${
                      isRecording
                        ? "bg-gradient-to-r from-red-500 to-pink-500 animate-pulse"
                        : voiceFilePath
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : "bg-gradient-to-r from-gray-600 to-gray-700"
                    }`}
                  >
                    {isRecording ? (
                      <MicOff className="w-12 h-12 text-white" />
                    ) : voiceFilePath ? (
                      <Waveform className="w-12 h-12 text-white" />
                    ) : (
                      <Mic className="w-12 h-12 text-white" />
                    )}
                  </div>

                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isRecording
                        ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    }`}
                  >
                    {isRecording ? "Stop Recording" : voiceFilePath ? "Re-record" : "Start Recording"}
                  </Button>
                </div>

                {voiceFilePath && (
                  <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <Volume2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Voice Sample</p>
                          <p className="text-gray-400 text-sm">Ready for voice generation</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Uploaded</Badge>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-white font-medium">Tips for best results:</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Speak clearly and naturally</li>
                    <li>• Record in a quiet environment</li>
                    <li>• Use consistent volume and pace</li>
                    <li>• Record 15-30 seconds for optimal quality</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Text Input Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Waveform className="w-5 h-5 text-teal-400" />
                  Text to Speech
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter the text you want your AI voice to speak
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Your Text</label>
                  <Textarea
                    placeholder="Enter the text you want to convert to speech using your cloned voice..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[200px] bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20 resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">{text.length} characters</span>
                    <span className="text-xs text-gray-400">Max: 1000 characters</span>
                  </div>
                </div>

                <Button
                  onClick={generateVoice}
                  disabled={!voiceFilePath || !text.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating Voice...
                    </>
                  ) : (
                    <>
                      <Waveform className="w-4 h-4 mr-2" />
                      Generate AI Voice
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Generated Audio Output */}
        {generatedAudioUrl && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 backdrop-blur-xl border border-teal-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-teal-400" />
                  Generated Voice Output
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Your AI-generated voice is ready to play and download
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1">
                    <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
                      <p className="text-gray-300 text-sm italic">"{text}"</p>
                    </div>
                    <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden">
                      <source src={generatedAudioUrl} type="audio/wav" />
                    </audio>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={playGeneratedAudio}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Play
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={downloadAudio}
                      variant="outline"
                      className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10 px-6 py-3 rounded-xl font-semibold bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-gray-900/50 border-gray-700/50 text-center p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">High Quality</h3>
            <p className="text-gray-400 text-sm">Studio-grade voice cloning with natural intonation</p>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700/50 text-center p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Waveform className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Fast Processing</h3>
            <p className="text-gray-400 text-sm">Generate voice output in seconds, not minutes</p>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700/50 text-center p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Multiple Formats</h3>
            <p className="text-gray-400 text-sm">Export in MP3, WAV, and other popular formats</p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
