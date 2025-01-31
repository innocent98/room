import { Collapse, CollapseProps } from "antd";

const { Panel } = Collapse;
const items: CollapseProps["items"] = [
  {
    key: "faq1",
    label: "How to create a form?",
    children: (
      <p>
        To create a form, log in to your account and click on the "Create New
        Form" button on your dashboard. Follow the step-by-step guide to add
        questions, customize the form, and set up your preferences.
      </p>
    ),
  },
  {
    key: "faq2",
    label: "How to download responses?",
    children: (
      <p>
        To download responses, go to your form's "Responses" page. Click on the
        "Export" button and choose your preferred format (CSV, Excel, or PDF).
        The file will be generated and downloaded to your device.
      </p>
    ),
  },
  {
    key: "faq3",
    label: "What is the export limit?",
    children: (
      <p>
        The export limit depends on your account type. Free accounts can export
        up to 100 responses per form. Premium accounts have unlimited exports.
        Check your account settings for more details on your specific limits.
      </p>
    ),
  },
  {
    key: "faq4",
    label: "How to share my form?",
    children: (
      <p>
        After creating your form, go to the "Share" tab. You'll find options to
        copy a direct link, embed the form on your website, or share via email.
        Choose the method that works best for your needs.
      </p>
    ),
  },
  {
    key: "faq5",
    label: "Can I customize the look of my form?",
    children: (
      <p>
        Yes, you can customize the appearance of your form. In the form editor,
        look for the "Theme" or "Design" options. You can change colors, fonts,
        and add your logo to match your brand or preferences.
      </p>
    ),
  },
];

export default function FAQSection() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      <Collapse items={items} defaultActiveKey={["1"]} />
    </div>
  );
}
