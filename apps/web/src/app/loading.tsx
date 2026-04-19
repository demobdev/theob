import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative">
        {/* Pulsing animation on the logo */}
        <div className="animate-pulse">
          <Image
            src="/loading-icon.png"
            width={120}
            height={120}
            alt="Loading The Owner's Box..."
            className="rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
