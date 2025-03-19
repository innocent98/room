"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState, useCallback, useEffect, useRef } from "react";
import { Layout, Button, Tooltip, message, Input, Modal } from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  SendOutlined,
  QuestionCircleOutlined,
  UndoOutlined,
  RedoOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type { Field } from "@/constants/types";
import FieldSettings from "@/components/form-creation/FieldSettings";
import FormPreview from "@/components/form-creation/FormPreview";
import FormSettings from "@/components/form-creation/FormSettings";
import useUndoableState from "@/app/hooks/useUndoableState";
import Sidebar from "@/components/form-creation/Sidebar";
import ShareButton from "@/components/form-creation/ShareButton";
import TemplateSelectionModal from "@/components/form-creation/TemplateSelectionModal";
import { debounce } from "lodash";

const { Header, Sider, Content, Footer } = Layout;

export default function FormCreationPage() {
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [formDescription, setFormDesc] = useState("");
  const [formFields, setFormFields, { undo, redo, canUndo, canRedo }] =
    useUndoableState<any | Field[]>([]);
  const [selectedField, setSelectedField] = useState<any>(null);
  const [formId, setFormId] = useState(`form-${Date.now()}`);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [formSettings, setFormSettings] = useState<any>({});
  const [isPublished, setIsPublished] = useState(false);
  const [showPublishWarning, setShowPublishWarning] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Create a stable reference to the save function
  const saveFormRef = useRef<any>(null);

  // Check for draft or template parameters
  useEffect(() => {
    const draftId = searchParams.get("draft");
    const templateId = searchParams.get("template");

    if (draftId) {
      fetchDraft(draftId);
    } else if (templateId) {
      fetchTemplate(templateId);
    } else if (formFields.length === 0) {
      // Show template modal on initial load if no fields
      setShowTemplateModal(true);
    }
  }, [searchParams]);

  const fetchDraft = async (draftId: string) => {
    try {
      const response = await fetch(`/api/forms/${draftId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch draft");
      }

      const data = await response.json();
      setFormTitle(data.title);
      setFormDesc(data.description || "");
      setFormFields(data.fields || []);
      setFormId(data.id);
      setFormSettings(data.settings || {});
      setIsPublished(data.published || false);

      message.success("Draft loaded successfully");
    } catch (error) {
      console.error("Error fetching draft:", error);
      message.error("Failed to load draft");
    }
  };

  const fetchTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/form-templates?id=${templateId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch template");
      }

      const template = await response.json();
      setFormTitle(template.title);
      setFormFields(template.fields);

      message.success("Template loaded successfully");
    } catch (error) {
      console.error("Error fetching template:", error);
      message.error("Failed to load template");
    }
  };

  const moveField = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setFormFields((prevFields: Field[]) => {
        const updatedFields = [...prevFields];
        const [reorderedItem] = updatedFields.splice(dragIndex, 1);
        updatedFields.splice(hoverIndex, 0, reorderedItem);
        return updatedFields;
      });
    },
    [setFormFields]
  );

  const addField = useCallback(
    (field: Field) => {
      setFormFields((prevFields: Field[]) => [
        ...prevFields,
        { ...field, id: `field-${Date.now()}`, options: field.options || [] },
      ]);
    },
    [setFormFields]
  );

  const updateField = useCallback(
    (fieldId: string, updates: Partial<Field>) => {
      setFormFields((prevFields: Field[]) =>
        prevFields.map((field) =>
          field.id === fieldId ? { ...field, ...updates } : field
        )
      );
    },
    [setFormFields]
  );

  const deleteField = useCallback(
    (fieldId: string) => {
      setFormFields((prevFields: Field[]) =>
        prevFields.filter((field) => field.id !== fieldId)
      );
      setSelectedField(null);
    },
    [setFormFields]
  );

  const updateSettings = useCallback((newSettings: any) => {
    setFormSettings(newSettings);
  }, []);

  const saveForm = useCallback(async () => {
    setIsSaving(true);

    try {
      const formData = {
        id: formId,
        title: formTitle,
        description: formDescription,
        fields: formFields,
        isDraft: true,
        published: false,
        settings: formSettings,
      };

      // Check if form already exists
      const method = formId.startsWith("form-") ? "POST" : "PUT";
      const url = method === "POST" ? "/api/forms" : `/api/forms/${formId}`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save form");
      }

      const savedForm = await response.json();

      // Update form ID if it's a new form
      if (method === "POST") {
        setFormId(savedForm.id);
        // Update URL without refreshing the page
        window.history.replaceState(
          {},
          "",
          `/dashboard/form/create?draft=${savedForm.id}`
        );
      }

      setLastSaved(new Date().toLocaleTimeString());
      message.success("Form saved successfully");
    } catch (error) {
      console.error("Error saving form:", error);
      message.error("Failed to save form");
    } finally {
      setIsSaving(false);
    }
  }, [formId, formTitle, formDescription, formFields, formSettings]);

  // Update the ref whenever the saveForm function changes
  useEffect(() => {
    saveFormRef.current = saveForm;
  }, [saveForm]);

  const publishForm = useCallback(async () => {
    setIsPublishing(true);

    try {
      // First save the form
      await saveForm();

      // Then publish it
      const response = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published: true,
          isDraft: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish form");
      }

      setIsPublished(true);
      message.success("Form published successfully");

      // Redirect to the published form
      router.push(`/dashboard/form/${formId}/view`);
    } catch (error) {
      console.error("Error publishing form:", error);
      message.error("Failed to publish form");
    } finally {
      setIsPublishing(false);
    }
  }, [formId, saveForm, router]);

  const handleSelectTemplate = (templateId: string, template: any) => {
    if (template && template.fields) {
      setFormFields(template.fields);
      setFormTitle(template.title || "Untitled Form");
      message.success("Template loaded successfully");
    } else {
      // Fallback to fetching the template from the API
      fetchTemplate(templateId);
    }
    setShowTemplateModal(false);
  };

  // Modified auto-save function that checks if the form is published
  const autoSaveForm = useCallback(() => {
    if (formFields.length > 0) {
      if (isPublished) {
        // If the form is published, show a warning before saving
        setShowPublishWarning(true);
      } else {
        // If not published, save as normal
        saveFormRef.current();
      }
    }
  }, [formFields, isPublished]);

  // Create a debounced version of the autoSaveForm function
  const autoSaveFormDebounced = useCallback(
    debounce(() => {
      autoSaveForm();
    }, 30000),
    [autoSaveForm]
  );

  // Auto-save every 30 seconds
  useEffect(() => {
    autoSaveFormDebounced();
    return autoSaveFormDebounced.cancel; // Cleanup
  }, [
    formFields,
    formSettings,
    formTitle,
    formDescription,
    autoSaveFormDebounced,
  ]);

  // Handle manual save with warning for published forms
  const handleManualSave = () => {
    if (isPublished) {
      setShowPublishWarning(true);
    } else {
      saveForm();
    }
  };

  // Handle confirmation from the warning modal
  const handleConfirmSave = () => {
    setShowPublishWarning(false);
    saveForm();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout className="min-h-screen">
        <Header className="bg-white px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Button icon={<ArrowLeftOutlined />} className="mr-4">
                Back
              </Button>
            </Link>
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="text-xl font-bold"
              variant="borderless"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip title="Use Template">
              <Button
                icon={<FileOutlined />}
                onClick={() => setShowTemplateModal(true)}
              />
            </Tooltip>
            <Tooltip title="Undo">
              <Button
                icon={<UndoOutlined />}
                onClick={undo}
                disabled={!canUndo}
              />
            </Tooltip>
            <Tooltip title="Redo">
              <Button
                icon={<RedoOutlined />}
                onClick={redo}
                disabled={!canRedo}
              />
            </Tooltip>
            <ShareButton formId={formId} formTitle={formTitle} />
            <Button
              icon={<SaveOutlined />}
              onClick={handleManualSave}
              loading={isSaving}
            >
              Save Draft
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={publishForm}
              loading={isPublishing}
            >
              Publish Form
            </Button>
          </div>
        </Header>
        <Layout>
          <Sider width={250} className="bg-white">
            <Sidebar addField={addField} />
          </Sider>
          <Content className="p-6 bg-gray-100">
            {formSettings?.bannerImage && (
              <div className="mb-6 rounded-lg overflow-hidden shadow-sm">
                <img
                  src={formSettings.bannerImage || "/placeholder.svg"}
                  alt="Form Banner"
                  className="w-full h-auto object-cover max-h-48"
                />
              </div>
            )}
            {formFields.length > 0 ? (
              formFields.map((field: any, index: number) => (
                <FormPreview
                  key={field.id}
                  index={index}
                  field={field}
                  moveField={moveField}
                  onClick={() => setSelectedField(field)}
                  isSelected={selectedField && selectedField.id === field.id}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 mt-8 p-8 bg-white rounded-lg shadow-sm">
                <div className="mb-4">
                  <FileOutlined style={{ fontSize: "48px" }} />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Start Building Your Form
                </h3>
                <p className="mb-4">
                  Drag and drop fields from the sidebar or select a template to
                  get started.
                </p>
                <Button
                  type="primary"
                  onClick={() => setShowTemplateModal(true)}
                >
                  Choose a Template
                </Button>
              </div>
            )}
            {lastSaved && (
              <div className="text-xs text-gray-400 mt-4 text-right">
                Last saved: {lastSaved}
              </div>
            )}
          </Content>
          <Sider width={300} className="bg-white">
            {selectedField ? (
              <FieldSettings
                field={selectedField}
                updateField={updateField}
                deleteField={deleteField}
                formFields={formFields}
              />
            ) : (
              <FormSettings
                formTitle={formTitle}
                formDescription={formDescription}
                setFormTitle={setFormTitle}
                setFormDesc={setFormDesc}
                formFields={formFields}
                settings={formSettings}
                updateSettings={updateSettings}
              />
            )}
          </Sider>
        </Layout>
        <Footer className="text-center">
          <Tooltip title="Get help with form creation">
            <Button icon={<QuestionCircleOutlined />}>Need Help?</Button>
          </Tooltip>
        </Footer>
      </Layout>

      <TemplateSelectionModal
        visible={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <Modal
        title="Warning: Form is Published"
        open={showPublishWarning}
        onOk={handleConfirmSave}
        onCancel={() => setShowPublishWarning(false)}
        okText="Save as Draft"
        cancelText="Cancel"
      >
        <p>
          This form is currently published and accessible to users. Saving
          changes will unpublish the form.
        </p>
        <p>
          For the form to be accessible again, you will need to publish it after
          saving your changes.
        </p>
      </Modal>
    </DndProvider>
  );
}
