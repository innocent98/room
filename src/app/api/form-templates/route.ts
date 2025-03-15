import { type NextRequest, NextResponse } from "next/server";

// Template data
type Template = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  popular: boolean;
  new: boolean;
  variations: {
    id: string;
    name: string;
    description: string;
    fields: {
      id: string;
      type: string;
      label: string;
      placeholder?: string;
      required: boolean;
      options?: string[];
    }[];
  }[];
};

// Template data
const templates: { [key: string]: Template } = {
  "customer-feedback": {
    id: "customer-feedback",
    title: "Customer Satisfaction Survey",
    description: "Collect feedback about your products or services",
    category: "feedback",
    image: "/placeholder.svg?height=160&width=280",
    popular: true,
    new: false,
    variations: [
      {
        id: "1-1",
        name: "Basic",
        description: "Simple 5-question survey",
        fields: [
          {
            id: "field-1",
            type: "text",
            label: "Your Name",
            placeholder: "Enter your full name",
            required: true,
          },
          {
            id: "field-2",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
          },
          {
            id: "field-3",
            type: "radio",
            label: "How satisfied are you with our service?",
            options: [
              "Very Satisfied",
              "Satisfied",
              "Neutral",
              "Dissatisfied",
              "Very Dissatisfied",
            ],
            required: true,
          },
          {
            id: "field-4",
            type: "text",
            label: "What did you like most about our service?",
            placeholder: "Please share your thoughts",
            required: false,
          },
          {
            id: "field-5",
            type: "text",
            label: "How can we improve?",
            placeholder: "Please share your suggestions",
            required: false,
          },
        ],
      },
      {
        id: "1-2",
        name: "Detailed",
        description: "Comprehensive 15-question survey",
        fields: [
          {
            id: "field-1",
            type: "text",
            label: "Your Name",
            placeholder: "Enter your full name",
            required: true,
          },
          {
            id: "field-2",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
          },
          {
            id: "field-3",
            type: "radio",
            label: "How satisfied are you with our service?",
            options: [
              "Very Satisfied",
              "Satisfied",
              "Neutral",
              "Dissatisfied",
              "Very Dissatisfied",
            ],
            required: true,
          },
          {
            id: "field-4",
            type: "radio",
            label: "How likely are you to recommend us to a friend?",
            options: [
              "Very Likely",
              "Likely",
              "Neutral",
              "Unlikely",
              "Very Unlikely",
            ],
            required: true,
          },
          {
            id: "field-5",
            type: "checkbox",
            label: "Which features do you use most?",
            options: ["Feature A", "Feature B", "Feature C", "Feature D"],
            required: false,
          },
          {
            id: "field-6",
            type: "radio",
            label: "How would you rate our customer support?",
            options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
            required: true,
          },
          {
            id: "field-7",
            type: "radio",
            label: "How would you rate the ease of use?",
            options: [
              "Very Easy",
              "Easy",
              "Neutral",
              "Difficult",
              "Very Difficult",
            ],
            required: true,
          },
          {
            id: "field-8",
            type: "text",
            label: "What did you like most about our service?",
            placeholder: "Please share your thoughts",
            required: false,
          },
          {
            id: "field-9",
            type: "text",
            label: "How can we improve?",
            placeholder: "Please share your suggestions",
            required: false,
          },
        ],
      },
      {
        id: "1-3",
        name: "NPS",
        description: "Net Promoter Score focused",
        fields: [
          {
            id: "field-1",
            type: "text",
            label: "Your Name",
            placeholder: "Enter your full name",
            required: true,
          },
          {
            id: "field-2",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
          },
          {
            id: "field-3",
            type: "radio",
            label:
              "On a scale of 0-10, how likely are you to recommend our product/service to a friend or colleague?",
            options: [
              "0 - Not at all likely",
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10 - Extremely likely",
            ],
            required: true,
          },
          {
            id: "field-4",
            type: "text",
            label: "What is the primary reason for your score?",
            placeholder: "Please explain your rating",
            required: true,
          },
          {
            id: "field-5",
            type: "text",
            label: "What could we do to improve your experience?",
            placeholder: "Please share your suggestions",
            required: false,
          },
        ],
      },
    ],
  },
  "event-registration": {
    id: "event-registration",
    title: "Event Registration Form",
    description: "Collect registrations for your upcoming events",
    category: "event",
    image: "/placeholder.svg?height=160&width=280",
    popular: true,
    new: false,
    variations: [
      {
        id: "2-1",
        name: "Basic",
        description: "Simple registration form",
        fields: [
          {
            id: "field-1",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
          },
          {
            id: "field-2",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
          },
          {
            id: "field-3",
            type: "text",
            label: "Phone Number",
            placeholder: "Enter your phone number",
            required: true,
          },
          {
            id: "field-4",
            type: "dropdown",
            label: "How did you hear about this event?",
            options: [
              "Social Media",
              "Email",
              "Website",
              "Friend/Colleague",
              "Other",
            ],
            required: false,
          },
        ],
      },
      {
        id: "2-2",
        name: "With Payment",
        description: "Registration with payment options",
        fields: [
          {
            id: "field-1",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
          },
          {
            id: "field-2",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
          },
          {
            id: "field-3",
            type: "text",
            label: "Phone Number",
            placeholder: "Enter your phone number",
            required: true,
          },
          {
            id: "field-4",
            type: "dropdown",
            label: "Ticket Type",
            options: [
              "General Admission ($50)",
              "VIP ($100)",
              "Early Bird ($35)",
              "Group (5+ people, $40 each)",
            ],
            required: true,
          },
          {
            id: "field-5",
            type: "number",
            label: "Number of Tickets",
            placeholder: "Enter number of tickets",
            required: true,
          },
          {
            id: "field-6",
            type: "checkbox",
            label: "Additional Options",
            options: [
              "Parking Pass (+$15)",
              "Event T-shirt (+$25)",
              "Dinner Voucher (+$30)",
            ],
            required: false,
          },
          {
            id: "field-7",
            type: "text",
            label: "Special Requests",
            placeholder: "Any special accommodations or requests",
            required: false,
          },
        ],
      },
    ],
  },
  "job-application": {
    id: "job-application",
    title: "Job Application Form",
    description: "Streamline your hiring process with this template",
    category: "business",
    image: "/placeholder.svg?height=160&width=280",
    popular: false,
    new: true,
    variations: [
      {
        id: "3-1",
        name: "General",
        description: "Standard job application",
        fields: [
          {
            id: "field-1",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
          },
          {
            id: "field-2",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
          },
          {
            id: "field-3",
            type: "text",
            label: "Phone Number",
            placeholder: "Enter your phone number",
            required: true,
          },
          {
            id: "field-4",
            type: "dropdown",
            label: "Position Applied For",
            options: [
              "Marketing Manager",
              "Software Developer",
              "Customer Support",
              "Sales Representative",
              "Other",
            ],
            required: true,
          },
          {
            id: "field-5",
            type: "file",
            label: "Resume/CV",
            required: true,
          },
          {
            id: "field-6",
            type: "file",
            label: "Cover Letter",
            required: false,
          },
          {
            id: "field-7",
            type: "textarea",
            label: "Why do you want to work with us?",
            placeholder: "Please explain your interest in our company",
            required: true,
          },
        ],
      },
      {
        id: "3-2",
        name: "Technical",
        description: "For technical positions",
        fields: [
          {
            id: "field-1",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
          },
          {
            id: "field-2",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
          },
          {
            id: "field-3",
            type: "text",
            label: "Phone Number",
            placeholder: "Enter your phone number",
            required: true,
          },
          {
            id: "field-4",
            type: "dropdown",
            label: "Position Applied For",
            options: [
              "Frontend Developer",
              "Backend Developer",
              "Full Stack Developer",
              "DevOps Engineer",
              "Data Scientist",
              "Other",
            ],
            required: true,
          },
          {
            id: "field-5",
            type: "file",
            label: "Resume/CV",
            required: true,
          },
          {
            id: "field-6",
            type: "checkbox",
            label: "Technical Skills",
            options: [
              "JavaScript",
              "Python",
              "Java",
              "C#",
              "React",
              "Angular",
              "Node.js",
              "AWS",
              "Docker",
              "Kubernetes",
            ],
            required: true,
          },
          {
            id: "field-7",
            type: "textarea",
            label: "Describe a challenging technical problem you solved",
            placeholder:
              "Please provide details about the problem and your solution",
            required: true,
          },
          {
            id: "field-8",
            type: "text",
            label: "Portfolio/GitHub URL",
            placeholder: "Enter URL to your work",
            required: false,
          },
        ],
      },
    ],
  },
  "course-evaluation": {
    id: "course-evaluation",
    title: "Course Evaluation",
    description: "Get feedback from students about your courses",
    category: "education",
    image: "/placeholder.svg?height=160&width=280",
    popular: false,
    new: false,
    variations: [
      {
        id: "4-1",
        name: "Standard",
        description: "Comprehensive course evaluation",
        fields: [
          {
            id: "field-1",
            type: "dropdown",
            label: "Course Name",
            options: ["Course A", "Course B", "Course C", "Other"],
            required: true,
          },
          {
            id: "field-2",
            type: "dropdown",
            label: "Instructor Name",
            options: ["Instructor A", "Instructor B", "Instructor C", "Other"],
            required: true,
          },
          {
            id: "field-3",
            type: "radio",
            label: "The course objectives were clear",
            options: [
              "Strongly Agree",
              "Agree",
              "Neutral",
              "Disagree",
              "Strongly Disagree",
            ],
            required: true,
          },
          {
            id: "field-4",
            type: "radio",
            label: "The course materials were helpful",
            options: [
              "Strongly Agree",
              "Agree",
              "Neutral",
              "Disagree",
              "Strongly Disagree",
            ],
            required: true,
          },
          {
            id: "field-5",
            type: "radio",
            label: "The instructor was knowledgeable about the subject",
            options: [
              "Strongly Agree",
              "Agree",
              "Neutral",
              "Disagree",
              "Strongly Disagree",
            ],
            required: true,
          },
          {
            id: "field-6",
            type: "radio",
            label: "The instructor was responsive to student questions",
            options: [
              "Strongly Agree",
              "Agree",
              "Neutral",
              "Disagree",
              "Strongly Disagree",
            ],
            required: true,
          },
          {
            id: "field-7",
            type: "textarea",
            label: "What aspects of the course were most valuable?",
            placeholder: "Please share your thoughts",
            required: false,
          },
          {
            id: "field-8",
            type: "textarea",
            label: "What suggestions do you have for improving the course?",
            placeholder: "Please share your suggestions",
            required: false,
          },
        ],
      },
    ],
  },
  "product-feedback": {
    id: "product-feedback",
    title: "Product Feedback Form",
    description: "Collect detailed feedback about your products",
    category: "feedback",
    image: "/placeholder.svg?height=160&width=280",
    popular: false,
    new: true,
    variations: [
      {
        id: "5-1",
        name: "Basic",
        description: "Simple product feedback form",
        fields: [
          {
            id: "field-1",
            type: "dropdown",
            label: "Which product are you providing feedback for?",
            options: ["Product A", "Product B", "Product C", "Other"],
            required: true,
          },
          {
            id: "field-2",
            type: "radio",
            label: "How would you rate this product overall?",
            options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
            required: true,
          },
          {
            id: "field-3",
            type: "checkbox",
            label: "What aspects of the product did you like?",
            options: [
              "Design",
              "Functionality",
              "Ease of use",
              "Price",
              "Quality",
              "Customer support",
            ],
            required: false,
          },
          {
            id: "field-4",
            type: "checkbox",
            label: "What aspects of the product could be improved?",
            options: [
              "Design",
              "Functionality",
              "Ease of use",
              "Price",
              "Quality",
              "Customer support",
            ],
            required: false,
          },
          {
            id: "field-5",
            type: "textarea",
            label: "Please share any additional feedback or suggestions",
            placeholder: "Your feedback helps us improve our products",
            required: false,
          },
        ],
      },
      {
        id: "5-2",
        name: "Detailed",
        description: "Comprehensive product feedback survey",
        fields: [
          {
            id: "field-1",
            type: "dropdown",
            label: "Which product are you providing feedback for?",
            options: ["Product A", "Product B", "Product C", "Other"],
            required: true,
          },
          {
            id: "field-2",
            type: "text",
            label: "How long have you been using this product?",
            placeholder: "e.g., 3 months, 1 year",
            required: true,
          },
          {
            id: "field-3",
            type: "radio",
            label: "How would you rate the product quality?",
            options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
            required: true,
          },
          {
            id: "field-4",
            type: "radio",
            label: "How would you rate the product's ease of use?",
            options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
            required: true,
          },
          {
            id: "field-5",
            type: "radio",
            label: "How would you rate the value for money?",
            options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
            required: true,
          },
          {
            id: "field-6",
            type: "radio",
            label: "How likely are you to recommend this product to others?",
            options: [
              "Very Likely",
              "Likely",
              "Neutral",
              "Unlikely",
              "Very Unlikely",
            ],
            required: true,
          },
          {
            id: "field-7",
            type: "textarea",
            label: "What do you like most about the product?",
            placeholder: "Please share your thoughts",
            required: false,
          },
          {
            id: "field-8",
            type: "textarea",
            label: "What improvements would you suggest for the product?",
            placeholder: "Please share your suggestions",
            required: false,
          },
        ],
      },
    ],
  },
  "conference-registration": {
    id: "conference-registration",
    title: "Conference Registration",
    description: "Manage attendees for your conference",
    category: "event",
    image: "/placeholder.svg?height=160&width=280",
    popular: false,
    new: false,
    variations: [
      {
        id: "6-1",
        name: "Standard",
        description: "Complete conference registration form",
        fields: [
          {
            id: "field-1",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
          },
          {
            id: "field-2",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
          },
          {
            id: "field-3",
            type: "text",
            label: "Organization/Company",
            placeholder: "Enter your organization name",
            required: true,
          },
          {
            id: "field-4",
            type: "text",
            label: "Job Title",
            placeholder: "Enter your job title",
            required: true,
          },
          {
            id: "field-5",
            type: "dropdown",
            label: "Registration Type",
            options: [
              "Full Conference ($499)",
              "One-Day Pass ($199)",
              "Virtual Attendance ($99)",
              "Student ($149)",
            ],
            required: true,
          },
          {
            id: "field-6",
            type: "checkbox",
            label: "Which sessions are you interested in attending?",
            options: [
              "Keynote Presentations",
              "Technical Workshops",
              "Panel Discussions",
              "Networking Events",
              "Product Demonstrations",
            ],
            required: false,
          },
          {
            id: "field-7",
            type: "checkbox",
            label: "Dietary Restrictions",
            options: [
              "Vegetarian",
              "Vegan",
              "Gluten-Free",
              "Dairy-Free",
              "Nut Allergy",
              "None",
            ],
            required: true,
          },
          {
            id: "field-8",
            type: "textarea",
            label: "Special Accommodations",
            placeholder:
              "Please let us know if you require any special accommodations",
            required: false,
          },
        ],
      },
    ],
  },
  "employee-onboarding": {
    id: "employee-onboarding",
    title: "Employee Onboarding",
    description: "Streamline your employee onboarding process",
    category: "business",
    image: "/placeholder.svg?height=160&width=280",
    popular: true,
    new: false,
    variations: [
      {
        id: "7-1",
        name: "Basic",
        description: "Essential employee information form",
        fields: [
          {
            id: "field-1",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
          },
          {
            id: "field-2",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
          },
          {
            id: "field-3",
            type: "text",
            label: "Phone Number",
            placeholder: "Enter your phone number",
            required: true,
          },
          {
            id: "field-4",
            type: "date",
            label: "Date of Birth",
            required: true,
          },
          {
            id: "field-5",
            type: "text",
            label: "Emergency Contact Name",
            placeholder: "Enter emergency contact name",
            required: true,
          },
          {
            id: "field-6",
            type: "text",
            label: "Emergency Contact Phone",
            placeholder: "Enter emergency contact phone",
            required: true,
          },
          {
            id: "field-7",
            type: "dropdown",
            label: "Department",
            options: [
              "Engineering",
              "Marketing",
              "Sales",
              "Customer Support",
              "Human Resources",
              "Finance",
              "Operations",
            ],
            required: true,
          },
          {
            id: "field-8",
            type: "file",
            label: "Upload ID Document",
            required: true,
          },
        ],
      },
      {
        id: "7-2",
        name: "Comprehensive",
        description: "Detailed employee onboarding form",
        fields: [
          {
            id: "field-1",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
          },
          {
            id: "field-2",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
          },
          {
            id: "field-3",
            type: "text",
            label: "Phone Number",
            placeholder: "Enter your phone number",
            required: true,
          },
          {
            id: "field-4",
            type: "date",
            label: "Date of Birth",
            required: true,
          },
          {
            id: "field-5",
            type: "text",
            label: "Social Security Number",
            placeholder: "Enter your SSN",
            required: true,
          },
          {
            id: "field-6",
            type: "text",
            label: "Home Address",
            placeholder: "Enter your home address",
            required: true,
          },
          {
            id: "field-7",
            type: "text",
            label: "Emergency Contact Name",
            placeholder: "Enter emergency contact name",
            required: true,
          },
          {
            id: "field-8",
            type: "text",
            label: "Emergency Contact Phone",
            placeholder: "Enter emergency contact phone",
            required: true,
          },
          {
            id: "field-9",
            type: "dropdown",
            label: "Department",
            options: [
              "Engineering",
              "Marketing",
              "Sales",
              "Customer Support",
              "Human Resources",
              "Finance",
              "Operations",
            ],
            required: true,
          },
          {
            id: "field-10",
            type: "dropdown",
            label: "Employment Type",
            options: [
              "Full-time",
              "Part-time",
              "Contract",
              "Temporary",
              "Intern",
            ],
            required: true,
          },
          {
            id: "field-11",
            type: "file",
            label: "Upload ID Document",
            required: true,
          },
          {
            id: "field-12",
            type: "checkbox",
            label: "I acknowledge receipt of the following company policies",
            options: [
              "Employee Handbook",
              "Code of Conduct",
              "IT Security Policy",
              "Non-Disclosure Agreement",
            ],
            required: true,
          },
        ],
      },
    ],
  },
  "website-feedback": {
    id: "website-feedback",
    title: "Website Feedback Survey",
    description: "Improve your website with user feedback",
    category: "feedback",
    image: "/placeholder.svg?height=160&width=280",
    popular: false,
    new: false,
    variations: [
      {
        id: "8-1",
        name: "Standard",
        description: "Comprehensive website feedback form",
        fields: [
          {
            id: "field-1",
            type: "radio",
            label: "How easy was it to navigate our website?",
            options: [
              "Very Easy",
              "Easy",
              "Neutral",
              "Difficult",
              "Very Difficult",
            ],
            required: true,
          },
          {
            id: "field-2",
            type: "radio",
            label: "How would you rate the design of our website?",
            options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
            required: true,
          },
          {
            id: "field-3",
            type: "radio",
            label: "Did you find the information you were looking for?",
            options: ["Yes, easily", "Yes, with some effort", "No"],
            required: true,
          },
          {
            id: "field-4",
            type: "checkbox",
            label: "Which features of our website do you find most useful?",
            options: [
              "Search functionality",
              "Product information",
              "Customer reviews",
              "FAQ section",
              "Contact information",
              "Blog/Articles",
            ],
            required: false,
          },
          {
            id: "field-5",
            type: "checkbox",
            label: "Which areas of our website could be improved?",
            options: [
              "Navigation",
              "Design/Layout",
              "Content quality",
              "Loading speed",
              "Mobile responsiveness",
              "Search functionality",
            ],
            required: false,
          },
          {
            id: "field-6",
            type: "textarea",
            label: "Please share any additional feedback or suggestions",
            placeholder: "Your feedback helps us improve our website",
            required: false,
          },
          {
            id: "field-7",
            type: "email",
            label: "Email Address (Optional)",
            placeholder: "Enter your email if you'd like us to follow up",
            required: false,
          },
        ],
      },
    ],
  },
};

// First, let's add some debugging to help identify the issue
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("id");
    const category = searchParams.get("category");

    console.log("Request for template ID:", templateId);
    console.log("Available template keys:", Object.keys(templates));

    if (templateId) {
      // Check if it's a variation ID (e.g., "8-1")
      if (templateId.includes("-")) {
        console.log("Searching for variation with ID:", templateId);

        // Iterate through templates to find a matching variation
        for (const templateKey in templates) {
          const template = templates[templateKey];
          const variation = template.variations?.find((v) => v.id === templateId);
          
          if (variation) {
            console.log("Found variation:", variation.name);
            return NextResponse.json({
              ...template,
              title: `${template.title} - ${variation.name}`,
              fields: variation.fields,
            });
          }
        }

        console.log("Variation not found:", templateId);
        return NextResponse.json({ error: "Template variation not found" }, { status: 404 });
      }

      // For non-variation template IDs
      console.log("Looking for template with ID:", templateId);
      if (!templates[templateId]) {
        console.log("Template not found:", templateId);
        return NextResponse.json({ error: "Template not found" }, { status: 404 });
      }

      const template = templates[templateId];
      console.log("Found template:", template.title);
      return NextResponse.json(template);
    }

    // Convert to array for response
    const templateArray = Object.values(templates);

    // Filter by category if provided
    let filteredTemplates = templateArray;
    if (category && category !== "all") {
      filteredTemplates = templateArray.filter(
        (template) => template.category === category
      );
    }

    return NextResponse.json(filteredTemplates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
