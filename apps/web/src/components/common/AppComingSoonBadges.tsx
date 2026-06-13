import Image from "next/image";

type AppComingSoonBadgesProps = {
  className?: string;
  direction?: "row" | "col";
};

export default function AppComingSoonBadges({
  className = "",
  direction = "col",
}: AppComingSoonBadgesProps) {
  const flex = direction === "row" ? "flex-row flex-wrap" : "flex-col";
  return (
    <div
      className={`flex ${flex} gap-3 ${className}`}
      role="group"
      aria-label="Mobile apps launching soon"
    >
      <div
        className="inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-1 opacity-50 saturate-50 pointer-events-none select-none"
        aria-hidden
      >
        <Image
          src="/apple-app-store.svg"
          alt=""
          width={160}
          height={48}
          className="h-12 w-auto"
        />
      </div>
      <div
        className="inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-1 opacity-50 saturate-50 pointer-events-none select-none"
        aria-hidden
      >
        <Image
          src="/google-play.svg"
          alt=""
          width={160}
          height={48}
          className="h-12 w-auto"
        />
      </div>
    </div>
  );
}
