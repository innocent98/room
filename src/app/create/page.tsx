"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState, useCallback, useEffect } from "react";
import { Layout, Button, Tooltip, message, Input } from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  SendOutlined,
  QuestionCircleOutlined,
  UndoOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Link from "next/link";
import Sidebar from "../components/form-creation/Sidebar";
import FormPreview from "../components/form-creation/FormPreview";
import FieldSettings from "../components/form-creation/FieldSettings";
import FormSettings from "../components/form-creation/FormSettings";
import useUndoableState from "../hooks/useUndoableState";
import { Field } from "@/constants/types";

const { Header, Sider, Content, Footer } = Layout;

export default function FormCreationPage() {
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [formFields, setFormFields, { undo, redo, canUndo, canRedo }] =
    useUndoableState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);

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
      setFormFields((prevFields: Field[]) => {
        const updatedFields: Field[] = [
          ...prevFields,
          { ...field, id: `field-${Date.now()}`, options: [] },
        ];
        return updatedFields;
      });
    },
    [setFormFields]
  );

  const updateField = (fieldId: string, updates: Partial<Field>) => {
    setFormFields((prevFields: Field[]) => {
      return prevFields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      );
    });
  };
  //   [setFormFields]
  // );

  const deleteField = useCallback(
    (fieldId: string) => {
      setFormFields((prevFields: Field[]) => {
        return prevFields.filter(
          (field: { id: string }) => field.id !== fieldId
        );
      });
      setSelectedField(null);
    },
    [setFormFields]
  );

  const saveForm = useCallback(() => {
    // TODO: Implement actual save functionality
    message.success("Form saved successfully");
  }, []);

  const publishForm = useCallback(() => {
    // TODO: Implement actual publish functionality
    message.success("Form published successfully");
  }, []);

  useEffect(() => {
    const autoSave = setTimeout(() => {
      saveForm();
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSave);
  }, [saveForm]);

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
            <Button icon={<SaveOutlined />} onClick={saveForm}>
              Save Draft
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={publishForm}
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
            {formFields.map((field: Field, index) => (
              <FormPreview
                key={field.id}
                index={index}
                field={field}
                moveField={moveField}
                onClick={() => setSelectedField(field)}
              />
            ))}
            {formFields.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                Drag and drop fields from the sidebar to start building your
                form
              </div>
            )}
          </Content>
          <Sider width={300} className="bg-white">
            {selectedField ? (
              <FieldSettings
                field={selectedField}
                updateField={updateField}
                deleteField={deleteField}
              />
            ) : (
              <FormSettings
                formTitle={formTitle}
                setFormTitle={setFormTitle}
                formFields={formFields}
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
    </DndProvider>
  );
}
