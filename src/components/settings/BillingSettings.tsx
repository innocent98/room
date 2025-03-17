"use client"

import { useState, useEffect } from "react"
import { message, Modal } from "antd"
import { CreditCardIcon } from "@heroicons/react/24/outline"

interface BillingData {
  plan: {
    name: string
    status: string
    renewalDate: string
  }
  paymentMethods: {
    id: string
    type: string
    last4: string
    expiryDate: string
    isDefault: boolean
  }[]
  invoices: {
    id: string
    date: string
    description: string
    amount: string
    status: string
  }[]
}

export default function BillingSettings() {
  const [loading, setLoading] = useState(false)
  const [billingData, setBillingData] = useState<BillingData | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/billing")

      if (!response.ok) {
        throw new Error("Failed to fetch billing data")
      }

      const data = await response.json()
      setBillingData(data)
    } catch (error) {
      console.error("Error fetching billing data:", error)
      message.error("Failed to load billing data")

      // Set mock data if API fails
      setBillingData({
        plan: {
          name: "Pro Plan",
          status: "Active",
          renewalDate: "October 15, 2023",
        },
        paymentMethods: [
          {
            id: "pm_1",
            type: "Visa",
            last4: "4242",
            expiryDate: "12/2024",
            isDefault: true,
          },
        ],
        invoices: [
          {
            id: "inv_1",
            date: "Sep 15, 2023",
            description: "Pro Plan - Monthly",
            amount: "$29.99",
            status: "Paid",
          },
          {
            id: "inv_2",
            date: "Aug 15, 2023",
            description: "Pro Plan - Monthly",
            amount: "$29.99",
            status: "Paid",
          },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePlan = () => {
    message.info("Plan change functionality will be implemented soon")
  }

  const handleCancelSubscription = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/subscription", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to cancel subscription")
      }

      message.success("Subscription cancelled successfully")

      // Update the billing data
      if (billingData) {
        setBillingData({
          ...billingData,
          plan: {
            ...billingData.plan,
            status: "Cancelled",
          },
        })
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error)
      message.error("Failed to cancel subscription")
    } finally {
      setLoading(false)
      setShowCancelModal(false)
    }
  }

  const handleEditPaymentMethod = () => {
    message.info("Payment method editing will be implemented soon")
  }

  const handleAddPaymentMethod = () => {
    message.info("Adding payment method will be implemented soon")
  }

  if (!billingData) {
    return (
      <div className="text-center py-8">
        <p>Loading billing information...</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Billing & Subscription</h2>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-indigo-800">{billingData.plan.name}</h3>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
            {billingData.plan.status}
          </span>
        </div>
        <p className="text-indigo-700 mb-4">Your subscription renews on {billingData.plan.renewalDate}</p>
        <div className="flex space-x-4">
          <button
            className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 font-medium"
            onClick={handleChangePlan}
          >
            Change Plan
          </button>
          <button
            className="text-indigo-600 hover:text-indigo-800 font-medium"
            onClick={() => setShowCancelModal(true)}
          >
            Cancel Subscription
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Payment Method</h3>
        {billingData.paymentMethods.map((method) => (
          <div key={method.id} className="border border-gray-200 rounded-md p-4 mb-4 flex items-center">
            <div className="bg-blue-100 p-2 rounded-md mr-4">
              <CreditCardIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">
                {method.type} ending in {method.last4}
              </p>
              <p className="text-sm text-gray-500">Expires {method.expiryDate}</p>
            </div>
            <button
              className="ml-auto text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              onClick={handleEditPaymentMethod}
            >
              Edit
            </button>
          </div>
        ))}
        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium" onClick={handleAddPaymentMethod}>
          + Add Payment Method
        </button>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium mb-4">Billing History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billingData.invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-800">
                    <a href="#">Download</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title="Cancel Subscription"
        open={showCancelModal}
        onOk={handleCancelSubscription}
        onCancel={() => setShowCancelModal(false)}
        okText="Yes, Cancel Subscription"
        okButtonProps={{ danger: true, loading }}
        cancelText="Keep Subscription"
      >
        <p>
          Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your
          current billing period.
        </p>
      </Modal>
    </div>
  )
}

