'use client';

import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
  const router = useRouter();

  const handleClick = () => {
    // Check for a valid auth token
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    if (token) {
      // Simulate valid token → go to templates
      router.push('/templates');
    } else {
      // No token → go to login
      router.push('/auth/login');
    }
  };

  return (
    <div className="mt-4 sm:mt-6 lg:mt-8 flex items-center justify-center" onClick={handleClick}>
      <div className="w-full max-w-xs sm:max-w-sm lg:w-64 bg-darkGrey rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-custom transition-transform hover:scale-105 equal-height-card h-full">
        <img
          src={`/${product.image}`}
          alt={product.name}
          className="w-full h-48 sm:h-56 lg:h-64 rounded-t-xl object-cover"
        />
        <div className="flex flex-col items-start gap-2 px-4 py-4 pb-4 w-full">
          <p className="text-lg sm:text-xl font-semibold text-black">{product.name}</p>
          <p className="text-sm font-normal text-lightGrey">{product.description}</p>
          {/* <p className="text-base font-medium text-black mt-2">₹{product.price.toLocaleString()}</p> */}
        </div>
      </div>
    </div>
  );
}
