import {
    AlertTriangle,
    ArrowRight,
    Check,
    ChevronLeft,
    ChevronRight,
    Github,
    HelpCircle,
    Loader2,
    Mail,
    Plus,
    Settings,
    Trash,
    Twitter,
    User,
    X,
    type LucideIcon,
  } from "lucide-react"
  
  export type Icon = LucideIcon
  
  export const Icons = {
    logo: ({ ...props }) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          d="M12 2L17 7H14V15H10V7H7L12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    close: X,
    spinner: Loader2,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    trash: Trash,
    settings: Settings,
    plus: Plus,
    arrowRight: ArrowRight,
    help: HelpCircle,
    user: User,
    warning: AlertTriangle,
    check: Check,
    google: ({ ...props }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M17.6 9.2H21v1.5h-3.4V14h-1.6v-3.3H12v-1.5h4v-3.2h1.6v3.2z" />
        <path d="M10.2 14.5v2.6c0 1.8-1.6 3.4-3.4 3.4H3.4C1.6 20.5 0 19 0 17.1V6.9C0 5 1.6 3.5 3.4 3.5h3.4c.9 0 1.8.4 2.4 1l1.3 1.3-1.3 1.4-1.1-1.2c-.8-.6-1.7-.5-2.4 0-.5.5-.9 1.1-.9 1.9v8.1c0 1.4 1.1 2.5 2.5 2.5 1.4 0 2.5-1.1 2.5-2.5v-2.5h-2.5v-2h2.9z" />
      </svg>
    ),
    github: Github,
    twitter: Twitter,
    mail: Mail,
  }
  
  