import type { DraftFormType } from "@/types/form"

// Mock data for drafts
export const MOCK_DRAFTS: DraftFormType[] = [
  {
    id: "draft-1",
    title: "Customer Feedback Survey",
    description: "Gathering feedback about our customer service",
    createdAt: new Date(2023, 9, 15),
    updatedAt: new Date(2023, 9, 16),
    fields: [],
    settings: {
      theme: "default",
      branding: false,
      collectEmail: true,
    },
  },
  {
    id: "draft-2",
    title: "Event Registration Form",
    description: "Registration for company annual event",
    createdAt: new Date(2023, 9, 10),
    updatedAt: new Date(2023, 9, 14),
    fields: [],
    settings: {
      theme: "dark",
      branding: true,
      collectEmail: true,
    },
  },
  {
    id: "draft-3",
    title: "Employee Satisfaction Survey",
    description: "Annual employee satisfaction survey",
    createdAt: new Date(2023, 9, 5),
    updatedAt: new Date(2023, 9, 12),
    fields: [],
    settings: {
      theme: "light",
      branding: true,
      collectEmail: false,
    },
  },
]

