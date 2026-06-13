import { getDoorDashStoreUrl } from "@/lib/orderLinks";
import { cn } from "@/lib/utils";

type DoorDashButtonProps = {
  className?: string;
  size?: "sm" | "md";
  fullWidth?: boolean;
};

function DoorDashMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        d="M27.1282 4.91327C25.8796 2.48938 23.4392 1 20.8001 1H0.681042C0.312144 1 0 1.32124 0 1.73009C0 1.90531 0.0851302 2.08053 0.198637 2.22655L4.56865 6.7531C4.96593 7.16195 5.47671 7.39558 6.01587 7.36637H20.1759C21.1974 7.36637 22.0203 8.18407 22.0203 9.2354C22.0203 10.2867 21.2258 11.1336 20.2042 11.1336H10.471C10.1021 11.1336 9.78997 11.4549 9.78997 11.8637C9.78997 12.0389 9.8751 12.2142 9.98861 12.3602L14.3586 16.8867C14.7559 17.2956 15.2667 17.5 15.8342 17.5H20.261C25.9931 17.5 30.3347 11.192 27.1282 4.91327Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function DoorDashButton({
  className,
  size = "md",
  fullWidth = false,
}: DoorDashButtonProps) {
  const url = getDoorDashStoreUrl();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on DoorDash"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[#EB1700] text-white font-black uppercase tracking-widest shadow-[0_2px_12px_rgba(235,23,0,0.35)] ring-1 ring-white/25 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]",
        fullWidth && "w-full py-4 text-xs",
        !fullWidth && size === "sm" && "px-3 py-2 text-[9px]",
        !fullWidth && size === "md" && "px-4 py-2.5 text-[10px]",
        className,
      )}
    >
      <DoorDashMark className={fullWidth ? "h-4 w-6" : "h-3.5 w-5"} />
      <span>Order on DoorDash</span>
    </a>
  );
}
