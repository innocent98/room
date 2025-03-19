"use client"

import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { Card } from "antd"
import type { Field } from "@/constants/types"
import { BranchesOutlined } from "@ant-design/icons"

interface FormPreviewProps {
  index: number
  field: Field
  moveField: (dragIndex: number, hoverIndex: number) => void
  onClick: () => void
  isSelected?: boolean
}

export default function FormPreview({ index, field, moveField, onClick, isSelected = false }: FormPreviewProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: "FIELD",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ handlerId }, drop] = useDrop({
    accept: "FIELD",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveField(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  const renderFieldPreview = () => {
    switch (field.type) {
      case "text":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              placeholder={field.placeholder}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled
            />
          </div>
        )
      case "textarea":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              placeholder={field.placeholder}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              disabled
            />
          </div>
        )
      case "email":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="email"
              placeholder={field.placeholder}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled
            />
          </div>
        )
      case "number":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              placeholder={field.placeholder}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled
            />
          </div>
        )
      case "checkbox":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {field.options &&
                field.options.map((option: string, i: number) => (
                  <div key={i} className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" disabled />
                    <label className="ml-2 block text-sm text-gray-700">{option}</label>
                  </div>
                ))}
            </div>
          </div>
        )
      case "radio":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {field.options &&
                field.options.map((option: string, i: number) => (
                  <div key={i} className="flex items-center">
                    <input type="radio" className="h-4 w-4 text-indigo-600 border-gray-300" disabled />
                    <label className="ml-2 block text-sm text-gray-700">{option}</label>
                  </div>
                ))}
            </div>
          </div>
        )
      case "dropdown":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-md bg-white" disabled>
              <option value="">Select an option</option>
              {field.options &&
                field.options.map((option: string, i: number) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </div>
        )
      case "date":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input type="date" className="w-full p-2 border border-gray-300 rounded-md" disabled />
          </div>
        )
      case "file":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input type="file" className="w-full p-2 border border-gray-300 rounded-md" disabled />
          </div>
        )
      case "signature":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="w-full h-32 border border-gray-300 rounded-md bg-gray-50 flex items-center justify-center">
              <span className="text-gray-400 italic">Signature pad</span>
            </div>
          </div>
        )
      case "rating":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-2xl text-gray-300 cursor-not-allowed">
                  ★
                </span>
              ))}
            </div>
          </div>
        )
      default:
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              placeholder={field.placeholder}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled
            />
          </div>
        )
    }
  }

  // Check if field has conditional logic
  const hasConditionalLogic = field.conditionalLogic && field.conditionalLogic.enabled

  return (
    <div
      ref={ref}
      className={`mb-4 cursor-move ${isDragging ? "opacity-50" : "opacity-100"}`}
      onClick={onClick}
      data-handler-id={handlerId}
    >
      <Card
        className={`${isSelected ? "border-2 border-indigo-500" : ""}`}
        hoverable
        extra={
          hasConditionalLogic && (
            <div className="text-xs flex items-center text-blue-500">
              <BranchesOutlined className="mr-1" />
              <span>Conditional</span>
            </div>
          )
        }
      >
        {renderFieldPreview()}
      </Card>
    </div>
  )
}

