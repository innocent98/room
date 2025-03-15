"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Modal, Input, Tabs, Card, Tag, Button, Empty, Spin } from "antd"
import { SearchOutlined, StarOutlined, StarFilled } from "@ant-design/icons"

const { TabPane } = Tabs

// Template categories
const categories = [
  { key: "all", name: "All Templates" },
  { key: "survey", name: "Surveys" },
  { key: "feedback", name: "Feedback" },
  { key: "registration", name: "Registration" },
  { key: "event", name: "Event" },
  { key: "education", name: "Education" },
  { key: "business", name: "Business" },
]

interface Template {
  id: string
  title: string
  description: string
  category: string
  fields: any[]
  image?: string
  popular?: boolean
  new?: boolean
  variations?: {
    id: string
    name: string
    description: string
    fields?: any[]
  }[]
}

interface TemplateSelectionModalProps {
  visible: boolean
  onClose: () => void
  onSelectTemplate: (templateId: string, template: any) => void
}

export default function TemplateSelectionModal({ visible, onClose, onSelectTemplate }: TemplateSelectionModalProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)

  // Load templates when modal becomes visible
  useEffect(() => {
    if (visible) {
      fetchTemplates()
    }
  }, [visible])

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("templateFavorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/form-templates")
      if (!response.ok) {
        throw new Error("Failed to fetch templates")
      }

      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      console.error("Error fetching templates:", error)
      // Fallback to empty array if API fails
      setTemplates([])
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

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    let newFavorites
    if (favorites.includes(id)) {
      newFavorites = favorites.filter((favId) => favId !== id)
    } else {
      newFavorites = [...favorites, id]
    }
    setFavorites(newFavorites)
    localStorage.setItem("templateFavorites", JSON.stringify(newFavorites))
  }

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template)
    if (template.variations && template.variations.length > 0) {
      setSelectedVariation(template.variations[0].id)
    } else {
      setSelectedVariation(template.id)
    }
  }

  // Update the handleUseTemplate function to better handle template IDs
  const handleUseTemplate = async () => {
    if (selectedTemplate && selectedVariation) {
      try {
        console.log("Using template:", selectedTemplate.id, "variation:", selectedVariation)

        // If it's a variation, fetch the specific template variation
        let templateData

        if (selectedTemplate.variations) {
          const variation = selectedTemplate.variations.find((v) => v.id === selectedVariation)

          if (variation && variation.fields) {
            templateData = {
              ...selectedTemplate,
              fields: variation.fields,
              title: `${selectedTemplate.title} - ${variation.name}`,
            }
            console.log("Using variation from memory:", variation.name)
          } else {
            // Fetch the variation from the API
            console.log("Fetching variation from API:", selectedVariation)
            const response = await fetch(`/api/form-templates?id=${selectedVariation}`)
            if (!response.ok) {
              console.error("API error:", await response.text())
              throw new Error("Failed to fetch template variation")
            }
            templateData = await response.json()
            console.log("Received template data from API")
          }
        } else {
          templateData = selectedTemplate
          console.log("Using template without variations")
        }

        onSelectTemplate(selectedVariation, templateData)
        onClose()
      } catch (error) {
        console.error("Error loading template:", error)
        // Fallback to just using the template ID
        onSelectTemplate(selectedVariation, selectedTemplate)
        onClose()
      }
    }
  }

  const handleBackToTemplates = () => {
    setSelectedTemplate(null)
    setSelectedVariation(null)
  }

  return (
    <Modal
      title={selectedTemplate ? `Select Template Variation: ${selectedTemplate.title}` : "Choose a Template"}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={
        selectedTemplate ? (
          <div className="flex justify-between">
            <Button onClick={handleBackToTemplates}>Back to Templates</Button>
            <Button type="primary" onClick={handleUseTemplate} disabled={!selectedVariation}>
              Use Template
            </Button>
          </div>
        ) : null
      }
    >
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
          <span className="ml-2">Loading templates...</span>
        </div>
      ) : !selectedTemplate ? (
        <>
          <div className="mb-4">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs activeKey={activeCategory} onChange={setActiveCategory}>
            {categories.map((category) => (
              <TabPane tab={category.name} key={category.key}>
                {filteredTemplates.length === 0 ? (
                  <Empty description="No templates found" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTemplates.map((template) => (
                      <Card
                        key={template.id}
                        hoverable
                        cover={
                          <img
                            alt={template.title}
                            src={template.image || "/placeholder.svg?height=120&width=200"}
                            className="h-32 object-cover"
                          />
                        }
                        onClick={() => handleSelectTemplate(template)}
                        className="cursor-pointer"
                        extra={
                          <Button
                            type="text"
                            icon={
                              favorites.includes(template.id) ? (
                                <StarFilled style={{ color: "#faad14" }} />
                              ) : (
                                <StarOutlined />
                              )
                            }
                            onClick={(e) => toggleFavorite(template.id, e)}
                          />
                        }
                      >
                        <Card.Meta
                          title={
                            <div className="flex items-center">
                              {template.title}
                              {template.new && (
                                <Tag color="green" className="ml-2">
                                  New
                                </Tag>
                              )}
                              {template.popular && (
                                <Tag color="blue" className="ml-2">
                                  Popular
                                </Tag>
                              )}
                            </div>
                          }
                          description={template.description}
                        />
                        <div className="mt-2 text-xs text-gray-500">
                          {template.variations?.length || 1} variation{template.variations?.length !== 1 ? "s" : ""}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabPane>
            ))}
          </Tabs>
        </>
      ) : (
        <div>
          <div className="mb-4 flex items-center">
            <img
              src={selectedTemplate.image || "/placeholder.svg?height=120&width=200"}
              alt={selectedTemplate.title}
              className="w-24 h-24 object-cover rounded mr-4"
            />
            <div>
              <h3 className="text-lg font-medium">{selectedTemplate.title}</h3>
              <p className="text-gray-500">{selectedTemplate.description}</p>
            </div>
          </div>

          <h4 className="font-medium mb-2">Select a Variation:</h4>
          <div className="grid grid-cols-1 gap-3">
            {selectedTemplate.variations?.map((variation) => (
              <div
                key={variation.id}
                className={`border rounded-lg p-4 cursor-pointer ${
                  selectedVariation === variation.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
                onClick={() => setSelectedVariation(variation.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{variation.name}</h4>
                    <p className="text-sm text-gray-500">{variation.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border ${
                      selectedVariation === variation.id ? "border-indigo-500 bg-indigo-500" : "border-gray-300"
                    }`}
                  >
                    {selectedVariation === variation.id && (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}

