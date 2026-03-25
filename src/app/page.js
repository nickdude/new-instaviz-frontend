'use client';

import Benefit from "@/components/Benefit";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HomeNavbar from "@/components/HomeNavBar";
import { PlanCard } from "@/components/PlanCard";
import Products from "@/components/Products";
import TrustedBy from "@/components/TrustedBy";
import Why from "@/components/Why";
import { useRouter } from "next/navigation";

const SAMPLE_PLANS = [
    {
        "_id": "6914d180e1514234b360e8db",
        "title": "Annually",
        "price": 399,
        "subtitle": "only digital card",
        "duration": 365,
        "createdAt": "2025-11-12T18:27:12.867Z",
        "updatedAt": "2025-12-06T13:40:19.157Z",
        "__v": 0
    },
    {
        "_id": "6914d18ee1514234b360e8de",
        "title": "Annually",
        "price": 749,
        "subtitle": "digital + plastic card",
        "duration": 365,
        "createdAt": "2025-11-12T18:27:26.135Z",
        "updatedAt": "2025-12-06T13:40:33.711Z",
        "__v": 0
    },
    {
        "_id": "6914d198e1514234b360e8e1",
        "title": "Annually",
        "price": 1599,
        "subtitle": "digital + metal card",
        "duration": 365,
        "createdAt": "2025-11-12T18:27:36.436Z",
        "updatedAt": "2025-12-06T13:40:47.532Z",
        "__v": 0
    },
    {
        "_id": "6914d1a2e1514234b360e8e4",
        "title": "Annually",
        "price": 9000,
        "subtitle": "digital + NFC card",
        "duration": 365,
        "createdAt": "2025-11-12T18:27:46.189Z",
        "updatedAt": "2025-12-06T13:41:00.955Z",
        "__v": 0
    }
]

export default function Home() {
  const router = useRouter();

  return (
    <>
      <HomeNavbar/>
      <HeroSection />
      <Why />
      <section id="plans" className="w-full bg-gray-100 flex items-start justify-center py-16 px-4">
        <div className="max-w-screen-xl w-full mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold text-black">Plans</h2>
            <p className="text-sm text-lightGrey">Choose a plan that fits you. Visit Plans page to purchase.</p>
          </div>

          <div className="flex items-start justify-center md:justify-between gap-6 mt-4 w-full py-10">
            {SAMPLE_PLANS.map((plan) => (
              <PlanCard
                key={plan._id}
                title={plan.title}
                price={plan.price}
                subNote={plan.subtitle}
                onSelect={() => router.push('/auth/register')}
              />
            ))}
          </div>
        </div>
      </section>
      <Products/>
      <TrustedBy/>
        <Benefit/>
      <Footer/>
    </>
  );
}
