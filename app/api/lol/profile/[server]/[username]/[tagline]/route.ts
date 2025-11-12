"use server";

import { NextResponse } from "next/server";
import axios from "axios";

const REGION_MAP: Record<string, string> = {
  na1: "americas",
  br1: "americas",
  la1: "americas",
  la2: "americas",
  oc1: "americas",
  kr: "asia",
  jp1: "asia",
  eun1: "europe",
  euw1: "europe",
  tr1: "europe",
  ru: "europe",
  ph2: "asia",
  sg2: "asia",
  th2: "asia",
  tw2: "asia",
  vn2: "asia",
};

export async function GET(
  request: Request,
  context: { params: Promise<{ server: string; username: string; tagLine: string }> }
) {
  const { server, username, tagLine } = await context.params;

  const API_KEY = process.env.RIOT_API_KEY as string;
  if (!API_KEY) {
    return NextResponse.json({ error: "RIOT_API_KEY is missing or empty" }, { status: 500 });
  }

  const region = REGION_MAP[server.toLowerCase()];
  if (!region) {
    return NextResponse.json({ error: "Invalid server region" }, { status: 400 });
  }

  try {
    const encodedGameName = encodeURIComponent(username);
    const encodedTagLine = encodeURIComponent(tagLine);

    const riotUrl = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`;

    const riotRes = await axios.get(riotUrl, {
      headers: { "X-Riot-Token": API_KEY },
    });
    console.log(riotRes.data);
    return NextResponse.json(riotRes.data);
    
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status || 500;
      const message = err.response?.data?.status?.message || err.message;

      if (status === 401) {
        return NextResponse.json({ error: "Invalid API key" }, { status });
      }
      if (status === 404) {
        return NextResponse.json({ error: "Summoner not found" }, { status });
      }
      if (status === 429) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status });
      }
      return NextResponse.json({ error: `Riot API error: ${message}` }, { status });
    }

    console.error("Internal server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
