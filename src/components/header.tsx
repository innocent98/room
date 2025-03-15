import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-2xl text-indigo-600">
              ROOM
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="#features"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Testimonials
              </Link>
              <Link
                href="#pricing"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Link
              href="/auth/sign-in"
              className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
