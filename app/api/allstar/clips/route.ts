import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameName = searchParams.get('gameName');
  const tagLine = searchParams.get('tagLine');

  if (!gameName || !tagLine) {
    return NextResponse.json(
      { error: 'Missing gameName or tagLine' },
      { status: 400 }
    );
  }

  const serverKey = process.env.ALLSTAR_SERVER_KEY;
  
  if (!serverKey) {
    return NextResponse.json(
      { error: 'Allstar.gg API key not configured' },
      { status: 500 }
    );
  }

  try {
    const riotId = `${gameName}#${tagLine}`;
    
    const response = await fetch(
      `https://api.allstar.gg/v1/clips/league-of-legends/${encodeURIComponent(riotId)}`,
      {
        headers: {
          'Authorization': `Bearer ${serverKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Allstar.gg API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch clips from Allstar.gg', clips: [] },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Allstar.gg clips:', error);
    return NextResponse.json(
      { error: 'Internal server error', clips: [] },
      { status: 500 }
    );
  }
}
