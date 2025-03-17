import { motion } from "framer-motion";
import React from "react";

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

export default function StatSection() {
  return (
    <section className="bg-gradient-to-r from-indigo-700 to-purple-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80')] bg-cover opacity-[0.05]"></div>
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
            <dd className="order-1 text-5xl font-extrabold text-white">1M+</dd>
          </motion.div>
          <motion.div className="flex flex-col mt-10 sm:mt-0" variants={fadeIn}>
            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
              Responses Collected
            </dt>
            <dd className="order-1 text-5xl font-extrabold text-white">50M+</dd>
          </motion.div>
          <motion.div className="flex flex-col mt-10 sm:mt-0" variants={fadeIn}>
            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
              Customer Satisfaction
            </dt>
            <dd className="order-1 text-5xl font-extrabold text-white">98%</dd>
          </motion.div>
        </motion.dl>
      </div>
    </section>
  );
}
