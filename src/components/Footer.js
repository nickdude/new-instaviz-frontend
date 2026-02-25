'use client';

import logo from '../assets/logo.jpeg';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = (id) => (e) => {
    e.preventDefault();
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (pathname !== '/') {
      router.push('/');
      // wait for navigation to complete and DOM to render
      setTimeout(doScroll, 80);
    } else {
      doScroll();
    }
  };

  return (
    <footer className='w-full bg-gray-100 px-4 sm:px-6 lg:px-8 py-12 lg:py-16'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col lg:flex-row justify-between gap-12 lg:gap-24'>
          {/* Left Section - Company Info */}
          <div className='flex flex-col items-start gap-4 lg:max-w-md'>
            <img src={logo.src} alt='logo' className='h-6 sm:h-14 w-auto' />
            <p className='text-sm text-black font-normal font-inter tracking-[-0.15px]'>© 2025 Instaviz pvt ltd.</p>

            <div className='mt-4'>
              <h1 className='text-black font-bold text-sm leading-5 mb-2'>Address</h1>
              <p className='text-black font-inter text-sm leading-5'>
                7th Floor, Temple Tower,<br />
                672 Anna Salai, Nandanam,<br />
                Chennai, TN 600 035
              </p>
            </div>

            <div className='mt-4'>
              <h1 className='text-black font-bold text-sm leading-5 mb-2'>Contact</h1>
              <p className='text-black font-inter text-sm leading-5 underline'>info@instaviz.me</p>
              <p className='text-black font-inter text-sm leading-5 underline'>support@instaviz.me</p>
            </div>

            <div className="flex space-x-4 items-start text-xl sm:text-2xl text-black mt-4">
              <a href="https://www.facebook.com/instavizdigital" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors"><FaFacebookF /></a>
              <a href="https://www.instagram.com/insta_viz/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors"><FaInstagram /></a>
              <a href="https://www.linkedin.com/company/instavizofficial" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-colors"><FaLinkedinIn /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors"><FaYoutube /></a>
            </div>
          </div>

          {/* Right Section - Menu Links */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16'>
            <div>
              <h1 className='text-black font-bold text-sm leading-5 mb-4'>Features</h1>
              <div className='space-y-3'>
                <a href="/" onClick={scrollToSection('why-digital')} className='text-black font-inter text-sm leading-5 hover:text-blue-600 transition-colors block'>Why digital card?</a>
                <a href="/" onClick={scrollToSection('process')} className='text-black font-inter text-sm leading-5 hover:text-blue-600 transition-colors block'>Process</a>
                <a href="/" onClick={scrollToSection('paper-vs-digital')} className='text-black font-inter text-sm leading-5 hover:text-blue-600 transition-colors block'>Paper Vs Digital</a>
              </div>
            </div>

            <div>
              <h1 className='text-black font-bold text-sm leading-5 mb-4'>Pricing</h1>
              <div className='space-y-3'>
                <a href="/" onClick={scrollToSection('plans')} className='text-black font-inter text-sm leading-5 hover:text-blue-600 transition-colors block'>Pricing</a>
                <a href="/" onClick={scrollToSection('reviews')} className='text-black font-inter text-sm leading-5 hover:text-blue-600 transition-colors block'>Reviews</a>
                <Link href="/auth/register" onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)} className='text-black font-inter text-sm leading-5 hover:text-blue-600 transition-colors block'>Register</Link>
              </div>
            </div>

            <div>
              <h1 className='text-black font-bold text-sm leading-5 mb-4'>Company</h1>
              <div className='space-y-3'>
                <a href='/' onClick={scrollToSection('top')} className='text-black font-inter text-sm leading-5 hover:text-blue-600 transition-colors block'>Home</a>
                <Link href="/about" onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)} className='text-black font-inter text-sm leading-5 hover:text-blue-600 transition-colors block'>About Us</Link>
                <Link href="/contact" onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)} className='text-black font-inter text-sm leading-5 hover:text-blue-600 transition-colors block'>Contact us</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}