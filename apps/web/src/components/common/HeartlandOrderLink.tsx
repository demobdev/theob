import { getOrderPagePath } from "@/lib/orderLinks";
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
      href={getOrderPagePath()}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(className)}
    >
      {children}
    </a>
  );
}
