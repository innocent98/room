import { GetProp, Menu, MenuProps } from "antd";
import {
  FormOutlined,
  NumberOutlined,
  MailOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  UnorderedListOutlined,
  FileOutlined,
  StarOutlined,
  EditOutlined,
  BranchesOutlined,
} from "@ant-design/icons";

interface SidebarProps {
  addField: (field: any) => void;
}

type MenuItem = GetProp<MenuProps, "items">[number];

export default function Sidebar({ addField }: SidebarProps) {
  const handleAddField = (fieldType: string) => {
    addField({ type: fieldType, label: `New ${fieldType}` });
  };

  const items: MenuItem[] = [
    {
      key: "sub1",
      label: "Basic Fields",
      icon: <FormOutlined />,
      children: [
        {
          key: "text",
          label: "Text Input",
          icon: <FormOutlined />,
          onClick: () => handleAddField("text"),
        },
        {
          key: "number",
          label: "Number Input",
          icon: <NumberOutlined />,
          onClick: () => handleAddField("number"),
        },
        {
          key: "email",
          label: "Email",
          icon: <MailOutlined />,
          onClick: () => handleAddField("email"),
        },
        {
          key: "date",
          label: "Date Picker",
          icon: <CalendarOutlined />,
          onClick: () => handleAddField("date"),
        },
      ],
    },
    {
      key: "selection",
      label: "Selection Fields",
      icon: <CheckSquareOutlined />,
      children: [
        {
          key: "dropdown",
          label: "Dropdown",
          icon: <UnorderedListOutlined />,
          onClick: () => handleAddField("dropdown"),
        },
        {
          key: "radio",
          label: "Radio Buttons",
          icon: <CheckSquareOutlined />,
          onClick: () => handleAddField("radio"),
        },
        {
          key: "checkbox",
          label: "Checkboxes",
          icon: <CheckSquareOutlined />,
          onClick: () => handleAddField("checkbox"),
        },
        {
          key: "multiselect",
          label: "Multi-Select",
          icon: <UnorderedListOutlined />,
          onClick: () => handleAddField("multiselect"),
        },
      ],
    },
    {
      key: "advanced",
      label: "Advanced Fields",
      icon: <FileOutlined />,
      children: [
        {
          key: "file",
          label: "File Upload",
          icon: <FileOutlined />,
          onClick: () => handleAddField("file"),
        },
        {
          key: "rating",
          label: "Rating",
          icon: <StarOutlined />,
          onClick: () => handleAddField("rating"),
        },
        {
          key: "signature",
          label: "Signature",
          icon: <EditOutlined />,
          onClick: () => handleAddField("signature"),
        },
        {
          key: "conditional",
          label: "Conditional Logic",
          icon: <BranchesOutlined />,
          onClick: () => handleAddField("conditional"),
        },
      ],
    },
  ];

  return <Menu mode="inline" className="h-full" items={items} />;
}
