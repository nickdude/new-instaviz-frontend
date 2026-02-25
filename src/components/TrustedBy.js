'use client';

import { FaStar } from 'react-icons/fa';
import test1 from '../assets/testinomial.svg';
import per1 from '../assets/per1.svg';
import left from '../assets/left.svg';
import right from '../assets/right.svg';

export default function TrustedBy() {
  return (
    <div id="reviews" className='w-full min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-8 bg-gray-100 py-12 lg:py-16'>
      <h1 className='font-semibold text-2xl sm:text-3xl lg:text-4xl font-inter text-center max-w-4xl mb-12 lg:mb-20'>Trusted by Modern Professionals</h1>
      <div className='w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 mt-4 lg:mt-8'>
        <div className='w-full max-w-lg lg:w-[528px] h-64 sm:h-80 lg:h-96 bg-blue-700 rounded-lg flex items-center justify-center'>
          <img src={test1.src} alt='testimonial visual' className='w-full h-full object-cover rounded-lg' />
        </div>

        <div className='w-full max-w-lg lg:w-[528px] h-auto lg:h-96 bg-white rounded-lg flex flex-col'>
          <div className='w-full h-auto lg:h-80 rounded-lg flex flex-col items-start gap-4 p-4 sm:p-6'>
            <div className='flex items-center gap-2'>
              <FaStar className="text-lightBlue text-base sm:text-lg" />
              <FaStar className="text-lightBlue text-base sm:text-lg" />
              <FaStar className="text-lightBlue text-base sm:text-lg" />
              <FaStar className="text-lightBlue text-base sm:text-lg" />
              <FaStar className="text-lightBlue text-base sm:text-lg" />
            </div>
            <p className='font-medium text-lg sm:text-xl lg:text-2xl font-inter text-black'>"My entire executive leadership team uses AnurTech."</p>
            <p className='font-normal text-sm font-inter text-black'>I've created AnurTech digital business cards for my company's executive leadership and had a wonderful experience doing it - great product, service, and value. I highly recommend it!</p>
          </div>
          <div className='w-full h-auto lg:h-20 rounded-lg flex items-center gap-4 p-4 sm:p-6 mt-4 bg-shadowGrey'>
            <img src={per1.src} alt='Philip Smith' className='w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0' />
            <div className='flex flex-col items-start'>
              <p className='font-bold text-base sm:text-lg font-inter text-black'>Philip Smith,</p>
              <p className='font-normal text-sm sm:text-base font-inter text-mediumGrey leading-4'>Communications Manager<br />Chick-fil-A</p>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full max-w-4xl flex items-center justify-center lg:justify-end gap-4 lg:gap-8 mt-8 px-4 mb-12 lg:mb-20'>
        <button className='border border-lightBlue px-3 py-2 sm:px-4 sm:py-3 rounded-md hover:bg-lightBlue hover:text-white transition-colors'>
          <img src={left.src} alt='previous' className='w-4 h-4' />
        </button>
        <span className='text-sm sm:text-base'>1 / 5</span>
        <button className='border border-lightBlue px-3 py-2 sm:px-4 sm:py-3 rounded-md hover:bg-lightBlue hover:text-white transition-colors'>
          <img src={right.src} alt='next' className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
}