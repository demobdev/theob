import { NextResponse } from "next/server";
import { getHeartlandOrderUrl } from "@/lib/orderLinks";

export function GET() {
  return NextResponse.redirect(getHeartlandOrderUrl(), 307);
}
