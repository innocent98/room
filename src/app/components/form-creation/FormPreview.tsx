/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  Input,
  Select,
  DatePicker,
  Checkbox,
  Radio,
  Rate,
  Upload,
  Button,
  Space,
  Row,
  Flex,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Field } from "@/constants/types";

interface FormPreviewProps {
  index: number;
  field: Field;
  moveField: (dragIndex: number, hoverIndex: number) => void;
  onClick: () => void;
}

const ItemTypes = {
  FIELD: "field",
};

export default function FormPreview({
  index,
  field,
  moveField,
  onClick,
}: FormPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.FIELD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveField(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.FIELD,
    item: () => {
      return { id: field.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
        return (
          <Input placeholder={field.placeholder || `Enter ${field.label}`}/>
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder || `Enter ${field.label}`}
          />
        );
      case "date":
        return <DatePicker className="w-full" />;
      case "dropdown":
        return (
          <Select
            className="w-full"
            placeholder={field.placeholder || `Select ${field.label}`}
          >
            {(field.options || []).map((option: string, index: number) => (
              <Select.Option key={index} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        );
      case "radio":
        return (
          <Radio.Group>
            {(field.options || []).map((option: string, index: number) => (
              <Radio key={index} value={option}>
                {option}
              </Radio>
            ))}
          </Radio.Group>
        );
      case "checkbox":
        return (
          <Checkbox.Group>
            {(field.options || []).map((option: string, index: number) => (
              <Checkbox key={index} value={option}>
                {option}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
      case "multiselect":
        return (
          <Select
            mode="multiple"
            className="w-full"
            placeholder={field.placeholder || `Select ${field.label}`}
          >
            {(field.options || []).map((option: string, index: number) => (
              <Select.Option key={index} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        );
      case "file":
        return (
          <Upload>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        );
      case "rating":
        return <Rate />;
      case "signature":
        return <Input placeholder="Signature Placeholder" />;
      case "conditional":
        return <Input placeholder="Conditional Logic Placeholder" />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      style={{ opacity }}
      onClick={onClick}
      data-handler-id={handlerId}
      className="mb-4 p-4 bg-white rounded shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <label className="block mb-2 font-medium">{field.label}</label>
      <Flex className="w-full items-center">
        {renderField()}
        {field.required && <span className="text-red-500 ml-1 vg">*</span>}
      </Flex>
    </div>
  );
}
