"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MagnifyingGlassIcon, ArrowRightIcon, StarIcon, ClockIcon, TagIcon } from "@heroicons/react/24/outline"
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid"
import { Spin } from "antd"
import Layout from "@/components/layout"

// Template categories
const categories = [
  { id: "all", name: "All Templates" },
  { id: "survey", name: "Surveys" },
  { id: "feedback", name: "Feedback" },
  { id: "registration", name: "Registration" },
  { id: "event", name: "Event" },
  { id: "education", name: "Education" },
  { id: "business", name: "Business" },
]

export default function TemplatesPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<{ templateId: string; variationId?: string } | null>(null)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem("templateFavorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }

    // Fetch templates from API
    fetchTemplates()
  }, [])

  useEffect(() => {
    if (selectedTemplate) {
      const { templateId, variationId } = selectedTemplate
      const id = variationId || templateId
      router.push(`/dashboard/form/create?template=${id}`)
      setSelectedTemplate(null) // Reset after navigation
    }
  }, [selectedTemplate, router])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/form-templates")
      if (!response.ok) {
        throw new Error("Failed to fetch templates")
      }
      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter templates based on active category and search query
  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = activeCategory === "all" || template.category === activeCategory
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFavorite = (id: string) => {
    let newFavorites
    if (favorites.includes(id)) {
      newFavorites = favorites.filter((favId) => favId !== id)
    } else {
      newFavorites = [...favorites, id]
    }
    setFavorites(newFavorites)
    localStorage.setItem("templateFavorites", JSON.stringify(newFavorites))
  }

  // Update the useTemplate function to handle both string and numeric IDs
  const handleUseTemplate = (templateId: string, variationId?: string) => {
    // Ensure templateId is a string
    const id = variationId || templateId;
    console.log("Redirecting to template:", id);
    setSelectedTemplate({ templateId, variationId });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
          <span className="ml-2">Loading templates...</span>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Header Section */}
      <div className="p-6">
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Form Templates</h1>
          <p className="text-gray-600">
            Choose from our pre-built templates to get started quickly or create your own from scratch.
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          className="mb-8 flex flex-col md:flex-row gap-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search templates..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Templates Section */}
        {activeCategory === "all" && searchQuery === "" && (
          <motion.div
            className="mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4">Popular Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates
                .filter((t) => t.popular)
                .map((template) => (
                  <div
                    key={template.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={template.image || "/placeholder.svg?height=160&width=280"}
                        alt={template.title}
                        className="w-full h-40 object-cover"
                      />
                      <button
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(template.id)
                        }}
                      >
                        {favorites.includes(template.id) ? (
                          <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                        ) : (
                          <StarIcon className="h-5 w-5 text-gray-400 hover:text-yellow-400" />
                        )}
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold">{template.title}</h3>
                        {template.new && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                      {template.variations && template.variations.length > 0 ? (
                        <div className="space-y-2">
                          {template.variations.map((variation: any) => (
                            <button
                              key={variation.id}
                              className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg font-medium text-sm flex items-center justify-center mb-2"
                              onClick={() => handleUseTemplate(template.id, variation.id)}
                            >
                              Use {variation.name} Template
                              <ArrowRightIcon className="h-4 w-4 ml-1" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <button
                          className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg font-medium text-sm flex items-center justify-center"
                          onClick={() => handleUseTemplate(template.id)}
                        >
                          Use Template
                          <ArrowRightIcon className="h-4 w-4 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* All Templates Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.3 }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {activeCategory === "all" ? "All Templates" : categories.find((c) => c.id === activeCategory)?.name}
            </h2>
            <span className="text-sm text-gray-500">{filteredTemplates.length} templates</span>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-gray-500 mb-4">We couldn't find any templates matching your search criteria.</p>
              <button
                className="text-indigo-600 font-medium"
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("all")
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={template.image || "/placeholder.svg?height=160&width=280"}
                      alt={template.title}
                      className="w-full h-40 object-cover"
                    />
                    <button
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(template.id)
                      }}
                    >
                      {favorites.includes(template.id) ? (
                        <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <StarIcon className="h-5 w-5 text-gray-400 hover:text-yellow-400" />
                      )}
                    </button>
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {template.new && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          New
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded-full flex items-center">
                        <TagIcon className="h-3 w-3 mr-1" />
                        {categories.find((c) => c.id === template.category)?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                    {template.variations && template.variations.length > 0 ? (
                      <div className="space-y-2">
                        {template.variations.map((variation: any) => (
                          <button
                            key={variation.id}
                            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg font-medium text-sm flex items-center justify-center mb-2"
                            onClick={() => handleUseTemplate(template.id, variation.id)}
                          >
                            Use {variation.name} Template
                            <ArrowRightIcon className="h-4 w-4 ml-1" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button
                        className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg font-medium text-sm flex items-center justify-center"
                        onClick={() => handleUseTemplate(template.id)}
                      >
                        Use Template
                        <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}

