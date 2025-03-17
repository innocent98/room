import { motion } from "framer-motion";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const testimonials = [
  {
    id: 1,
    quote:
      "ROOM has transformed how we collect feedback from our customers. The interface is intuitive and the analytics are powerful.",
    author: "Sarah Johnson",
    title: "Product Manager at TechCorp",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "We've tried many form builders, but ROOM stands out with its ease of use and powerful features. It's become an essential tool for our marketing team.",
    author: "Michael Chen",
    title: "Marketing Director at GrowthLabs",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "The team collaboration features in ROOM have made it so much easier to work together on surveys and forms. Highly recommended!",
    author: "Emily Rodriguez",
    title: "Research Lead at DataInsights",
    avatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 4,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-white overflow-hidden">
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

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-14 w-14 rounded-full object-cover border-2 border-indigo-100"
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.author}
                      width={56}
                      height={56}
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900">
                      {testimonial.author}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
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
                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
