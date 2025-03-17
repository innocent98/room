"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/components/landing-page/HeroSection";
import StatSection from "@/components/landing-page/StatSection";
import FeaturesSection from "@/components/landing-page/FeaturesSection";
import TestimonialsSection from "@/components/landing-page/TestimonialsSection";
import PricingSection from "@/components/landing-page/PricingSection";
import CTASection from "@/components/landing-page/CTASection";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
