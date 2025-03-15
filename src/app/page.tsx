"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  const [activeTab, setActiveTab] = useState("forms");

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const features = [
    {
      id: "forms",
      title: "Intuitive Form Builder",
      description:
        "Create beautiful forms with our drag-and-drop builder. No coding required.",
      image: "/placeholder.svg?height=400&width=600",
      bullets: [
        "Drag-and-drop interface",
        "40+ field types",
        "Conditional logic",
        "Custom themes",
        "Mobile responsive",
      ],
    },
    {
      id: "responses",
      title: "Powerful Response Management",
      description: "Collect, analyze, and manage responses in one place.",
      image: "/placeholder.svg?height=400&width=600",
      bullets: [
        "Real-time responses",
        "Advanced filtering",
        "Export to Excel, CSV, PDF",
        "Response notifications",
        "Data visualization",
      ],
    },
    {
      id: "collaboration",
      title: "Team Collaboration",
      description: "Work together with your team to create and manage forms.",
      image: "/placeholder.svg?height=400&width=600",
      bullets: [
        "Role-based permissions",
        "Comment and feedback",
        "Version history",
        "Shared templates",
        "Activity tracking",
      ],
    },
    {
      id: "integrations",
      title: "Seamless Integrations",
      description: "Connect with your favorite tools and services.",
      image: "/placeholder.svg?height=400&width=600",
      bullets: ["Google Workspace", "Slack", "Zapier", "Mailchimp", "Webhooks"],
    },
  ];

  const testimonials = [
    {
      id: 1,
      quote:
        "ROOM has transformed how we collect feedback from our customers. The interface is intuitive and the analytics are powerful.",
      author: "Sarah Johnson",
      title: "Product Manager at TechCorp",
      avatar: "/placeholder.svg?height=64&width=64",
      rating: 5,
    },
    {
      id: 2,
      quote:
        "We've tried many form builders, but ROOM stands out with its ease of use and powerful features. It's become an essential tool for our marketing team.",
      author: "Michael Chen",
      title: "Marketing Director at GrowthLabs",
      avatar: "/placeholder.svg?height=64&width=64",
      rating: 5,
    },
    {
      id: 3,
      quote:
        "The team collaboration features in ROOM have made it so much easier to work together on surveys and forms. Highly recommended!",
      author: "Emily Rodriguez",
      title: "Research Lead at DataInsights",
      avatar: "/placeholder.svg?height=64&width=64",
      rating: 4,
    },
  ];

  const pricingPlans = [
    {
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
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations with specific needs",
      features: [
        "Everything in Pro",
        "Unlimited responses",
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

  return (
    <div className="bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <motion.h1
                className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5 }}
              >
                <span className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                  Create, Share, and Analyze Forms with Ease
                </span>
              </motion.h1>
              <motion.p
                className="mt-6 text-base text-gray-500 sm:text-lg md:text-xl"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                ROOM helps you build professional forms and surveys in minutes.
                Collect responses, analyze data, and make better decisions.
              </motion.p>
              <motion.div
                className="mt-8 sm:flex sm:justify-center lg:justify-start"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="rounded-md shadow">
                  <Link
                    href="/signup"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started Free
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    href="#features"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img
                    className="w-full"
                    src="/placeholder.svg?height=400&width=600"
                    alt="Form builder screenshot"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      className="relative flex items-center justify-center bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <span className="sr-only">Watch demo</span>
                      <svg
                        className="h-8 w-8 text-indigo-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-indigo-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-3xl font-extrabold text-white sm:text-4xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
            >
              Trusted by thousands of organizations worldwide
            </motion.h2>
          </div>
          <motion.dl
            className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="flex flex-col" variants={fadeIn}>
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
                Forms Created
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                1M+
              </dd>
            </motion.div>
            <motion.div
              className="flex flex-col mt-10 sm:mt-0"
              variants={fadeIn}
            >
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
                Responses Collected
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                50M+
              </dd>
            </motion.div>
            <motion.div
              className="flex flex-col mt-10 sm:mt-0"
              variants={fadeIn}
            >
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
                Customer Satisfaction
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                98%
              </dd>
            </motion.div>
          </motion.dl>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Everything you need to succeed
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Powerful features to help you create forms, collect responses, and
              make better decisions.
            </p>
          </motion.div>

          <div className="mt-12">
            <div className="flex overflow-x-auto pb-4 mb-6 space-x-4 scrollbar-hide">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    activeTab === feature.id
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab(feature.id)}
                >
                  {feature.title}
                </button>
              ))}
            </div>

            {features.map((feature) => (
              <div
                key={feature.id}
                className={`${activeTab === feature.id ? "block" : "hidden"}`}
              >
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                  <motion.div
                    className="lg:col-span-5"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-lg text-gray-500">
                      {feature.description}
                    </p>
                    <div className="mt-10">
                      <ul className="space-y-4">
                        {feature.bullets.map((bullet, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                          >
                            <div className="flex-shrink-0">
                              <CheckCircleIcon className="h-6 w-6 text-green-500" />
                            </div>
                            <p className="ml-3 text-base text-gray-700">
                              {bullet}
                            </p>
                          </motion.li>
                        ))}
                      </ul>
                      <div className="mt-10">
                        <Link
                          href="/signup"
                          className="text-base font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                        >
                          Get started with {feature.title.toLowerCase()}
                          <ArrowRightIcon className="ml-1 h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="mt-12 lg:mt-0 lg:col-span-7"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="relative lg:pl-10">
                      <div className="aspect-w-3 aspect-h-2 rounded-lg shadow-lg overflow-hidden">
                        <img
                          src={feature.image || "/placeholder.svg"}
                          alt={feature.title}
                          className="object-cover object-center"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              Testimonials
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Loved by businesses worldwide
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Don't just take our word for it. Here's what our customers have to
              say.
            </p>
          </motion.div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-100"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.author}
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-gray-900">
                        {testimonial.author}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              Pricing
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Plans for teams of all sizes
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Choose the plan that's right for you. All plans include a 14-day
              free trial.
            </p>
          </motion.div>

          <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`relative p-8 bg-white border rounded-2xl shadow-sm flex flex-col ${
                  plan.popular
                    ? "border-indigo-500 ring-2 ring-indigo-500"
                    : "border-gray-200"
                }`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
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
                      {plan.price}
                    </span>
                    <span className="ml-1 text-xl font-semibold text-gray-500">
                      /{plan.period}
                    </span>
                  </div>
                  <p className="mt-2 text-base text-gray-500">
                    {plan.description}
                  </p>

                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">
                          {feature}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  <button
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-indigo-200">
                Create your first form today.
              </span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-indigo-200">
              Join thousands of satisfied customers who use ROOM to create forms
              that get results.
            </p>
          </motion.div>
          <motion.div
            className="mt-8 flex lg:mt-0 lg:flex-shrink-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Contact sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
