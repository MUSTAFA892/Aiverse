"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users, Rocket, Shield, User } from "lucide-react";

/* ---------- DATA ---------- */
const values = [
  {
    icon: Brain,
    title: "Innovation",
    description:
      "We push boundaries with practical AI — research-led, usability-first.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Creators, builders, and learners collaborating to make better tools.",
  },
  {
    icon: Rocket,
    title: "Performance",
    description: "Optimized pipelines and fast iteration so your ideas keep moving.",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Privacy-first engineering and secure-by-design practices.",
  },
];

const team = [
  {
    name: "Mustafa Tinwala",
    role: "Frontend Developer",
    details: "Crafts fluid, accessible UIs — React + Tailwind specialist.",
  },
  {
    name: "Nhowmitha Suresh",
    role: "Frontend Developer",
    details: "Design-driven frontend dev focused on animations and UX.",
  },
  {
    name: "Abinav Prakash",
    role: "Backend Developer",
    details: "Builds resilient server logic and scalable APIs.",
  },
  {
    name: "Ajay",
    role: "Backend Developer",
    details: "Performance-minded engineer, loves databases and caching.",
  },
  {
    name: "Nevil",
    role: "Frontend Developer",
    details: "Creates delightful micro-interactions and responsive layouts.",
  },
];

/* ---------- HELPERS ---------- */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

/* ---------- COMPONENT ---------- */
export default function AboutPage(): JSX.Element {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white py-12 px-4">
      {/* Particle background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-20">
          <div className="particles" />
        </div>
        <div className="absolute inset-0" style={{ mixBlendMode: "overlay" }} />
      </div>

      {/* Page container */}
      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4">
            <span className="shimmer">AIverse</span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Student-built, design-first AI tools — simple, fast, and built to
            amplify human creativity.
          </p>
        </motion.header>

        {/* ABOUT (short) */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="mb-14"
        >
          <motion.div variants={fadeUp} className="prose prose-invert text-center mx-auto max-w-3xl">
            <p className="text-lg text-gray-300">
              A five-person student team building human-centric AI — we combine
              research, engineering and design to make tools that are useful,
              delightful and ethical.
            </p>
          </motion.div>
        </motion.section>

        {/* OUR VALUES */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-center mb-8">
            Our Values
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              >
                <Card className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-800 rounded-2xl hover:shadow-2xl hover:shadow-violet-700/30 transition-all duration-300">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="iconWrap mb-4">
                      <v.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
                    <p className="text-gray-400 text-sm">{v.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* MEET OUR TEAM */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-center mb-8">
            Meet Our Team
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                whileHover={{ rotate: -1.5, scale: 1.04 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="relative group"
              >
                {/* colorful glitter layer */}
                <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                     style={{
                       background: "linear-gradient(90deg, rgba(139,92,246,0.18), rgba(59,130,246,0.14), rgba(236,72,153,0.12))",
                       filter: "blur(14px)",
                     }} />

                <Card className="relative z-10 overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-4 shadow-lg">
                  <CardContent className="p-5 flex flex-col items-center text-center">
                    {/* Avatar circle (same icon for all) */}
                    <div className="w-20 h-20 rounded-full grid place-items-center mb-4 transform transition-all duration-300 group-hover:scale-105"
                         style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}>
                      <User className="w-9 h-9 text-white" />
                    </div>

                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-xs text-purple-300 font-medium mb-2">{member.role}</p>
                    <p className="text-gray-300 text-sm">{member.details}</p>

                    {/* glitter sparkles overlay (animated) */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <radialGradient id={`g${idx}`} cx="50%" cy="50%">
                            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                            <stop offset="70%" stopColor="white" stopOpacity="0.03" />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                        <circle cx={`${20 + idx * 10}%`} cy={`${15 + idx * 6}%`} r="8" fill={`url(#g${idx})`} className="opacity-0 group-hover:opacity-80 transition-opacity duration-400" />
                        <circle cx={`${70 - idx * 6}%`} cy={`${65 - idx * 8}%`} r="6" fill={`url(#g${idx})`} className="opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* tagline / footer */}
        <motion.footer
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-400"
        >
          © {new Date().getFullYear()} AIverse — Student built. Design led.
        </motion.footer>
      </div>

      {/* ===== Inline CSS for particles, shimmer, icons, etc. ===== */}
      <style>{`
        /* shimmer text */
        .shimmer {
          background-image: linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.26) 40%, rgba(255,255,255,0.08) 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* icon wrap */
        .iconWrap {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(124,58,237,0.12), rgba(59,130,246,0.12));
          box-shadow: 0 6px 18px rgba(2,6,23,0.6);
          transition: transform .28s ease, box-shadow .28s ease;
        }
        .iconWrap:hover {
          transform: translateY(-4px) scale(1.06);
          box-shadow: 0 20px 50px rgba(99,102,241,0.18);
        }

        /* particle background (subtle floating dots) */
        .particles {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 10% 20%, rgba(99,102,241,0.06) 0px, transparent 40%),
            radial-gradient(circle at 40% 80%, rgba(236,72,153,0.04) 0px, transparent 30%),
            radial-gradient(circle at 80% 30%, rgba(59,130,246,0.05) 0px, transparent 35%),
            radial-gradient(circle at 70% 70%, rgba(124,58,237,0.03) 0px, transparent 25%);
          background-size: 300% 300%;
          animation: particleSlow 12s linear infinite;
        }
        @keyframes particleSlow {
          0% { background-position: 0% 0%; }
          50% { background-position: 50% 100%; }
          100% { background-position: 0% 0%; }
        }

        /* small responsive tweaks */
        @media (max-width: 640px) {
          .iconWrap { width: 48px; height: 48px; }
        }
      `}</style>
    </div>
  );
}
