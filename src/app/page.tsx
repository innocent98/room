"use client";

import { useRouter } from "next/navigation";
import Layout from "./components/layout";
import {
  PlusIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const router = useRouter();
  return (
    <Layout>
      {/* Section A: Welcome Banner */}
      <section className="card mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, Victor!</h1>
        <p className="text-gray-600">
          Ready to create your next form? Get started with just a few clicks.
        </p>
      </section>

      {/* Section B: Recent Activity */}
      <section className="card mb-6">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <ul className="space-y-2">
          <li className="flex items-center justify-between">
            <span>Customer Feedback Form</span>
            <span className="text-green-500">Active</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Employee Survey 2023</span>
            <span className="text-yellow-500">Draft</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Product Launch Questionnaire</span>
            <span className="text-blue-500">Completed</span>
          </li>
        </ul>
      </section>

      {/* Section C: Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <button className="btn btn-primary flex items-center justify-center text-lg">
          <PlusIcon className="h-6 w-6 mr-2" />
          Create a New Form
        </button>
        <button
          className="btn btn-primary flex items-center justify-center text-lg"
          onClick={() => router.push("/all-responses")}
        >
          <DocumentTextIcon className="h-6 w-6 mr-2" />
          View All Responses
        </button>
        <button className="btn btn-primary flex items-center justify-center text-lg">
          <ClipboardDocumentListIcon className="h-6 w-6 mr-2" />
          Explore Templates
        </button>
      </section>

      {/* Section D: Analytics Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold mb-2">Total Forms</h3>
          <p className="text-4xl font-bold">15</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold mb-2">Total Responses</h3>
          <p className="text-4xl font-bold">256</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold mb-2">Active Forms</h3>
          <p className="text-4xl font-bold">8</p>
        </div>
      </section>
    </Layout>
  );
}
