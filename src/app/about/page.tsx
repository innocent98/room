"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Heart, Users, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function AboutPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
   <div>
    <Header />
    <div className="container mx-auto py-16 px-4">
      {/* Hero Section */}
      <motion.section
        className="max-w-5xl mx-auto text-center mb-20"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Our Mission
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
          At ROOM, we're on a mission to make form creation and data collection accessible, intuitive, and powerful for
          everyone - from individuals to large enterprises.
        </p>
        <motion.div
          className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
            alt="ROOM Team Collaboration"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-8 text-white text-left">
              <h3 className="text-2xl font-bold mb-2">Collaboration that inspires</h3>
              <p className="text-white/80">Building tools that bring people together</p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Our Story */}
      <motion.section
        className="max-w-4xl mx-auto mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 relative">
              Our Story
              <span className="absolute -bottom-2 left-0 w-20 h-1 bg-indigo-600"></span>
            </h2>
            <p className="mb-4 text-muted-foreground">
              ROOM was founded in 2023 by a team of product designers and developers who were frustrated by the
              limitations of existing form builders. We saw an opportunity to create something better - a platform that
              combines beautiful design with powerful functionality.
            </p>
            <p className="mb-4 text-muted-foreground">
              We started with a simple idea: form building shouldn't be complicated. Since then, we've grown to serve
              thousands of customers worldwide, from solo entrepreneurs to Fortune 500 companies.
            </p>
            <p className="text-muted-foreground">
              Our team is now distributed across the globe, working remotely but united by our shared mission to
              transform how people collect and analyze data.
            </p>
          </div>
          <motion.div
            className="relative h-[350px] rounded-2xl overflow-hidden shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
              alt="ROOM Origin Story"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Core Values */}
      <motion.section
        className="max-w-4xl mx-auto mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div variants={fadeIn} transition={{ duration: 0.5 }}>
            <ValueCard
              icon={<CheckCircle className="h-10 w-10" />}
              title="Quality First"
              description="We believe in building products that are reliable, secure, and delightful to use. We never compromise on quality."
              color="from-blue-500 to-indigo-600"
            />
          </motion.div>
          <motion.div variants={fadeIn} transition={{ duration: 0.5 }}>
            <ValueCard
              icon={<Users className="h-10 w-10" />}
              title="Customer Focused"
              description="Every decision we make is guided by what's best for our users. Your success is our success."
              color="from-indigo-500 to-purple-600"
            />
          </motion.div>
          <motion.div variants={fadeIn} transition={{ duration: 0.5 }}>
            <ValueCard
              icon={<Heart className="h-10 w-10" />}
              title="Passion & Purpose"
              description="We're passionate about our work and driven by our mission to make data collection easier for everyone."
              color="from-purple-500 to-pink-600"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="max-w-5xl mx-auto mb-24 py-16 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-5xl font-bold mb-2">1M+</h3>
            <p className="text-white/80">Forms Created</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold mb-2">50M+</h3>
            <p className="text-white/80">Responses Collected</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold mb-2">98%</h3>
            <p className="text-white/80">Customer Satisfaction</p>
          </div>
        </div>
      </motion.section>

      {/* Leadership Team */}
      <motion.section
        className="max-w-4xl mx-auto mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Leadership</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div variants={fadeIn} transition={{ duration: 0.5 }}>
            <TeamMember
              name="Sarah Johnson"
              role="Co-Founder & CEO"
              bio="Former UX lead at Google with 15+ years of experience in product design and development."
              imageUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=988&auto=format&fit=crop"
            />
          </motion.div>
          <motion.div variants={fadeIn} transition={{ duration: 0.5 }}>
            <TeamMember
              name="Michael Chen"
              role="Co-Founder & CTO"
              bio="Full-stack developer with a background in data science and AI. Previously founded two tech startups."
              imageUrl="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=987&auto=format&fit=crop"
            />
          </motion.div>
          <motion.div variants={fadeIn} transition={{ duration: 0.5 }}>
            <TeamMember
              name="Emily Rodriguez"
              role="Chief Product Officer"
              bio="Product management expert with experience scaling SaaS products at Salesforce and Dropbox."
              imageUrl="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1022&auto=format&fit=crop"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Global Presence */}
      <motion.section
        className="max-w-4xl mx-auto mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative h-[350px] rounded-2xl overflow-hidden shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1974&auto=format&fit=crop"
              alt="Global Presence"
              fill
              className="object-cover"
            />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold mb-6 relative">
              Global Presence
              <span className="absolute -bottom-2 left-0 w-20 h-1 bg-indigo-600"></span>
            </h2>
            <p className="mb-4 text-muted-foreground">
              With team members and customers across six continents, ROOM is truly a global company. We embrace
              diversity and believe that our different perspectives make our product stronger.
            </p>
            <p className="mb-4 text-muted-foreground">
              Our platform is available in 12 languages and complies with data regulations worldwide, including GDPR and
              CCPA.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <Globe className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium">Available in 12 languages</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Zap className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium">24/7 global support</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Join Us */}
      <motion.section
        className="max-w-4xl mx-auto py-16 px-8 bg-muted rounded-2xl text-center mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
          We're always looking for talented individuals who share our vision and values. Check out our current openings
          or reach out to discuss how you can contribute.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => router.push("#")} className="rounded-full px-8">
            View Open Positions
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push("/help")} className="rounded-full px-8">
            Contact Us
          </Button>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="max-w-4xl mx-auto mt-20 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Experience ROOM?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
          Join thousands of satisfied users who are simplifying their data collection with ROOM.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Button
            size="lg"
            onClick={() => router.push("/auth/sign-up")}
            className="rounded-full px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </motion.section>
    </div>
    <Footer />
   </div>
  )
}

function ValueCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  return (
    <motion.div
      className="flex flex-col items-center text-center p-8 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`h-16 w-16 rounded-full bg-gradient-to-br ${color} text-white flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  )
}

function TeamMember({
  name,
  role,
  bio,
  imageUrl,
}: {
  name: string
  role: string
  bio: string
  imageUrl: string
}) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative h-52 w-52 rounded-full overflow-hidden mb-6 border-4 border-background shadow-lg">
        <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-indigo-600 font-medium mb-3">{role}</p>
      <p className="text-muted-foreground">{bio}</p>
    </motion.div>
  )
}

