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

    if (!/^\d{17}$/.test(steamId)) {
      const resolveUrl = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${encodeURIComponent(steamId)}`;
      const resolveRes = await fetch(resolveUrl);
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

    const summaryUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId64}`;
    const summaryRes = await fetch(summaryUrl);
    const summaryData = await summaryRes.json();

    if (!summaryData.response?.players?.length) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 }
      );
    }

    const player = summaryData.response.players[0];

    const bansUrl = `https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${apiKey}&steamids=${steamId64}`;
    const bansRes = await fetch(bansUrl);
    const bansData = await bansRes.json();

    const friendsUrl = `https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${apiKey}&steamid=${steamId64}&relationship=friend`;
    let friendCount = null;
    try {
      const friendsRes = await fetch(friendsUrl);
      if (friendsRes.ok) {
        const friendsData = await friendsRes.json();
        friendCount = friendsData.friendslist?.friends?.length || null;
      }
    } catch {
    }

    const gamesUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId64}&format=json&include_appinfo=true`;
    let cs2Stats = null;
    let totalGames = null;
    try {
      const gamesRes = await fetch(gamesUrl);
      if (gamesRes.ok) {
        const gamesData = await gamesRes.json();
        totalGames = gamesData.response?.game_count || null;
        const cs2Game = gamesData.response?.games?.find(
          (g: { appid: number }) => g.appid === 730
        );
        if (cs2Game) {
          cs2Stats = {
            playtime_forever: cs2Game.playtime_forever,
            playtime_2weeks: cs2Game.playtime_2weeks || 0,
          };
        }
      }
    } catch {
    }

    const userStatsUrl = `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${apiKey}&steamid=${steamId64}`;
    let gameStats = null;
    let gameStatsError = null;
    try {
      const userStatsRes = await fetch(userStatsUrl);
      
      if (userStatsRes.status === 500) {
        gameStatsError = "Player's 'Game details' are likely set to Private in Steam settings.";
      } else if (userStatsRes.status === 403) {
        gameStatsError = "Access denied. Player's profile or game stats are private.";
      } else if (userStatsRes.ok) {
        const userStatsData = await userStatsRes.json();
        
        if (userStatsData.playerstats?.stats) {
          const statsArray = userStatsData.playerstats.stats;
          const statsMap: Record<string, number> = {};
          statsArray.forEach((stat: { name: string; value: number }) => {
            statsMap[stat.name] = stat.value;
          });
          gameStats = {
            totalKills: statsMap["total_kills"] || 0,
            totalDeaths: statsMap["total_deaths"] || 0,
            totalTimePlayed: statsMap["total_time_played"] || 0,
            totalWins: statsMap["total_wins"] || 0,
            totalMatchesPlayed: statsMap["total_matches_played"] || 0,
            totalMVPs: statsMap["total_mvps"] || 0,
            totalHeadshots: statsMap["total_kills_headshot"] || 0,
            totalDamage: statsMap["total_damage_done"] || 0,
            totalMoneyEarned: statsMap["total_money_earned"] || 0,
            totalWeaponsDoanted: statsMap["total_weapons_donated"] || 0,
            totalRoundsPlayed: statsMap["total_rounds_played"] || 0,
            totalBombsPlanted: statsMap["total_planted_bombs"] || 0,
            totalBombsDefused: statsMap["total_defused_bombs"] || 0,
            killsAK47: statsMap["total_kills_ak47"] || 0,
            killsM4A1: statsMap["total_kills_m4a1"] || 0,
            killsAWP: statsMap["total_kills_awp"] || 0,
            killsDeagle: statsMap["total_kills_deagle"] || 0,
            killsKnife: statsMap["total_kills_knife"] || 0,
            shotsHit: statsMap["total_shots_hit"] || 0,
            shotsFired: statsMap["total_shots_fired"] || 0,
            lastMatchKills: statsMap["last_match_kills"] || 0,
            lastMatchDeaths: statsMap["last_match_deaths"] || 0,
            lastMatchMVPs: statsMap["last_match_mvps"] || 0,
            lastMatchDamage: statsMap["last_match_damage"] || 0,
            lastMatchRounds: statsMap["last_match_rounds"] || 0,
            lastMatchWins: statsMap["last_match_wins"] || 0,
          };
        } else {
          gameStatsError = "No CS2 stats data returned from Steam. Player may have private game details.";
        }
      } else {
        gameStatsError = `Steam API returned error ${userStatsRes.status}`;
      }
    } catch (err) {
      console.error("Error fetching game stats:", err);
      gameStatsError = "Failed to communicate with Steam stats API.";
    }

    const statusMap: Record<number, string> = {
      0: "Offline",
      1: "Online",
      2: "Busy",
      3: "Away",
      4: "Snooze",
      5: "Looking to trade",
      6: "Looking to play",
    };

    const profile = {
      steamid: player.steamid,
      personaname: player.personaname,
      profileurl: player.profileurl,
      avatar: player.avatar,
      avatarmedium: player.avatarmedium,
      avatarfull: player.avatarfull,
      personastate: player.personastate,
      personastateText: statusMap[player.personastate] || "Unknown",
      communityvisibilitystate: player.communityvisibilitystate,
      profilestate: player.profilestate,
      lastlogoff: player.lastlogoff,
      realname: player.realname,
      primaryclanid: player.primaryclanid,
      timecreated: player.timecreated,
      loccountrycode: player.loccountrycode,
      locstatecode: player.locstatecode,
      loccityid: player.loccityid,
      gameextrainfo: player.gameextrainfo,
      gameid: player.gameid,
      bans: bansData.players?.[0] || null,
      friendCount,
      totalGames,
      cs2Stats,
      gameStats,
      gameStatsError,
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Steam API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Steam data" },
      { status: 500 }
    );
  }
}
