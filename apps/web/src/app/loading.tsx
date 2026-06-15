import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex h-32 w-32 items-center justify-center p-5">
        <div className="animate-pulse h-full w-full">
          <Image
            src="/loading-icon.png"
            width={88}
            height={88}
            alt="Loading The Owner's Box..."
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
