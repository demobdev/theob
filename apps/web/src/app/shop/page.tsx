import MerchPageFrame from "@/components/shop/MerchPageFrame";
import { KnitCard, TeeCard } from "@/components/shop/MerchCards";
import { merchMetadata, MERCH_PATHS } from "@/lib/shop/merch";

export const metadata = merchMetadata(
  "The Owners Box Merch | Greenville, SC",
  "The Owners Box merch from Woodruff Road in Greenville, SC. Preview the Woodruff Road Tee and our first real Christmas knit. Online ordering is coming soon.",
  MERCH_PATHS.shop,
);

export default function ShopPage() {
  return (
    <MerchPageFrame
      title="The Owners Box Merch"
      intro="For the crew, then the crowd. Everyday tees and our first holiday knit, from Woodruff Road in Greenville."
      currentPath={MERCH_PATHS.shop}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <TeeCard />
        <KnitCard />
      </div>
      <p className="mt-8 max-w-2xl text-sm font-semibold leading-relaxed text-[#05070B]/65">
        Online ordering is coming soon. We’re starting with staff fit testing
        before opening the collection to everyone.
      </p>
    </MerchPageFrame>
  );
}
