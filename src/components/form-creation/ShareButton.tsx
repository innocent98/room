"use client";

import { useState } from "react";
import { Button } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import ShareForm from "../form-sharing/ShareForm";

interface ShareButtonProps {
  formId: string;
  formTitle: string;
}

export default function ShareButton({ formId, formTitle }: ShareButtonProps) {
  const [shareModalVisible, setShareModalVisible] = useState(false);

  return (
    <>
      <Button
        icon={<ShareAltOutlined />}
        onClick={() => setShareModalVisible(true)}
      >
        Share Form
      </Button>

      <ShareForm
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        formId={formId}
        formTitle={formTitle}
      />
    </>
  );
}
