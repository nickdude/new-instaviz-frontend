'use client';

import wifi from '../assets/wifi.svg';
import note from '../assets/note.svg';
import leaf from '../assets/leaf.svg';

export default function Why() {
  return (
    <div id="why-digital" className='w-full min-h-screen lg:h-[58vh] flex items-center justify-center bg-black text-white flex-col px-4 sm:px-6 lg:px-8 py-16 lg:py-8'>
      <h2 className='text-2xl sm:text-3xl lg:text-5xl font-semibold font-inter leading-tight lg:leading-10 text-center max-w-4xl'>Why should you switch to digital business cards?</h2>
      <div className='w-full max-w-6xl mt-12 lg:mt-28 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-10'>
        <div className='flex flex-col items-center justify-center text-center px-4 w-full lg:w-1/3 max-w-sm'>
          <img src={wifi.src} alt='wifi' className='h-12 w-20' />
          <h3 className='text-lg sm:text-xl font-semibold font-inter mt-4'>Tap to Share. No App Needed.</h3>
          <p className='text-sm font-normal leading-5 font-inter mt-2 text-greyBlack'>With built-in NFC, share your contact details just by tapping your card to a smartphone. Works across most iOS and Android devices without needing an app.</p>
        </div>
        <div className='flex flex-col items-center justify-center text-center px-4 w-full lg:w-1/3 max-w-sm'>
          <img src={note.src} alt='note' className='h-12 w-20' />
          <h3 className='text-lg sm:text-xl font-semibold font-inter mt-4'>100% Customizable Cards</h3>
          <p className='text-sm font-normal font-inter mt-2 text-greyBlack'>Update your contact information or professional details before any event without the hassles of re-printing.</p>
        </div>
        <div className='flex flex-col items-center justify-center text-center px-4 w-full lg:w-1/3 max-w-sm'>
          <img src={leaf.src} alt='leaf' className='h-12 w-20' />
          <h3 className='text-lg sm:text-xl font-semibold font-inter mt-4'>Eco-Friendly + Always Updated</h3>
          <p className='text-sm font-normal font-inter mt-2 text-greyBlack'>No more paper waste. No more reprints. You can update your details anytime — your card stays current forever.</p>
        </div>
      </div>
    </div>
  );
}