'use client';

import React from "react";
import BlueButton from "./buttons/BlueButton";

export default function PlanCard({ title, price, subtitle, onContinue, disabled, showButton = true }) {
  return (
    <div className="flex items-start flex-col justify-center bg-white shadow-[0px_0px_8px_0px_#1D1D1F08] p-4 rounded-2xl w-full sm:w-[260px] md:w-[294px] gap-4">
      <h2 className="text-lg font-bold text-black font-inter">{title}</h2>
      <h2 className="text-3xl font-bold">
        Rs {price}{" "}
        <span className="font-normal text-xs text-semiLightGrey">{subtitle}</span>
      </h2>
      <p className="text-sm text-semiLightGrey">
        {price === 0 || price === '0' ? "Free Trial" : `Equal to Rs ${(price / 12).toFixed(2)}/mo`}
      </p>

      {showButton && (
        <BlueButton
          label={disabled ? "Already Purchased" : "Continue"}
          width="w-full"
          onClick={onContinue}
          disabled={disabled}
        />
      )}
    </div>
  );
}
