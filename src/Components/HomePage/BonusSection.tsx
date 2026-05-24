"use client";
import React from "react";
import { ChevronLeft, ChevronRight, Disc, MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface BonusCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick?: () => void;
  accentColor?: string;
}

const BonusCard: React.FC<BonusCardProps> = ({ title, subtitle, icon, buttonText, onClick, accentColor = "#14A990" }) => (
  <div className="relative overflow-hidden rounded-[28px] border border-[#1E2F3F] bg-[#0C1320] p-7 group transition-all hover:translate-y-[-4px] min-h-[220px] flex flex-col justify-between w-full">
    {/* Subtle Pattern Overlay */}
    <div 
      className="absolute inset-0 opacity-[0.05] pointer-events-none" 
      style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
    />
    
    <div className="relative z-10">
      <h3 className="text-white text-[22px] font-bold leading-tight">{title}</h3>
      <p className="text-[#8C9DB6] text-[14px] font-medium mt-1">{subtitle}</p>
    </div>

    <div className="relative z-10 flex items-center justify-between mt-6">
      <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-white font-bold text-[14px] sm:text-[15px] transition-all hover:brightness-110 active:scale-[0.95]"
        style={{ 
          background: `linear-gradient(135deg, ${accentColor} 0%, #14A290 100%)`,
          boxShadow: `0 8px 24px ${accentColor}40`
        }}
      >
        <span className="flex items-center gap-2 whitespace-nowrap">
          {buttonText === "Spin" ? <Disc size={18} className="animate-spin-slow" /> : <MoveRight size={18} />}
          {buttonText}
        </span>
      </button>
    </div>
  </div>
);

const BonusSection: React.FC = () => {
  const router = useRouter();

  return (
    <section className="w-full mt-8 sm:mt-12 max-w-[1440px] mx-auto pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-6 md:px-10">
        <BonusCard
          title="Sign up bonus"
          subtitle="Win up to $30"
          buttonText="Spin"
          accentColor="#0AC07D"
          onClick={() => router.push("/bonus")}
          icon={
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(255,79,177,0.3)]">
              <circle cx="50" cy="50" r="45" stroke="#7B4DFF" strokeWidth="4" fill="#0C1320"/>
              <path d="M50 50L50 10A40 40 0 0 1 84.64 30Z" fill="#A3FF12" fillOpacity="0.9"/>
              <path d="M50 50L84.64 30A40 40 0 0 1 84.64 70Z" fill="#FF4FB1" fillOpacity="0.9"/>
              <path d="M50 50L84.64 70A40 40 0 0 1 50 90Z" fill="#A3FF12" fillOpacity="0.9"/>
              <path d="M50 50L50 90A40 40 0 0 1 15.36 70Z" fill="#FF4FB1" fillOpacity="0.9"/>
              <path d="M50 50L15.36 70A40 40 0 0 1 15.36 30Z" fill="#A3FF12" fillOpacity="0.9"/>
              <path d="M50 50L15.36 30A40 40 0 0 1 50 10Z" fill="#FF4FB1" fillOpacity="0.9"/>
              <circle cx="50" cy="50" r="6" fill="#FFD700" stroke="white" strokeWidth="2"/>
              <path d="M50 15L56 28H44L50 15Z" fill="white" className="drop-shadow-md"/>
            </svg>
          }
        />
        <BonusCard
          title="7 days Streak"
          subtitle="Earn $1 daily to keep up with streak"
          buttonText="Go to streak"
          accentColor="#0AC07D"
          onClick={() => router.push("/streak")}
          icon={
            <svg width="85" height="85" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
              <rect x="20" y="45" width="60" height="35" rx="4" fill="#8B4513" stroke="#FFD700" strokeWidth="2"/>
              <rect x="20" y="45" width="60" height="10" fill="#A0522D" stroke="#FFD700" strokeWidth="2"/>
              <rect x="30" y="45" width="6" height="35" fill="#FFD700"/>
              <rect x="64" y="45" width="6" height="35" fill="#FFD700"/>
              <circle cx="50" cy="55" r="5" fill="#FFD700"/>
              <rect x="48" y="55" width="4" height="6" fill="#FFD700"/>
              <circle cx="50" cy="35" r="4" fill="#FFD700">
                <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                <animate attributeName="translateY" values="0;-10;0" dur="2s" repeatCount="indefinite" />
              </circle>
              <path d="M40 38L42 42L46 38L42 34L40 38Z" fill="#FFD700">
                <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
              </path>
            </svg>
          }
        />
        <BonusCard
          title="Verification"
          subtitle="Win $0.2 each"
          buttonText="Go to Verification"
          accentColor="#0AC07D"
          onClick={() => router.push("/verification")}
          icon={
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
              <path d="M30 25V45C30 56 38.9 65 50 65C61.1 65 70 56 70 45V25H30Z" fill="#FFD700" stroke="#FF8C00" strokeWidth="2"/>
              <path d="M30 30H20V45C20 52 25 55 30 55" stroke="#FFD700" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M70 30H80V45C80 52 75 55 70 55" stroke="#FFD700" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <rect x="35" y="70" width="30" height="5" rx="2" fill="#FF8C00"/>
              <rect x="45" y="65" width="10" height="5" fill="#FFD700"/>
              <path d="M50 35L53 43H62L55 48L57 56L50 51L43 56L45 48L38 43H47L50 35Z" fill="white"/>
              <circle cx="25" cy="20" r="2" fill="white">
                <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="75" cy="20" r="2" fill="white">
                <animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite" />
              </circle>
            </svg>
          }
        />
      </div>
    </section>
  );
};

export default BonusSection;
