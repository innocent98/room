"use client";

import "@ant-design/v5-patch-for-react-19";
import { lazy, Suspense } from "react";

const FormSettingsPage = lazy(
  () => import("@/components/pages/FormSettingsPage")
);

export default function FormSettings() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormSettingsPage />
    </Suspense>
  );
}
