import type React from "react"
import { FolderOpenIcon } from "lucide-react"

interface EmptyProps {
  title: string
  description: string
  icon?: React.ReactNode
}

export function Empty({ title, description, icon }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-muted/10">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon || <FolderOpenIcon className="h-6 w-6 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">{description}</p>
    </div>
  )
}

