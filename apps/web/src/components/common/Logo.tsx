import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  isMobile?: boolean;
}

const Logo = ({ isMobile }: Props) => {
  return (
    <Link href={"/"}>
      <div className="flex gap-4 items-center">
        <Image src={"/theob-white.JPG"} width={40} height={40} alt="The Owner's Box Logo" className="rounded-full object-cover" />
        {!isMobile ? (
          <h1 className="font-montserrat text-black text-2xl sm:text-[32px] not-italic font-semibold tracking-tight">
            The Owner's Box
          </h1>
        ) : null}
      </div>
    </Link>
  );
};

export default Logo;
