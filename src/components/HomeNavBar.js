'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import logo from "../assets/logo.jpeg";
import BlueButton from "./buttons/BlueButton";
import BlueTransparentButton from "./buttons/BlueTransparentButton";

export default function HomeNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  useEffect(() => {
    // Check authentication status on mount and when user returns to page
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
      }
    };

    checkAuth();

    // Listen for storage changes (logout from another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
    // If not on homepage, navigate to homepage first
    if (pathname !== '/') {
      router.push('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } else {
      // Already on homepage, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };


  return (
    <nav className="w-full bg-white shadow-sm relative">
      {/* Desktop Navbar */}
      <div className="hidden lg:flex h-24 items-center justify-center gap-14 px-4">
        <div className="flex items-center gap-4">
          <img src={logo.src} className="h-14 w-54 cursor-pointer" alt="logo" onClick={() => router.push("/")} />
          <hr className="border-collapse h-7 w-[1px] bg-black" />
          <p className="font-normal font-inter text-xs text-grey">
            Your digital business
            <br /> card platform.
          </p>
        </div>

        <div className="flex items-center gap-8 font-inter">
          <p
            className="font-medium text-sm text-lightGrey hover:text-blue-600 cursor-pointer transition-colors duration-200"
            onClick={() => scrollToSection('why-digital')}
          >
            Why digital card?
          </p>
          <p
            className="font-medium text-sm text-lightGrey hover:text-blue-600 cursor-pointer transition-colors duration-200"
            onClick={() => scrollToSection('process')}
          >
            Process
          </p>
          <p
            className="font-medium text-sm text-lightGrey hover:text-blue-600 cursor-pointer transition-colors duration-200"
            onClick={() => scrollToSection('reviews')}
          >
            Reviews
          </p>
          <p
            className="font-medium text-sm text-lightGrey hover:text-blue-600 cursor-pointer transition-colors duration-200"
            onClick={() => scrollToSection('paper-vs-digital')}
          >
            Paper Vs Digital
          </p>
          <p
            className="font-medium text-sm text-lightGrey hover:text-blue-600 cursor-pointer transition-colors duration-200"
            onClick={() => { router.push('/about'); setIsMobileMenuOpen(false); }}
          >
            About Us
          </p>
          <p
            className="font-medium text-sm text-lightGrey hover:text-blue-600 cursor-pointer transition-colors duration-200"
            onClick={() => { router.push('/contact'); setIsMobileMenuOpen(false); }}
          >
            Contact us
          </p>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <p className="font-medium text-sm text-lightGrey hover:text-blue-600 transition">My Cards</p>
              </Link>
              <BlueTransparentButton label="Logout" onClick={handleLogout} />
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <BlueTransparentButton label="Login" />
              </Link>
              <Link href="/auth/register">
                <BlueButton label="Get Yours Now" />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src={logo.src} className="h-6 w-auto cursor-pointer" alt="logo" onClick={() => router.push("/")} />
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="px-4 py-2 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-3">
              <p
                className="block font-medium text-sm text-lightGrey hover:text-blue-600 cursor-pointer transition-colors duration-200 py-2"
                onClick={() => scrollToSection('why-digital')}
              >
                Why digital card?
              </p>
              <p
                className="block font-medium text-sm text-lightGrey hover:text-blue-600 cursor-pointer transition-colors duration-200 py-2"
                onClick={() => scrollToSection('process')}
              >
                Process
              </p>
              <p
                className="block font-medium text-sm text-lightGrey hover:text-blue-600 cursor-pointer transition-colors duration-200 py-2"
                onClick={() => scrollToSection('reviews')}
              >
                Reviews
              </p>
              <p
                className="block font-medium text-sm text-lightGrey hover:text-blue-600 cursor-pointer transition-colors duration-200 py-2"
                onClick={() => scrollToSection('paper-vs-digital')}
              >
                Paper Vs Digital
              </p>
              <p
                className="block font-medium text-sm text-lightGrey hover:text-blue-600 cursor-pointer transition-colors duration-200 py-2"
                onClick={() => { router.push('/about'); setIsMobileMenuOpen(false); }}
              >
                About Us
              </p>
              <p
                className="block font-medium text-sm text-lightGrey hover:text-blue-600 cursor-pointer transition-colors duration-200 py-2"
                onClick={() => { router.push('/contact'); setIsMobileMenuOpen(false); }}
              >
                Contact us
              </p>
            </div>

            {/* Auth Buttons */}
            <div className="border-t pt-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <p className="block font-medium text-sm text-lightGrey hover:text-blue-600 transition py-2">My Cards</p>
                  </Link>
                  <div className="pt-2">
                    <BlueTransparentButton label="Logout" onClick={handleLogout} />
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="block w-full mb-3">
                      <BlueTransparentButton label="Login" />
                    </div>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="block w-full">
                      <BlueButton label="Get Yours Now" />
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
