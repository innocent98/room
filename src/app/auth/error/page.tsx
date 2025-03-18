"use client";

import { lazy, Suspense } from "react";
const AuthErrorPage = lazy(() => import("@/components/pages/AuthErrorPage"));

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorPage />
    </Suspense>
  );
}
