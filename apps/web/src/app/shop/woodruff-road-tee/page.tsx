import { permanentRedirect } from "next/navigation";
import { MERCH_PATHS } from "@/lib/shop/merch";

export default function RetiredWoodruffRoadTeePage() {
  permanentRedirect(MERCH_PATHS.shop);
}
