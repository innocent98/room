// "use client"

// import { useState, useEffect } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { DndProvider } from "react-dnd"
// import { HTML5Backend } from "react-dnd-html5-backend"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { SaveAsDraftDialog } from "@/components/form-builder/save-as-draft-dialog"
// import type { FormField } from "@/types/form"
// import { MOCK_DRAFTS } from "@/data/mock-data" // Assuming you have this file for mock data
// import FormSettings from "@/components/form-creation/FormSettings"

// export default function FormBuilderPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const draftId = searchParams?.get("draftId")

//   const [activeTab, setActiveTab] = useState("editor")
//   const [formTitle, setFormTitle] = useState("")
//   const [formDescription, setFormDescription] = useState("")
//   const [formFields, setFormFields] = useState<FormField[]>([])
//   const [formSettings, setFormSettings] = useState({
//     theme: "default",
//     branding: true,
//     collectEmail: true,
//     redirectUrl: "",
//     showProgressBar: true,
//     notifyOnSubmission: false,
//     emailNotifications: [],
//   })
//   const [isSaveAsDraftOpen, setIsSaveAsDraftOpen] = useState(false)
//   const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)

//   useEffect(() => {
//     // Load draft if draftId is provided
//     if (draftId) {
//       // In a real app, you would fetch the draft from an API
//       // For now, we'll use mock data
//       const draft = MOCK_DRAFTS.find((d) => d.id === draftId)

//       if (draft) {
//         setFormTitle(draft.title)
//         setFormDescription(draft.description)
//         setFormFields(draft.fields)
//         setFormSettings(draft.settings)
//       }
//     }
//   }, [draftId])

//   const handlePublishForm = () => {
//     // Logic to publish form
//     console.log("Publishing form:", {
//       title: formTitle,
//       description: formDescription,
//       fields: formFields,
//       settings: formSettings,
//     })

//     // Redirect to the published form page
//     router.push(`/form/success?id=${Date.now().toString()}`)
//   }

//   const handleSaveAsDraft = (title: string, description: string) => {
//     const draftData = {
//       id: draftId || `draft-${Date.now()}`,
//       title,
//       description,
//       fields: formFields,
//       settings: formSettings,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }

//     console.log("Saving draft:", draftData)

//     // In a real app, you would save this to your backend
//     // For now, we'll just close the dialog
//     setIsSaveAsDraftOpen(false)

//     // Redirect to drafts page
//     router.push("/drafts")
//   }

//   const handleAddField = (field: FormField) => {
//     setFormFields([...formFields, field])
//   }

//   const handleUpdateField = (index: number, updatedField: FormField) => {
//     const updatedFields = [...formFields]
//     updatedFields[index] = updatedField
//     setFormFields(updatedFields)
//   }

//   const handleDeleteField = (index: number) => {
//     const updatedFields = [...formFields]
//     updatedFields.splice(index, 1)
//     setFormFields(updatedFields)
//   }

//   const handleMoveField = (dragIndex: number, hoverIndex: number) => {
//     const draggedField = formFields[dragIndex]
//     const updatedFields = [...formFields]
//     updatedFields.splice(dragIndex, 1)
//     updatedFields.splice(hoverIndex, 0, draggedField)
//     setFormFields(updatedFields)
//   }

//   const handleUpdateSettings = (settings: any) => {
//     setFormSettings({ ...formSettings, ...settings })
//   }

//   const handleSelectTemplate = (template: any) => {
//     // Apply the selected template to the form
//     setFormTitle(template.title)
//     setFormDescription(template.description)
//     setFormFields(template.fields)
//     setFormSettings({ ...formSettings, ...template.settings })
//     setIsTemplateModalOpen(false)
//   }

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="container mx-auto py-6">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-3xl font-bold">{draftId ? "Edit Draft Form" : "Create New Form"}</h1>
//             <p className="text-muted-foreground mt-1">
//               {draftId ? "Continue editing your draft" : "Design your form by adding fields and configuring settings"}
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <Button variant="outline" onClick={() => setIsTemplateModalOpen(true)}>
//               Use Template
//             </Button>
//             <Button variant="outline" onClick={() => setIsSaveAsDraftOpen(true)}>
//               Save as Draft
//             </Button>
//             <Button onClick={handlePublishForm}>Publish Form</Button>
//           </div>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//           <TabsList>
//             <TabsTrigger value="editor">Editor</TabsTrigger>
//             <TabsTrigger value="settings">Settings</TabsTrigger>
//           </TabsList>
//           <TabsContent value="editor">
//             <FormBuilder
//               formTitle={formTitle}
//               formDescription={formDescription}
//               fields={formFields}
//               onTitleChange={setFormTitle}
//               onDescriptionChange={setFormDescription}
//               onAddField={handleAddField}
//               onUpdateField={handleUpdateField}
//               onDeleteField={handleDeleteField}
//               onMoveField={handleMoveField}
//             />
//           </TabsContent>
//           <TabsContent value="settings">
//             <FormSettings settings={formSettings} onUpdateSettings={handleUpdateSettings} />
//           </TabsContent>
//         </Tabs>

//         <SaveAsDraftDialog
//           open={isSaveAsDraftOpen}
//           onOpenChange={setIsSaveAsDraftOpen}
//           initialTitle={formTitle}
//           initialDescription={formDescription}
//           onSave={handleSaveAsDraft}
//         />

//         <TemplateSelectorModal
//           open={isTemplateModalOpen}
//           onOpenChange={setIsTemplateModalOpen}
//           onSelectTemplate={handleSelectTemplate}
//         />
//       </div>
//     </DndProvider>
//   )
// }

