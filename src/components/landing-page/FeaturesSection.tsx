import { motion } from "framer-motion";
import { CheckCircleIcon, ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const features = [
  {
    id: "forms",
    title: "Intuitive Form Builder",
    description:
      "Create beautiful forms with our drag-and-drop builder. No coding required. Design surveys, quizzes, and feedback forms that engage your audience and collect the data you need.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
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
    description:
      "Collect, analyze, and manage responses in one place. Get real-time insights with beautiful charts and graphs that help you make data-driven decisions faster.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
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
    description:
      "Work together with your team to create and manage forms. Share templates, provide feedback, and track changes in real-time for seamless collaboration.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
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
    description:
      "Connect with your favorite tools and services. Automate workflows and save time by integrating ROOM with the apps you already use every day.",
    image:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    bullets: ["Google Workspace", "Slack", "Zapier", "Mailchimp", "Webhooks"],
  },
];

export default function FeaturesSection() {
  const [activeTab, setActiveTab] = useState("forms");

  return (
    <section id="features" className="py-20 bg-gray-50 overflow-hidden">
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

        <div className="mt-16">
          <div className="flex overflow-x-auto pb-4 mb-8 space-x-4 scrollbar-hide justify-center">
            {features.map((feature) => (
              <button
                key={feature.id}
                className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                  activeTab === feature.id
                    ? "bg-indigo-100 text-indigo-700 shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
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
              <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
                <motion.div
                  className="lg:col-span-5"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-10">
                    <ul className="space-y-5">
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
                        href="/auth/sign-up"
                        className="text-base font-medium text-indigo-600 hover:text-indigo-500 flex items-center group"
                      >
                        Get started with {feature.title.toLowerCase()}
                        <ArrowRightIcon className="ml-1 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
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
                    <div className="aspect-w-16 aspect-h-9 rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                      <Image
                        src={feature.image || "/placeholder.svg"}
                        alt={feature.title}
                        width={800}
                        height={450}
                        className="object-cover object-center w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/10 to-purple-900/5"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
