"use client"

import { Form, Input, Switch, Button, Space, Select } from "antd"
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { useState, useEffect } from "react"

interface Field {
  id: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  options?: string[]
  description?: string
  conditionalLogic?: any
}

interface FieldSettingsProps {
  field: Field
  updateField: (fieldId: string, updates: Partial<Field>) => void
  deleteField: (fieldId: string) => void
  formFields: Field[]
}

export default function FieldSettings({ field, updateField, deleteField, formFields }: FieldSettingsProps) {
  const [conditionalEnabled, setConditionalEnabled] = useState(field.conditionalLogic?.enabled || false)
  const [conditions, setConditions] = useState<any[]>(field.conditionalLogic?.conditions || [])

  // Update conditionalLogic when conditions or enabled state changes
  useEffect(() => {
    if (conditionalEnabled) {
      updateField(field.id, {
        conditionalLogic: {
          enabled: true,
          conditions: conditions.length > 0 ? conditions : [createEmptyCondition()],
        },
      })
    } else {
      updateField(field.id, {
        conditionalLogic: null,
      })
    }
  }, [conditionalEnabled, conditions])

  const handleChange = (key: string, value: unknown) => {
    updateField(field.id, { [key]: value })
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(field.options || [])]
    newOptions[index] = value
    handleChange("options", newOptions)
  }

  const addOption = () => {
    const newOptions = [...(field.options || []), ""]
    handleChange("options", newOptions)
  }

  const removeOption = (index: number) => {
    const newOptions = [...(field.options || [])]
    newOptions.splice(index, 1)
    handleChange("options", newOptions)
  }

  // Create an empty condition
  const createEmptyCondition = () => ({
    sourceField: "",
    operator: "equals",
    value: "",
  })

  // Add a new condition
  const addCondition = () => {
    setConditions([...conditions, createEmptyCondition()])
  }

  // Remove a condition
  const removeCondition = (index: number) => {
    const newConditions = [...conditions]
    newConditions.splice(index, 1)
    setConditions(newConditions)
  }

  // Update a condition
  const updateCondition = (index: number, key: string, value: any) => {
    const newConditions = [...conditions]
    newConditions[index] = {
      ...newConditions[index],
      [key]: value,
    }
    setConditions(newConditions)
  }

  // Get fields that can be used as source fields (excluding the current field)
  const sourceFields = formFields.filter((f) => f.id !== field.id)

  return (
    <Form layout="vertical" className="p-4">
      <h2 className="text-lg font-semibold mb-4">Field Settings</h2>
      <Form.Item label="Field Label">
        <Input value={field.label} onChange={(e) => handleChange("label", e.target.value)} />
      </Form.Item>
      <Form.Item label="Placeholder">
        <Input
          value={field.placeholder || ""}
          onChange={(e) => handleChange("placeholder", e.target.value)}
          placeholder="Enter placeholder text"
        />
      </Form.Item>
      <Form.Item label="Description">
        <Input.TextArea
          value={field.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter field description"
          rows={2}
        />
      </Form.Item>
      <Form.Item label="Required">
        <Switch checked={field.required} onChange={(checked) => handleChange("required", checked)} />
      </Form.Item>

      {["dropdown", "radio", "checkbox", "multiselect"].includes(field.type) && (
        <Form.Item label="Options">
          {(field.options ?? []).map((option: string, index: number) => (
            <Space key={index} className="mb-2 w-full">
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-grow"
              />
              <Button icon={<DeleteOutlined />} onClick={() => removeOption(index)} danger />
            </Space>
          ))}
          <Button type="dashed" onClick={addOption} block icon={<PlusOutlined />}>
            Add Option
          </Button>
        </Form.Item>
      )}

      <Form.Item label="Conditional Logic">
        <Switch checked={conditionalEnabled} onChange={setConditionalEnabled} />
        <div className="text-xs text-gray-500 mt-1">Show this field based on other field values</div>
      </Form.Item>

      {conditionalEnabled && (
        <div className="border p-3 rounded-md mb-4 bg-gray-50">
          <h3 className="text-sm font-medium mb-2">Conditions</h3>
          {conditions.length === 0 && (
            <div className="text-gray-500 text-sm mb-2">No conditions added yet. Add a condition below.</div>
          )}

          {conditions.map((condition, index) => (
            <div key={index} className="mb-3 p-2 border rounded bg-white">
              <Form.Item label="If field" className="mb-2">
                <Select
                  value={condition.sourceField}
                  onChange={(value) => updateCondition(index, "sourceField", value)}
                  placeholder="Select field"
                  className="w-full"
                >
                  {sourceFields.map((field) => (
                    <Select.Option key={field.id} value={field.id}>
                      {field.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Operator" className="mb-2">
                <Select
                  value={condition.operator}
                  onChange={(value) => updateCondition(index, "operator", value)}
                  className="w-full"
                >
                  <Select.Option value="equals">Equals</Select.Option>
                  <Select.Option value="notEquals">Does not equal</Select.Option>
                  <Select.Option value="contains">Contains</Select.Option>
                  <Select.Option value="notContains">Does not contain</Select.Option>
                  <Select.Option value="greaterThan">Greater than</Select.Option>
                  <Select.Option value="lessThan">Less than</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Value" className="mb-2">
                <Input
                  value={condition.value}
                  onChange={(e) => updateCondition(index, "value", e.target.value)}
                  placeholder="Enter value"
                />
              </Form.Item>

              <Button danger size="small" icon={<DeleteOutlined />} onClick={() => removeCondition(index)}>
                Remove Condition
              </Button>
            </div>
          ))}

          <Button type="dashed" onClick={addCondition} icon={<PlusOutlined />} className="w-full mt-2">
            Add Condition
          </Button>
        </div>
      )}

      <Form.Item>
        <Button danger icon={<DeleteOutlined />} onClick={() => deleteField(field.id)}>
          Delete Field
        </Button>
      </Form.Item>
    </Form>
  )
}

