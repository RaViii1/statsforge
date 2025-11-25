"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  Eye, 
  Shield, 
  Coins,
  Swords,
  Map,
  AlertCircle
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface MatchAnalyticsProps {
  server: string;
  matchId: string;
  targetPuuid?: string; // Optional: highlight specific player
}

interface ParticipantData {
  puuid: string;
  summonerName: string;
  championName: string;
  teamPosition: string;
  win: boolean;
  // Combat metrics
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  damagePerMinute: number;
  totalDamageDealtToChampions: number;
  teamDamagePercentage: number;
  killParticipation: number;
  // Objective metrics
  baronKills: number;
  dragonKills: number;
  turretTakedowns: number;
  objectivesStolen: number;
  // Economy metrics
  goldEarned: number;
  goldPerMinute: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  // Survivability metrics
  totalDamageTaken: number;
  damageSelfMitigated: number;
  timeSpentDead: number;
  // Vision metrics
  visionScore: number;
  visionScorePerMinute: number;
  wardsPlaced: number;
  wardsKilled: number;
  // Other
  level: number;
  timePlayed: number;
}

interface MatchData {
  matchId: string;
  gameDuration: number;
  participants: ParticipantData[];
}

interface PlayerScore {
  puuid: string;
  summonerName: string;
  championName: string;
  teamPosition: string;
  win: boolean;
  combatScore: number;
  objectiveScore: number;
  economyScore: number;
  survivalScore: number;
  visionScore: number;
  totalScore: number;
  rank: number;
}

export function MatchAnalytics({ server, matchId, targetPuuid }: MatchAnalyticsProps) {
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([]);
  const [mvp, setMvp] = useState<PlayerScore | null>(null);
  const [targetPlayer, setTargetPlayer] = useState<PlayerScore | null>(null);

  useEffect(() => {
    fetchMatchData();
  }, [server, matchId]);

  const fetchMatchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/lol/matches/${server}/stats/${matchId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch match data');
      }
      
      const data = await response.json();
      setMatchData(data);
      
      // Calculate scores
      const scores = calculatePlayerScores(data.participants);
      setPlayerScores(scores);
      
      // Find MVP (highest total score)
      const mvpPlayer = scores.reduce((prev, current) => 
        current.totalScore > prev.totalScore ? current : prev
      );
      setMvp(mvpPlayer);
      
      // Find target player if specified
      if (targetPuuid) {
        const target = scores.find(s => s.puuid === targetPuuid);
        setTargetPlayer(target || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const calculatePlayerScores = (participants: ParticipantData[]): PlayerScore[] => {
    const gameDurationMinutes = participants[0]?.timePlayed / 60 || 1;
    
    // Normalize function: higher is better
    const normalize = (value: number, max: number) => {
      return max > 0 ? (value / max) * 100 : 0;
    };
    
    // Find max values for normalization
    const maxKDA = Math.max(...participants.map(p => p.kda));
    const maxDPM = Math.max(...participants.map(p => p.damagePerMinute));
    const maxGoldPerMin = Math.max(...participants.map(p => p.goldPerMinute));
    const maxVisionScore = Math.max(...participants.map(p => p.visionScore));
    const maxObjectives = Math.max(...participants.map(p => 
      p.baronKills + p.dragonKills + p.turretTakedowns
    ));
    
    const scores = participants.map(p => {
      // 1. Combat Score (25% weight)
      const combatScore = (
        normalize(p.kda, maxKDA) * 0.3 +
        normalize(p.damagePerMinute, maxDPM) * 0.25 +
        (p.teamDamagePercentage * 100) * 0.2 +
        (p.killParticipation * 100) * 0.25
      ) * 0.25;
      
      // 2. Objective Score (20% weight)
      const totalObjectives = p.baronKills + p.dragonKills + p.turretTakedowns;
      const objectiveScore = (
        normalize(totalObjectives, maxObjectives) * 0.5 +
        normalize(p.objectivesStolen, 5) * 0.3 +
        normalize(p.baronKills, 3) * 0.2
      ) * 0.20;
      
      // 3. Economy Score (15% weight)
      const economyScore = (
        normalize(p.goldPerMinute, maxGoldPerMin) * 0.6 +
        normalize(p.totalMinionsKilled + p.neutralMinionsKilled, 400) * 0.4
      ) * 0.15;
      
      // 4. Survival Score (15% weight) - Lower deaths is better
      const deathPenalty = Math.max(0, 100 - (p.deaths * 10));
      const survivalScore = (
        deathPenalty * 0.5 +
        normalize(p.damageSelfMitigated, 50000) * 0.3 +
        normalize(100 - (p.timeSpentDead / gameDurationMinutes), 100) * 0.2
      ) * 0.15;
      
      // 5. Vision Score (15% weight)
      const visionScore = (
        normalize(p.visionScore, maxVisionScore) * 0.5 +
        normalize(p.wardsPlaced, 50) * 0.25 +
        normalize(p.wardsKilled, 30) * 0.25
      ) * 0.15;
      
      // 6. Macro Score (10% weight) - Win bonus
      const macroScore = (p.win ? 50 : 0) * 0.10;
      
      const totalScore = combatScore + objectiveScore + economyScore + survivalScore + visionScore + macroScore;
      
      return {
        puuid: p.puuid,
        summonerName: p.summonerName,
        championName: p.championName,
        teamPosition: p.teamPosition,
        win: p.win,
        combatScore,
        objectiveScore,
        economyScore,
        survivalScore,
        visionScore,
        totalScore,
        rank: 0, // Will be assigned after sorting
      };
    });
    
    // Sort by total score and assign ranks
    scores.sort((a, b) => b.totalScore - a.totalScore);
    scores.forEach((score, index) => {
      score.rank = index + 1;
    });
    
    return scores;
  };

  const getImprovementSuggestions = (player: PlayerScore, participant: ParticipantData) => {
    const suggestions: string[] = [];
    const gameDurationMinutes = participant.timePlayed / 60;
    
    // Combat suggestions
    if (participant.kda < 2) {
      suggestions.push("🎯 Focus on improving your KDA - try to die less and participate in more kills");
    }
    if (participant.teamDamagePercentage < 0.15) {
      suggestions.push("⚔️ Increase your damage output - you're dealing below-average damage to champions");
    }
    
    // Economy suggestions
    if (participant.goldPerMinute < 300) {
      suggestions.push("💰 Work on your CS and gold generation - aim for 6-7 CS per minute");
    }
    
    // Vision suggestions
    if (participant.visionScorePerMinute < 1.5) {
      suggestions.push("👁️ Place more wards - vision score is crucial for map control");
    }
    if (participant.wardsKilled < 5) {
      suggestions.push("🔍 Clear more enemy wards with control wards and sweepers");
    }
    
    // Objective suggestions
    const totalObjectives = participant.baronKills + participant.dragonKills + participant.turretTakedowns;
    if (totalObjectives < 5) {
      suggestions.push("🏆 Participate more in objectives - dragons, barons, and turrets win games");
    }
    
    // Death suggestions
    if (participant.deaths > 7) {
      suggestions.push("🛡️ Reduce your deaths - position more carefully and respect enemy threats");
    }
    if (participant.timeSpentDead > gameDurationMinutes * 10) {
      suggestions.push("⏱️ You spent too much time dead - avoid risky plays in late game");
    }
    
    return suggestions;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading match analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!matchData || !mvp) {
    return null;
  }

  const targetPlayerData = targetPlayer 
    ? matchData.participants.find(p => p.puuid === targetPlayer.puuid)
    : null;

  // Prepare radar chart data for target player
  const radarData = targetPlayer ? [
    {
      category: 'Combat',
      score: targetPlayer.combatScore,
      fullMark: 25,
    },
    {
      category: 'Objectives',
      score: targetPlayer.objectiveScore,
      fullMark: 20,
    },
    {
      category: 'Economy',
      score: targetPlayer.economyScore,
      fullMark: 15,
    },
    {
      category: 'Survival',
      score: targetPlayer.survivalScore,
      fullMark: 15,
    },
    {
      category: 'Vision',
      score: targetPlayer.visionScore,
      fullMark: 15,
    },
  ] : [];

  // Prepare bar chart data for all players
  const barChartData = playerScores.slice(0, 10).map(score => ({
    name: `${score.summonerName.substring(0, 8)}...`,
    Combat: score.combatScore,
    Objectives: score.objectiveScore,
    Economy: score.economyScore,
    Survival: score.survivalScore,
    Vision: score.visionScore,
  }));

  const gameDurationMinutes = Math.floor(matchData.gameDuration / 60);
  const gameDurationSeconds = matchData.gameDuration % 60;

  return (
    <div className="space-y-6">
      {/* Match Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Match Analysis - {matchData.matchId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-lg font-semibold">{gameDurationMinutes}m {gameDurationSeconds}s</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">MVP</p>
              <p className="text-lg font-semibold text-yellow-500">
                {mvp.summonerName} ({mvp.championName})
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">MVP Score</p>
              <p className="text-lg font-semibold">{mvp.totalScore.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Result</p>
              <p className={`text-lg font-semibold ${mvp.win ? 'text-green-500' : 'text-red-500'}`}>
                {mvp.win ? 'Victory' : 'Defeat'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Player Performance */}
      {targetPlayer && targetPlayerData && (
        <>
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Performance - Rank #{targetPlayer.rank}/10
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Champion</p>
                  <p className="text-lg font-semibold">{targetPlayer.championName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="text-lg font-semibold">{targetPlayer.teamPosition}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">KDA</p>
                  <p className="text-lg font-semibold">
                    {targetPlayerData.kills}/{targetPlayerData.deaths}/{targetPlayerData.assists}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-lg font-semibold">{targetPlayer.totalScore.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Result</p>
                  <p className={`text-lg font-semibold ${targetPlayer.win ? 'text-green-500' : 'text-red-500'}`}>
                    {targetPlayer.win ? 'Win' : 'Loss'}
                  </p>
                </div>
              </div>

              {/* Performance Radar Chart */}
              <div className="h-[300px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 25]} />
                    <Radar
                      name="Your Score"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Combat Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Swords className="h-4 w-4" />
                  Combat & Damage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">KDA Ratio</span>
                  <span className="font-semibold">{targetPlayerData.kda.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Damage/Min</span>
                  <span className="font-semibold">{targetPlayerData.damagePerMinute.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Damage</span>
                  <span className="font-semibold">{targetPlayerData.totalDamageDealtToChampions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Team Damage %</span>
                  <span className="font-semibold">{(targetPlayerData.teamDamagePercentage * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kill Participation</span>
                  <span className="font-semibold">{(targetPlayerData.killParticipation * 100).toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Objective Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Trophy className="h-4 w-4" />
                  Objectives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Baron Kills</span>
                  <span className="font-semibold">{targetPlayerData.baronKills}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dragon Kills</span>
                  <span className="font-semibold">{targetPlayerData.dragonKills}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Turret Takedowns</span>
                  <span className="font-semibold">{targetPlayerData.turretTakedowns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Objectives Stolen</span>
                  <span className="font-semibold">{targetPlayerData.objectivesStolen}</span>
                </div>
              </CardContent>
            </Card>

            {/* Economy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Coins className="h-4 w-4" />
                  Economy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gold Earned</span>
                  <span className="font-semibold">{targetPlayerData.goldEarned.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gold/Min</span>
                  <span className="font-semibold">{targetPlayerData.goldPerMinute.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CS</span>
                  <span className="font-semibold">
                    {targetPlayerData.totalMinionsKilled + targetPlayerData.neutralMinionsKilled}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CS/Min</span>
                  <span className="font-semibold">
                    {((targetPlayerData.totalMinionsKilled + targetPlayerData.neutralMinionsKilled) / (targetPlayerData.timePlayed / 60)).toFixed(1)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Survivability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4" />
                  Survivability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Damage Taken</span>
                  <span className="font-semibold">{targetPlayerData.totalDamageTaken.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Damage Mitigated</span>
                  <span className="font-semibold">{targetPlayerData.damageSelfMitigated.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Dead</span>
                  <span className="font-semibold">{Math.floor(targetPlayerData.timeSpentDead)}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deaths</span>
                  <span className="font-semibold">{targetPlayerData.deaths}</span>
                </div>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Eye className="h-4 w-4" />
                  Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vision Score</span>
                  <span className="font-semibold">{targetPlayerData.visionScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vision/Min</span>
                  <span className="font-semibold">{targetPlayerData.visionScorePerMinute.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wards Placed</span>
                  <span className="font-semibold">{targetPlayerData.wardsPlaced}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wards Killed</span>
                  <span className="font-semibold">{targetPlayerData.wardsKilled}</span>
                </div>
              </CardContent>
            </Card>

            {/* Macro */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Map className="h-4 w-4" />
                  Map Influence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-semibold">{targetPlayerData.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Win</span>
                  <span className={`font-semibold ${targetPlayer.win ? 'text-green-500' : 'text-red-500'}`}>
                    {targetPlayer.win ? 'Yes' : 'No'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Improvement Suggestions */}
          <Card className="border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Improvement Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {getImprovementSuggestions(targetPlayer, targetPlayerData).map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span className="text-sm">{suggestion}</span>
                  </li>
                ))}
                {getImprovementSuggestions(targetPlayer, targetPlayerData).length === 0 && (
                  <li className="text-sm text-green-500">✅ Great performance! Keep it up!</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </>
      )}

      {/* All Players Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Player Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Combat" fill="hsl(var(--chart-1))" />
                <Bar dataKey="Objectives" fill="hsl(var(--chart-2))" />
                <Bar dataKey="Economy" fill="hsl(var(--chart-3))" />
                <Bar dataKey="Survival" fill="hsl(var(--chart-4))" />
                <Bar dataKey="Vision" fill="hsl(var(--chart-5))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Match Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {playerScores.map((player) => (
              <div
                key={player.puuid}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  player.puuid === targetPuuid ? 'border-primary bg-primary/5' : 'border-border'
                } ${player.rank === 1 ? 'bg-yellow-500/10' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    player.rank === 1 ? 'bg-yellow-500 text-black' :
                    player.rank === 2 ? 'bg-gray-400 text-black' :
                    player.rank === 3 ? 'bg-orange-600 text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {player.rank}
                  </div>
                  <div>
                    <p className="font-semibold">{player.summonerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {player.championName} • {player.teamPosition}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{player.totalScore.toFixed(1)}</p>
                  <p className={`text-sm ${player.win ? 'text-green-500' : 'text-red-500'}`}>
                    {player.win ? 'Victory' : 'Defeat'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
