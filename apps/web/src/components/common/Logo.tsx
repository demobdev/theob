import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  isMobile?: boolean;
}

const Logo = ({ isMobile }: Props) => {
  return (
    <Link href={"/"}>
      <div className="flex gap-3 items-center group">
        <div className="relative h-10 w-10 sm:h-12 sm:w-12">
          <Image 
            src={"/images/theob-letter-tp.png"} 
            fill
            alt="The Owner's Box Logo" 
            className="object-contain group-hover:scale-110 transition-transform duration-300" 
          />
        </div>
        {!isMobile ? (
          <div className="flex flex-col">
            <span className="font-montserrat text-white text-xl sm:text-2xl font-black uppercase tracking-tighter leading-none">
              The Owner's
            </span>
            <span className="font-montserrat text-[#D4AF37] text-lg sm:text-xl font-bold uppercase tracking-widest leading-none mt-0.5">
              Box
            </span>
          </div>
        ) : null}
      </div>
    </Link>
  );
};

export default Logo;
