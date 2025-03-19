"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Checkbox,
  Radio,
  Select,
  DatePicker,
  Upload,
  Rate,
  Button,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import SignaturePad from "./SignaturePad";

interface Field {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  allowedFileTypes?: string[];
  multiple?: boolean;
  conditionalLogic?: any;
}

interface FormFieldProps {
  field: Field;
}

export default function FormField({ field }: FormFieldProps) {
  const [signatureDataURL, setSignatureDataURL] = useState<string | null>(null);

  // Parse options if they exist and are a string
  const options = field.options || [];

  // Special handling for signature field
  if (field.type === "signature") {
    return (
      <Form.Item
        key={field.id}
        label={field.label}
        name={field.id}
        rules={[
          {
            required: field.required,
            message: `Please provide your signature`,
          },
        ]}
        help={field.description}
      >
        <SignaturePad onChange={setSignatureDataURL} field={field} />
      </Form.Item>
    );
  }

  // Render different field types
  switch (field.type) {
    case "text":
      return (
        <Form.Item
          key={field.id}
          label={field.label}
          name={field.id}
          rules={[
            {
              required: field.required,
              message: `Please enter ${field.label}`,
            },
          ]}
          help={field.description}
        >
          <Input placeholder={field.placeholder} />
        </Form.Item>
      );

    case "textarea":
      return (
        <Form.Item
          key={field.id}
          label={field.label}
          name={field.id}
          rules={[
            {
              required: field.required,
              message: `Please enter ${field.label}`,
            },
          ]}
          help={field.description}
        >
          <Input.TextArea rows={4} placeholder={field.placeholder} />
        </Form.Item>
      );

    case "email":
      return (
        <Form.Item
          key={field.id}
          label={field.label}
          name={field.id}
          rules={[
            {
              required: field.required,
              message: `Please enter ${field.label}`,
            },
            { type: "email", message: "Please enter a valid email address" },
          ]}
          help={field.description}
        >
          <Input
            type="email"
            placeholder={field.placeholder || "example@email.com"}
          />
        </Form.Item>
      );

    case "number":
      return (
        <Form.Item
          key={field.id}
          label={field.label}
          name={field.id}
          rules={[
            {
              required: field.required,
              message: `Please enter ${field.label}`,
            },
          ]}
          help={field.description}
        >
          <Input
            type="number"
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step || 1}
          />
        </Form.Item>
      );

    case "checkbox":
      return (
        <Form.Item
          key={field.id}
          label={field.label}
          name={field.id}
          rules={[
            {
              required: field.required,
              message: `Please select at least one option`,
            },
          ]}
          help={field.description}
        >
          <Checkbox.Group>
            {options.map((option: string, index: number) => (
              <div key={index} className="mb-2">
                <Checkbox value={option}>{option}</Checkbox>
              </div>
            ))}
          </Checkbox.Group>
        </Form.Item>
      );

    case "radio":
      return (
        <Form.Item
          key={field.id}
          label={field.label}
          name={field.id}
          rules={[
            { required: field.required, message: `Please select an option` },
          ]}
          help={field.description}
        >
          <Radio.Group>
            {options.map((option: string, index: number) => (
              <div key={index} className="mb-2">
                <Radio value={option}>{option}</Radio>
              </div>
            ))}
          </Radio.Group>
        </Form.Item>
      );

    case "dropdown":
      return (
        <Form.Item
          key={field.id}
          label={field.label}
          name={field.id}
          rules={[
            { required: field.required, message: `Please select an option` },
          ]}
          help={field.description}
        >
          <Select placeholder={field.placeholder || "Select an option"}>
            {options.map((option: string, index: number) => (
              <Select.Option key={index} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      );

    case "date":
      return (
        <Form.Item
          key={field.id}
          label={field.label}
          name={field.id}
          rules={[
            { required: field.required, message: `Please select a date` },
          ]}
          help={field.description}
        >
          <DatePicker className="w-full" />
        </Form.Item>
      );

    case "file":
      return (
        <Form.Item
          key={field.id}
          label={field.label}
          name={field.id}
          rules={[
            { required: field.required, message: `Please upload a file` },
          ]}
          help={field.description}
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload
            name="file"
            action="/api/upload/form-file"
            listType="text"
            accept={field.allowedFileTypes?.join(",")}
            maxCount={field.multiple ? undefined : 1}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      );

    case "rating":
      return (
        <Form.Item
          key={field.id}
          label={field.label}
          name={field.id}
          rules={[
            { required: field.required, message: `Please provide a rating` },
          ]}
          help={field.description}
        >
          <Rate />
        </Form.Item>
      );

    default:
      return (
        <Form.Item
          key={field.id}
          label={field.label}
          name={field.id}
          rules={[
            {
              required: field.required,
              message: `Please enter ${field.label}`,
            },
          ]}
          help={field.description}
        >
          <Input placeholder={field.placeholder} />
        </Form.Item>
      );
  }
}
