"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface SaveAsDraftDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialTitle: string
  initialDescription: string
  onSave: (title: string, description: string) => void
}

export function SaveAsDraftDialog({
  open,
  onOpenChange,
  initialTitle,
  initialDescription,
  onSave,
}: SaveAsDraftDialogProps) {
  const [title, setTitle] = useState(initialTitle || "Untitled Form")
  const [description, setDescription] = useState(initialDescription || "")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)

    // Simulate saving process
    setTimeout(() => {
      onSave(title, description)
      setIsSaving(false)
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save as Draft</DialogTitle>
          <DialogDescription>Save your form as a draft to continue working on it later.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Form Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter form title" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe your form"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || isSaving}>
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

