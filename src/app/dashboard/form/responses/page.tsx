"use client";

import "@ant-design/v5-patch-for-react-19";
import Layout from "@/components/layout";
import { lazy, Suspense } from "react";

const AllResponsesPage = lazy(
  () => import("@/components/pages/AllResponsesPage")
);

export default function AllResponses() {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <Layout>
        <AllResponsesPage />
      </Layout>
    </Suspense>
  );
}
