import { Instagram } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/socialLinks";
import { cn } from "@/lib/utils";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.18 8.18 0 0 0 4.77 1.52V6.82a4.85 4.85 0 0 1-1-.13z" />
    </svg>
  );
}

type SocialLinksProps = {
  className?: string;
};

export default function SocialLinks({ className }: SocialLinksProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      <a
        href={SOCIAL_LINKS[0].href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Instagram ${SOCIAL_LINKS[0].handle}`}
        className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all"
      >
        <Instagram size={18} />
      </a>
      <a
        href={SOCIAL_LINKS[1].href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`TikTok ${SOCIAL_LINKS[1].handle}`}
        className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all"
      >
        <TikTokIcon className="h-[18px] w-[18px]" />
      </a>
    </div>
  );
}
