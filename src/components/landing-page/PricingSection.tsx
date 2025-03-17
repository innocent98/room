import { motion } from "framer-motion";
import { CheckCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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
    url: "/auth/sign-up",
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
    url: "/subscribe?plan=pro",
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

export default function PricingSection() {
  const router = useRouter();
  return (
    <section id="pricing" className="py-20 bg-gray-50">
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

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative p-8 bg-white border rounded-2xl shadow-lg flex flex-col transform transition-all duration-300 hover:-translate-y-2 ${
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
                  <span className="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-md">
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

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => router.push(plan.url ?? "")}
                  className={`w-full ${
                    plan.popular
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  } border border-transparent rounded-md py-3 px-5 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200`}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
