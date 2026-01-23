import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ steamId: string }> }
) {
  const { steamId } = await params;
  const apiKey = process.env.STEAM_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Steam API key not configured" },
      { status: 500 }
    );
  }

  try {
    let steamId64 = steamId;

    // Resolve vanity URL to Steam ID if needed
    if (!/^\d{17}$/.test(steamId)) {
      const resolveUrl = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${encodeURIComponent(steamId)}`;
      const resolveRes = await fetch(resolveUrl);
      
      if (!resolveRes.ok) {
        return NextResponse.json(
          { error: "Failed to resolve Steam ID" },
          { status: resolveRes.status }
        );
      }

      const resolveData = await resolveRes.json();
      
      if (resolveData.response?.success === 1) {
        steamId64 = resolveData.response.steamid;
      } else {
        return NextResponse.json(
          { error: "Player not found" },
          { status: 404 }
        );
      }
    }

    // Fetch recent games
    const recentGamesUrl = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId64}&format=json`;
    const recentGamesRes = await fetch(recentGamesUrl);
    
    if (!recentGamesRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch recent games" },
        { status: recentGamesRes.status }
      );
    }

    const contentType = recentGamesRes.headers.get("content-type");
    
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Profile is private or games data unavailable" },
        { status: 403 }
      );
    }

    const recentGamesData = await recentGamesRes.json();
    
    // Return games data
    return NextResponse.json({
      steamid: steamId64,
      total_count: recentGamesData.response?.total_count || 0,
      games: recentGamesData.response?.games || []
    });

  } catch (error) {
    console.error("Steam API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Steam data" },
      { status: 500 }
    );
  }
}