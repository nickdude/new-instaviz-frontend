'use client';


import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import test1 from '../assets/testinomial.svg';
import per1 from '../assets/per1.svg';
import left from '../assets/left.svg';
import right from '../assets/right.svg';

export default function TrustedBy() {
  const testimonials = [
    {
      image: test1.src,
      stars: 5,
      quote: 'My entire executive leadership team uses Instaviz.',
      feedback: "I've created Instaviz digital business cards for my company's executive leadership and had a wonderful experience doing it - great product, service, and value. I highly recommend it!",
      person: {
        image: per1.src,
        name: 'Philip Smith',
        title: 'Communications Manager',
        company: 'Chick-fil-A',
      },
    },
    // 4 more dummy cards with same image and dummy data
    {
      image: test1.src,
      stars: 5,
      quote: 'Amazing product for professionals!',
      feedback: 'The digital card setup was seamless and the support team is fantastic.',
      person: {
        image: per1.src,
        name: 'Jane Doe',
        title: 'Product Manager',
        company: 'TechCorp',
      },
    },
    {
      image: test1.src,
      stars: 5,
      quote: 'Highly recommend AnurTech!',
      feedback: 'Easy to use and very effective for networking.',
      person: {
        image: per1.src,
        name: 'John Appleseed',
        title: 'Lead Designer',
        company: 'Designify',
      },
    },
    {
      image: test1.src,
      stars: 5,
      quote: 'A must-have for teams.',
      feedback: 'Our team loves the convenience and style of these cards.',
      person: {
        image: per1.src,
        name: 'Emily Clark',
        title: 'HR Director',
        company: 'PeopleFirst',
      },
    },
    {
      image: test1.src,
      stars: 5,
      quote: 'Great value and service.',
      feedback: 'The onboarding was smooth and the cards look great.',
      person: {
        image: per1.src,
        name: 'Michael Lee',
        title: 'Operations Lead',
        company: 'OpsGen',
      },
    },
  ];

  const [current, setCurrent] = useState(0);
  const total = testimonials.length;

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const t = testimonials[current];

  return (
    <div id="reviews" className='w-full min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-8 bg-gray-100 py-12 lg:py-16'>
      <h1 className='font-semibold text-2xl sm:text-3xl lg:text-4xl font-inter text-center max-w-4xl mb-12 lg:mb-20'>Trusted by Modern Professionals</h1>
      <div className='w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 mt-4 lg:mt-8'>
        <div className='w-full max-w-lg lg:w-[528px] h-64 sm:h-80 lg:h-96 bg-blue-700 rounded-lg flex items-center justify-center'>
          <img src={t.image} alt='testimonial visual' className='w-full h-full object-cover rounded-lg' />
        </div>
        <div className='w-full max-w-lg lg:w-[528px] h-auto lg:h-96 bg-white rounded-lg flex flex-col'>
          <div className='w-full h-auto lg:h-80 rounded-lg flex flex-col items-start gap-4 p-4 sm:p-6'>
            <div className='flex items-center gap-2'>
              {[...Array(t.stars)].map((_, i) => (
                <FaStar key={i} className="text-lightBlue text-base sm:text-lg" />
              ))}
            </div>
            <p className='font-medium text-lg sm:text-xl lg:text-2xl font-inter text-black'>"{t.quote}"</p>
            <p className='font-normal text-sm font-inter text-black'>{t.feedback}</p>
          </div>
          <div className='w-full h-auto lg:h-20 rounded-lg flex items-center gap-4 p-4 sm:p-6 mt-4 bg-shadowGrey'>
            <img src={t.person.image} alt={t.person.name} className='w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0' />
            <div className='flex flex-col items-start'>
              <p className='font-bold text-base sm:text-lg font-inter text-black'>{t.person.name},</p>
              <p className='font-normal text-sm sm:text-base font-inter text-mediumGrey leading-4'>{t.person.title}<br />{t.person.company}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full max-w-4xl flex items-center justify-center lg:justify-end gap-4 lg:gap-8 mt-8 px-4 mb-12 lg:mb-20'>
        <button onClick={handlePrev} className='border border-lightBlue px-3 py-2 sm:px-4 sm:py-3 rounded-md hover:bg-lightBlue hover:text-white transition-colors'>
          <img src={left.src} alt='previous' className='w-4 h-4' />
        </button>
        <span className='text-sm sm:text-base'>{current + 1} / {total}</span>
        <button onClick={handleNext} className='border border-lightBlue px-3 py-2 sm:px-4 sm:py-3 rounded-md hover:bg-lightBlue hover:text-white transition-colors'>
          <img src={right.src} alt='next' className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
}