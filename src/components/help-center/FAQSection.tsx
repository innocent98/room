"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    question: "How do I create my first form?",
    answer:
      "To create your first form, log in to your ROOM account and click on the 'Create New Form' button on your dashboard. You can start from scratch or use one of our templates. Our drag-and-drop builder makes it easy to add and customize fields.",
    category: "Getting Started",
  },
  {
    question: "Can I customize the design of my forms?",
    answer:
      "Yes! ROOM offers extensive customization options. You can change colors, fonts, add your logo, and even use custom CSS if you're on a Pro or Enterprise plan. Look for the 'Design' tab in the form editor to access these options.",
    category: "Customization",
  },
  {
    question: "How do I share my form with respondents?",
    answer:
      "Once your form is ready, click the 'Publish' button to make it live. You'll get a unique URL that you can share via email, social media, or embed on your website. You can also use our direct integrations with email marketing platforms.",
    category: "Sharing",
  },
  {
    question: "Where can I view responses to my form?",
    answer:
      "All form responses are available in the 'Responses' tab of your form dashboard. You can view individual responses, see summary statistics, or export the data in various formats including Excel, CSV, and PDF.",
    category: "Responses",
  },
  {
    question: "Is my form data secure?",
    answer:
      "Absolutely. ROOM uses industry-standard encryption for all data in transit and at rest. We're GDPR and CCPA compliant, and offer features like password protection and data retention policies to help you maintain privacy and security.",
    category: "Security",
  },
  {
    question: "What happens when I reach my plan's response limit?",
    answer:
      "When you approach your plan's response limit, you'll receive notifications. If you exceed the limit, your forms will continue to collect responses, but you'll need to upgrade your plan to access them. No data is ever lost.",
    category: "Billing",
  },
  {
    question: "Can I collaborate with my team on forms?",
    answer:
      "Yes, team collaboration is available on all paid plans. You can invite team members with different permission levels (admin, editor, viewer) to work on forms together. Changes are synced in real-time for seamless collaboration.",
    category: "Teams",
  },
  {
    question: "How do I set up conditional logic in my forms?",
    answer:
      "To set up conditional logic, select a field in your form and click the 'Logic' tab. From there, you can create rules like 'Show this question only if...' or 'Skip to section based on answer.' This helps create dynamic forms that adapt to respondents' answers.",
    category: "Advanced Features",
  },
]

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const categories = ["All", ...Array.from(new Set(faqs.map((faq) => faq.category)))]

  const filteredFAQs = activeCategory === "All" ? faqs : faqs.filter((faq) => faq.category === activeCategory)

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredFAQs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="border rounded-lg overflow-hidden"
          >
            <button
              className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <span className="font-medium">{faq.question}</span>
              <motion.div animate={{ rotate: expandedIndex === index ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 bg-gray-50 border-t">
                    <p className="text-gray-700">{faq.answer}</p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

