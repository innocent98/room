"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  BookOpen,
  MessageSquare,
  FileText,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ContactSupportForm from "@/components/help-center/ContactSUpportForm";
import FAQSection from "@/components/help-center/FAQSection";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // Mock search functionality
    const mockResults = [
      "How to create a form",
      "How to download responses",
      "What is the export limit",
      "How to set up conditional logic",
      "How to share my form",
    ].filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));

    setSearchResults(mockResults);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex items-center mb-8"
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.3 }}
          >
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Help Center</h1>
          </motion.div>

          {/* Search Section */}
          <motion.div
            className="mb-12"
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                How can we help you today?
              </h2>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white/30"
                  />
                </div>
                <Button type="submit" variant="secondary">
                  Search
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <motion.div
              className="mb-12 bg-white rounded-xl border p-6 shadow-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4">Search Results</h2>
              <ul className="space-y-2">
                {searchResults.map((result, index) => (
                  <li key={index}>
                    <Link
                      href={`#${result.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {result}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Quick Links */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Documentation</h3>
              <p className="text-gray-600 mb-4">
                Explore our comprehensive guides and tutorials.
              </p>
              <Link
                href="/documentation"
                className="text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Browse Documentation →
              </Link>
            </div>

            <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Community Forum</h3>
              <p className="text-gray-600 mb-4">
                Connect with other users and share knowledge.
              </p>
              <Link
                href="/forum"
                className="text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Join Discussion →
              </Link>
            </div>

            <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Video Tutorials</h3>
              <p className="text-gray-600 mb-4">
                Watch step-by-step guides to master ROOM.
              </p>
              <Link
                href="/tutorials"
                className="text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Watch Tutorials →
              </Link>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <FAQSection />
          </motion.div>

          {/* Contact Support Form */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <ContactSupportForm />
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
