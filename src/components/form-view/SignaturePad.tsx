"use client";

import type React from "react";

import { useRef } from "react";
import { Button } from "antd";
import SignatureCanvas from "react-signature-canvas";
import { uploadImageToFirebase } from "@/lib/upload";
import { dataURLtoFile } from "@/lib/url-to-file";

interface SignaturePadProps {
  onChange: (dataURL: string | null) => void;
  field?: any;
}

export default function SignaturePad({ onChange, field }: SignaturePadProps) {
  // Signature refs
  const signatureRefs = useRef<Record<string, SignatureCanvas | null>>({});

  const endDrawing = () => {
    // Add signature data URLs to the form values
    Object.keys(signatureRefs.current).forEach((fieldId) => {
      const signatureCanvas = signatureRefs.current[fieldId];
      if (signatureCanvas && !signatureCanvas.isEmpty()) {
        const dataURL = signatureCanvas.toDataURL("image/png");

        const file = dataURLtoFile(dataURL, "signature.png");

        uploadImageToFirebase(file, `signature/${Date.now()}`).then(
          (signatureUrl) => {
            onChange(signatureUrl);
          }
        );
      }
    });
  };

  return (
    <div className="border rounded-md p-2">
      <SignatureCanvas
        ref={(ref) => {
          signatureRefs.current[field.id] = ref;
        }}
        canvasProps={{
          className: "w-full h-40 border border-gray-200 rounded",
          style: { background: "white" },
        }}
        clearOnResize={false}
        onEnd={endDrawing}
      />
      <Button
        size="small"
        className="mt-2"
        onClick={() => {
          if (signatureRefs.current[field.id]) {
            signatureRefs.current[field.id]?.clear();
          }
        }}
      >
        Clear
      </Button>
    </div>
  );
}
