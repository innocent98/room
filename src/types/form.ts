export interface FormField {
    id: string
    type: string
    label: string
    placeholder?: string
    required: boolean
    options?: { label: string; value: string }[]
    description?: string
  }
  
  export interface FormSettings {
    theme: "default" | "dark" | "light" | string
    branding: boolean
    collectEmail: boolean
    redirectUrl?: string
    customDomain?: string
    showProgressBar?: boolean
    notifyOnSubmission?: boolean
    emailNotifications?: string[]
  }
  
  export interface DraftFormType {
    id: string
    title: string
    description: string
    createdAt: Date
    updatedAt: Date
    fields: FormField[]
    settings: FormSettings
  }
  
  