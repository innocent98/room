import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80')] bg-cover opacity-[0.05]"></div>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between relative">
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
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-all duration-200 transform hover:scale-105"
            >
              Get started
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
            >
              Contact sales
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
