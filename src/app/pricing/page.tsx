"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { message } from "antd";
import Footer from "@/components/footer";
import Header from "@/components/header";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For individuals just getting started",
    features: [
      "Up to 3 forms",
      "100 responses per month",
      "Basic form fields",
      "Email notifications",
      "Export to CSV",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For professionals and small teams",
    features: [
      "Unlimited forms",
      "10,000 responses per month",
      "Advanced form fields",
      "Conditional logic",
      "File uploads",
      "Custom branding",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$79",
    period: "per month",
    description: "For growing teams that need collaboration",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Team collaboration",
      "Role-based permissions",
      "Shared templates",
      "Team analytics dashboard",
      "Advanced security features",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations with specific needs",
    features: [
      "Everything in Team",
      "Unlimited team members",
      "SSO authentication",
      "Advanced security",
      "Dedicated account manager",
      "Custom integrations",
      "SLA",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSelectPlan = (planId: string) => {
    if (planId === "enterprise") {
      // Redirect to contact page for enterprise plan
      router.push("/contact");
    } else if (planId === "free") {
      // Free plan doesn't need subscription
      message.success("You're now on the Free plan!");
      router.push("/");
    } else {
      // For paid plans, redirect to subscription page
      router.push(`/subscribe?plan=${planId}`);
    }
  };

  return (
    <div>
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Plans for teams of all sizes
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Choose the plan that's right for you. All plans include a 14-day
            free trial.
          </p>

          <div className="mt-12 flex justify-center">
            <div className="relative bg-white rounded-full p-1 flex">
              <button
                type="button"
                className={`${
                  billingPeriod === "monthly"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-500"
                } relative py-2 px-6 border-transparent rounded-full text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10`}
                onClick={() => setBillingPeriod("monthly")}
              >
                Monthly billing
              </button>
              <button
                type="button"
                className={`${
                  billingPeriod === "annual"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-500"
                } relative py-2 px-6 border-transparent rounded-full text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10`}
                onClick={() => setBillingPeriod("annual")}
              >
                Annual billing
                <span className="ml-1 text-xs font-bold text-indigo-200">
                  (Save 20%)
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative p-8 bg-white border rounded-2xl shadow-sm flex flex-col ${
                plan.popular
                  ? "border-indigo-500 ring-2 ring-indigo-500"
                  : "border-gray-200"
              }`}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                  <span className="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {billingPeriod === "annual" &&
                    plan.price !== "Custom" &&
                    plan.price !== "$0"
                      ? `$${Math.round(Number.parseInt(plan.price.replace("$", "")) * 0.8)}`
                      : plan.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    {plan.period === "per month" && billingPeriod === "annual"
                      ? "/year"
                      : `/${plan.period}`}
                  </span>
                </div>
                <p className="mt-2 text-base text-gray-500">
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckIcon className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full ${
                    plan.popular
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  } border border-transparent rounded-md py-3 px-5 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                What's included in the free plan?
              </h3>
              <p className="text-gray-500">
                The free plan includes up to 3 forms, 100 responses per month,
                and basic form fields. It's perfect for individuals just getting
                started.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Can I upgrade or downgrade my plan later?
              </h3>
              <p className="text-gray-500">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                will be applied immediately, and your billing will be prorated
                accordingly.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How does the Team plan work?
              </h3>
              <p className="text-gray-500">
                The Team plan allows up to 10 team members to collaborate on
                forms. Each member can be assigned different roles with specific
                permissions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Do you offer custom plans for larger organizations?
              </h3>
              <p className="text-gray-500">
                Yes, our Enterprise plan is customizable to meet the specific
                needs of larger organizations. Contact our sales team to discuss
                your requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
