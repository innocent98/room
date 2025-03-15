"use client"

import type React from "react"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle, Heart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-16 px-4">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          At ROOM, we're on a mission to make form creation and data collection accessible, intuitive, and powerful for
          everyone - from individuals to large enterprises.
        </p>
        <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
          <Image src="/placeholder.svg?height=800&width=1200" alt="ROOM Team" fill className="object-cover" />
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-4xl mx-auto mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="mb-4">
              ROOM was founded in 2023 by a team of product designers and developers who were frustrated by the
              limitations of existing form builders. We saw an opportunity to create something better - a platform that
              combines beautiful design with powerful functionality.
            </p>
            <p className="mb-4">
              We started with a simple idea: form building shouldn't be complicated. Since then, we've grown to serve
              thousands of customers worldwide, from solo entrepreneurs to Fortune 500 companies.
            </p>
            <p>
              Our team is now distributed across the globe, working remotely but united by our shared mission to
              transform how people collect and analyze data.
            </p>
          </div>
          <div className="relative h-[300px] rounded-xl overflow-hidden shadow-md">
            <Image src="/placeholder.svg?height=600&width=800" alt="ROOM Origin Story" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-4xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <ValueCard
            icon={<CheckCircle className="h-10 w-10" />}
            title="Quality First"
            description="We believe in building products that are reliable, secure, and delightful to use. We never compromise on quality."
          />
          <ValueCard
            icon={<Users className="h-10 w-10" />}
            title="Customer Focused"
            description="Every decision we make is guided by what's best for our users. Your success is our success."
          />
          <ValueCard
            icon={<Heart className="h-10 w-10" />}
            title="Passion & Purpose"
            description="We're passionate about our work and driven by our mission to make data collection easier for everyone."
          />
        </div>
      </section>

      {/* Leadership Team */}
      <section className="max-w-4xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Leadership</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <TeamMember
            name="Sarah Johnson"
            role="Co-Founder & CEO"
            bio="Former UX lead at Google with 15+ years of experience in product design and development."
            imageUrl="/placeholder.svg?height=400&width=400"
          />
          <TeamMember
            name="Michael Chen"
            role="Co-Founder & CTO"
            bio="Full-stack developer with a background in data science and AI. Previously founded two tech startups."
            imageUrl="/placeholder.svg?height=400&width=400"
          />
          <TeamMember
            name="Emily Rodriguez"
            role="Chief Product Officer"
            bio="Product management expert with experience scaling SaaS products at Salesforce and Dropbox."
            imageUrl="/placeholder.svg?height=400&width=400"
          />
        </div>
      </section>

      {/* Join Us */}
      <section className="max-w-4xl mx-auto py-12 px-8 bg-muted rounded-xl text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          We're always looking for talented individuals who share our vision and values. Check out our current openings
          or reach out to discuss how you can contribute.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => router.push("/careers")}>
            View Open Positions
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push("/contact")}>
            Contact Us
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto mt-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience ROOM?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied users who are simplifying their data collection with ROOM.
        </p>
        <Button size="lg" onClick={() => router.push("/signup")} className="px-8">
          Get Started Free
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>
    </div>
  )
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
      <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
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
    <div className="flex flex-col items-center text-center">
      <div className="relative h-52 w-52 rounded-full overflow-hidden mb-4 border-4 border-background shadow-md">
        <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-primary font-medium mb-2">{role}</p>
      <p className="text-muted-foreground">{bio}</p>
    </div>
  )
}

