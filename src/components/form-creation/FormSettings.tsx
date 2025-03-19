"use client"

import { Form, Input, Switch, Upload, Button, message, Image } from "antd"
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons"
import { useState, useEffect } from "react"
import type { UploadFile, UploadProps } from "antd/es/upload/interface"

interface FormSettingsProps {
  formTitle: string
  formDescription: string
  setFormTitle: (title: string) => void
  setFormDesc: (description: string) => void
  formFields: any[]
  settings?: any
  updateSettings?: (settings: any) => void
}

export default function FormSettings({
  formTitle,
  formDescription,
  setFormTitle,
  setFormDesc,
  formFields,
  settings = {},
  updateSettings = () => {},
}: FormSettingsProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewVisible, setPreviewVisible] = useState(false)

  // Initialize fileList when settings change or on component mount
  useEffect(() => {
    if (settings?.bannerImage) {
      setFileList([
        {
          uid: "-1",
          name: "banner.png",
          status: "done",
          url: settings.bannerImage,
        },
      ])
    } else {
      setFileList([])
    }
  }, [settings?.bannerImage])

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({
      ...settings,
      [key]: value,
    })
  }

  const handleRemoveBanner = () => {
    handleSettingChange("bannerImage", null)
    setFileList([])
  }

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("file", file)

      // Send the file to your API endpoint
      const response = await fetch("/api/upload/banner", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      // Update the banner image URL in settings
      handleSettingChange("bannerImage", data.url)

      // Update the file list with the uploaded file
      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: data.url,
        },
      ])

      message.success(`${file.name} uploaded successfully`)
      onSuccess(data, file)
    } catch (error) {
      console.error("Error uploading file:", error)
      message.error(`${file.name} upload failed.`)
      onError(error)
    }
  }

  const uploadProps: UploadProps = {
    fileList,
    customRequest,
    onRemove: handleRemoveBanner,
    maxCount: 1,
    accept: "image/*",
    showUploadList: false,
  }

  return (
    <Form layout="vertical" className="p-4">
      <h2 className="text-lg font-semibold mb-4">Form Settings</h2>
      <Form.Item label="Form Title">
        <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
      </Form.Item>
      <Form.Item label="Description">
        <Input.TextArea
          placeholder="Enter form description"
          rows={4}
          value={formDescription}
          onChange={(e) => setFormDesc(e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Banner Image">
        {settings?.bannerImage ? (
          <div className="mb-3">
            <div className="relative">
              <Image
                src={settings.bannerImage || "/placeholder.svg"}
                alt="Form Banner"
                className="w-full h-32 object-cover rounded-md"
                preview={{
                  visible: previewVisible,
                  onVisibleChange: (visible) => setPreviewVisible(visible),
                  mask: <div className="text-white">Preview</div>,
                }}
              />
            </div>
            <Button icon={<DeleteOutlined />} danger onClick={handleRemoveBanner} className="mt-2">
              Remove Banner
            </Button>
          </div>
        ) : (
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload Banner Image</Button>
          </Upload>
        )}
        <div className="text-xs text-gray-500 mt-1">Recommended size: 1200 x 300 pixels. Max size: 2MB.</div>
      </Form.Item>

      <Form.Item label="Allow Multiple Submissions">
        <Switch
          checked={settings.allowMultipleSubmissions}
          onChange={(checked) => handleSettingChange("allowMultipleSubmissions", checked)}
        />
      </Form.Item>
      <Form.Item label="Collect Email Addresses">
        <Switch
          checked={settings.emailNotifications}
          onChange={(checked) => handleSettingChange("emailNotifications", checked)}
        />
      </Form.Item>
      {/* <Form.Item label="Show Progress Bar">
        <Switch
          checked={settings.showProgressBar}
          onChange={(checked) => handleSettingChange("showProgressBar", checked)}
        />
      </Form.Item> */}
      <Form.Item label="Confirmation Message">
        <Input.TextArea
          placeholder="Enter confirmation message"
          rows={4}
          value={settings.confirmationMessage}
          onChange={(e) => handleSettingChange("confirmationMessage", e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Redirect URL (after submission)">
        <Input
          placeholder="https://example.com/thank-you"
          value={settings.redirectUrl}
          onChange={(e) => handleSettingChange("redirectUrl", e.target.value)}
        />
      </Form.Item>
    </Form>
  )
}

