import Image from "next/image";
import Link from "next/link";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/appLinks";

type AppStoreBadgesProps = {
  className?: string;
  direction?: "row" | "col";
};

export default function AppStoreBadges({
  className = "",
  direction = "col",
}: AppStoreBadgesProps) {
  const flex = direction === "row" ? "flex-row flex-wrap" : "flex-col";
  return (
    <div className={`flex ${flex} gap-3 ${className}`}>
      <Link
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-[1.02] transition-transform"
      >
        <Image
          src="/apple-app-store.svg"
          alt="Download on the App Store"
          width={160}
          height={48}
        />
      </Link>
      <Link
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-[1.02] transition-transform"
      >
        <Image
          src="/google-play.svg"
          alt="Get it on Google Play"
          width={160}
          height={48}
        />
      </Link>
    </div>
  );
}
