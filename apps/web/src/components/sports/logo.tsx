"use client";

import React from "react";
import Image from "next/image";

type LogoProps = {
  theme?: "light" | "dark";
  className?: string;
  isIcon?: boolean;
};

export function TheobLogo({ className = "h-12", isIcon = false }: LogoProps) {
  if (isIcon) {
    return (
      <div className={`${className} relative aspect-square`}>
        <Image 
          src="/images/theob-letter-tp.png" 
          alt="OB Icon" 
          fill
          className="object-contain" 
        />
      </div>
    );
  }

  return (
    <div className={`${className} relative aspect-[3/1]`}>
      <Image
        src="/images/theob-letter-tp.png"
        alt="Owner's Box Bar & Grill"
        fill
        className="object-contain transition-all duration-500"
      />
    </div>
  );
}
