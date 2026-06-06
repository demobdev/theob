import { HEARTLAND_ORDER_URL } from "@/lib/heartlandLinks";
import { cn } from "@/lib/utils";

type HeartlandOrderLinkProps = {
  children: React.ReactNode;
  className?: string;
};

export default function HeartlandOrderLink({
  children,
  className,
}: HeartlandOrderLinkProps) {
  return (
    <a
      href={HEARTLAND_ORDER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(className)}
    >
      {children}
    </a>
  );
}
