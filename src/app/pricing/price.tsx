// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { ArrowRight, Check } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"

// export default function PricingPage() {
//   const router = useRouter()
//   const [isAnnual, setIsAnnual] = useState(true)

//   const plans = [
//     {
//       name: "Free",
//       description: "For individuals just getting started",
//       price: { monthly: 0, annual: 0 },
//       features: [
//         "Up to 5 forms",
//         "100 responses per month",
//         "Basic templates",
//         "Email support",
//         "Form analytics",
//         "1 user",
//       ],
//       limitations: ["No custom branding", "No team collaboration", "Basic analytics only"],
//       cta: "Start for Free",
//       highlight: false,
//     },
//     {
//       name: "Pro",
//       description: "For professionals and growing teams",
//       price: { monthly: 29, annual: 24 },
//       features: [
//         "Unlimited forms",
//         "10,000 responses per month",
//         "Advanced templates",
//         "Custom branding",
//         "Advanced analytics",
//         "File uploads",
//         "Form logic & branching",
//         "Data export (CSV, Excel)",
//         "Priority support",
//         "Up to 5 team members",
//       ],
//       limitations: [],
//       cta: "Start Free Trial",
//       highlight: true,
//     },
//     {
//       name: "Enterprise",
//       description: "For large organizations with specific needs",
//       price: { monthly: null, annual: null },
//       features: [
//         "Unlimited everything",
//         "Custom branding",
//         "Advanced security",
//         "HIPAA compliance",
//         "SSO integration",
//         "User management",
//         "API access",
//         "Dedicated account manager",
//         "Custom integrations",
//         "Unlimited team members",
//       ],
//       limitations: [],
//       cta: "Contact Sales",
//       highlight: false,
//     },
//   ]

//   return (
//     <div className="container mx-auto py-16 px-4">
//       <div className="text-center mb-16">
//         <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
//         <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//           Choose the plan that works best for you and your team, with no hidden fees.
//         </p>

//         <div className="flex items-center justify-center mt-8 space-x-3">
//           <Label htmlFor="billing-toggle" className={isAnnual ? "text-muted-foreground" : "font-medium"}>
//             Bill Monthly
//           </Label>
//           <Switch id="billing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
//           <Label htmlFor="billing-toggle" className={!isAnnual ? "text-muted-foreground" : "font-medium"}>
//             Bill Annually
//             <span className="ml-1.5 inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-100">
//               Save 17%
//             </span>
//           </Label>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//         {plans.map((plan, index) => (
//           <Card key={index} className={`relative flex flex-col ${plan.highlight ? "border-primary shadow-lg" : ""}`}>
//             {plan.highlight && (
//               <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
//                 Most Popular
//               </div>
//             )}
//             <CardHeader>
//               <CardTitle>{plan.name}</CardTitle>
//               <CardDescription>{plan.description}</CardDescription>
//               <div className="mt-4">
//                 {plan.price.monthly === null ? (
//                   <div className="text-4xl font-bold">Custom</div>
//                 ) : (
//                   <div className="flex items-baseline">
//                     <span className="text-4xl font-bold">${isAnnual ? plan.price.annual : plan.price.monthly}</span>
//                     <span className="text-muted-foreground ml-2">{plan.price.monthly > 0 ? "/mo" : ""}</span>
//                   </div>
//                 )}
//                 {isAnnual && plan.price.monthly > 0 && (
//                   <div className="text-muted-foreground text-sm mt-1">
//                     Billed annually (${plan.price.annual * 12}/year)
//                   </div>
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent className="flex-grow">
//               <div className="space-y-4">
//                 <p className="font-medium">What's included:</p>
//                 <ul className="space-y-2">
//                   {plan.features.map((feature, i) => (
//                     <li key={i} className="flex items-start">
//                       <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
//                       <span>{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//                 {plan.limitations.length > 0 && (
//                   <>
//                     <p className="font-medium mt-6">Limitations:</p>
//                     <ul className="space-y-2">
//                       {plan.limitations.map((limitation, i) => (
//                         <li key={i} className="flex items-start text-muted-foreground">
//                           <span className="mr-2">•</span>
//                           <span>{limitation}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </>
//                 )}
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Button
//                 variant={plan.highlight ? "default" : "outline"}
//                 className="w-full"
//                 onClick={() => {
//                   if (plan.name === "Free") {
//                     router.push("/signup")
//                   } else if (plan.name === "Pro") {
//                     router.push("/signup?plan=pro&billing=" + (isAnnual ? "annual" : "monthly"))
//                   } else {
//                     router.push("/contact")
//                   }
//                 }}
//               >
//                 {plan.cta}
//                 {plan.highlight && <ArrowRight className="ml-2 h-4 w-4" />}
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>

//       <div className="mt-20">
//         <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
//         <div className="max-w-3xl mx-auto space-y-6">
//           <FAQItem
//             question="What happens when I reach my response limit?"
//             answer="You'll still be able to access your existing responses, but you won't be able to collect new ones until you either upgrade your plan or wait for the next billing cycle. We'll send you an email notification when you're approaching your limit."
//           />
//           <FAQItem
//             question="Can I cancel my subscription at any time?"
//             answer="Yes, you can cancel your subscription at any time. If you cancel, you'll have access to your Pro features until the end of your current billing period. After that, your account will be downgraded to the Free plan."
//           />
//           <FAQItem
//             question="Do you offer discounts for nonprofits or educational institutions?"
//             answer="Yes! We offer special discounts for qualified nonprofit organizations and educational institutions. Please contact our sales team for more information about our discount programs."
//           />
//           <FAQItem
//             question="How does the 14-day free trial work?"
//             answer="Our 14-day free trial gives you full access to all Pro plan features with no obligation. No credit card is required to start your trial. At the end of your trial, you can choose to subscribe to continue using Pro features or your account will automatically switch to the Free plan."
//           />
//           <FAQItem
//             question="Can I change plans later?"
//             answer="You can upgrade, downgrade, or cancel your plan at any time through your account settings. If you upgrade, the change is immediate. If you downgrade, the change will take effect at the end of your current billing cycle."
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// function FAQItem({ question, answer }: { question: string; answer: string }) {
//   const [isOpen, setIsOpen] = useState(false)

//   return (
//     <div className="border rounded-lg overflow-hidden">
//       <button
//         className="flex justify-between items-center w-full p-4 text-left font-medium focus:outline-none"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {question}
//         <svg
//           className={`h-5 w-5 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//         </svg>
//       </button>
//       <div className={`px-4 pb-4 ${isOpen ? "block" : "hidden"}`}>
//         <p className="text-muted-foreground">{answer}</p>
//       </div>
//     </div>
//   )
// }

