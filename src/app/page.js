
'use client';

import Benefit from "@/components/Benefit";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HomeNavbar from "@/components/HomeNavBar";
import { PlanCard } from "@/components/PlanCard";
import Products from "@/components/Products";
import TrustedBy from "@/components/TrustedBy";
import Why from "@/components/Why";
import { useEffect, useState } from "react";
import { usePlans } from "@/hooks/usePlans";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { getPlans } = usePlans();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await getPlans(true);
        const data = response?.data || [];
        setPlans(data);
      } catch (err) {
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, [getPlans]);

  return (
    <>
      <HomeNavbar/>
      <HeroSection />
      <Why />
       <Products/>
      <section id="plans" className="w-full bg-gray-100 flex items-start justify-center py-16 px-4">
        <div className="max-w-screen-xl w-full mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold text-black">Plans</h2>
            <p className="text-sm text-lightGrey">Choose a plan that fits you. Visit Plans page to purchase.</p>
          </div>

          <div className="mt-4 w-full">
            <div className="flex items-start justify-start gap-6 py-4 md:py-10 overflow-x-auto md:overflow-visible md:grid md:grid-cols-4 md:justify-between">
              {loading ? (
                <div className="col-span-4 flex justify-center items-center w-full h-40 text-gray-400">Loading...</div>
              ) : plans.length === 0 ? (
                <div className="col-span-4 flex justify-center items-center w-full h-40 text-gray-400">No plans available.</div>
              ) : (
                plans.map((plan) => (
                  <div key={plan._id} className="shrink-0 min-w-[260px] md:min-w-0">
                    <PlanCard
                      title={plan.title}
                      price={plan.price?.rupees ?? plan.price?.dollar ?? plan.price}
                      subNote={plan.description || plan.subtitle}
                      onSelect={() => router.push('/my-card')}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      <TrustedBy/>
        <Benefit/>
      <Footer/>
    </>
  );
}
