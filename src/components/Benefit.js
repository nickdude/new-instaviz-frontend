'use client';

import Link from 'next/link';
import closeIcon from '../assets/close.svg';
import tick from '../assets/tick.svg';
import BlueButton from './buttons/BlueButton';
import oldCard from '../assets/old_card.svg';
import newCard from '../assets/new_card.svg';

export default function Benefit() {
  return (
    <div id="paper-vs-digital" className='w-full flex items-center flex-col justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8'>
      <h2 className='text-2xl sm:text-3xl lg:text-4xl font-semibold font-inter leading-tight lg:leading-10 text-center max-w-4xl'>Benefits of Our Digital NFC Card</h2>
      <p className='text-sm sm:text-base font-normal leading-5 font-inter mt-2 text-lightGrey text-center max-w-2xl'>The smarter, modern alternative to traditional business cards.</p>
      <div className='w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 mt-6 sm:mt-8 mb-8 lg:mb-10'>
        <div className="relative bg-darkGrey rounded-xl flex flex-col items-center gap-4 cursor-pointer hover:shadow-custom p-4 w-full max-w-lg">
          <h3 className="text-lg sm:text-xl font-semibold text-black text-center">
            Paper Business Card
          </h3>
          <div className="flex flex-col items-start gap-2 w-full">
            <div className="w-full min-h-[300px] sm:min-h-[350px] lg:min-h-[395px] bg-white rounded-lg p-4 flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <img src={closeIcon.src} alt="card1" className="w-5 h-5 rounded-t-xl" />
                <h1 className="text-base font-medium text-lightGrey">
                  Shares just the basics
                </h1>
              </div>
              <p className="text-sm font-normal ml-7 text-lightGrey mb-2">
                Name, Number, Website.
              </p>

              <div className="flex items-center gap-2">
                <img src={closeIcon.src} alt="card1" className="w-5 h-5 rounded-t-xl" />
                <h1 className="text-base font-medium text-lightGrey">Limited Sharing</h1>
              </div>
              <p className="text-sm font-normal ml-7 text-lightGrey">
                Needs to be handed over physically.
              </p>

              <div className="flex items-center gap-2">
                <img src={closeIcon.src} alt="card1" className="w-5 h-5 rounded-t-xl" />
                <h1 className="text-base font-medium text-lightGrey">Hard to Update</h1>
              </div>
              <p className="text-sm font-normal ml-7 text-lightGrey">
                Changes need reprinting.
              </p>

              <div className="flex items-center gap-2">
                <img src={closeIcon.src} alt="card1" className="w-5 h-5 rounded-t-xl" />
                <h1 className="text-base font-medium text-lightGrey">
                  Limited Info Space
                </h1>
              </div>
              <p className="text-sm font-normal ml-7 text-lightGrey">
                Only basic text fits.
              </p>
            </div>
          </div>

          {/* Floating Image */}
          <img
            src={oldCard.src}
            alt="traditional business card"
            className="hidden lg:block absolute -bottom-8 -left-32 xl:-left-64 translate-x-1/2 translate-y-1/2 w-60 h-60 xl:w-80 xl:h-80"
          />
        </div>

        <div className='relative bg-lightBlue rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:shadow-custom p-4 w-full max-w-lg'>
          <h3 className='text-lg sm:text-xl font-semibold text-white text-center'>Our Digital NFC Card</h3>
          <div className='flex flex-col items-start gap-2 w-full'>
            <div className='w-full min-h-[300px] sm:min-h-[350px] lg:min-h-[395px] bg-white rounded-lg p-4 flex flex-col items-start gap-2'>
              <div className='flex items-center gap-2'>
                <img src={tick.src} alt='card1' className='w-5 h-5 rounded-t-xl' />
                <h1 className='text-base font-medium text-lightGrey'>Instant Sharing in one Tap</h1>
              </div>
              <p className='text-sm font-normal ml-7 text-lightGrey mb-2'>Tap, scan, or send via link anytime.</p>

              <div className='flex items-center gap-2'>
                <img src={tick.src} alt='card1' className='w-5 h-5 rounded-t-xl' />
                <h1 className='text-base font-medium text-lightGrey'>Edit your card anytime</h1>
              </div>
              <p className='text-sm font-normal ml-7 text-lightGrey'>Edit your info anytime without extra cost..</p>

              <div className='flex items-center gap-2'>
                <img src={tick.src} alt='card1' className='w-5 h-5 rounded-t-xl' />
                <h1 className='text-base font-medium text-lightGrey'>Eco-Friendly</h1>
              </div>
              <p className='text-sm font-normal ml-7 text-lightGrey'>100% digital, zero waste.</p>

              <div className='flex items-center gap-2'>
                <img src={tick.src} alt='card1' className='w-5 h-5 rounded-t-xl' />
                <h1 className='text-base font-medium text-lightGrey'>Unlimited Info</h1>
              </div>
              <p className='text-sm font-normal ml-7 text-lightGrey'>Add links, videos, social media & more.</p>

              <div className='flex items-center gap-2'>
                <img src={tick.src} alt='card1' className='w-5 h-5 rounded-t-xl' />
                <h1 className='text-base font-medium text-lightGrey'>Cost-Effective</h1>
              </div>
              <p className='text-sm font-normal ml-7 text-lightGrey'>One-time setup, no ongoing print costs.</p>

              <div className='flex items-center gap-2'>
                <img src={tick.src} alt='card1' className='w-5 h-5 rounded-t-xl' />
                <h1 className='text-base font-medium text-lightGrey'>Modern & Impressive</h1>
              </div>
              <p className='text-sm font-normal ml-7 text-lightGrey'>Stand out with a sleek, smart card.</p>
            </div>
          </div>

          <img
            src={newCard.src}
            alt="digital NFC card"
            className="hidden lg:block absolute -bottom-8 left-20 xl:left-40 translate-x-1/2 translate-y-1/2 w-60 h-60 xl:w-80 xl:h-80"
          />
        </div>
      </div>

      <div className="mt-8">
        <Link href="/auth/register"><BlueButton label='Get Yours Now' /></Link>
      </div>
    </div>
  );
}