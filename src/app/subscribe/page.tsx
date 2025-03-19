"use client";

import type React from "react";

import { lazy, Suspense } from "react";

const SubscribePage = lazy(() => import("@/components/pages/SubscribePage"));

export default function Subscribe() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubscribePage />
    </Suspense>
  );
}
