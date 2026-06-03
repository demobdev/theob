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
        <div className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0">
          <Image
            src="/images/ob-icon.png"
            fill
            alt="The Owner's Box"
            className="object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        {!isMobile ? (
          <span className="font-montserrat text-white text-sm sm:text-base font-black uppercase tracking-tight whitespace-nowrap leading-none">
            The Owner&apos;s Box
          </span>
        ) : null}
      </div>
    </Link>
  );
};

export default Logo;
