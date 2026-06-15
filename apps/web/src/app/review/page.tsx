import { redirect } from "next/navigation";
import { OB_GOOGLE_REVIEW_URL } from "@/lib/localSeo";

/** Short URL for table tents, receipts, and QR codes → Google review flow */
export default function ReviewRedirectPage() {
  redirect(OB_GOOGLE_REVIEW_URL);
}
