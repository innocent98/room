"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckIcon } from "@heroicons/react/24/outline"
import Layout from "@/components/layout"
import { message, Spin } from "antd"

export default function SubscribePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("plan")

  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [processing, setProcessing] = useState(false)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    if (!planId) {
      router.push("/pricing")
      return
    }

    // Fetch plan details
    const fetchPlan = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/plans?id=${planId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch plan")
        }
        const data = await response.json()
        setPlan(data)
      } catch (error) {
        console.error("Error fetching plan:", error)
        message.error("Failed to load plan details")
        router.push("/pricing")
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [planId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      // In a real app, this would process payment and create subscription
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      // Create subscription
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: plan.id,
          // Add payment details if needed
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create subscription")
      }

      message.success("Subscription successful!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error processing subscription:", error)
      message.error("Failed to process subscription")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
          <span className="ml-2">Loading plan details...</span>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Subscribe to {plan?.name || "Pro"} Plan
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Complete your subscription to get access to premium features.
          </p>
        </motion.div>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12">
          <motion.div
            className="lg:col-span-7"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Payment Information</h2>

              <div className="mb-6">
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-md ${
                      paymentMethod === "credit_card"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 border-2"
                        : "bg-white border-gray-300 text-gray-700 border"
                    }`}
                    onClick={() => setPaymentMethod("credit_card")}
                  >
                    Credit Card
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-md ${
                      paymentMethod === "paypal"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 border-2"
                        : "bg-white border-gray-300 text-gray-700 border"
                    }`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    PayPal
                  </button>
                </div>
              </div>

              {paymentMethod === "credit_card" ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 font-medium"
                    disabled={processing}
                  >
                    {processing ? "Processing..." : "Subscribe Now"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="mb-6 text-gray-600">You'll be redirected to PayPal to complete your payment.</p>
                  <button
                    type="button"
                    className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 font-medium"
                    onClick={handleSubmit}
                    disabled={processing}
                  >
                    {processing ? "Processing..." : "Pay with PayPal"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="mt-8 lg:mt-0 lg:col-span-5"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">{plan?.name || "Pro"} Plan</span>
                <span className="font-medium">{plan?.price || "$29"}/month</span>
              </div>
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{plan?.price || "$29"}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-lg font-bold">{plan?.price || "$29"}</span>
                </div>
              </div>
              <div className="bg-white rounded-md p-4 border border-gray-200 mb-4">
                <h3 className="font-medium text-gray-900 mb-2">What's included:</h3>
                <ul className="space-y-2">
                  {plan?.features ? (
                    JSON.parse(plan.features).map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">Unlimited forms</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">10,000 responses per month</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">Advanced form fields</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">Priority support</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <p className="text-sm text-gray-500">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

