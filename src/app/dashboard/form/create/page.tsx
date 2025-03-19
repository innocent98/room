"use client";

import "@ant-design/v5-patch-for-react-19";
import Layout from "@/components/layout";
import { lazy, Suspense } from "react";

const FormCreationPage = lazy(
  () => import("@/components/pages/FormCreationPage")
);

export default function FormCreation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Layout>
        <FormCreationPage />
      </Layout>
    </Suspense>
  );
}
