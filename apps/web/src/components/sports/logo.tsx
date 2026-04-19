"use client";

import React from "react";

type LogoProps = {
  theme?: "light" | "dark";
  className?: string;
  isIcon?: boolean;
};

export function TheobLogo({ theme = "light", className = "h-12", isIcon = false }: LogoProps) {
  if (isIcon) {
    return (
      <img 
        src="/theob-icon.JPEG" 
        alt="UB Icon" 
        className={`${className} object-contain`} 
      />
    );
  }

  return (
    <img
      src="/theob-main.png"
      alt="Owner's Box Bar & Grill"
      className={`${className} object-contain transition-all duration-500`}
    />
  );
}
