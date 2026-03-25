'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import heroImage from '../assets/hero.svg';
import BlackButton from './buttons/BlackButton';
import BlueButton from './buttons/BlueButton';
import reviewer1 from '../assets/reviewer1.svg';
import reviewer2 from '../assets/reviewer2.svg';
import reviewer3 from '../assets/reviewer3.svg';
import reviewer4 from '../assets/reviewer4.svg';
import reviewer5 from '../assets/reviewer5.svg';

export default function HeroSection() {
  return (
    <div className='w-full flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-8 pb-16 lg:pb-28'>
      <div className='flex flex-col max-w-2xl lg:max-w-none text-center lg:text-left'>
        <p className='text-lightBlue font-semibold text-xs sm:text-sm leading-5 mt-8 lg:mt-16'>INSTANTLY SHARE CONTACT DETAILS WITH A SINGLE TAP</p>
        <h1 className='font-semibold text-3xl sm:text-4xl lg:text-5xl text-black font-inter mt-4 lg:mt-6 leading-tight lg:leading-[60px]'>
          Your AI Powered<br />
          Digital Business<br />
          Card Platform
        </h1>
        <p className='text-base lg:text-lg text-lightGrey font-normal font-inter mt-6 lg:mt-10 leading-6 max-w-xl mx-auto lg:mx-0'>
          AI-powered digital cards that capture leads, integrate with CRMs, and amplify your brand
        </p>
        <div className='flex flex-col sm:flex-row gap-4 mt-8 lg:mt-12 justify-center lg:justify-start'>
          <Link href="/auth/register"><BlueButton label='Get Yours Now' /></Link>
          <Link href="/contact"><BlackButton label='Book a Demo' /></Link>
        </div>
        <div className='flex flex-col sm:flex-row items-center justify-center lg:justify-start mt-8 lg:mt-14 gap-4'>
          <div className="flex items-center justify-center py-4">
            <img src={reviewer1.src} className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border border-white -ml-3 sm:-ml-5 first:ml-0" alt="Reviewer 1" />
            <img src={reviewer2.src} className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border border-white -ml-3 sm:-ml-5" alt="Reviewer 2" />
            <img src={reviewer3.src} className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border border-white -ml-3 sm:-ml-5" alt="Reviewer 3" />
            <img src={reviewer4.src} className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border border-white -ml-3 sm:-ml-5" alt="Reviewer 4" />
            <img src={reviewer5.src} className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border border-white -ml-3 sm:-ml-5" alt="Reviewer 5" />
          </div>

          <div className='flex flex-col items-center lg:items-start justify-center ml-0 sm:ml-4'>
            <div className='flex items-center gap-2'>
              <FaStar className="text-lightBlue text-sm sm:text-lg" />
              <FaStar className="text-lightBlue text-sm sm:text-lg" />
              <FaStar className="text-lightBlue text-sm sm:text-lg" />
              <FaStar className="text-lightBlue text-sm sm:text-lg" />
              <FaStar className="text-lightBlue text-sm sm:text-lg" />
            </div>
            <p className='text-semiGrey font-normal text-xs mt-3 text-center lg:text-left'>
              <span className='font-semibold text-black'>200.000 +</span> professionals have experienced the future of networking
            </p>
          </div>
        </div>
      </div>
      <div className='h-[50vh] sm:h-[60vh] lg:h-[70vh] w-full lg:w-[44vw] mt-8 lg:mt-12 flex items-center justify-center'>
        <img src={heroImage.src} alt='Hero' className='h-full w-full object-contain lg:object-cover max-w-md lg:max-w-none' />
      </div>
    </div>
  );
}