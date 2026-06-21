import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const dimensions = {
    sm: { svg: "h-8 w-8", text: "text-lg", subtext: "text-[8px]" },
    md: { svg: "h-12 w-12", text: "text-2xl", subtext: "text-[10px]" },
    lg: { svg: "h-16 w-16", text: "text-3xl", subtext: "text-[12px]" },
  };

  const currentSize = dimensions[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Emblem */}
      <svg
        className={`${currentSize.svg} flex-shrink-0`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blue Cross Base */}
        {/* Vertical Bar: x: 38 to 62, y: 15 to 85 */}
        {/* Left Arm: x: 15 to 38, y: 38 to 62 */}
        {/* Right Arm is truncated/fitted with V-shape indent on the left side of the right segment */}
        <path
          d="M 38 15 L 62 15 L 62 38 L 85 38 L 85 62 L 62 62 L 62 85 L 38 85 L 38 62 L 15 62 L 15 38 L 38 38 Z"
          fill="#2B4C9B"
        />
        {/* V-Cut on the horizontal bar center-right to overlay the red arrow */}
        <path
          d="M 50 50 L 65 35 L 65 65 Z"
          fill="#F8FAFC" /* Matches background but we'll use a cutout style */
        />
        {/* Red Arrow Pointing Left */}
        <path
          d="M 54 50 L 72 38 L 88 38 L 72 50 L 88 62 L 72 62 Z"
          fill="#E3232A"
        />
        {/* Inner white chevron/border to make it crisp */}
        <path
          d="M 54 50 L 72 38 L 76 38 L 58 50 L 76 62 L 72 62 Z"
          fill="#FFFFFF"
        />
      </svg>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none font-sans font-extrabold tracking-tight">
          <div className="flex flex-col">
            <span className="text-[#2B4C9B] uppercase font-black tracking-wide">
              Medical
            </span>
            <span className="text-[#E3232A] uppercase font-black tracking-wide">
              Center
            </span>
          </div>
          <span className={`text-[#64748B] font-semibold tracking-widest mt-1 ${currentSize.subtext}`}>
            TIBB MƏRKƏZİ
          </span>
        </div>
      )}
    </div>
  );
}
