import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.ALLSTAR_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: "Allstar.gg API key not configured" },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const playerId = searchParams.get("playerId");
  const gameName = searchParams.get("gameName") || "league-of-legends";

  const baseUrl = "https://viewer.allstar.gg/iframe";
  const params = new URLSearchParams({
    apiKey,
    game: gameName,
    ...(playerId && { playerId }),
  });

  return NextResponse.json({ 
    iframeUrl: `${baseUrl}?${params.toString()}`,
    configured: true
  });
}
