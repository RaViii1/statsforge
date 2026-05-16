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
  Sparkles,
  Sword
} from "lucide-react";
import { getChampionImage, getChampionSplashByName } from "@/lib/lol/lolfunctions";
import { MatchTimeline } from "../MatchTimeline";
import { Item } from "@/lib/items";
import { getChampionIdByName } from "@/lib/champion-data";
import SvgIcon from "@/components/SvgIcon";
import { getCombatWeights, getDragonBonusMultiplier, getEconomyWeights, getMacroScore, getMostAssistsBonus, getMostKillsBonus, getObjectiveMultiplier, getObjectiveWeights, getPerfectDragonSoulBonus, getVisionMultiplier, scoreCategoryWeights, survivalWeights, visionWeights } from "./scoringWeights";

interface MatchAnalyticsProps {
  server: string;
  matchid: string;
  targetPuuid?: string;
}

interface ParticipantData {
  puuid: string;
  profileIconId: number;
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
  multikills: number;
  timeCCingOthers: number;
  totalHealsOnTeammates: number;
  totalDamageShieldedOnTeammates: number;
  riftHeraldTakedowns: number;
  inhibitorTakedowns: number;
  longestTimeSpentLiving : number;
  perfectDragonSoulsTaken: number;
  firstTurretKilled: number;
  controlWardsPlaced: number;

}

interface MatchData {
  matchid: string;
  gameDuration: number;
  participants: ParticipantData[];
}

interface PlayerScore {
  puuid: string;
  profileIcon?: number;
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


const PremiumCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-orange-500/10 bg-linear-to-br from-zinc-900/95 to-zinc-900/80 backdrop-blur-sm shadow-2xl ${className}`}>
    <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none" />
    {children}
  </div>
);

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
    excellent: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400",
    good: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    poor: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400"
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-linear-to-br ${styles[type]} border shadow-sm transition-all duration-200 hover:scale-101`}>
      <Icon className="w-3 h-3" strokeWidth={1.5} />
      <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
    </div>
  );
};
// Performance Radar Chart Component
const PerformanceRadar = ({ playerScore, avgScores, interactive = true }: { playerScore: PlayerScore, avgScores: any, interactive?: boolean }) => {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [selectedStat, setSelectedStat] = useState<number | null>(null);
  
  const stats = [
    { label: "Combat", value: playerScore.combatScore || 0, max: 25, avg: avgScores?.combatScore || 0, color: "rgb(249, 115, 22)" },
    { label: "Objectives", value: playerScore.objectiveScore || 0, max: 20, avg: avgScores?.objectiveScore || 0, color: "rgb(168, 85, 247)" },
    { label: "Economy", value: playerScore.economyScore || 0, max: 15, avg: avgScores?.economyScore || 0, color: "rgb(34, 197, 94)" },
    { label: "Survival", value: playerScore.survivalScore || 0, max: 15, avg: avgScores?.survivalScore || 0, color: "rgb(59, 130, 246)" },
    { label: "Vision", value: playerScore.visionScore || 0, max: 15, avg: avgScores?.visionScore || 0, color: "rgb(234, 179, 8)" },
  ];

  // Increased size by 5% (357 instead of 340)
  const size = 357;
  const center = size / 2;
  const maxRadius = size / 2 - 52; // Slightly adjusted to maintain proportions
  const angleStep = (Math.PI * 2) / stats.length;

  const getPoint = (value: number, max: number, index: number) => {
    const ratio = Math.min(Math.max(value / max, 0), 1);
    const angle = index * angleStep - Math.PI / 2;
    const radius = maxRadius * ratio;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const getAvgPoint = (avg: number, max: number, index: number) => {
    const ratio = Math.min(Math.max(avg / max, 0), 1);
    const angle = index * angleStep - Math.PI / 2;
    const radius = maxRadius * ratio;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // Calculate points only if values are valid
  const playerPoints = stats.map((stat, i) => getPoint(stat.value, stat.max, i));
  const avgPoints = stats.map((stat, i) => getAvgPoint(stat.avg, stat.max, i));
  
  const playerPathData = playerPoints.length > 0 ? playerPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z' : '';
  const avgPathData = avgPoints.length > 0 ? avgPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z' : '';

  const getLabelPosition = (index: number, offset = 40) => {
    const angle = index * angleStep - Math.PI / 2;
    const radius = maxRadius + offset;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative">
        <svg 
          width={size} 
          height={size} 
          className="overflow-visible"
          viewBox={`0 0 ${size} ${size}`}
        >
          <defs>
            <linearGradient id="playerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(249, 115, 22)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(249, 115, 22)" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="avgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(113, 113, 122)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="rgb(113, 113, 122)" stopOpacity="0.05" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid circles - clearly visible */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((ratio) => (
            <circle
              key={ratio}
              cx={center}
              cy={center}
              r={maxRadius * ratio}
              fill="none"
              stroke="rgb(63, 63, 70)"
              strokeWidth="1.5"
              strokeDasharray={ratio === 1 ? "none" : "4,4"}
              opacity={ratio === 1 ? 0.6 : 0.4}
            />
          ))}

          {/* Grid lines - clearly visible */}
          {stats.map((stat, i) => {
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
                opacity="0.4"
                strokeDasharray="4,4"
              />
            );
          })}

          {/* Average player polygon */}
          {avgPathData && (
            <path
              d={avgPathData}
              fill="url(#avgGradient)"
              stroke="rgb(113, 113, 122)"
              strokeWidth="1.5"
              strokeDasharray="6,4"
              opacity="0.7"
            />
          )}

          {/* Average player points - no white borders */}
          {avgPoints.map((point, i) => (
            point.x && point.y ? (
              <circle
                key={`avg-${i}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="rgb(113, 113, 122)"
                stroke="none"
                opacity="0.6"
              />
            ) : null
          ))}

          {/* Player performance polygon */}
          {playerPathData && (
            <path
              d={playerPathData}
              fill="url(#playerGradient)"
              stroke="rgb(249, 115, 22)"
              strokeWidth="2.5"
              className="transition-all duration-500"
            />
          )}

          {/* Player data points - no white borders */}
          {playerPoints.map((point, i) => {
            const isSelected = selectedStat === i;
            const stat = stats[i];
            
            return point.x && point.y ? (
              <g
                key={i}
                onMouseEnter={() => setHoveredStat(i)}
                onMouseLeave={() => setHoveredStat(null)}
                onClick={() => setSelectedStat(isSelected ? null : i)}
                className="cursor-pointer transition-all duration-300"
              >
                {isSelected && (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="12"
                    fill="none"
                    stroke={stat.color}
                    strokeWidth="2"
                    opacity="0.5"
                  />
                )}
                
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isSelected ? 7 : 5}
                  fill={stat.color}
                  stroke="none"
                  filter="url(#glow)"
                  className="transition-all duration-200"
                />
              </g>
            ) : null;
          })}

          {/* Labels */}
          {stats.map((stat, i) => {
            const pos = getLabelPosition(i, 40);
            const isHovered = hoveredStat === i;
            const isSelected = selectedStat === i;
            
            return (
              <g
                key={`label-${i}`}
                onMouseEnter={() => setHoveredStat(i)}
                onMouseLeave={() => setHoveredStat(null)}
                onClick={() => setSelectedStat(isSelected ? null : i)}
                className="cursor-pointer transition-all duration-300"
              >
                <text
                  x={pos.x}
                  y={pos.y}
                  fill={isHovered || isSelected ? stat.color : "rgb(161, 161, 170)"}
                  fontSize={isHovered || isSelected ? "12" : "11"}
                  fontWeight={isHovered || isSelected ? "600" : "500"}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="transition-all duration-200"
                >
                  {stat.label}
                </text>
                
                {(isHovered || isSelected) && (
                  <text
                    x={pos.x}
                    y={pos.y + 18}
                    fill={stat.color}
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    opacity="0.8"
                  >
                    {stat.value.toFixed(1)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Center value indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-[10px] font-bold text-zinc-200 uppercase tracking-wider pb-2">Total</div>
          <div className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
            {stats.reduce((sum, stat) => sum + stat.value, 0).toFixed(0)}
          </div>
        </div>
      </div>

      {/* Selected stat detailed view - only appears when a stat is clicked */}
      {selectedStat !== null && stats[selectedStat] && (
        <div className="w-full mt-4 p-3 rounded-lg bg-orange-500/5 border border-orange-500/15 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[8px] text-zinc-500 uppercase tracking-wider">Selected</div>
              <div className="text-sm font-semibold text-white">{stats[selectedStat].label}</div>
            </div>
            <div className="text-center">
              <div className="text-[8px] text-zinc-500">Your Score</div>
              <div className="text-xl font-bold text-orange-400">{stats[selectedStat].value.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-[8px] text-zinc-500">Average</div>
              <div className="text-base font-semibold text-zinc-400">{stats[selectedStat].avg.toFixed(1)}</div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-zinc-500">vs Avg</div>
              <div className={`text-sm font-bold ${stats[selectedStat].value > stats[selectedStat].avg ? 'text-green-400' : 'text-red-400'}`}>
                {stats[selectedStat].value > stats[selectedStat].avg ? '+' : ''}{(stats[selectedStat].value - stats[selectedStat].avg).toFixed(1)}
              </div>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(Math.max((stats[selectedStat].value / stats[selectedStat].max) * 100, 0), 100)}%`, 
                  backgroundColor: stats[selectedStat].color 
                }}
              />
            </div>
          </div>
        </div>
      )}
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

  const formatValue = (value: number) => {
    if (label === 'KDA') return value.toFixed(2);
    if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
    return value.toFixed(0);
  };

  return (
    <div className="space-y-4">
      {sortedPlayers.map((player, index) => {
        const value = typeof player[metric] === 'number' ? player[metric] as number : 0;
        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
        const isTop3 = index <= 2;
        
        return (
          <div key={player.puuid} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {/* Rank Badge */}
                <div className={`w-5 shrink-0 ${
                  index === 0 ? 'text-orange-400' :
                  index === 1 ? 'text-zinc-400' :
                  index === 2 ? 'text-amber-600' :
                  'text-zinc-600'
                }`}>
                  {index === 0 && <Crown className="h-3 w-3" strokeWidth={1.5} />}
                  {index === 1 && <Trophy className="h-3 w-3" strokeWidth={1.5} />}
                  {index === 2 && <Award className="h-3 w-3" strokeWidth={1.5} />}
                  {index > 2 && <span className="text-[9px] font-mono font-bold">#{index + 1}</span>}
                </div>
                
                {/* Player Name */}
                <span className={`font-medium truncate text-xs ${
                  index === 0 ? 'text-white font-semibold' :
                  index === 1 ? 'text-zinc-300' :
                  index === 2 ? 'text-zinc-400' :
                  'text-zinc-500'
                }`}>
                  {player.summonerName}
                </span>
                
                {/* Champion Name */}
                <span className="text-[9px] text-zinc-600 truncate hidden sm:inline-block">
                  {player.championName}
                </span>
              </div>
              
              {/* Value */}
              <span className={`text-xs font-mono font-bold ml-2 shrink-0 ${
                index === 0 ? 'text-orange-400' :
                index === 1 ? 'text-zinc-400' :
                index === 2 ? 'text-amber-500' :
                'text-zinc-600'
              }`}>
                {formatValue(value)}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
                  index === 0 ? 'bg-linear-to-r from-orange-500/50 to-orange-400/90' :
                  index === 1 ? 'bg-linear-to-r from-zinc-500/50 to-zinc-400' :
                  index === 2 ? 'bg-linear-to-r from-amber-600/50 to-amber-500' :
                  'bg-zinc-700/50'
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
    <div className="flex flex-col gap-4">
      {/* Chart Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-orange-500/20">
        <div className="p-1 rounded-lg bg-orange-500/10">
          <PieChart className="h-3.5 w-3.5 text-orange-400" strokeWidth={1.5} />
        </div>
        <span className="text-xs font-semibold text-white uppercase tracking-wider">Damage Share</span>
      </div>

      <div className="flex items-center justify-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {/* Background circle (others damage) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgb(63, 63, 70)"
              strokeWidth="16"
            />
            {/* Player damage circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#damageGradient)"
              strokeWidth="16"
              strokeDasharray={`${playerPercentage * 2.513} ${100 * 2.513}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="damageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xl font-bold bg-linear-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              {playerPercentage.toFixed(1)}%
            </div>
            <div className="text-[9px] text-zinc-500">of team</div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-linear-to-r from-orange-500 to-orange-600 shadow-sm" />
            <div>
              <div className="text-[9px] text-zinc-500">Your Damage</div>
              <div className="text-xs font-bold text-white">{(totalDamage / 1000).toFixed(1)}k</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div>
              <div className="text-[9px] text-zinc-500">Team Total</div>
              <div className="text-xs font-bold text-white">{(teamDamage / 1000).toFixed(1)}k</div>
            </div>
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
    <div className="flex flex-col gap-4">
      {/* Chart Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-orange-500/20">
        <div className="p-1 rounded-lg bg-blue-500/10">
          <Shield className="h-3.5 w-3.5 text-blue-400" strokeWidth={1.5} />
        </div>
        <span className="text-xs font-semibold text-white uppercase tracking-wider">Damage Taken Share</span>
      </div>

      <div className="flex items-center justify-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {/* Background circle (others damage) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgb(63, 63, 70)"
              strokeWidth="16"
            />
            {/* Player damage circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#damageTakenGradient)"
              strokeWidth="16"
              strokeDasharray={`${playerPercentage * 2.513} ${100 * 2.513}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="damageTakenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xl font-bold bg-linear-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
              {playerPercentage.toFixed(1)}%
            </div>
            <div className="text-[9px] text-zinc-500">of team</div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-linear-to-r from-blue-500 to-blue-600 shadow-sm" />
            <div>
              <div className="text-[9px] text-zinc-500">Your Damage Taken</div>
              <div className="text-xs font-bold text-white">{(totalDamageTaken / 1000).toFixed(1)}k</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div>
              <div className="text-[9px] text-zinc-500">Team Total Taken</div>
              <div className="text-xs font-bold text-white">{(teamDamageTaken / 1000).toFixed(1)}k</div>
            </div>
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
    <div className="flex flex-col gap-4">
      {/* Chart Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-orange-500/20">
        <div className="p-1 rounded-lg bg-green-500/10">
          <Heart className="h-3.5 w-3.5 text-green-400" strokeWidth={1.5} />
        </div>
        <span className="text-xs font-semibold text-white uppercase tracking-wider">Healing Share</span>
      </div>

      <div className="flex items-center justify-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {/* Background circle (others healing) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgb(63, 63, 70)"
              strokeWidth="16"
            />
            {/* Player healing circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#healingGradient)"
              strokeWidth="16"
              strokeDasharray={`${playerPercentage * 2.513} ${100 * 2.513}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="healingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xl font-bold bg-linear-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
              {playerPercentage.toFixed(1)}%
            </div>
            <div className="text-[9px] text-zinc-500">of team</div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-linear-to-r from-green-500 to-green-600 shadow-sm" />
            <div>
              <div className="text-[9px] text-zinc-500">Your Healing</div>
              <div className="text-xs font-bold text-white">{(totalHeal / 1000).toFixed(1)}k</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div>
              <div className="text-[9px] text-zinc-500">Team Total Healed</div>
              <div className="text-xs font-bold text-white">{(teamDamageHealed / 1000).toFixed(1)}k</div>
            </div>
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
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-950/30",
      borderColor: "border-emerald-900/50",
      dropShadow: "group-hover:drop-shadow-[0_0_15px_rgba(20,184,166,0.8)]" // green-500
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
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
            <circle cx="50" cy="50" r="40" fill="currentColor" className={obj.color.includes('green') ? 'text-green-500' : obj.color.includes('purple') ? 'text-purple-500' : obj.color.includes('blue') ? 'text-blue-500' : 'text-yellow-500'} />
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
      <div className="rounded-xl p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <Sword className="h-6 w-6 text-orange-400/50" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">No Multikills</p>
            <p className="text-xs text-zinc-500 mt-0.5">No consecutive champion eliminations recorded in this match</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 ">
      {/* Header with Biggest Multikill Badge */}
      <div className="flex items-center justify-between ">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 shadow-lg">
            <Sword className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-white">Multikill Streak</h3>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">Consecutive champion eliminations</p>
          </div>
        </div>
        
        {biggestMultikill && (
          <div className="relative group ">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/40 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-semibold text-zinc-200 uppercase tracking-wider">Best Streak</span>
                  <span className="text-sm font-bold text-orange-400">{biggestMultikill.name}</span>
                </div>
                <div className="w-px h-8 bg-orange-500/30" />
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  x{biggestMultikill.count}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Multikill Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {multikills.map((mk, idx) => {
          const isActive = mk.value > 0;
          
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                isActive 
                  ? 'border-orange-500/30 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 hover:scale-105 hover:border-orange-500/60 cursor-pointer' 
                  : 'border-zinc-800/50 bg-zinc-900/30 opacity-40'
              }`}
            >
              {/* Glow effect on active */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              
              <div className="p-4 text-center">
                {/* Kill streak label with icon */}
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  {mk.label === 'Double Kill' && <Sword className="w-3 h-3 text-orange-400" strokeWidth={2} />}
                  {mk.label === 'Triple Kill' && <Sword className="w-3 h-3 text-orange-400" strokeWidth={2} />}
                  {mk.label === 'Quadra Kill' && <Sword className="w-3 h-3 text-orange-400" strokeWidth={2} />}
                  {mk.label === 'Penta Kill' && <Crown className="w-3 h-3 text-orange-400" strokeWidth={2} />}
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                    isActive ? 'text-zinc-300' : 'text-zinc-600'
                  }`}>
                    {mk.label}
                  </span>
                </div>
                
                {/* Kill count */}
                <div className={`text-3xl font-bold tracking-tight ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent' 
                    : 'text-zinc-700'
                }`}>
                  x{mk.value}
                </div>
                
                {/* Decorative line */}
                {isActive && (
                  <div className="mt-2 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                )}
              </div>
              
              {/* Animated pulse for active */}
              {isActive && mk.value === biggestMultikill?.count && (
                <div className="absolute inset-0 border-2 border-orange-500/30 rounded-xl animate-pulse pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Combat Efficiency Analysis Component
const CombatEfficiencyAnalysis = ({ participant, allParticipants }: { participant: ParticipantData, allParticipants: ParticipantData[] }) => {
  const gameDurationMinutes = participant.timePlayed / 60;
  
  // Calculate efficiency metrics
  const damagePerGold = participant.totalDamageDealtToChampions / participant.goldEarned;
  const damageEfficiency = (participant.totalDamageDealtToChampions / participant.totalDamageTaken) * 100;
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
      color: damagePerGold > avgDamagePerGold ? "from-orange-400 to-orange-500" : "from-white to-zinc-600",
      description: "Damage dealt per gold spent"
    },
    {
      label: "Trade Efficiency",
      value: `${damageEfficiency.toFixed(0)}%`,
      subtitle: damageEfficiency > 100 ? "Positive trades" : "Negative trades",
      icon: Crosshair,
      color: damageEfficiency > 100 ? "from-green-500 to-emerald-500" : "from-red-500 to-rose-500",
      description: "Damage dealt vs damage taken ratio"
    },
    {
      label: "Gold Efficiency",
      value: goldEfficiency.toFixed(0),
      subtitle: `${participant.goldPerMinute.toFixed(0)}/min`,
      icon: Coins,
      color: participant.goldPerMinute > avgGoldPerMin ? "from-amber-400 to-yellow-500" : "from-zinc-500 to-zinc-600",
      description: "Gold earned per death (higher is better)"
    },
    {
      label: "Survival Rate",
      value: `${survivalRate.toFixed(1)}%`,
      subtitle: survivalRate > 85 ? "Excellent" : survivalRate > 70 ? "Good" : "Needs work",
      icon: Shield,
      color: survivalRate > 85 ? "from-green-400 to-emerald-500" : survivalRate > 70 ? "from-yellow-500 to-amber-500" : "from-red-500 to-rose-500",
      description: "Time alive vs time dead"
    }
  ];

  return (
    <div className="rounded-2xl border border-orange-500/10 bg-linear-to-br from-zinc-900/95 to-zinc-900/80 backdrop-blur-sm shadow-2xl overflow-hidden">
      {/* Decorative gradient line at top */}
      <div className="h-0.5 w-full bg-linear-to-r from-transparent via-orange-500/50 to-transparent" />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 shadow-lg">
            <Activity className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-white">Combat Efficiency</h3>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">Advanced performance metrics and analysis</p>
          </div>
        </div>

        {/* Efficiency Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {efficiencyMetrics.map((metric, idx) => (
            <div 
              key={idx} 
              className="group relative rounded-xl border border-orange-500/10 bg-linear-to-br from-zinc-800/30 to-zinc-900/30 p-4 hover:border-orange-500/30 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-linear-to-br from-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider">{metric.label}</div>
                  <metric.icon className="h-4 w-4 text-orange-400/60" strokeWidth={1.5} />
                </div>
                <div className={`text-2xl font-bold bg-linear-to-r ${metric.color} bg-clip-text text-transparent mb-1`}>
                  {metric.value}
                </div>
                <div className="text-[10px] text-zinc-500 mb-2">{metric.subtitle}</div>
                <div className="text-[9px] text-zinc-600 leading-relaxed border-t border-orange-500/10 pt-2 mt-1">
                  {metric.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Damage Analysis Card */}
          <div className="rounded-xl border border-orange-500/10 bg-linear-to-br from-zinc-800/30 to-zinc-900/30 p-5">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-orange-500/20">
              <div className="p-1.5 rounded-lg bg-orange-500/10">
                <Flame className="h-4 w-4 text-orange-400" strokeWidth={1.5} />
              </div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Damage Analysis</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500">Damage per Death</span>
                <span className="text-xs font-bold text-white">{damagePerDeath.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500">Damage per Minute</span>
                <span className="text-xs font-bold text-white">{participant.damagePerMinute.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500">Mitigated Damage</span>
                <span className="text-xs font-bold text-white">{(participant.damageSelfMitigated / 1000).toFixed(1)}k</span>
              </div>
              <div className="pt-2 border-t border-orange-500/10">
                <div className="text-[9px] text-zinc-600 mb-1">Combat Rating</div>
                <div className="flex items-center gap-2">
                  {damagePerDeath > 10000 ? (
                    <>
                      <TrendingUpIcon className="h-3.5 w-3.5 text-green-400" strokeWidth={1.5} />
                      <span className="text-[10px] font-semibold text-green-400">Excellent Impact</span>
                    </>
                  ) : damagePerDeath > 5000 ? (
                    <>
                      <TrendingUp className="h-3.5 w-3.5 text-yellow-400" strokeWidth={1.5} />
                      <span className="text-[10px] font-semibold text-yellow-400">Good Impact</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3.5 w-3.5 text-red-400" strokeWidth={1.5} />
                      <span className="text-[10px] font-semibold text-red-400">Low Impact</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Survivability Analysis Card */}
          <div className="rounded-xl border border-orange-500/10 bg-linear-to-br from-zinc-800/30 to-zinc-900/30 p-5">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-orange-500/20">
              <div className="p-1.5 rounded-lg bg-blue-500/10">
                <Shield className="h-4 w-4 text-blue-400" strokeWidth={1.5} />
              </div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Survivability</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500">Time Alive</span>
                <span className="text-xs font-bold text-white">{((gameDurationMinutes * 60 - participant.timeSpentDead) / 60).toFixed(1)} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500">Time Dead</span>
                <span className="text-xs font-bold text-white">{(participant.timeSpentDead / 60).toFixed(1)} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500">Death Timer Impact</span>
                <span className={`text-xs font-bold ${participant.timeSpentDead > 180 ? 'text-red-400' : 'text-green-400'}`}>
                  {participant.timeSpentDead > 180 ? 'High' : 'Low'}
                </span>
              </div>
              <div className="pt-2 border-t border-orange-500/10">
                <div className="text-[9px] text-zinc-600 mb-1">Survivability Rating</div>
                <div className="flex items-center gap-2">
                  {survivalRate > 85 ? (
                    <>
                      <Star className="h-3.5 w-3.5 text-green-400" strokeWidth={1.5} />
                      <span className="text-[10px] font-semibold text-green-400">Excellent Positioning</span>
                    </>
                  ) : survivalRate > 70 ? (
                    <>
                      <Award className="h-3.5 w-3.5 text-yellow-400" strokeWidth={1.5} />
                      <span className="text-[10px] font-semibold text-yellow-400">Good Positioning</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 text-red-400" strokeWidth={1.5} />
                      <span className="text-[10px] font-semibold text-red-400">Risky Positioning</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Efficiency Insights */}
        <div className="rounded-xl border border-orange-500/10 bg-linear-to-br from-zinc-800/30 to-zinc-900/30 p-5">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-orange-500/20">
            <div className="p-1.5 rounded-lg bg-orange-500/10">
              <Brain className="h-4 w-4 text-orange-400" strokeWidth={1.5} />
            </div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Efficiency Insights</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900/50 border border-orange-500/10">
              <div className="w-1 h-4 rounded-full bg-orange-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                {damagePerGold > avgDamagePerGold 
                  ? "You're converting gold into damage efficiently. Keep building high-impact items."
                  : "Consider building more damage-focused items to improve your combat effectiveness."}
              </p>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900/50 border border-orange-500/10">
              <div className="w-1 h-4 rounded-full bg-orange-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                {damageEfficiency > 100
                  ? "Great trading! You're dealing more damage than you take in fights."
                  : "Focus on positioning to take less damage while maintaining your damage output."}
              </p>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900/50 border border-orange-500/10">
              <div className="w-1 h-4 rounded-full bg-orange-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                {participant.deaths <= 3
                  ? "Excellent death control! Your cautious playstyle is paying off."
                  : `With ${participant.deaths} deaths, focus on map awareness and safer positioning.`}
              </p>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900/50 border border-orange-500/10">
              <div className="w-1 h-4 rounded-full bg-orange-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-zinc-300 leading-relaxed">
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
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetchMatchData();
    fetchItemsData();
  }, [server, matchid]);

  const fetchItemsData = async () => {
    try {
      const response = await fetch(`/api/lol/lol-items`);
      if (!response.ok) {
        throw new Error('Failed to fetch items data');
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch items data:', err);
      setItems([]); // Set empty array as fallback
    }
  };

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
  
  // Get max values for normalization
  const maxKDA = Math.max(...participants.map(p => p.kda));
  const maxDPM = Math.max(...participants.map(p => p.damagePerMinute));
  const maxGoldPerMin = Math.max(...participants.map(p => p.goldPerMinute));
  const maxVisionScore = Math.max(...participants.map(p => p.visionScore));
  const maxObjectives = Math.max(...participants.map(p => 
    p.baronKills + p.dragonKills + p.turretTakedowns + (p.riftHeraldTakedowns || 0)
  ));
  const maxCC = Math.max(...participants.map(p => p.timeCCingOthers || 0));
  const maxHealing = Math.max(...participants.map(p => (p.totalHealsOnTeammates || 0) + (p.totalDamageShieldedOnTeammates || 0)));
  const maxMultikills = Math.max(...participants.map(p => p.multikills || 0));
  const maxLongestLiving = Math.max(...participants.map(p => p.longestTimeSpentLiving || 0));
  const maxInhibitors = Math.max(...participants.map(p => p.inhibitorTakedowns || 0));
  const maxControlWards = Math.max(...participants.map(p => p.controlWardsPlaced || 0));
  
  // Get highest kills and assists in the game
  const highestKills = Math.max(...participants.map(p => p.kills));
  const highestAssists = Math.max(...participants.map(p => p.assists));
  
  const scores = participants.map(p => {
    const position = p.teamPosition;
    
    // Check if player has most kills or assists
    const hasMostKills = p.kills === highestKills && highestKills > 0;
    const hasMostAssists = p.assists === highestAssists && highestAssists > 0;
    
    // Get weights from config
    const combatWeights = getCombatWeights(position);
    const economyWeights = getEconomyWeights(position);
    
    // Get bonus points
    const killsBonus = getMostKillsBonus(position, hasMostKills);
    const assistsBonus = getMostAssistsBonus(position, hasMostAssists);
    
    // COMBAT SCORE (25%) - Now includes kill/assist bonuses as direct points
    let combatScore = (
      ((p.killParticipation * 100)) * combatWeights.killParticipation +
      normalize(p.kda, maxKDA) * combatWeights.kda +
      normalize(p.damagePerMinute, maxDPM) * combatWeights.damage +
      (p.teamDamagePercentage * 100) * combatWeights.teamDamage +
      normalize(p.timeCCingOthers || 0, maxCC) * combatWeights.cc +
      normalize((p.totalHealsOnTeammates || 0) + (p.totalDamageShieldedOnTeammates || 0), maxHealing) * combatWeights.healingShielding +
      normalize(p.multikills || 0, maxMultikills) * combatWeights.multikills
    ) * scoreCategoryWeights.combat;
    
    // Add direct bonus points for most kills/assists (these are flat additions, not percentage-based)
    combatScore += killsBonus;
    combatScore += assistsBonus;

    // OBJECTIVE SCORE (25%)
    const totalObjectives = (p.baronKills || 0) + (p.dragonKills || 0) + (p.turretTakedowns || 0) + (p.riftHeraldTakedowns || 0);

    // Get role-specific objective weights
    const objectiveWeights = getObjectiveWeights(position);
    const objectiveMultiplier = getObjectiveMultiplier(position);
    const dragonBonusMultiplier = getDragonBonusMultiplier(position);

    // Calculate dragon score with bonus for junglers
    const dragonScore = normalize(p.dragonKills || 0, 6) * objectiveWeights.dragonKills * dragonBonusMultiplier;

    // Calculate base objective score (without perfect dragon soul)
    let objectiveScore = (
      normalize(totalObjectives, maxObjectives) * objectiveWeights.totalObjectives +
      normalize(p.objectivesStolen || 0, 5) * objectiveWeights.objectivesStolen +
      normalize(p.baronKills || 0, 3) * objectiveWeights.baronKills +
      dragonScore +
      normalize(p.riftHeraldTakedowns || 0, 1) * objectiveWeights.riftHerald +
      normalize(p.turretTakedowns || 0, 10) * objectiveWeights.turretTakedowns +
      normalize(p.inhibitorTakedowns || 0, maxInhibitors) * objectiveWeights.inhibitors +
      ((p.firstTurretKilled || 0) * 10) * objectiveWeights.firstTurret
    ) * scoreCategoryWeights.objectives * objectiveMultiplier;

    // Add perfect dragon soul as PURE BONUS
    const dragonSoulBonus = getPerfectDragonSoulBonus(position, p.perfectDragonSoulsTaken === 1);
    objectiveScore += dragonSoulBonus;

    // ECONOMY SCORE (15%)
    const economyScore = (
      normalize(p.goldPerMinute, maxGoldPerMin) * economyWeights.goldPerMin +
      normalize(p.totalMinionsKilled + p.neutralMinionsKilled, 400) * economyWeights.cs
    ) * scoreCategoryWeights.economy;
    
    // SURVIVAL SCORE (15%)
    const deathPenalty = Math.max(0, 100 - (p.deaths * 10));
    const survivalScore = (
      deathPenalty * survivalWeights.deathPenalty +
      normalize(p.damageSelfMitigated, 40000) * survivalWeights.damageMitigated +
      normalize(100 - (p.timeSpentDead / gameDurationMinutes), 100) * survivalWeights.timeAlive +
      normalize(p.longestTimeSpentLiving || 0, maxLongestLiving) * survivalWeights.longestLiving
    ) * scoreCategoryWeights.survival;
    
    // VISION SCORE (10%)
    const visionPercent = normalize(p.visionScore, maxVisionScore);
    const visionMultiplier = getVisionMultiplier(position, visionPercent);
    
    const visionScore = (
      normalize(p.visionScore, maxVisionScore) * visionWeights.visionScore +
      normalize(p.wardsPlaced, 30) * visionWeights.wardsPlaced +
      normalize(p.wardsKilled, 25) * visionWeights.wardsKilled +
      normalize(p.controlWardsPlaced || 0, maxControlWards) * visionWeights.controlWards
    ) * scoreCategoryWeights.vision * visionMultiplier;
    
    // MACRO SCORE (10%)
    const macroScore = getMacroScore(p.win, p.perfectDragonSoulsTaken, p.firstTurretKilled);
    
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


const calculateMVPAndACE = (scores: PlayerScore[], participants: ParticipantData[]) => {
  if (scores.length === 0) return { mvp: null, ace: null };
  
  const weightedScores = scores.map(score => {
    const participant = participants.find(p => p.puuid === score.puuid);
    if (!participant) return { ...score, weightedTotal: score.totalScore };
    
    let weightMultiplier = 1.0;
    const position = participant.teamPosition;
    const isSupport = position === "UTILITY" || position === "SUPPORT";
    const isJungle = position === "JUNGLE";
    
    // HIGHEST PRIORITY: Kill Participation
    if (participant.killParticipation > 0.75) {
      weightMultiplier *= 1.20; // +20% for 75%+ KP
    } else if (participant.killParticipation > 0.6) {
      weightMultiplier *= 1.10; // +10% for 60%+ KP
    } else if (participant.killParticipation < 0.4) {
      weightMultiplier *= 0.85; // -15% for low KP
    }
    
    // Objective priority for junglers
    if (isJungle) {
      const totalObjectives = (participant.baronKills || 0) + (participant.dragonKills || 0) + (participant.riftHeraldTakedowns || 0);
      if (totalObjectives > 6) {
        weightMultiplier *= 1.20;
      } else if (totalObjectives > 3) {
        weightMultiplier *= 1.10;
      } else {
        weightMultiplier *= 0.85; // Penalty for junglers with poor objective control
      }
    }
    
    // Support penalties for low KP
    if (isSupport) {
      if (participant.killParticipation < 0.5) {
        weightMultiplier *= 0.70; // Heavy penalty for supports with low KP
      }
      
      // Vision bonus for supports
      const avgVision = scores.reduce((sum, s) => {
        const p = participants.find(p2 => p2.puuid === s.puuid);
        return sum + (p?.visionScore || 0);
      }, 0) / scores.length;
      
      if (participant.visionScore > avgVision * 1.5) {
        weightMultiplier *= 1.10;
      }
    }
    
    // Universal bonuses
    if (participant.deaths === 0 && participant.kills > 0) {
      weightMultiplier *= 1.10;
    }
    
    if (participant.pentaKills > 0) {
      weightMultiplier *= 1.08;
    }
    
    if (participant.perfectDragonSoulsTaken) {
      weightMultiplier *= 1.10;
    }
    
    if (participant.firstTurretKilled) {
      weightMultiplier *= 1.05;
    }
    
    if (participant.deaths > 8) {
      weightMultiplier *= 0.80;
    }
    
    return { ...score, weightedTotal: score.totalScore * weightMultiplier };
  });
  
  weightedScores.sort((a, b) => b.weightedTotal - a.weightedTotal);
  const mvp = weightedScores[0];
  
  const losingPlayers = weightedScores.filter(s => !s.win);
  const ace = losingPlayers.length > 0 ? losingPlayers.reduce((prev, current) => 
    current.weightedTotal > prev.weightedTotal ? current : prev
  ) : null;
  
  return { mvp, ace };
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
    if (csPerMin >= 8.5) {
      badges.push({ label: "CS Master", type: "excellent", icon: Target });
    } else if (csPerMin < 4 && !["UTILITY", "SUPPORT"].includes(participant.teamPosition)) {
      badges.push({ label: "Low CS", type: "poor", icon: TrendingDown });
    }

    if (participant.deaths >= 10) {
      badges.push({ label: "Too Many Deaths", type: "poor", icon: Skull });
    } else if (participant.deaths <= 2 && participant.kda > 3) {
      badges.push({ label: "Great Survival", type: "excellent", icon: Shield });
    }

    const totalObjectives = participant.baronKills + participant.dragonKills + participant.turretTakedowns;
    if (totalObjectives >= 5) {
      badges.push({ label: "Objective Focused", type: "excellent", icon: Trophy });
    }

    const performanceScore = (participant.kills * 3 + participant.assists - participant.deaths * 2) / gameDurationMinutes;
    if (performanceScore > 1.5) {
      badges.push({ label: "Carry Performance", type: "excellent", icon: Crown });
    }

    const DragonStealer = participant.objectivesStolen || 0;
    if (DragonStealer >= 1) {
      badges.push({ label: "Dragon Stealer", type: "excellent", icon: Trophy });
    }

    const DpsThreat = participant.totalDamageDealtToChampions / gameDurationMinutes;
    if (DpsThreat >= 850) {
      badges.push({ label: "Dps Threat", type: "excellent", icon: Trophy });
    }

    const FirstTurretDestroyer = participant.firstTurretKilled / gameDurationMinutes;
    if (FirstTurretDestroyer >= 1) {
      badges.push({ label: "First Turret Destroyer", type: "excellent", icon: Trophy });
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
<div className="rounded-2xl border border-orange-500/10 bg-linear-to-br from-zinc-900/95 to-zinc-900/80 backdrop-blur-sm shadow-2xl overflow-hidden relative">
  {/* Background Champion Splash */}
  <div 
    className="absolute inset-0 bg-center bg-cover opacity-40 pointer-events-none"
    style={{backgroundImage: `url(${getChampionSplashByName(mvp.championName.toLowerCase())})`}}
  />
  
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-linear-to-br from-zinc-900/95 via-zinc-900/85 to-zinc-900/90 pointer-events-none" />
  
  <div className="relative z-10 p-6">
    {/* Header Section */}
    <div className="flex items-start justify-between mb-6 pb-5 border-b border-orange-500/10">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 shadow-lg">
          <Activity className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white">Match Overview</h2>
          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{matchid}</p>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Duration</div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white tabular-nums">{gameDurationMinutes}</span>
          <span className="text-sm text-zinc-500">:</span>
          <span className="text-2xl font-bold text-white tabular-nums">{gameDurationSeconds.toString().padStart(2, '0')}</span>
          <span className="text-xs text-zinc-600 ml-1">min</span>
        </div>
      </div>
    </div>

    {/* MVP Display - Premium Redesign */}
    <div className="relative rounded-xl border border-orange-500/20 overflow-hidden bg-linear-to-br from-orange-950/20 to-transparent">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-orange-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-500/5 to-transparent rounded-full blur-2xl" />
      
      {/* MVP Content */}
      <div className="relative p-6">
        <div className="flex items-center justify-between flex-wrap gap-6">
          {/* Left Section - MVP Info */}
          <div className="flex items-center gap-5">
            {/* MVP Crown Icon with Glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 rounded-xl blur-xl opacity-40 animate-pulse" />
              <div className="relative p-3 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 shadow-lg">
                <Crown className="h-7 w-7 text-white drop-shadow-md" strokeWidth={1.5} />
              </div>
            </div>
            
            {/* MVP Details */}
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">Match MVP</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{mvp.summonerName}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-orange-400">{mvp.championName}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-wide">{mvp.teamPosition}</span>
              </div>
            </div>
          </div>
          
          {/* Right Section - Performance Score */}
          <div className="text-right">
            <div className="px-5 py-3 rounded-xl ">
              <div className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Performance Score</div>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-4xl font-black bg-linear-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  {mvp.totalScore.toFixed(2)}
                </span>
                <span className="text-xs text-zinc-600">/ 100</span>
              </div>
              {/* Mini progress bar */}
              <div className="mt-2 w-full h-0.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-orange-500 to-yellow-500 rounded-full"
                  style={{ width: `${(mvp.totalScore / 100) * 100}%` }}
                />
              </div>
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
        <div className="rounded-xl border border-orange-500/10 bg-linear-to-br from-zinc-900/95 to-zinc-900/80 backdrop-blur-sm shadow-2xl overflow-hidden">
  <div className="p-6">
    {/* Header */}
    <div className="flex items-start gap-3 mb-6">
      <div className="p-2.5 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 shadow-lg">
        <Star className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-white">Performance Highlights</h3>
        <p className="text-xs text-zinc-500 font-medium mt-0.5">Key metrics and achievements</p>
      </div>
    </div>
    
    {/* Performance Badges */}
    <div className="flex flex-wrap gap-2 mb-6">
      {getPerformanceBadges(targetPlayerData, matchData.participants).map((badge, idx) => (
        <PerformanceBadge key={idx} badge={badge} />
      ))}
    </div>
    
    {/* Key Metrics Grid */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* KDA Card */}
      <div className="group relative p-4 rounded-xl bg-linear-to-br from-zinc-800/30 to-zinc-900/30 border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:scale-105 cursor-pointer">
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
        <div className="relative">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">KDA Ratio</div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-bold text-white">{targetPlayerData.kills}</span>
            <span className="text-lg text-zinc-600">/</span>
            <span className="text-2xl font-semibold text-red-400">{targetPlayerData.deaths}</span>
            <span className="text-lg text-zinc-600">/</span>
            <span className="text-2xl font-semibold text-blue-400">{targetPlayerData.assists}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-bold text-orange-400">{targetPlayerData.kda.toFixed(2)}</div>
            <div className="text-[10px] text-zinc-500">KDA</div>
          </div>
          <div className="mt-2 h-px bg-linear-to-r from-orange-500/20 to-transparent" />
        </div>
      </div>
      
      {/* Damage Card */}
      <div className="group relative p-4 rounded-xl bg-linear-to-br from-zinc-800/30 to-zinc-900/30 border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:scale-105 cursor-pointer">
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
        <div className="relative">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Damage Dealt</div>
          <div className="text-3xl font-bold text-white mb-1">
            {(targetPlayerData.totalDamageDealtToChampions / 1000).toFixed(1)}k
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-orange-400 font-semibold">{(targetPlayerData.teamDamagePercentage * 100).toFixed(1)}%</span>
            <span className="text-zinc-500">of team damage</span>
          </div>
          <div className="mt-3">
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-orange-500 to-red-500 rounded-full"
                style={{ width: `${targetPlayerData.teamDamagePercentage * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Gold Card */}
      <div className="group relative p-4 rounded-xl bg-linear-to-br from-zinc-800/30 to-zinc-900/30 border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:scale-105 cursor-pointer">
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
        <div className="relative">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Gold Earned</div>
          <div className="text-3xl font-bold text-white mb-1">
            {(targetPlayerData.goldEarned / 1000).toFixed(1)}k
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <SvgIcon size={10} type="gold" className="text-amber-400" />
              <span className="text-orange-400 font-semibold">{targetPlayerData.goldPerMinute.toFixed(0)}</span>
              <span className="text-zinc-500">/min</span>
            </div>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">CS: {targetPlayerData.totalMinionsKilled + targetPlayerData.neutralMinionsKilled}</span>
          </div>
          <div className="mt-2 h-px bg-linear-to-r from-amber-500/20 to-transparent" />
        </div>
      </div>
      
      {/* Vision Card */}
      <div className="group relative p-4 rounded-xl bg-linear-to-br from-zinc-800/30 to-zinc-900/30 border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:scale-105 cursor-pointer">
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
        <div className="relative">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Vision Score</div>
          <div className="text-3xl font-bold text-white mb-1">{targetPlayerData.visionScore}</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-blue-400 font-semibold">{targetPlayerData.visionScorePerMinute.toFixed(1)}</span>
            <span className="text-zinc-500">per minute</span>
          </div>
          <div className="mt-2 h-px bg-linear-to-r from-blue-500/20 to-transparent" />
        </div>
      </div>
    </div>
    
            <div className="border-t border-orange-500/10 pt-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Objective Contributions</h4>
              </div>
              <ObjectivesDetail participant={targetPlayerData} />
            </div>
          </div>
        </div>
          <PremiumCard className="mb-6">
          <div className="rounded-xl border border-orange-500/10 bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 p-6">
            <MultikillsDisplay participant={targetPlayerData} />
          </div>
          </PremiumCard>

             <MatchTimeline 
               server={server} 
               matchId={matchid} 
               puuid={targetPlayerData.puuid}
               items={items}
             />

          
          <div className="rounded-2xl border border-orange-500/10 bg-linear-to-br from-zinc-900/95 to-zinc-900/80 backdrop-blur-sm shadow-2xl overflow-hidden">
            <div className="h-0.5 w-full bg-linear-to-r from-transparent via-orange-500/50 to-transparent" />
            <div className="p-6">
              
              <div className="flex items-start gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 shadow-lg">
                  <Activity className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-white">Performance Analysis</h2>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">Complete breakdown of your match performance</p>
                </div>
              </div>

             
              <div className="relative mb-8 p-4 rounded-xl bg-linear-to-br from-zinc-800/30 to-zinc-900/30 border border-orange-500/10">
                <PerformanceRadar playerScore={targetPlayer} avgScores={avgScores} />
              </div>


              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="group">
                  <CircularProgress
                    value={targetPlayer.combatScore}
                    maxValue={25}
                    label="Combat"
                    color="orange"
                  />
                </div>
                <div className="group">
                  <CircularProgress
                    value={targetPlayer.objectiveScore}
                    maxValue={20}
                    label="Objectives"
                    color="purple"
                  />
                </div>
                <div className="group">
                  <CircularProgress
                    value={targetPlayer.economyScore}
                    maxValue={15}
                    label="Economy"
                    color="green"
                  />
                </div>
                <div className="group">
                  <CircularProgress
                    value={targetPlayer.survivalScore}
                    maxValue={15}
                    label="Survival"
                    color="blue"
                  />
                </div>
                <div className="group">
                  <CircularProgress
                    value={targetPlayer.visionScore}
                    maxValue={15}
                    label="Vision"
                    color="yellow"
                  />
                </div>
              </div>


              <div className="border-t border-orange-500/10 pt-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-linear-to-br from-orange-500/15 to-orange-600/5 border border-orange-500/15">
                    <BarChart3 className="h-4 w-4 text-orange-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Score Breakdown</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Key metrics and improvement areas</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Combat Score Card */}
                  <div className="group relative rounded-xl border border-orange-500/10 bg-linear-to-br from-zinc-800/30 to-zinc-900/30 p-4 hover:border-orange-500/30 transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-linear-to-br from-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-orange-500/20">
                        <div className="p-1.5 rounded-lg bg-orange-500/10">
                          <Swords className="h-3.5 w-3.5 text-orange-400" strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Combat Score</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: "Kill Participation", value: `${(targetPlayerData.killParticipation * 100).toFixed(0)}%`, highlight: targetPlayerData.killParticipation > 0.6 },
                          { label: "Kills", value: `${targetPlayerData.kills || 0}`, highlight: (targetPlayerData.kills || 0) > 10 },
                          { label: "Assists", value: `${targetPlayerData.assists || 0}`, highlight: (targetPlayerData.assists || 0) > 10 },
                          { label: "KDA Ratio", value: `${targetPlayerData.kda.toFixed(2)}`, highlight: targetPlayerData.kda > 3 },
                          { label: "Damage/Min", value: `${targetPlayerData.damagePerMinute.toFixed(0)}`, highlight: targetPlayerData.damagePerMinute > 600 },
                          { label: "Team Damage %", value: `${(targetPlayerData.teamDamagePercentage * 100).toFixed(1)}%`, highlight: (targetPlayerData.teamDamagePercentage * 100) > 25 },
                          { label: "CC Score", value: `${(targetPlayerData.timeCCingOthers || 0).toFixed(1)}s`, highlight: (targetPlayerData.timeCCingOthers || 0) > 10 },
                          { label: "Heal/Shield", value: `${((targetPlayerData.totalHealsOnTeammates || 0) + (targetPlayerData.totalDamageShieldedOnTeammates || 0) / 1000).toFixed(1)}k`, highlight: ((targetPlayerData.totalHealsOnTeammates || 0) + (targetPlayerData.totalDamageShieldedOnTeammates || 0)) > 5000 },
                          { label: "Multikills", value: `${targetPlayerData.multikills || 0}`, highlight: (targetPlayerData.multikills || 0) > 0 }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between group/item">
                            <span className="text-[10px] text-zinc-500">{item.label}</span>
                            <span className={`text-[11px] font-semibold transition-all duration-200 ${item.highlight ? 'text-green-400 group-hover/item:text-green-300' : 'text-white'}`}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Objective Score Card */}
                  <div className="group relative rounded-xl border border-purple-500/10 bg-linear-to-br from-zinc-800/30 to-zinc-900/30 p-4 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-500/20">
                        <div className="p-1.5 rounded-lg bg-purple-500/10">
                          <Trophy className="h-3.5 w-3.5 text-purple-400" strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Objective Score</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: "Total Objectives", value: `${(targetPlayerData.baronKills || 0) + (targetPlayerData.dragonKills || 0) + (targetPlayerData.turretTakedowns || 0) + (targetPlayerData.riftHeraldTakedowns || 0)}`, highlight: true },
                          { label: "Baron Kills", value: `${targetPlayerData.baronKills || 0}`, highlight: (targetPlayerData.baronKills || 0) > 0 },
                          { label: "Dragon Kills", value: `${targetPlayerData.dragonKills || 0}`, highlight: (targetPlayerData.dragonKills || 0) > 1 },
                          { label: "Rift Herald", value: `${targetPlayerData.riftHeraldTakedowns || 0}`, highlight: (targetPlayerData.riftHeraldTakedowns || 0) > 0 },
                          { label: "Turret Takedowns", value: `${targetPlayerData.turretTakedowns || 0}`, highlight: (targetPlayerData.turretTakedowns || 0) > 2 },
                          { label: "Inhibitors", value: `${targetPlayerData.inhibitorTakedowns || 0}`, highlight: (targetPlayerData.inhibitorTakedowns || 0) > 0 },
                          { label: "Objectives Stolen", value: `${targetPlayerData.objectivesStolen || 0}`, highlight: (targetPlayerData.objectivesStolen || 0) > 0 },
                          { label: "First Turret", value: `${targetPlayerData.firstTurretKilled ? 'Yes' : 'No'}`, highlight: targetPlayerData.firstTurretKilled === 1 },
                          { label: "Perfect Dragon Soul", value: `${targetPlayerData.perfectDragonSoulsTaken ? 'Yes' : 'No'}`, highlight: targetPlayerData.perfectDragonSoulsTaken === 1 }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between group/item">
                            <span className="text-[10px] text-zinc-500">{item.label}</span>
                            <span className={`text-[11px] font-semibold transition-all duration-200 ${item.highlight ? 'text-green-400 group-hover/item:text-green-300' : 'text-white'}`}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Economy Score Card */}
                  <div className="group relative rounded-xl border border-green-500/10 bg-linear-to-br from-zinc-800/30 to-zinc-900/30 p-4 hover:border-green-500/30 transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-linear-to-br from-green-500/0 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-500/20">
                        <div className="p-1.5 rounded-lg bg-green-500/10">
                          <Coins className="h-3.5 w-3.5 text-green-400" strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Economy Score</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: "Gold/Min", value: `${targetPlayerData.goldPerMinute.toFixed(0)}`, highlight: targetPlayerData.goldPerMinute > 400 },
                          { label: "Total Gold", value: `${(targetPlayerData.goldEarned / 1000).toFixed(1)}k`, highlight: targetPlayerData.goldEarned > 10000 },
                          { label: "CS/Min", value: `${((targetPlayerData.totalMinionsKilled + targetPlayerData.neutralMinionsKilled) / (targetPlayerData.timePlayed / 60)).toFixed(1)}`, highlight: true },
                          { label: "Total CS", value: `${targetPlayerData.totalMinionsKilled + targetPlayerData.neutralMinionsKilled}`, highlight: true }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between group/item">
                            <span className="text-[10px] text-zinc-500">{item.label}</span>
                            <span className="text-[11px] font-semibold text-white group-hover/item:text-zinc-200">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Survival Score Card */}
                  <div className="group relative rounded-xl border border-blue-500/10 bg-linear-to-br from-zinc-800/30 to-zinc-900/30 p-4 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-500/20">
                        <div className="p-1.5 rounded-lg bg-blue-500/10">
                          <Shield className="h-3.5 w-3.5 text-blue-400" strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Survival Score</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: "Deaths", value: `${targetPlayerData.deaths}`, highlight: targetPlayerData.deaths <= 3 },
                          { label: "Time Dead", value: `${(targetPlayerData.timeSpentDead / 60).toFixed(1)} min`, highlight: targetPlayerData.timeSpentDead < 180 },
                          { label: "Longest Living", value: `${(targetPlayerData.longestTimeSpentLiving / 60).toFixed(1)} min`, highlight: (targetPlayerData.longestTimeSpentLiving / 60) > 10 },
                          { label: "Damage Mitigated", value: `${(targetPlayerData.damageSelfMitigated / 1000).toFixed(1)}k`, highlight: true }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between group/item">
                            <span className="text-[10px] text-zinc-500">{item.label}</span>
                            <span className={`text-[11px] font-semibold transition-all duration-200 ${item.highlight ? 'text-green-400 group-hover/item:text-green-300' : 'text-white'}`}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Vision Score Card */}
                  <div className="group relative rounded-xl border border-yellow-500/10 bg-linear-to-br from-zinc-800/30 to-zinc-900/30 p-4 hover:border-yellow-500/30 transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-linear-to-br from-yellow-500/0 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-yellow-500/20">
                        <div className="p-1.5 rounded-lg bg-yellow-500/10">
                          <Eye className="h-3.5 w-3.5 text-yellow-400" strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Vision Score</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: "Vision Score", value: `${targetPlayerData.visionScore}`, highlight: targetPlayerData.visionScore > 30 },
                          { label: "Vision/Min", value: `${targetPlayerData.visionScorePerMinute.toFixed(1)}`, highlight: targetPlayerData.visionScorePerMinute > 1 },
                          { label: "Wards Placed", value: `${targetPlayerData.wardsPlaced}`, highlight: targetPlayerData.wardsPlaced > 15 },
                          { label: "Wards Destroyed", value: `${targetPlayerData.wardsKilled}`, highlight: targetPlayerData.wardsKilled > 5 },
                          { label: "Control Wards", value: `${targetPlayerData.controlWardsPlaced || 0}`, highlight: (targetPlayerData.controlWardsPlaced || 0) > 3 }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between group/item">
                            <span className="text-[10px] text-zinc-500">{item.label}</span>
                            <span className={`text-[11px] font-semibold transition-all duration-200 ${item.highlight ? 'text-green-400 group-hover/item:text-green-300' : 'text-white'}`}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Your Stats Overview */}
          <PremiumCard>
            <div className="p-6">
              {/* Section Header with Score */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 shadow-lg">
                    <Target className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-white">Your Performance</h3>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">Ranked #{targetPlayer.rank} out of 10 players</p>
                  </div>
                </div>
                
                {/* Score Badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20">
                  <Zap className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
                  <span className="font-bold text-2xl bg-linear-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                    {targetPlayer.totalScore.toFixed(2)}
                  </span>
                  <span className="text-xs text-zinc-500">pts</span>
                </div>
              </div>


              {mvp && (
                <div className="relative mt-4">
                  {targetPlayer.puuid === mvp.puuid ? (

                    <div className="relative overflow-hidden rounded-xl border border-orange-500/30 bg-linear-to-br from-orange-950/15 to-amber-950/10 p-6">

                      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl" />
                      
                      <div className="relative z-10">
                        {/* MVP Crown */}
                        <div className="flex justify-center mb-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl" />
                            <div className="relative w-16 h-16 rounded-full bg-linear-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center">
                              <Crown className="h-8 w-8 text-orange-400" strokeWidth={1.5} />
                            </div>
                          </div>
                        </div>
                        
                        {/* MVP Text */}
                        <div className="text-center mb-3">
                          <span className="text-3xl font-bold bg-linear-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                            MVP
                          </span>
                        </div>
                        <h2 className="text-xl font-semibold text-white text-center mb-1">You are the MVP!</h2>
                        <p className="text-xs text-orange-400/80 text-center mb-6">Outstanding performance this match</p>
                        
                        {/* Stats Highlight - Subtle Card */}
                        <div className="max-w-sm mx-auto grid grid-cols-3 gap-3 p-3 rounded-lg bg-zinc-900/40 border border-orange-500/15 backdrop-blur-sm">
                          <div className="text-center">
                            <div className="text-xl font-bold text-white">{targetPlayerData.kills}</div>
                            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Kills</div>
                          </div>
                          <div className="text-center border-x border-orange-500/15">
                            <div className="text-xl font-bold text-orange-400">{targetPlayerData.kda.toFixed(1)}</div>
                            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">KDA</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-white">{targetPlayerData.assists}</div>
                            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Assists</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : ace && targetPlayer.puuid === ace.puuid ? (
                    /* ELEGANT ACE DESIGN */
                    <div className="relative overflow-hidden rounded-xl border border-purple-500/30 bg-linear-to-br from-purple-950/15 to-pink-950/10 p-5">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl" />
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/5 rounded-full blur-2xl" />
                      
                      <div className="relative z-10">
                        <div className="flex justify-center mb-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl" />
                            <div className="relative w-12 h-12 rounded-full bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                              <Star className="h-6 w-6 text-purple-400" strokeWidth={1.5} />
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <span className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ACE</span>
                          <h2 className="text-lg font-semibold text-white mt-2 mb-1">You are the ACE!</h2>
                          <p className="text-xs text-purple-400/80">Best player on the losing team</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* NORMAL COMPARISON DESIGN */
                    <div className={`rounded-lg ${
                      targetPlayer.puuid === mvp.puuid 
                        ? 'border border-orange-500/30 bg-orange-950/10' 
                        : ace && targetPlayer.puuid === ace.puuid
                        ? 'border border-purple-500/30 bg-purple-950/10'
                        : ''
                    } p-5`}>
                      
                      {/* Comparison Header */}
                      <div className="grid grid-cols-2 gap-6 mb-5 pb-4 border-b border-orange-500/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                            <span className="text-lg">👤</span>
                          </div>
                          <div>
                            <p className="text-base font-bold text-white">Your Stats</p>
                            <p className="text-xs text-zinc-500">{targetPlayer.summonerName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-orange-500 blur-md opacity-40 rounded-lg" />
                            <div className="relative w-10 h-10 rounded-lg bg-linear-to-br from-orange-500 to-yellow-500 border border-orange-400 flex items-center justify-center">
                              <Crown className="h-5 w-5 text-white" strokeWidth={1.5} />
                            </div>
                          </div>
                          <div>
                            <p className="text-base font-bold text-orange-400">MVP Stats</p>
                            <p className="text-xs text-zinc-500">{mvp.summonerName}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* KDA Row */}
                        <div className="grid grid-cols-2 gap-6 p-3 rounded-lg bg-zinc-800/20 border border-orange-500/5 hover:border-orange-500/20 transition-all duration-200">
                          <div>
                            <div className="text-xs text-zinc-500 mb-1">KDA</div>
                            <div className="text-lg font-bold text-white">{targetPlayerData.kills}/{targetPlayerData.deaths}/{targetPlayerData.assists}</div>
                            <div className="text-[10px] text-zinc-500">{targetPlayerData.kda.toFixed(2)} ratio</div>
                          </div>
                          <div>
                            <div className="text-xs text-orange-400/70 mb-1">KDA</div>
                            <div className="text-lg font-bold text-orange-400">{(() => {
                              const mvpData = matchData.participants.find(p => p.puuid === mvp.puuid);
                              return mvpData ? `${mvpData.kills}/${mvpData.deaths}/${mvpData.assists}` : '—';
                            })()}</div>
                            <div className="text-[10px] text-orange-600/50">{(() => {
                              const mvpData = matchData.participants.find(p => p.puuid === mvp.puuid);
                              return mvpData ? `${mvpData.kda.toFixed(2)} ratio` : '—';
                            })()}</div>
                          </div>
                        </div>

                        {/* Damage Row */}
                        <div className="grid grid-cols-2 gap-6 p-3 rounded-lg bg-zinc-800/20 border border-orange-500/5 hover:border-orange-500/20 transition-all duration-200">
                          <div>
                            <div className="text-xs text-zinc-500 mb-1">Damage</div>
                            <div className="text-lg font-bold text-white">{(targetPlayerData.totalDamageDealtToChampions / 1000).toFixed(1)}k</div>
                            <div className="text-[10px] text-zinc-500">{(targetPlayerData.teamDamagePercentage * 100).toFixed(1)}% of team</div>
                          </div>
                          <div>
                            <div className="text-xs text-orange-400/70 mb-1">Damage</div>
                            <div className="text-lg font-bold text-orange-400">{(() => {
                              const mvpData = matchData.participants.find(p => p.puuid === mvp.puuid);
                              return mvpData ? `${(mvpData.totalDamageDealtToChampions / 1000).toFixed(1)}k` : '—';
                            })()}</div>
                            <div className="text-[10px] text-orange-600/50">{(() => {
                              const mvpData = matchData.participants.find(p => p.puuid === mvp.puuid);
                              return mvpData ? `${(mvpData.teamDamagePercentage * 100).toFixed(1)}% of team` : '—';
                            })()}</div>
                          </div>
                        </div>

                        {/* Gold Row */}
                        <div className="grid grid-cols-2 gap-6 p-3 rounded-lg bg-zinc-800/20 border border-orange-500/5 hover:border-orange-500/20 transition-all duration-200">
                          <div>
                            <div className="text-xs text-zinc-500 mb-1">Gold</div>
                            <div className="text-lg font-bold text-white">{(targetPlayerData.goldEarned / 1000).toFixed(1)}k</div>
                            <div className="text-[10px] text-zinc-500">{targetPlayerData.goldPerMinute.toFixed(0)}/min</div>
                          </div>
                          <div>
                            <div className="text-xs text-orange-400/70 mb-1">Gold</div>
                            <div className="text-lg font-bold text-orange-400">{(() => {
                              const mvpData = matchData.participants.find(p => p.puuid === mvp.puuid);
                              return mvpData ? `${(mvpData.goldEarned / 1000).toFixed(1)}k` : '—';
                            })()}</div>
                            <div className="text-[10px] text-orange-600/50">{(() => {
                              const mvpData = matchData.participants.find(p => p.puuid === mvp.puuid);
                              return mvpData ? `${mvpData.goldPerMinute.toFixed(0)}/min` : '—';
                            })()}</div>
                          </div>
                        </div>

                        {/* CS Row */}
                        <div className="grid grid-cols-2 gap-6 p-3 rounded-lg bg-zinc-800/20 border border-orange-500/5 hover:border-orange-500/20 transition-all duration-200">
                          <div>
                            <div className="text-xs text-zinc-500 mb-1">CS</div>
                            <div className="text-lg font-bold text-white">{targetPlayerData.totalMinionsKilled + targetPlayerData.neutralMinionsKilled}</div>
                            <div className="text-[10px] text-zinc-500">{((targetPlayerData.totalMinionsKilled + targetPlayerData.neutralMinionsKilled) / (targetPlayerData.timePlayed / 60)).toFixed(1)}/min</div>
                          </div>
                          <div>
                            <div className="text-xs text-orange-400/70 mb-1">CS</div>
                            <div className="text-lg font-bold text-orange-400">{(() => {
                              const mvpData = matchData.participants.find(p => p.puuid === mvp.puuid);
                              return mvpData ? mvpData.totalMinionsKilled + mvpData.neutralMinionsKilled : '—';
                            })()}</div>
                            <div className="text-[10px] text-orange-600/50">{(() => {
                              const mvpData = matchData.participants.find(p => p.puuid === mvp.puuid);
                              return mvpData ? `${((mvpData.totalMinionsKilled + mvpData.neutralMinionsKilled) / (mvpData.timePlayed / 60)).toFixed(1)}/min` : '—';
                            })()}</div>
                          </div>
                        </div>

                        {/* Vision Row */}
                        <div className="grid grid-cols-2 gap-6 p-3 rounded-lg bg-zinc-800/20 border border-orange-500/5 hover:border-orange-500/20 transition-all duration-200">
                          <div>
                            <div className="text-xs text-zinc-500 mb-1">Vision</div>
                            <div className="text-lg font-bold text-white">{targetPlayerData.visionScore}</div>
                            <div className="text-[10px] text-zinc-500">{targetPlayerData.visionScorePerMinute.toFixed(1)}/min</div>
                          </div>
                          <div>
                            <div className="text-xs text-orange-400/70 mb-1">Vision</div>
                            <div className="text-lg font-bold text-orange-400">{(() => {
                              const mvpData = matchData.participants.find(p => p.puuid === mvp.puuid);
                              return mvpData ? mvpData.visionScore : '—';
                            })()}</div>
                            <div className="text-[10px] text-orange-600/50">{(() => {
                              const mvpData = matchData.participants.find(p => p.puuid === mvp.puuid);
                              return mvpData ? `${mvpData.visionScorePerMinute.toFixed(1)}/min` : '—';
                            })()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </PremiumCard>
          
          <div className="">

            <CombatEfficiencyAnalysis participant={targetPlayerData} allParticipants={matchData.participants} />
          </div>


          {/* Damage Breakdown Pie Chart */}
        <PremiumCard>
          <div className="p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 shadow-lg">
                <PieChart className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-white">Damage Contribution</h2>
                <p className="text-xs text-zinc-500 font-medium mt-0.5">Your damage output compared to team total</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              <div className="rounded-xl ">
                <DamageBreakdownChart participant={targetPlayerData} />
              </div>
              <div className="rounded-xl ">
                <DamageTakenBreakdownChart participant={targetPlayerData} allParticipants={matchData.participants} />
              </div>
              <div className="rounded-xl ">
                <DamageHealedBreakdownChart participant={targetPlayerData} allParticipants={matchData.participants} />
              </div>
            </div>
          </div>
        </PremiumCard>

          
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 shadow-lg">
              <BarChart3 className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">Player Rankings</h2>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">Performance comparison across all players</p>
            </div>
          </div>

          {/* Rankings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* KDA Comparison */}
            <div className="rounded-xl border border-orange-500/10 bg-linear-to-br from-zinc-800/30 to-zinc-900/30 p-4 hover:border-orange-500/30 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-orange-500/20">
                <div className="p-1.5 rounded-lg bg-orange-500/10">
                  <Trophy className="h-3.5 w-3.5 text-orange-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">KDA Rankings</h3>
                  <p className="text-[9px] text-zinc-500">Kill/Death/Assist performance</p>
                </div>
              </div>
              <PlayerComparisonChart players={matchData.participants} metric="kda" label="KDA" />
            </div>

            {/* Damage Comparison */}
            <div className="rounded-xl border border-orange-500/10 bg-linear-to-br from-zinc-800/30 to-zinc-900/30 p-4 hover:border-orange-500/30 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-orange-500/20">
                <div className="p-1.5 rounded-lg bg-red-500/10">
                  <Swords className="h-3.5 w-3.5 text-red-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Damage Output</h3>
                  <p className="text-[9px] text-zinc-500">Total damage to champions</p>
                </div>
              </div>
              <PlayerComparisonChart players={matchData.participants} metric="totalDamageDealtToChampions" label="Damage" />
            </div>

            {/* Gold Comparison */}
            <div className="rounded-xl border border-orange-500/10 bg-linear-to-br from-zinc-800/30 to-zinc-900/30 p-4 hover:border-orange-500/30 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-orange-500/20">
                <div className="p-1.5 rounded-lg bg-yellow-500/10">
                  <Coins className="h-3.5 w-3.5 text-yellow-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Gold Earned</h3>
                  <p className="text-[9px] text-zinc-500">Total gold accumulated</p>
                </div>
              </div>
              <PlayerComparisonChart players={matchData.participants} metric="goldEarned" label="Gold" />
            </div>

            {/* Vision Comparison */}
            <div className="rounded-xl border border-orange-500/10 bg-linear-to-br from-zinc-800/30 to-zinc-900/30 p-4 hover:border-orange-500/30 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-orange-500/20">
                <div className="p-1.5 rounded-lg bg-blue-500/10">
                  <Eye className="h-3.5 w-3.5 text-blue-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Vision Control</h3>
                  <p className="text-[9px] text-zinc-500">Ward placement & clearing</p>
                </div>
              </div>
              <PlayerComparisonChart players={matchData.participants} metric="visionScore" label="Vision" />
            </div>
          </div>
        </div>

          {/* Personalized Tips */}
          <PremiumCard>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 shadow-lg">
                  <Brain className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-white">Personalized Tips</h2>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">AI-analyzed suggestions based on your performance</p>
                </div>
              </div>
              
              {/* Tips List */}
              <div className="space-y-3">
                {getPersonalizedTips(targetPlayerData, matchData.participants, targetPlayer).map((tip, index) => (
                  <div 
                    key={index} 
                    className="group rounded-lg border border-orange-500/10 bg-linear-to-br from-zinc-800/30 to-zinc-900/30 p-4 hover:border-orange-500/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      {/* Tip Number Badge */}
                      <div className="w-6 h-6 rounded-full bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <span className="text-[10px] font-bold text-orange-400">{index + 1}</span>
                      </div>
                      
                      {/* Tip Content */}
                      <div className="flex flex-col flex-1">
                        <span className="text-xs text-zinc-300 leading-relaxed group-hover:text-zinc-200 transition-colors duration-200">
                          {tip}
                        </span>
                        
                        {/* Decorative gradient line */}
                        <div className="h-px w-full mt-3 bg-linear-to-r from-orange-500/40 via-orange-500/10 to-transparent" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PremiumCard>
          
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
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
          </div> */}
        </>
      )}

      {/* All Players Leaderboard */}
      <PremiumCard>
        <div className="p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 shadow-lg">
              <Trophy className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">Match Leaderboard</h2>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">Player rankings based on performance score</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {playerScores.map((player) => {
              const participant = matchData.participants.find(p => p.puuid === player.puuid);
              if (!participant) return null;
              
              const isMVP = mvp && player.puuid === mvp.puuid;
              const isACE = ace && player.puuid === ace.puuid && !isMVP;
              const isCurrentUser = player.puuid === targetPuuid;
              
              return (
                <div
                  key={player.puuid}
                  className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                    isCurrentUser 
                      ? 'border-orange-500/40 bg-linear-to-r from-orange-950/20 to-transparent' 
                      : isMVP
                      ? 'border-orange-500/30 bg-orange-950/10'
                      : isACE
                      ? 'border-purple-500/30 bg-purple-950/10'
                      : 'border-orange-500/10 bg-linear-to-br from-zinc-800/30 to-zinc-900/30'
                  } hover:border-opacity-60 group`}
                >
                  {/* Champion Splash Art on Hover */}
                  <div 
                    className="absolute inset-0 bg-cover bg-no-repeat opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                    style={{
                      backgroundImage: `url(${getChampionSplashByName(player.championName.toLowerCase())})`,
                      backgroundPosition: 'top 20% center',
                      backgroundSize: 'cover'
                    }}
                  />
                  
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between p-4 gap-4">
                      {/* Left Section - Player Info (takes remaining space) */}
                      <div className="flex items-center gap-4 flex-1">
                        {/* Champion Image */}
                        <div className="relative shrink-0">
                          <div className={`w-12 h-12 rounded-xl overflow-hidden border-2 ${
                            isMVP
                              ? 'border-orange-500/70 shadow-lg shadow-orange-500/20'
                              : isACE
                              ? 'border-purple-500/70 shadow-lg shadow-purple-500/20'
                              : isCurrentUser
                              ? 'border-orange-500/50'
                              : 'border-zinc-700'
                          }`}>
                            <img
                              src={getChampionImage(getChampionIdByName(player.championName.toString())?.toString() || "")}
                              alt={player.championName}
                              title={player.championName}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = `/images/nochampionimage.jpg`;
                              }}
                            />
                          </div>
                          {/* Rank Badge */}
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                            #{player.rank}
                          </div>
                        </div>
                        
                        {/* Player Name and Tags */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="font-bold text-white group-hover:text-orange-400 transition-colors duration-300 truncate">{player.summonerName}</p>
                            {isCurrentUser && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 shrink-0">
                                You
                              </span>
                            )}
                            {isMVP && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1 shrink-0">
                                <Crown className="w-3 h-3" strokeWidth={1.5} />
                                MVP
                              </span>
                            )}
                            {isACE && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1 shrink-0">
                                <Star className="w-3 h-3" strokeWidth={1.5} />
                                ACE
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300">{participant.championName}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300 whitespace-nowrap">{participant.kills}/{participant.deaths}/{participant.assists}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300 whitespace-nowrap">{participant.kda.toFixed(2)} KDA</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Section - Score & Badges (always aligned to right) */}
                      <div className="text-right shrink-0">
                        <div className="flex items-baseline justify-end gap-1 mb-1">
                          <span className="text-2xl font-bold bg-linear-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:to-orange-400 transition-all duration-300">
                            {player.totalScore.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-zinc-500">pts</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          {getPerformanceBadges(participant, matchData.participants).slice(0, 2).map((badge, idx) => (
                            <span key={idx} className={`px-2 py-0.5 rounded-md text-[9px] font-semibold whitespace-nowrap ${
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
                </div>
              );
            })}
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}