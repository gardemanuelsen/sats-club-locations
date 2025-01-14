import { getClubs } from "@/app/lib/clubs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clubs = await getClubs();
    return NextResponse.json(clubs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Sats Clubs" },
      { status: 500 }
    );
  }
}
