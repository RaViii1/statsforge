"use client";

import { useEffect, useState } from "react";
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  Eye, 
  Shield, 
  Coins,
  Swords,
  Skull,
  AlertCircle,
  Crown,
  Zap,
  Award,
  Loader2,
  Star,
  TrendingDown,
  Activity,
  Crosshair,
  Brain,
  Users,
  BarChart3,
  PieChart,
  Clock,
  Flame,
  Heart,
  TrendingUpIcon,
  Sparkles
} from "lucide-react";
import { getChampionSplashByName } from "@/lib/lol/lolfunctions";
import { MatchTimeline } from "./MatchTimeline";

interface MatchAnalyticsProps {
  server: string;
  matchid: string;
  targetPuuid?: string;
}

interface ParticipantData {
  puuid: string;
  profileIcon: number;
  summonerName: string;
  championName: string;
  teamPosition: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  damagePerMinute: number;
  totalDamageDealtToChampions: number;
  teamDamagePercentage: number;
  killParticipation: number;
  baronKills: number;
  dragonKills: number;
  turretTakedowns: number;
  objectivesStolen: number;
  goldEarned: number;
  goldPerMinute: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  totalDamageTaken: number;
  totalHeal: number;
  damageSelfMitigated: number;
  timeSpentDead: number;
  visionScore: number;
  visionScorePerMinute: number;
  wardsPlaced: number;
  wardsKilled: number;
  level: number;
  timePlayed: number;
  teamId: number;
  pentaKills: number;
  quadraKills: number;
  tripleKills: number;
  doubleKills: number;
}

interface MatchData {
  matchid: string;
  gameDuration: number;
  participants: ParticipantData[];
}

interface PlayerScore {
  puuid: string;
  profileIcon: number;
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

interface PerformanceBadge {
  label: string;
  type: "excellent" | "good" | "poor";
  icon: any;
}

// Circular Progress Component
const CircularProgress = ({ 
  value, 
  maxValue, 
  label, 
  color = "orange",
  size = 120 
}: { 
  value: number; 
  maxValue: number; 
  label: string;
  color?: "orange" | "purple" | "green" | "blue" | "yellow";
  size?: number;
}) => {
  const percentage = (value / maxValue) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    orange: { stroke: "rgb(249, 115, 22)", glow: "rgba(249, 115, 22, 0.3)", text: "text-orange-500" },
    purple: { stroke: "rgb(168, 85, 247)", glow: "rgba(168, 85, 247, 0.3)", text: "text-purple-500" },
    green: { stroke: "rgb(34, 197, 94)", glow: "rgba(34, 197, 94, 0.3)", text: "text-green-500" },
    blue: { stroke: "rgb(59, 130, 246)", glow: "rgba(59, 130, 246, 0.3)", text: "text-blue-500" },
    yellow: { stroke: "rgb(234, 179, 8)", glow: "rgba(234, 179, 8, 0.3)", text: "text-yellow-500" }
  };

  const colors = colorMap[color];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r="45"
            fill="none"
            stroke="rgb(39, 39, 42)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r="45"
            fill="none"
            stroke={colors.stroke}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ 
              transition: 'stroke-dashoffset 1s ease-in-out',
              filter: `drop-shadow(0 0 8px ${colors.glow})`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-2xl font-bold ${colors.text}`}>
            {Math.round(percentage)}%
          </div>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-sm text-zinc-400">{label}</div>
        <div className="text-lg font-bold text-white">{value.toFixed(1)}</div>
        <div className="text-xs text-zinc-600">/ {maxValue}</div>
      </div>
    </div>
  );
};

// Score Breakdown Component
const ScoreBreakdown = ({ 
  title, 
  icon: Icon, 
  color,
  breakdowns 
}: { 
  title: string;
  icon: any;
  color: string;
  breakdowns: { label: string; value: string; }[];
}) => {
  const colorMap: Record<string, string> = {
    orange: "border-orange-900/50 bg-orange-950/30 hover:border-orange-900/70",
    purple: "border-purple-900/50 bg-purple-950/30 hover:border-purple-900/70",
    green: "border-green-900/50 bg-green-950/30 hover:border-green-900/70",
    blue: "border-blue-900/50 bg-blue-950/30 hover:border-blue-900/70",
    yellow: "border-yellow-900/50 bg-yellow-950/30 hover:border-yellow-900/70"
  };

  const iconColorMap: Record<string, string> = {
    orange: "text-orange-500 bg-orange-950/50 border-orange-900/30",
    purple: "text-purple-500 bg-purple-950/50 border-purple-900/30",
    green: "text-green-500 bg-green-950/50 border-green-900/30",
    blue: "text-blue-500 bg-blue-950/50 border-blue-900/30",
    yellow: "text-yellow-500 bg-yellow-950/50 border-yellow-900/30"
  };

  return (
    <div className={`rounded-xl border ${colorMap[color]} p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg border ${iconColorMap[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h4 className="text-sm font-bold text-white">{title}</h4>
      </div>
      <div className="space-y-2">
        {breakdowns.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-xs text-zinc-400">{item.label}</span>
            <span className="text-sm font-semibold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ 
  icon: Icon, 
  title, 
  value,
  subtitle,
  accentColor = "orange" 
}: { 
  icon: any; 
  title: string; 
  value: string | number;
  subtitle?: string;
  accentColor?: string;
}) => {
  const colors = {
    orange: "border-zinc-800 hover:border-orange-900/50",
    green: "border-zinc-800 hover:border-green-900/50",
    purple: "border-zinc-800 hover:border-purple-900/50",
    blue: "border-zinc-800 hover:border-blue-900/50",
  };

  const iconColors = {
    orange: "bg-orange-950/50 border-orange-900/30 text-orange-500",
    green: "bg-green-950/50 border-green-900/30 text-green-500",
    purple: "bg-purple-950/50 border-purple-900/30 text-purple-500",
    blue: "bg-blue-950/50 border-blue-900/30 text-blue-500",
  };

  return (
    <div className={`rounded-xl border bg-zinc-900/50 backdrop-blur-sm transition-all p-6 ${colors[accentColor as keyof typeof colors] || colors.orange}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2.5 rounded-xl border ${iconColors[accentColor as keyof typeof iconColors] || iconColors.orange}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium text-zinc-400">{title}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      {subtitle && <div className="text-sm text-zinc-500">{subtitle}</div>}
    </div>
  );
};

// Performance Badge Component
const PerformanceBadge = ({ badge }: { badge: PerformanceBadge }) => {
  const { label, type, icon: Icon } = badge;
  
  const styles = {
    excellent: "bg-green-950/50 border-green-900/50 text-green-400",
    good: "bg-blue-950/50 border-blue-900/50 text-blue-400",
    poor: "bg-red-950/50 border-red-900/50 text-red-400"
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${styles[type]} font-semibold text-sm`}>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
  );
};

// Performance Radar Chart Component
const PerformanceRadar = ({ playerScore, avgScores }: { playerScore: PlayerScore, avgScores: any }) => {
  const stats = [
    { label: "Combat", value: playerScore.combatScore, max: 25, color: "rgb(249, 115, 22)" },
    { label: "Objectives", value: playerScore.objectiveScore, max: 20, color: "rgb(168, 85, 247)" },
    { label: "Economy", value: playerScore.economyScore, max: 15, color: "rgb(34, 197, 94)" },
    { label: "Survival", value: playerScore.survivalScore, max: 15, color: "rgb(59, 130, 246)" },
    { label: "Vision", value: playerScore.visionScore, max: 15, color: "rgb(234, 179, 8)" },
  ];

  const size = 300;
  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const angleStep = (Math.PI * 2) / stats.length;

  const getPoint = (value: number, max: number, index: number) => {
    const ratio = value / max;
    const angle = index * angleStep - Math.PI / 2;
    const radius = maxRadius * ratio;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const points = stats.map((stat, i) => getPoint(stat.value, stat.max, i));
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid circles */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((ratio) => (
          <circle
            key={ratio}
            cx={center}
            cy={center}
            r={maxRadius * ratio}
            fill="none"
            stroke="rgb(63, 63, 70)"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}

        {/* Grid lines */}
        {stats.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + maxRadius * Math.cos(angle);
          const y = center + maxRadius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgb(63, 63, 70)"
              strokeWidth="1"
              opacity="0.3"
            />
          );
        })}

        {/* Player performance polygon */}
        <path
          d={pathData}
          fill="rgba(249, 115, 22, 0.3)"
          stroke="rgb(249, 115, 22)"
          strokeWidth="2"
        />

        {/* Points */}
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="rgb(249, 115, 22)"
            stroke="rgb(255, 255, 255)"
            strokeWidth="2"
          />
        ))}

        {/* Labels */}
        {stats.map((stat, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelRadius = maxRadius + 25;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              fill="rgb(161, 161, 170)"
              fontSize="12"
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {stat.label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      {/* <div className="grid grid-cols-3 gap-4 mt-6 w-full">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-xs text-zinc-500 mb-1">{stat.label}</div>
            <div className="text-lg font-bold text-white">{stat.value.toFixed(2)}</div>
            <div className="text-xs text-zinc-600">/ {stat.max}</div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

// Player Comparison Bar Chart - REDESIGNED FOR CLEANER LOOK
const PlayerComparisonChart = ({ players, metric, label }: { players: ParticipantData[], metric: keyof ParticipantData, label: string }) => {
  const sortedPlayers = [...players].sort((a, b) => {
    const aVal = typeof a[metric] === 'number' ? a[metric] as number : 0;
    const bVal = typeof b[metric] === 'number' ? b[metric] as number : 0;
    return bVal - aVal;
  });
  
  const maxValue = Math.max(...sortedPlayers.map(p => {
    const val = p[metric];
    return typeof val === 'number' ? val : 0;
  }));

  return (
    <div className="space-y-3">
      {sortedPlayers.map((player, index) => {
        const value = typeof player[metric] === 'number' ? player[metric] as number : 0;
        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
        
        return (
          <div key={player.puuid} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className={`font-mono text-[10px] font-bold w-6 shrink-0 ${
                  index === 0 ? 'text-orange-400' :
                  index === 1 ? 'text-zinc-400' :
                  index === 2 ? 'text-zinc-500' :
                  'text-zinc-600'
                }`}>
                  #{index + 1}
                </span>
                <span className={`font-medium truncate text-xs ${
                  index === 0 ? 'text-white' :
                  index === 1 ? 'text-zinc-300' :
                  index === 2 ? 'text-zinc-400' :
                  'text-zinc-500'
                }`}>
                  {player.summonerName}
                </span>
              </div>
              <span className={`font-bold text-xs ml-2 shrink-0 ${
                index === 0 ? 'text-orange-400' :
                index === 1 ? 'text-zinc-400' :
                'text-zinc-500'
              }`}>
                {typeof value === 'number' ? value.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="relative h-1 bg-zinc-800/50 rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
                  index === 0 ? 'bg-orange-500/80' :
                  index === 1 ? 'bg-zinc-600/60' :
                  index === 2 ? 'bg-zinc-700/50' :
                  'bg-zinc-800/40'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Damage Breakdown Pie Chart
const DamageBreakdownChart = ({ participant }: { participant: ParticipantData }) => {
  const totalDamage = participant.totalDamageDealtToChampions;
  const teamDamage = totalDamage / participant.teamDamagePercentage;
  const othersDamage = teamDamage - totalDamage;

  const playerPercentage = (totalDamage / teamDamage) * 100;
  const othersPercentage = 100 - playerPercentage;

  return (
    <div className="flex items-center justify-center gap-8">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {/* Others damage */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgb(63, 63, 70)"
            strokeWidth="20"
          />
          {/* Player damage */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgb(249, 115, 22)"
            strokeWidth="20"
            strokeDasharray={`${playerPercentage * 2.513} ${100 * 2.513}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-orange-500">{playerPercentage.toFixed(1)}%</div>
          <div className="text-xs text-zinc-500">of team</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-orange-500"></div>
          <div>
            <div className="text-sm text-zinc-400">Your Damage</div>
            <div className="text-lg font-bold text-white">{totalDamage.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-zinc-700"></div>
          <div>
            <div className="text-sm text-zinc-400">Team Total</div>
            <div className="text-lg font-bold text-white">{teamDamage.toFixed(0).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DamageTakenBreakdownChart = ({ participant, allParticipants }: { participant: ParticipantData, allParticipants: ParticipantData[] }) => {
  const totalDamageTaken = participant.totalDamageTaken;
  
  // Calculate team's total damage taken (filter by teamId - must match exactly)
  const teamParticipants = allParticipants.filter(p => p.teamId === participant.teamId);
  const teamDamageTaken = teamParticipants.reduce((sum, p) => sum + (p.totalDamageTaken || 0), 0);

  // Safety check for division by zero
  const playerPercentage = teamDamageTaken > 0 ? (totalDamageTaken / teamDamageTaken) * 100 : 0;

  return (
    <div className="flex items-center justify-center gap-8">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {/* Others damage */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgb(63, 63, 70)"
            strokeWidth="20"
          />
          {/* Player damage */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="20"
            strokeDasharray={`${playerPercentage * 2.513} ${100 * 2.513}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-blue-500">{playerPercentage.toFixed(1)}%</div>
          <div className="text-xs text-zinc-500">of team</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-blue-500"></div>
          <div>
            <div className="text-sm text-zinc-400">Your Damage Taken</div>
            <div className="text-lg font-bold text-white">{totalDamageTaken.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-zinc-700"></div>
          <div>
            <div className="text-sm text-zinc-400">Team Total Taken</div>
            <div className="text-lg font-bold text-white">{teamDamageTaken.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DamageHealedBreakdownChart = ({ participant, allParticipants }: { participant: ParticipantData, allParticipants: ParticipantData[] }) => {
  const totalHeal = participant.totalHeal;
  
  // Calculate team's total healing (filter by teamId - must match exactly)
  const teamParticipants = allParticipants.filter(p => p.teamId === participant.teamId);
  const teamDamageHealed = teamParticipants.reduce((sum, p) => sum + (p.totalHeal || 0), 0);
  
  // Safety check for division by zero
  const playerPercentage = teamDamageHealed > 0 ? (totalHeal / teamDamageHealed) * 100 : 0;


  return (
    <div className="flex items-center justify-center gap-8">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {/* Others damage */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgb(63, 63, 70)"
            strokeWidth="20"
          />
          {/* Player damage */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgb(34, 197, 94)"
            strokeWidth="20"
            strokeDasharray={`${playerPercentage * 2.513} ${100 * 2.513}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-green-500">{playerPercentage.toFixed(1)}%</div>
          <div className="text-xs text-zinc-500">of team</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <div>
            <div className="text-sm text-zinc-400">Your Healing</div>
            <div className="text-lg font-bold text-white">{totalHeal.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-zinc-700"></div>
          <div>
            <div className="text-sm text-zinc-400">Team Total Healed</div>
            <div className="text-lg font-bold text-white">{teamDamageHealed.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// New Objectives Detail Component
const ObjectivesDetail = ({ participant }: { participant: ParticipantData }) => {
  const objectives = [
    { 
      label: "Dragons", 
      value: participant.dragonKills, 
      image: "/images/elder.png",
      color: "from-teal-500 to-emerald-500",
      bgColor: "bg-teal-950/30",
      borderColor: "border-emerald-900/50",
      dropShadow: "group-hover:drop-shadow-[0_0_15px_rgba(20,184,166,0.8)]" // teal-500
    },
    { 
      label: "Barons", 
      value: participant.baronKills, 
      image: "/images/baron.png",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-950/30",
      borderColor: "border-purple-900/50",
      dropShadow: "group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" // purple-500
    },
    { 
      label: "Turrets", 
      value: participant.turretTakedowns, 
      image: "/images/tower.png",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-950/30",
      borderColor: "border-blue-900/50",
      dropShadow: "group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" // blue-500
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {objectives.map((obj, idx) => (
        <div key={idx} className={`relative overflow-visible rounded-xl border ${obj.borderColor} ${obj.bgColor} p-4 pr-20 group hover:scale-[1.02] transition-transform duration-300 z-40`}>
          <div className="flex items-center justify-between">
            {/* Text on the left */}
            <div className="flex-1">
              <div className="text-xs text-zinc-400 mb-1">{obj.label}</div>
              <div className={`text-2xl font-bold bg-linear-to-r ${obj.color} bg-clip-text text-transparent`}>
                {obj.value}
              </div>
            </div>

            {/* Image on the right with padding buffer */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 overflow-visible">
              {obj.image ? (
                <div className="relative w-16 h-16 overflow-visible flex items-center justify-center">
                  <img 
                    src={obj.image} 
                    alt={obj.label}
                    className={`w-16 h-16 object-contain transition-all duration-500 ease-out group-hover:scale-[2.5] ${obj.dropShadow} relative z-50`}
                  />
                </div>
              ) : (
                <div className="text-3xl"><Target /></div>
              )}
            </div>
          </div>

          {/* Decorative SVG pattern */}
          <svg className="absolute right-0 top-0 w-20 h-20 opacity-10 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="currentColor" className={obj.color.includes('teal') ? 'text-teal-500' : obj.color.includes('purple') ? 'text-purple-500' : obj.color.includes('blue') ? 'text-blue-500' : 'text-yellow-500'} />
          </svg>
        </div>
      ))}
    </div>
  );
};

// Multikills Display Component
const MultikillsDisplay = ({ participant }: { participant: ParticipantData }) => {
  // Helper function to get the biggest multikill
  const getBiggestMultikill = () => {
    if (participant.pentaKills > 0) return { name: "Penta Kill", count: participant.pentaKills};
    if (participant.quadraKills > 0) return { name: "Quadra Kill", count: participant.quadraKills};
    if (participant.tripleKills > 0) return { name: "Triple Kill", count: participant.tripleKills};
    if (participant.doubleKills > 0) return { name: "Double Kill", count: participant.doubleKills};
    return null;
  };

  const biggestMultikill = getBiggestMultikill();

  const multikills = [
    {
      label: "Double Kill",
      value: participant.doubleKills,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-950/30",
      borderColor: "border-blue-900/50"
    },
    {
      label: "Triple Kill",
      value: participant.tripleKills,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-950/30",
      borderColor: "border-purple-900/50"
    },
    {
      label: "Quadra Kill",
      value: participant.quadraKills,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-950/30",
      borderColor: "border-orange-900/50"
    },
    {
      label: "Penta Kill",
      value: participant.pentaKills,
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-950/30",
      borderColor: "border-red-900/50"
    }
  ];

  // Check if player has any multikills
  const hasMultikills = multikills.some(mk => mk.value > 0);

  if (!hasMultikills) {
    return (
      <div className="text-center py-8 px-4 rounded-xl bg-zinc-900/30 border border-zinc-800">
        <div className="text-4xl mb-2">🎯</div>
        <p className="text-sm text-zinc-500">No multikills this match</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Biggest Multikill Badge */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Your Multikills</h3>
        {biggestMultikill && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/50 backdrop-blur-sm animate-pulse">
        
            <div className="flex flex-col">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Best: {biggestMultikill.name}</span>
              <span className="text-[10px] text-zinc-400">x{biggestMultikill.count}</span>
            </div>
          </div>
        )}
      </div>

      {/* Multikill Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {multikills.map((mk, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-xl border ${mk.borderColor} ${mk.bgColor} p-4 transition-all duration-300 ${
              mk.value > 0 ? 'hover:scale-105 opacity-100' : 'opacity-40'
            }`}
          >
            <div className="flex flex-row justify-center items-baseline space-x-2 text-center w-full">
            <div className="text-xs text-zinc-400 inline-block">
                {mk.label}
            </div>
            <div className={`text-3xl font-bold bg-linear-to-r ${mk.color} bg-clip-text text-transparent inline-block`}>
                x{mk.value}
            </div>
            </div>


            {/* Decorative glow */}
            {mk.value > 0 && (
              <div className={`absolute inset-0 bg-linear-to-br ${mk.color} opacity-5 blur-xl pointer-events-none`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// // Game Phase Performance Component
// const GamePhasePerformance = ({ participant }: { participant: ParticipantData }) => {
//   const gameDurationMinutes = participant.timePlayed / 60;
  
//   // Estimate phase performance based on available data
//   const phases = [
//     {
//       name: "Early Game",
//       time: "0-15 min",
//       icon: "🌅",
//       color: "from-blue-500 to-cyan-500",
//       bgColor: "bg-blue-950/30",
//       borderColor: "border-blue-900/50",
//       // Early game metrics estimation
//       score: Math.min(100, (participant.goldPerMinute * 15 / participant.goldEarned) * 100 * 1.5),
//       metrics: {
//         focus: "Laning Phase",
//         strength: participant.goldPerMinute > 400 ? "Strong economy" : participant.kills > participant.deaths ? "Good trades" : "Needs improvement",
//         tip: participant.goldPerMinute > 400 
//           ? "Great CS! Keep up the farming." 
//           : "Focus on last-hitting minions and avoid unnecessary trades."
//       }
//     },
//     {
//       name: "Mid Game",
//       time: "15-25 min",
//       icon: "⚔️",
//       color: "from-orange-500 to-red-500",
//       bgColor: "bg-orange-950/30",
//       borderColor: "border-orange-900/50",
//       // Mid game metrics estimation
//       score: Math.min(100, (participant.killParticipation * 100 + participant.teamDamagePercentage * 100) / 2),
//       metrics: {
//         focus: "Team Fights",
//         strength: participant.killParticipation > 0.6 
//           ? "High impact" 
//           : participant.objectivesStolen > 0 
//           ? "Good objective control" 
//           : "Low presence",
//         tip: participant.killParticipation > 0.6
//           ? "Excellent teamfight participation!"
//           : "Group with your team for objectives and fights."
//       }
//     },
//     {
//       name: "Late Game",
//       time: "25+ min",
//       icon: "👑",
//       color: "from-purple-500 to-pink-500",
//       bgColor: "bg-purple-950/30",
//       borderColor: "border-purple-900/50",
//       // Late game metrics estimation
//       score: Math.min(100, (participant.baronKills * 25 + (100 - (participant.timeSpentDead / gameDurationMinutes)) + participant.win ? 50 : 0)),
//       metrics: {
//         focus: "Game Closing",
//         strength: participant.win 
//           ? "Victory secured" 
//           : participant.deaths <= 3 
//           ? "Good positioning" 
//           : "Risky plays",
//         tip: participant.deaths > 7
//           ? "Avoid risky plays late game - death timers are crucial."
//           : participant.win
//           ? "Perfect! You helped close out the game."
//           : "Focus on Baron and Elder Dragon for comeback potential."
//       }
//     }
//   ];

//   return (
//     <div className="relative">
//       {/* Hero Image */}
//       <div className="absolute inset-0 rounded-xl overflow-hidden opacity-10">
//         <img 
//           src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/5e6a9517-f9f8-4974-960e-9e39c19d8424/generated_images/abstract-illustration-of-game-phases-and-b7d5ed8b-20251125173921.jpg"
//           alt="Game Phases"
//           className="w-full h-full object-cover"
//         />
//       </div>

//       <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
//         {phases.map((phase, idx) => (
//           <div key={idx} className={`relative overflow-hidden rounded-xl border ${phase.borderColor} ${phase.bgColor} p-5 backdrop-blur-sm group hover:scale-105 transition-all duration-300`}>
//             <div className="mb-4">
//               <div className="text-3xl mb-2">{phase.icon}</div>
//               <h4 className={`text-lg font-bold bg-linear-to-r ${phase.color} bg-clip-text text-transparent mb-1`}>
//                 {phase.name}
//               </h4>
//               <p className="text-xs text-zinc-500 font-mono">{phase.time}</p>
//             </div>

//             {/* Phase Score */}
//             <div className="mb-4">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-xs text-zinc-400">Phase Score</span>
//                 <span className="text-sm font-bold text-white">{phase.score.toFixed(0)}%</span>
//               </div>
//               <div className="relative h-2 bg-zinc-800/50 rounded-full overflow-hidden">
//                 <div
//                   className={`absolute inset-y-0 left-0 rounded-full bg-linear-to-r ${phase.color} transition-all duration-1000`}
//                   style={{ width: `${phase.score}%` }}
//                 />
//               </div>
//             </div>

//             {/* Phase Metrics */}
//             <div className="space-y-2 border-t border-zinc-800 pt-4">
//               <div>
//                 <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Focus</div>
//                 <div className="text-sm font-semibold text-zinc-300">{phase.metrics.focus}</div>
//               </div>
//               <div>
//                 <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Performance</div>
//                 <div className="text-sm font-semibold text-zinc-300">{phase.metrics.strength}</div>
//               </div>
//               <div>
//                 <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Tip</div>
//                 <div className="text-xs text-zinc-400 leading-relaxed">{phase.metrics.tip}</div>
//               </div>
//             </div>

//             {/* Decorative element */}
//             <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-linear-to-br ${phase.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`}></div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// Combat Efficiency Analysis Component
const CombatEfficiencyAnalysis = ({ participant, allParticipants }: { participant: ParticipantData, allParticipants: ParticipantData[] }) => {
  const gameDurationMinutes = participant.timePlayed / 60;
  
  // Calculate efficiency metrics
  const damagePerGold = participant.totalDamageDealtToChampions / participant.goldEarned;
  const damageEfficiency = (participant.totalDamageDealtToChampions / participant.totalDamageTaken) * 100;
  // FIX: Handle 0 deaths for gold efficiency to avoid Infinity
  const goldEfficiency = participant.deaths > 0 ? participant.goldEarned / participant.deaths : participant.goldEarned;
  const survivalRate = ((gameDurationMinutes * 60 - participant.timeSpentDead) / (gameDurationMinutes * 60)) * 100;
  const damagePerDeath = participant.deaths > 0 ? participant.totalDamageDealtToChampions / participant.deaths : participant.totalDamageDealtToChampions;
  
  // Compare to team average
  const avgDamagePerGold = allParticipants.reduce((sum, p) => sum + (p.totalDamageDealtToChampions / p.goldEarned), 0) / allParticipants.length;
  const avgGoldPerMin = allParticipants.reduce((sum, p) => sum + p.goldPerMinute, 0) / allParticipants.length;
  
  const efficiencyMetrics = [
    {
      label: "Damage Efficiency",
      value: damagePerGold.toFixed(2),
      subtitle: `${damagePerGold > avgDamagePerGold ? '+' : ''}${((damagePerGold / avgDamagePerGold - 1) * 100).toFixed(1)}% vs avg`,
      icon: Swords,
      color: damagePerGold > avgDamagePerGold ? "text-green-400" : "text-zinc-400",
      bgColor: damagePerGold > avgDamagePerGold ? "bg-green-950/30" : "bg-zinc-900/30",
      borderColor: damagePerGold > avgDamagePerGold ? "border-green-900/50" : "border-zinc-800",
      description: "Damage dealt per gold spent"
    },
    {
      label: "Trade Efficiency",
      value: `${damageEfficiency.toFixed(0)}%`,
      subtitle: damageEfficiency > 100 ? "Positive trades" : "Negative trades",
      icon: Crosshair,
      color: damageEfficiency > 100 ? "text-green-400" : "text-red-400",
      bgColor: damageEfficiency > 100 ? "bg-green-950/30" : "bg-red-950/30",
      borderColor: damageEfficiency > 100 ? "border-green-900/50" : "border-red-900/50",
      description: "Damage dealt vs damage taken ratio"
    },
    {
      label: "Gold Efficiency",
      value: goldEfficiency.toFixed(0),
      subtitle: `${participant.goldPerMinute.toFixed(0)}/min`,
      icon: Coins,
      color: participant.goldPerMinute > avgGoldPerMin ? "text-green-400" : "text-zinc-400",
      bgColor: participant.goldPerMinute > avgGoldPerMin ? "bg-green-950/30" : "bg-zinc-900/30",
      borderColor: participant.goldPerMinute > avgGoldPerMin ? "border-green-900/50" : "border-zinc-800",
      description: "Gold earned per death (higher is better)"
    },
    {
      label: "Survival Rate",
      value: `${survivalRate.toFixed(1)}%`,
      subtitle: survivalRate > 85 ? "Excellent" : survivalRate > 70 ? "Good" : "Needs work",
      icon: Heart,
      color: survivalRate > 85 ? "text-green-400" : survivalRate > 70 ? "text-yellow-400" : "text-red-400",
      bgColor: survivalRate > 85 ? "bg-green-950/30" : survivalRate > 70 ? "bg-yellow-950/30" : "bg-red-950/30",
      borderColor: survivalRate > 85 ? "border-green-900/50" : survivalRate > 70 ? "border-yellow-900/50" : "border-red-900/50",
      description: "Time alive vs time dead"
    }
  ];

  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="absolute inset-0 rounded-xl overflow-hidden opacity-10">
        <img 
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/5e6a9517-f9f8-4974-960e-9e39c19d8424/generated_images/abstract-illustration-of-combat-efficien-fa21c811-20251125173921.jpg"
          alt="Combat Efficiency"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10">
        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {efficiencyMetrics.map((metric, idx) => (
            <div key={idx} className={`rounded-xl border ${metric.borderColor} ${metric.bgColor} p-5 backdrop-blur-sm hover:scale-105 transition-all duration-300`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  <metric.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-zinc-500 mb-0.5">{metric.label}</div>
                  <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                </div>
              </div>
              <div className="text-xs text-zinc-400 mb-2">{metric.subtitle}</div>
              <div className="text-[10px] text-zinc-600 leading-relaxed">{metric.description}</div>
            </div>
          ))}
        </div>

        {/* Advanced Combat Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Damage Analysis */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-orange-500" />
              <h4 className="text-sm font-bold text-white">Damage Analysis</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Damage per Death</span>
                <span className="text-sm font-bold text-white">{damagePerDeath.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Damage per Minute</span>
                <span className="text-sm font-bold text-white">{participant.damagePerMinute.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Mitigated Damage</span>
                <span className="text-sm font-bold text-white">{participant.damageSelfMitigated.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-zinc-800">
                <div className="text-[10px] text-zinc-500 mb-1">Combat Rating</div>
                <div className="flex items-center gap-2">
                  {damagePerDeath > 10000 ? (
                    <>
                      <TrendingUpIcon className="h-4 w-4 text-green-400" />
                      <span className="text-xs font-semibold text-green-400">Excellent Impact</span>
                    </>
                  ) : damagePerDeath > 5000 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-yellow-400" />
                      <span className="text-xs font-semibold text-yellow-400">Good Impact</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-400" />
                      <span className="text-xs font-semibold text-red-400">Low Impact</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Survivability Analysis */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-blue-500" />
              <h4 className="text-sm font-bold text-white">Survivability</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Time Alive</span>
                <span className="text-sm font-bold text-white">{((gameDurationMinutes * 60 - participant.timeSpentDead) / 60).toFixed(1)} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Time Dead</span>
                <span className="text-sm font-bold text-white">{(participant.timeSpentDead / 60).toFixed(1)} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Death Timer Impact</span>
                <span className={`text-sm font-bold ${participant.timeSpentDead > 180 ? 'text-red-400' : 'text-green-400'}`}>
                  {participant.timeSpentDead > 180 ? 'High' : 'Low'}
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-800">
                <div className="text-[10px] text-zinc-500 mb-1">Survivability Rating</div>
                <div className="flex items-center gap-2">
                  {survivalRate > 85 ? (
                    <>
                      <Star className="h-4 w-4 text-green-400" />
                      <span className="text-xs font-semibold text-green-400">Excellent Positioning</span>
                    </>
                  ) : survivalRate > 70 ? (
                    <>
                      <Award className="h-4 w-4 text-yellow-400" />
                      <span className="text-xs font-semibold text-yellow-400">Good Positioning</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <span className="text-xs font-semibold text-red-400">Risky Positioning</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-orange-500" />
            <h4 className="text-sm font-bold text-white">Efficiency Insights</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {damagePerGold > avgDamagePerGold 
                  ? "You're converting gold into damage efficiently. Keep building high-impact items."
                  : "Consider building more damage-focused items to improve your combat effectiveness."}
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {damageEfficiency > 100
                  ? "Great trading! You're dealing more damage than you take in fights."
                  : "Focus on positioning to take less damage while maintaining your damage output."}
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {participant.deaths <= 3
                  ? "Excellent death control! Your cautious playstyle is paying off."
                  : `With ${participant.deaths} deaths, focus on map awareness and safer positioning.`}
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {survivalRate > 85
                  ? "Your uptime is excellent - you're maximizing your impact on the game."
                  : "Reduce time dead by playing safer during crucial moments and death timers."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function MatchAnalytics({ server, matchid, targetPuuid }: MatchAnalyticsProps) {
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([]);
  const [mvp, setMvp] = useState<PlayerScore | null>(null);
  const [ace, setAce] = useState<PlayerScore | null>(null);
  const [targetPlayer, setTargetPlayer] = useState<PlayerScore | null>(null);

  useEffect(() => {
    fetchMatchData();
  }, [server, matchid]);

  const fetchMatchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/lol/matches/${server}/stats/${matchid}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch match data');
      }
      
      const data = await response.json();
      setMatchData(data);
      
      const scores = calculatePlayerScores(data.participants);
      setPlayerScores(scores);
      
      const mvpPlayer = scores.reduce((prev, current) => 
        current.totalScore > prev.totalScore ? current : prev
      );
      setMvp(mvpPlayer);
      
      // Calculate ACE (best player from losing team)
      const losingPlayers = scores.filter(s => !s.win);
      if (losingPlayers.length > 0) {
        const acePlayer = losingPlayers.reduce((prev, current) => 
          current.totalScore > prev.totalScore ? current : prev
        );
        setAce(acePlayer);
      }
      
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
    
    const normalize = (value: number, max: number) => {
      return max > 0 ? (value / max) * 100 : 0;
    };
    
    const maxKDA = Math.max(...participants.map(p => p.kda));
    const maxDPM = Math.max(...participants.map(p => p.damagePerMinute));
    const maxGoldPerMin = Math.max(...participants.map(p => p.goldPerMinute));
    const maxVisionScore = Math.max(...participants.map(p => p.visionScore));
    const maxObjectives = Math.max(...participants.map(p => 
      p.baronKills + p.dragonKills + p.turretTakedowns
    ));
    
    const scores = participants.map(p => {
      const combatScore = (
        normalize(p.kda, maxKDA) * 0.3 +
        normalize(p.damagePerMinute, maxDPM) * 0.25 +
        (p.teamDamagePercentage * 100) * 0.2 +
        (p.killParticipation * 100) * 0.25
      ) * 0.25;
      
      const totalObjectives = p.baronKills + p.dragonKills + p.turretTakedowns;
      const objectiveScore = (
        normalize(totalObjectives, maxObjectives) * 0.5 +
        normalize(p.objectivesStolen, 5) * 0.3 +
        normalize(p.baronKills, 3) * 0.2
      ) * 0.20;
      
      const economyScore = (
        normalize(p.goldPerMinute, maxGoldPerMin) * 0.6 +
        normalize(p.totalMinionsKilled + p.neutralMinionsKilled, 400) * 0.4
      ) * 0.15;
      
      const deathPenalty = Math.max(0, 100 - (p.deaths * 10));
      const survivalScore = (
        deathPenalty * 0.5 +
        normalize(p.damageSelfMitigated, 40000) * 0.3 +
        normalize(100 - (p.timeSpentDead / gameDurationMinutes), 100) * 0.2
      ) * 0.15;
      
      const visionScore = (
        normalize(p.visionScore, maxVisionScore) * 0.5 +
        normalize(p.wardsPlaced, 50) * 0.25 +
        normalize(p.wardsKilled, 30) * 0.25
      ) * 0.15;
      
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
        rank: 0,
      };
    });
    
    scores.sort((a, b) => b.totalScore - a.totalScore);
    scores.forEach((score, index) => {
      score.rank = index + 1;
    });
    
    return scores;
  };

  const getPerformanceBadges = (participant: ParticipantData, allParticipants: ParticipantData[]): PerformanceBadge[] => {
    const badges: PerformanceBadge[] = [];
    const gameDurationMinutes = participant.timePlayed / 60;
    
    if (participant.deaths === 0) {
      badges.push({ label: "Perfect KD", type: "excellent", icon: Star });
    } else if (participant.kda >= 10) {
      badges.push({ label: "Legendary KDA", type: "excellent", icon: Trophy });
    } else if (participant.kda >= 5) {
      badges.push({ label: "High KDA", type: "excellent", icon: Award });
    } else if (participant.kda < 1) {
      badges.push({ label: "Low KDA", type: "poor", icon: Skull });
    }


    const avgDamage = allParticipants.reduce((sum, p) => sum + p.totalDamageDealtToChampions, 0) / allParticipants.length;
    const maxDamage = Math.max(...allParticipants.map(p => p.totalDamageDealtToChampions));
    
    if (participant.totalDamageDealtToChampions === maxDamage) {
      badges.push({ label: "Highest Damage", type: "excellent", icon: Swords });
    } else if (participant.totalDamageDealtToChampions > avgDamage * 1.3) {
      badges.push({ label: "High Damage", type: "excellent", icon: Crosshair });
    } else if (participant.totalDamageDealtToChampions < avgDamage * 0.5) {
      badges.push({ label: "Low Damage", type: "poor", icon: TrendingDown });
    }

    if (participant.killParticipation >= 0.7) {
      badges.push({ label: "Team Fighter", type: "excellent", icon: Users });
    } else if (participant.killParticipation < 0.3) {
      badges.push({ label: "Low Participation", type: "poor", icon: TrendingDown });
    }

    const avgVision = allParticipants.reduce((sum, p) => sum + p.visionScore, 0) / allParticipants.length;
    const maxVision = Math.max(...allParticipants.map(p => p.visionScore));
    
    if (participant.visionScore === maxVision) {
      badges.push({ label: "Vision King", type: "excellent", icon: Eye });
    } else if (participant.visionScore > avgVision * 1.3) {
      badges.push({ label: "Good Vision", type: "good", icon: Eye });
    } else if (participant.visionScore < avgVision * 0.5) {
      badges.push({ label: "Poor Vision", type: "poor", icon: Eye });
    }

    const avgGold = allParticipants.reduce((sum, p) => sum + p.goldEarned, 0) / allParticipants.length;
    const maxGold = Math.max(...allParticipants.map(p => p.goldEarned));
    
    if (participant.goldEarned === maxGold) {
      badges.push({ label: "Richest Player", type: "excellent", icon: Coins });
    } else if (participant.goldEarned > avgGold * 1.2) {
      badges.push({ label: "High Economy", type: "good", icon: Coins });
    }

    const csPerMin = (participant.totalMinionsKilled + participant.neutralMinionsKilled) / gameDurationMinutes;
    if (csPerMin >= 8) {
      badges.push({ label: "CS Master", type: "excellent", icon: Target });
    } else if (csPerMin < 4 && !["UTILITY", "SUPPORT"].includes(participant.teamPosition)) {
      badges.push({ label: "Low CS", type: "poor", icon: TrendingDown });
    }

    if (participant.deaths >= 10) {
      badges.push({ label: "Too Many Deaths", type: "poor", icon: Skull });
    } else if (participant.deaths <= 2) {
      badges.push({ label: "Great Survival", type: "excellent", icon: Shield });
    }

    const totalObjectives = participant.baronKills + participant.dragonKills + participant.turretTakedowns;
    if (totalObjectives >= 10) {
      badges.push({ label: "Objective Focused", type: "excellent", icon: Trophy });
    }

    const performanceScore = (participant.kills * 3 + participant.assists - participant.deaths * 2) / gameDurationMinutes;
    if (performanceScore > 1.5) {
      badges.push({ label: "Carry Performance", type: "excellent", icon: Crown });
    }

    return badges;
  };

  const getPersonalizedTips = (participant: ParticipantData, allParticipants: ParticipantData[], playerScore: PlayerScore): string[] => {
    const tips: string[] = [];
    const gameDurationMinutes = participant.timePlayed / 60;
    
    if (participant.kda < 2) {
      tips.push(`Your KDA of ${participant.kda.toFixed(2)} is below average. Focus on trading more effectively and positioning safely in teamfights.`);
    }
    
    if (participant.killParticipation < 0.5) {
      tips.push(`You participated in only ${(participant.killParticipation * 100).toFixed(0)}% of kills. Roam more and group with your team for objectives.`);
    }

    const avgDamage = allParticipants.reduce((sum, p) => sum + p.totalDamageDealtToChampions, 0) / allParticipants.length;
    if (participant.totalDamageDealtToChampions < avgDamage * 0.7) {
      tips.push(`Your damage output (${participant.totalDamageDealtToChampions.toLocaleString()}) was ${((participant.totalDamageDealtToChampions / avgDamage - 1) * 100).toFixed(0)}% below average. Look for more opportunities to poke and trade.`);
    }

    const csPerMin = (participant.totalMinionsKilled + participant.neutralMinionsKilled) / gameDurationMinutes;
    if (csPerMin < 6 && !["UTILITY", "SUPPORT"].includes(participant.teamPosition)) {
      tips.push(`Your CS/min of ${csPerMin.toFixed(2)} needs improvement. Aim for at least 7 CS/min by focusing on last-hitting during lane phase.`);
    }

    const avgVision = allParticipants.reduce((sum, p) => sum + p.visionScore, 0) / allParticipants.length;
    if (participant.visionScore < avgVision * 0.7) {
      tips.push(`Your vision score (${participant.visionScore}) was below average. Buy more control wards and use your trinket off cooldown.`);
    }

    if (participant.wardsKilled < 3) {
      tips.push(`You only cleared ${participant.wardsKilled} enemy wards. Invest in Oracle Lens to deny enemy vision around objectives.`);
    }

    if (participant.deaths > 7) {
      tips.push(`${participant.deaths} deaths is too many. Focus on map awareness, respect enemy cooldowns, and avoid overextending without vision.`);
    }

    const timeDeadPercent = (participant.timeSpentDead / (gameDurationMinutes * 60)) * 100;
    if (timeDeadPercent > 20) {
      tips.push(`You spent ${timeDeadPercent.toFixed(0)}% of the game dead. Avoid risky plays in late game when death timers are long.`);
    }

    const totalObjectives = participant.baronKills + participant.dragonKills + participant.turretTakedowns;
    if (totalObjectives < 5) {
      tips.push(`Only ${totalObjectives} objective participations. Prioritize dragons, barons, and turrets - they win games more than kills.`);
    }

    if (participant.teamDamagePercentage < 0.15 && !["UTILITY", "SUPPORT"].includes(participant.teamPosition)) {
      tips.push(`You dealt only ${(participant.teamDamagePercentage * 100).toFixed(1)}% of your team's damage. Work on maximizing your damage output in fights.`);
    }

    if (tips.length === 0) {
      tips.push(`Excellent performance across all categories! Keep up this level of play.`);
    }

    return tips;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-zinc-900/50 rounded-xl border border-zinc-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 font-medium">Analyzing match performance...</p>
          <p className="text-zinc-600 text-sm mt-2">This may take a few moments</p>
          
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
        <div className="flex items-center gap-3 text-red-400">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Failed to Load Match Data</h3>
            <p className="text-sm text-zinc-400 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!matchData || !mvp) {
    return null;
  }

  const targetPlayerData = targetPlayer 
    ? matchData.participants.find(p => p.puuid === targetPlayer.puuid)
    : null;

  const gameDurationMinutes = Math.floor(matchData.gameDuration / 60);
  const gameDurationSeconds = matchData.gameDuration % 60;

  // Calculate average scores for radar comparison
  const avgScores = {
    combat: playerScores.reduce((sum, p) => sum + p.combatScore, 0) / playerScores.length,
    objective: playerScores.reduce((sum, p) => sum + p.objectiveScore, 0) / playerScores.length,
    economy: playerScores.reduce((sum, p) => sum + p.economyScore, 0) / playerScores.length,
    survival: playerScores.reduce((sum, p) => sum + p.survivalScore, 0) / playerScores.length,
    vision: playerScores.reduce((sum, p) => sum + p.visionScore, 0) / playerScores.length,
  };

  return (
    <div className="space-y-6">
      {/* Match Overview */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 relative overflow-hidden">
        {/* Background Image with Opacity */}
        <div 
          className="absolute inset-0 bg-center bg-cover opacity-70 pointer-events-none"
          style={{backgroundImage: `url(${getChampionSplashByName(mvp.championName.toLowerCase())})`}}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-zinc-900/95 via-zinc-900/90 to-zinc-900/80 pointer-events-none"></div>
      
        <div className="relative z-10 p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-zinc-800/50">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-900/30 backdrop-blur-sm">
                <Activity className="h-7 w-7 text-orange-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">Match Overview</h2>
                <p className="text-xs text-zinc-500 font-mono tracking-wider">{matchid}</p>
              </div>
            </div>
            <div className="text-right backdrop-blur-sm bg-zinc-900/50 border border-zinc-800 rounded-xl px-6 py-4">
              <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Duration</div>
              <div className="text-3xl font-bold text-white tabular-nums">
                {gameDurationMinutes}:{gameDurationSeconds.toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* MVP Display - Redesigned */}
          <div className="relative rounded-2xl border border-orange-900/30 overflow-hidden backdrop-blur-sm">
            {/* MVP Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-orange-950/40 via-orange-900/20 via-orange-900/10 to-transparent"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-2xl"></div>

            <div className="relative p-8">
              <div className="flex items-center justify-between flex-wrap gap-6">
                {/* Left: MVP Info */}
                <div className="flex items-center gap-6">
                  {/* Icon with Glow Effect */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative p-5 rounded-2xl bg-linear-to-br from-orange-500 to-yellow-600 border-2 border-orange-400/50 shadow-2xl">
                      <Crown className="h-10 w-10 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  
                  {/* MVP Details */}
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 backdrop-blur-sm mb-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                      <span className="text-xs text-orange-400 font-bold uppercase tracking-widest">Match MVP</span>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{mvp.summonerName}</h3>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-900/50 border border-zinc-700/50">
                        <span className="text-white font-semibold">{mvp.championName}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                      <span className="text-zinc-400 uppercase text-xs font-medium tracking-wide">{mvp.teamPosition}</span>
                    </div>
                  </div>
                </div>
                
                {/* Right: Performance Score */}
                <div className="text-right">
                  <div className="inline-flex flex-col items-end px-8 py-6 rounded-2xl bg-linear-to-br from-zinc-900/80 to-zinc-900/50 border border-orange-900/30 backdrop-blur-sm">
                    <div className="text-xs text-zinc-400 uppercase tracking-widest mb-2 font-semibold">Performance Score</div>
                    <div className="text-5xl font-black bg-linear-to-r from-orange-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
                      {mvp.totalScore.toFixed(2)}
                    </div>
                    <div className="mt-2 text-xs text-zinc-500 font-medium">/ 100.00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Player Performance */}
      {targetPlayer && targetPlayerData && (
        <>
          {/* Performance Badges */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-orange-950/50 border border-orange-900/30">
                <Star className="h-5 w-5 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Performance Highlights</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {getPerformanceBadges(targetPlayerData, matchData.participants).map((badge, idx) => (
                <PerformanceBadge key={idx} badge={badge} />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">

              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="text-xs text-zinc-500 mb-1">KDA</div>
                <div className="text-2xl font-bold text-white">
                  {targetPlayerData.kills}/{targetPlayerData.deaths}/{targetPlayerData.assists}
                </div>
                <div className="text-sm text-orange-500 mt-1">{targetPlayerData.kda.toFixed(2)} ratio</div>
              </div>
              
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="text-xs text-zinc-500 mb-1">Damage</div>
                <div className="text-2xl font-bold text-white">{targetPlayerData.totalDamageDealtToChampions.toLocaleString()}</div>
                <div className="text-sm text-zinc-400 mt-1">{(targetPlayerData.teamDamagePercentage * 100).toFixed(1)}% of team</div>
              </div>
              
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="text-xs text-zinc-500 mb-1">Gold</div>
                <div className="text-2xl font-bold text-white">{targetPlayerData.goldEarned.toLocaleString()}</div>
                <div className="text-sm text-zinc-400 mt-1">{targetPlayerData.goldPerMinute.toFixed(2)}/min</div>
              </div>
              
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="text-xs text-zinc-500 mb-1">Vision</div>
                <div className="text-2xl font-bold text-white">{targetPlayerData.visionScore}</div>
                <div className="text-sm text-zinc-400 mt-1">{targetPlayerData.visionScorePerMinute.toFixed(2)}/min</div>
              </div>
            </div>

            {/* Objectives Detail */}
            <div className="border-t border-zinc-800 pt-6">
              <h3 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Objective Contributions</h3>
              <ObjectivesDetail participant={targetPlayerData} />
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <MultikillsDisplay participant={targetPlayerData} />
          </div>

            <MatchTimeline 
              server={server} 
              matchId={matchid} 
              puuid={targetPlayerData.puuid}
            />

          {/* COMBINED Performance Analysis Section - Radar + Circular Progress + Breakdown */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-orange-950/50 border border-orange-900/30">
                <Activity className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Performance Analysis</h2>
                <p className="text-sm text-zinc-400">Complete breakdown of your match performance</p>
              </div>
            </div>

            {/* Performance Radar Chart */}
            <div className="mb-8">
              <PerformanceRadar playerScore={targetPlayer} avgScores={avgScores} />
            </div>

            {/* Circular Progress Scores */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
              <CircularProgress
                value={targetPlayer.combatScore}
                maxValue={25}
                label="Combat"
                color="orange"
              />
              <CircularProgress
                value={targetPlayer.objectiveScore}
                maxValue={20}
                label="Objectives"
                color="purple"
              />
              <CircularProgress
                value={targetPlayer.economyScore}
                maxValue={15}
                label="Economy"
                color="green"
              />
              <CircularProgress
                value={targetPlayer.survivalScore}
                maxValue={15}
                label="Survival"
                color="blue"
              />
              <CircularProgress
                value={targetPlayer.visionScore}
                maxValue={15}
                label="Vision"
                color="yellow"
              />
            </div>

            {/* Score Breakdowns - What contributes to each score */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">
                Score Breakdown - How to Improve
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ScoreBreakdown
                  title="Combat Score"
                  icon={Swords}
                  color="orange"
                  breakdowns={[
                    { label: "KDA Ratio", value: `${targetPlayerData.kda.toFixed(2)}` },
                    { label: "Damage/Min", value: `${targetPlayerData.damagePerMinute.toFixed(0)}` },
                    { label: "Team Damage %", value: `${(targetPlayerData.teamDamagePercentage * 100).toFixed(1)}%` },
                    { label: "Kill Participation", value: `${(targetPlayerData.killParticipation * 100).toFixed(0)}%` }
                  ]}
                />
                <ScoreBreakdown
                  title="Objective Score"
                  icon={Trophy}
                  color="purple"
                  breakdowns={[
                    { label: "Baron Kills", value: `${targetPlayerData.baronKills}` },
                    { label: "Dragon Kills", value: `${targetPlayerData.dragonKills}` },
                    { label: "Turret Takedowns", value: `${targetPlayerData.turretTakedowns}` },
                    { label: "Objectives Stolen", value: `${targetPlayerData.objectivesStolen}` }
                  ]}
                />
                <ScoreBreakdown
                  title="Economy Score"
                  icon={Coins}
                  color="green"
                  breakdowns={[
                    { label: "Gold/Min", value: `${targetPlayerData.goldPerMinute.toFixed(0)}` },
                    { label: "Total Gold", value: `${(targetPlayerData.goldEarned / 1000).toFixed(1)}k` },
                    { label: "CS/Min", value: `${((targetPlayerData.totalMinionsKilled + targetPlayerData.neutralMinionsKilled) / (targetPlayerData.timePlayed / 60)).toFixed(1)}` },
                    { label: "Total CS", value: `${targetPlayerData.totalMinionsKilled + targetPlayerData.neutralMinionsKilled}` }
                  ]}
                />
                <ScoreBreakdown
                  title="Survival Score"
                  icon={Shield}
                  color="blue"
                  breakdowns={[
                    { label: "Deaths", value: `${targetPlayerData.deaths}` },
                    { label: "Time Dead", value: `${(targetPlayerData.timeSpentDead / 60).toFixed(1)} min` },
                    { label: "Damage Mitigated", value: `${(targetPlayerData.damageSelfMitigated / 1000).toFixed(1)}k` },
                    { label: "Damage Taken", value: `${(targetPlayerData.totalDamageTaken / 1000).toFixed(1)}k` }
                  ]}
                />
                <ScoreBreakdown
                  title="Vision Score"
                  icon={Eye}
                  color="yellow"
                  breakdowns={[
                    { label: "Vision Score", value: `${targetPlayerData.visionScore}` },
                    { label: "Vision/Min", value: `${targetPlayerData.visionScorePerMinute.toFixed(2)}` },
                    { label: "Wards Placed", value: `${targetPlayerData.wardsPlaced}` },
                    { label: "Wards Destroyed", value: `${targetPlayerData.wardsKilled}` }
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Your Stats Overview */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-950/50 border border-orange-900/30">
                  <Target className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Your Performance</h2>
                  <p className="text-sm text-zinc-400">Ranked #{targetPlayer.rank} out of 10 players</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-950/50 border border-orange-900/30">
                <Zap className="h-5 w-5 text-orange-500" />
                <span className="font-bold text-2xl text-orange-500">{targetPlayer.totalScore.toFixed(2)}</span>
                <span className="text-xs text-zinc-400">pts</span>
              </div>
            </div>

            {/* MVP Comparison Section */}
            {mvp && (
              <div className="relative mb-8">
                {/* MVP Badge - Shows when player IS the MVP */}
                {targetPlayer.puuid === mvp.puuid && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-yellow-500 blur-xl opacity-75 animate-pulse"></div>
                      <div className="relative px-6 py-3 bg-linear-to-r from-orange-500 to-yellow-500 rounded-xl border-2 border-yellow-400 shadow-2xl">
                        <div className="flex items-center gap-2">
                          <Crown className="h-6 w-6 text-white" />
                          <span className="text-2xl font-black text-white uppercase tracking-wider">MVP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ACE Badge - Shows when player IS the ACE (best on losing team) */}
                {ace && targetPlayer.puuid === ace.puuid && targetPlayer.puuid !== mvp.puuid && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-pink-500 blur-xl opacity-75 animate-pulse"></div>
                      <div className="relative px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl border-2 border-purple-400 shadow-2xl">
                        <div className="flex items-center gap-2">
                          <Star className="h-6 w-6 text-white" />
                          <span className="text-2xl font-black text-white uppercase tracking-wider">ACE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className={`rounded-xl border ${
                  targetPlayer.puuid === mvp.puuid 
                    ? 'border-orange-500/50 bg-orange-950/20' 
                    : ace && targetPlayer.puuid === ace.puuid
                    ? 'border-purple-500/50 bg-purple-950/20'
                    : 'border-zinc-800 bg-zinc-900/50'
                } p-6`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2.5 rounded-xl ${
                      ace && targetPlayer.puuid === ace.puuid && targetPlayer.puuid !== mvp.puuid
                        ? 'bg-purple-950/50 border-purple-900/30'
                        : 'bg-orange-950/50 border-orange-900/30'
                    }`}>
                      <Sparkles className={`h-6 w-6 ${
                        ace && targetPlayer.puuid === ace.puuid && targetPlayer.puuid !== mvp.puuid
                          ? 'text-purple-500'
                          : 'text-orange-500'
                      }`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {targetPlayer.puuid === mvp.puuid 
                          ? "You are the MVP!" 
                          : ace && targetPlayer.puuid === ace.puuid
                          ? "You are the ACE!"
                          : "Compare to MVP"}
                      </h2>
                      <p className="text-sm text-zinc-400">
                        {targetPlayer.puuid === mvp.puuid 
                          ? "Outstanding performance this match!" 
                          : ace && targetPlayer.puuid === ace.puuid
                          ? "Best player on the losing team - exceptional effort!"
                          : `See how you stack up against ${mvp.summonerName}`}
                      </p>
                    </div>
                  </div>

                  {targetPlayer.puuid !== mvp.puuid && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Your Stats */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                            <span className="text-lg">👤</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Your Stats</p>
                            <p className="text-xs text-zinc-500">{targetPlayer.summonerName}</p>
                          </div>
                        </div>
                        {[
                          { label: "KDA", value: `${targetPlayerData.kills}/${targetPlayerData.deaths}/${targetPlayerData.assists}`, sub: `${targetPlayerData.kda.toFixed(2)} ratio` },
                          { label: "Damage", value: targetPlayerData.totalDamageDealtToChampions.toLocaleString(), sub: `${(targetPlayerData.teamDamagePercentage * 100).toFixed(1)}% of team` },
                          { label: "Gold", value: targetPlayerData.goldEarned.toLocaleString(), sub: `${targetPlayerData.goldPerMinute.toFixed(0)}/min` },
                          { label: "CS", value: `${targetPlayerData.totalMinionsKilled + targetPlayerData.neutralMinionsKilled}`, sub: `${((targetPlayerData.totalMinionsKilled + targetPlayerData.neutralMinionsKilled) / (targetPlayerData.timePlayed / 60)).toFixed(1)}/min` },
                          { label: "Vision", value: `${targetPlayerData.visionScore}`, sub: `${targetPlayerData.visionScorePerMinute.toFixed(2)}/min` }
                        ].map((stat, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                            <div className="flex justify-between items-baseline mb-1">
                              <span className="text-xs text-zinc-500">{stat.label}</span>
                              <span className="text-lg font-bold text-white">{stat.value}</span>
                            </div>
                            <div className="text-xs text-zinc-600">{stat.sub}</div>
                          </div>
                        ))}
                      </div>

                      {/* MVP Stats */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-orange-500 blur-md opacity-50"></div>
                            <div className="relative w-10 h-10 rounded-lg bg-linear-to-br from-orange-500 to-yellow-500 border border-orange-400 flex items-center justify-center">
                              <Crown className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-orange-400">MVP Stats</p>
                            <p className="text-xs text-zinc-500">{mvp.summonerName}</p>
                          </div>
                        </div>
                        {(() => {
                          const mvpData = matchData.participants.find(p => p.puuid === mvp.puuid);
                          if (!mvpData) return null;
                          return [
                            { label: "KDA", value: `${mvpData.kills}/${mvpData.deaths}/${mvpData.assists}`, sub: `${mvpData.kda.toFixed(2)} ratio` },
                            { label: "Damage", value: mvpData.totalDamageDealtToChampions.toLocaleString(), sub: `${(mvpData.teamDamagePercentage * 100).toFixed(1)}% of team` },
                            { label: "Gold", value: mvpData.goldEarned.toLocaleString(), sub: `${mvpData.goldPerMinute.toFixed(0)}/min` },
                            { label: "CS", value: `${mvpData.totalMinionsKilled + mvpData.neutralMinionsKilled}`, sub: `${((mvpData.totalMinionsKilled + mvpData.neutralMinionsKilled) / (mvpData.timePlayed / 60)).toFixed(1)}/min` },
                            { label: "Vision", value: `${mvpData.visionScore}`, sub: `${mvpData.visionScorePerMinute.toFixed(2)}/min` }
                          ].map((stat, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-orange-950/30 border border-orange-900/50">
                              <div className="flex justify-between items-baseline mb-1">
                                <span className="text-xs text-orange-400/70">{stat.label}</span>
                                <span className="text-lg font-bold text-orange-400">{stat.value}</span>
                              </div>
                              <div className="text-xs text-orange-600/70">{stat.sub}</div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          
          {/* <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-orange-950/50 border border-orange-900/30">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Game Phase Performance</h2>
                <p className="text-sm text-zinc-400">How you performed throughout different stages of the game</p>
              </div>
            </div>
            <GamePhasePerformance participant={targetPlayerData} />
          </div> */}

          {/* NEW: Combat Efficiency Analysis */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-orange-950/50 border border-orange-900/30">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Combat Efficiency Analysis</h2>
                <p className="text-sm text-zinc-400">Detailed breakdown of your combat effectiveness and resource utilization</p>
              </div>
            </div>
            <CombatEfficiencyAnalysis participant={targetPlayerData} allParticipants={matchData.participants} />
          </div>


          {/* Damage Breakdown Pie Chart */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-orange-950/50 border border-orange-900/30">
                <PieChart className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Damage Contribution</h2>
                <p className="text-sm text-zinc-400">Your damage output compared to team total</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DamageBreakdownChart participant={targetPlayerData} />
            <DamageTakenBreakdownChart participant={targetPlayerData} allParticipants={matchData.participants} />
            <DamageHealedBreakdownChart participant={targetPlayerData} allParticipants={matchData.participants} />
            </div>
            
          </div>

          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-950/50 border border-orange-900/30">
                <BarChart3 className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Player Rankings</h2>
                <p className="text-sm text-zinc-400">Performance comparison across all players</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* KDA Comparison */}
              <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
                 
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="p-1.5 rounded-lg bg-orange-950/50 border border-orange-900/30">
                      <Trophy className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">KDA Rankings</h3>
                      <p className="text-[10px] text-zinc-500">Kill/Death/Assist performance</p>
                    </div>
                  </div>
                  <PlayerComparisonChart players={matchData.participants} metric="kda" label="KDA" />
                </div>
              </div>

              {/* Damage Comparison */}
              <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
                 
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="p-1.5 rounded-lg bg-red-950/50 border border-red-900/30">
                      <Swords className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Damage Output</h3>
                      <p className="text-[10px] text-zinc-500">Total damage to champions</p>
                    </div>
                  </div>
                  <PlayerComparisonChart players={matchData.participants} metric="totalDamageDealtToChampions" label="Damage" />
                </div>
              </div>

              {/* Gold Comparison */}
              <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
                

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="p-1.5 rounded-lg bg-yellow-950/50 border border-yellow-900/30">
                      <Coins className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Gold Earned</h3>
                      <p className="text-[10px] text-zinc-500">Total gold accumulated</p>
                    </div>
                  </div>
                  <PlayerComparisonChart players={matchData.participants} metric="goldEarned" label="Gold" />
                </div>
              </div>

              {/* Vision Comparison */}
              <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
                 
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="p-1.5 rounded-lg bg-blue-950/50 border border-blue-900/30">
                      <Eye className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Vision Control</h3>
                      <p className="text-[10px] text-zinc-500">Ward placement & clearing</p>
                    </div>
                  </div>
                  <PlayerComparisonChart players={matchData.participants} metric="visionScore" label="Vision" />
                </div>
              </div>
            </div>
          </div>

          {/* Personalized Tips */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-orange-950/50 border border-orange-900/30">
                <Brain className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Personalized Tips</h2>
                <p className="text-sm text-zinc-400">AI-analyzed suggestions based on your performance</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {getPersonalizedTips(targetPlayerData, matchData.participants, targetPlayer).map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="w-6 h-6 rounded-full bg-orange-950/50 border border-orange-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-orange-500 text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-sm text-zinc-300 leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Combat Details */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-orange-950/50 border border-orange-900/30">
                  <Swords className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-white">Combat Analysis</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Damage/Min</span>
                  <span className="text-sm font-semibold text-white">{targetPlayerData.damagePerMinute.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Total Damage</span>
                  <span className="text-sm font-semibold text-white">{targetPlayerData.totalDamageDealtToChampions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Team Damage %</span>
                  <span className="text-sm font-semibold text-white">{(targetPlayerData.teamDamagePercentage * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Kill Participation</span>
                  <span className="text-sm font-semibold text-white">{(targetPlayerData.killParticipation * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* Objectives Details */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-900/30">
                  <Trophy className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="text-lg font-bold text-white">Objectives</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Baron Kills</span>
                  <span className="text-sm font-semibold text-white">{targetPlayerData.baronKills}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Dragon Kills</span>
                  <span className="text-sm font-semibold text-white">{targetPlayerData.dragonKills}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Turret Takedowns</span>
                  <span className="text-sm font-semibold text-white">{targetPlayerData.turretTakedowns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Objectives Stolen</span>
                  <span className="text-sm font-semibold text-white">{targetPlayerData.objectivesStolen}</span>
                </div>
              </div>
            </div>

            {/* Vision Details */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-blue-950/50 border border-blue-900/30">
                  <Eye className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-white">Vision Control</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Vision Score</span>
                  <span className="text-sm font-semibold text-white">{targetPlayerData.visionScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Vision/Min</span>
                  <span className="text-sm font-semibold text-white">{targetPlayerData.visionScorePerMinute.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Wards Placed</span>
                  <span className="text-sm font-semibold text-white">{targetPlayerData.wardsPlaced}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Wards Cleared</span>
                  <span className="text-sm font-semibold text-white">{targetPlayerData.wardsKilled}</span>
                </div>
              </div>
            </div>

            {/* Economy Details */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-green-950/50 border border-green-900/30">
                  <Coins className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-white">Economy</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Gold Earned</span>
                  <span className="text-sm font-semibold text-white">{targetPlayerData.goldEarned.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Gold/Min</span>
                  <span className="text-sm font-semibold text-white">{targetPlayerData.goldPerMinute.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Total CS</span>
                  <span className="text-sm font-semibold text-white">{targetPlayerData.totalMinionsKilled + targetPlayerData.neutralMinionsKilled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">CS/Min</span>
                  <span className="text-sm font-semibold text-white">{((targetPlayerData.totalMinionsKilled + targetPlayerData.neutralMinionsKilled) / (targetPlayerData.timePlayed / 60)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* All Players Leaderboard */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-orange-950/50 border border-orange-900/30">
            <Trophy className="h-6 w-6 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-white">Match Leaderboard</h2>
        </div>
        
        <div className="space-y-2">
          {playerScores.map((player) => {
            const participant = matchData.participants.find(p => p.puuid === player.puuid);
            if (!participant) return null;
            
            const isMVP = mvp && player.puuid === mvp.puuid;
            const isACE = ace && player.puuid === ace.puuid && !isMVP;
            
            return (
              <div
                key={player.puuid}
                className={`rounded-xl border transition-all ${
                  player.puuid === targetPuuid 
                    ? 'border-orange-500/40 bg-orange-950/20' 
                    : isMVP
                    ? 'border-orange-500/30 bg-orange-950/10'
                    : isACE
                    ? 'border-purple-500/30 bg-purple-950/10'
                    : 'border-zinc-800 bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center justify-between p-4 flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border ${
                      isMVP ? 'bg-linear-to-br from-orange-500/20 to-yellow-500/20 border-orange-500/50 text-orange-500' :
                      isACE ? 'bg-linear-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 text-purple-500' :
                      player.rank === 2 ? 'bg-zinc-800/50 border-zinc-500/50 text-zinc-300' :
                      player.rank === 3 ? 'bg-orange-900/30 border-orange-600/50 text-orange-400' :
                      'bg-zinc-900/50 border-zinc-700/50 text-zinc-400'
                    }`}>
                      #{player.rank}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-white">{player.summonerName}</p>
                        {player.puuid === targetPuuid && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            You
                          </span>
                        )}
                        {isMVP && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            MVP
                          </span>
                        )}
                        {isACE && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            ACE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-zinc-300">{player.championName}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-500">{participant.kills}/{participant.deaths}/{participant.assists}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-500">{participant.kda.toFixed(2)} KDA</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white mb-1">
                      {player.totalScore.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {getPerformanceBadges(participant, matchData.participants).slice(0, 2).map((badge, idx) => (
                        <span key={idx} className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                          badge.type === "excellent" ? "bg-green-950/50 text-green-400 border border-green-900/50" :
                          badge.type === "good" ? "bg-blue-950/50 text-blue-400 border border-blue-900/50" :
                          "bg-red-950/50 text-red-400 border border-red-900/50"
                        }`}>
                          {badge.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}