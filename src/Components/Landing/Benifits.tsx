"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";

import VisaImg from "../../../public/assets/visa.png";
import PaypalImg from "../../../public/assets/paypal.png";
import AmazonImg from "../../../public/assets/amazon.png";
import AppleImg from "../../../public/assets/apple.png";
import VenmoImg from "../../../public/assets/venmo.png";
import SteamImg from "../../../public/assets/cb.png";

import IconTop from "../../../public/assets/benifits.png";

type Benefit = {
  id: number;
  name: string;
  icon: StaticImageData;
};

const benefits: Benefit[] = [
  { id: 1, name: "VISA", icon: VisaImg },
  { id: 2, name: "Paypal", icon: PaypalImg },
  { id: 3, name: "Amazon", icon: AmazonImg },
  { id: 4, name: "Apple Pay", icon: AppleImg },
  { id: 5, name: "Venmo", icon: VenmoImg },
  { id: 6, name: "Steam", icon: SteamImg },
  { id: 7, name: "VISA", icon: VisaImg },
  { id: 8, name: "Paypal", icon: PaypalImg },
  { id: 9, name: "Amazon", icon: AmazonImg },
  { id: 10, name: "Apple Pay", icon: AppleImg },
  { id: 11, name: "Venmo", icon: VenmoImg },
  { id: 12, name: "Steam", icon: SteamImg },
];

const Benefits: React.FC = () => {
  return (
    <section className="w-full bg-[#0f0f1a] text-white md:py-16 px-0">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Image
            src={IconTop}
            alt="Why Choose Us Icon"
            width={30}
            height={24}
            className="object-contain"
          />
          <span className="uppercase tracking-wide text-md font-medium text-white">
            BENEFITS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Your rewards in different ranges
        </h2>
        <p className="text-gray-400 px-6 md:px-20 text-sm sm:text-base">
          Lab Wards offers wide range of withdrawal options. Select the method
          that works for you.
        </p>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="inline-flex whitespace-nowrap gap-4 md:pl-20 px-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="flex flex-col items-center justify-center bg-[#151728] rounded-lg md:px-6 md:py-6 px-4 py-4 md:min-w-[150px] min-w-[120px] shadow-md border border-gray-800"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 mb-3">
                <Image
                  src={benefit.icon}
                  alt={benefit.name}
                  className="object-contain w-full h-full"
                />
              </div>
              <p className="text-sm sm:text-base font-medium">
                {benefit.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
