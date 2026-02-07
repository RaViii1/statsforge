import {
  Role,
  BenchmarkThresholds,
  ROLE_BENCHMARKS,
  getDurationFactor,
  MetricBenchmark,
  CategoryBenchmark,
} from './roleBenchmarks';

// --- Types ---

export interface MetricScore {
  name: string;
  key: string;
  value: number;
  unit: string;
  benchmark: BenchmarkThresholds;
  percentile: number; // 0-100
  grade: string;
  inverted: boolean;
}

export interface CategoryScore {
  name: string;
  score: number; // 0-100
  weight: number;
  grade: string;
  metrics: MetricScore[];
  tip: string;
}

export interface RoleScore {
  role: Role;
  categories: CategoryScore[];
  totalScore: number;
  overallGrade: string;
  strengths: string[];
  weaknesses: string[];
}

// --- Grade helpers ---

export function getGrade(score: number): string {
  if (score >= 95) return 'S+';
  if (score >= 85) return 'S';
  if (score >= 70) return 'A';
  if (score >= 55) return 'B';
  if (score >= 40) return 'C';
  if (score >= 25) return 'D';
  return 'F';
}

/**
 * Compute a 0-100 percentile for a value against benchmark thresholds.
 * For inverted metrics (lower = better), the scale is reversed.
 */
export function getPercentile(
  value: number,
  benchmark: BenchmarkThresholds,
  inverted?: boolean,
): number {
  const { poor, average, good, excellent } = benchmark;

  if (inverted) {
    // Lower is better: poor is the worst, excellent is the best
    // Map: >= poor → 0, <= excellent → 100
    if (value >= poor) return 0;
    if (value <= excellent) return 100;
    // Interpolate between tiers
    if (value >= average) {
      return lerp(0, 33, poor, average, value, true);
    }
    if (value >= good) {
      return lerp(33, 66, average, good, value, true);
    }
    return lerp(66, 100, good, excellent, value, true);
  }

  // Normal: higher is better
  if (value <= poor) return 0;
  if (value >= excellent) return 100;
  if (value <= average) {
    return lerp(0, 33, poor, average, value, false);
  }
  if (value <= good) {
    return lerp(33, 66, average, good, value, false);
  }
  return lerp(66, 100, good, excellent, value, false);
}

function lerp(
  outMin: number,
  outMax: number,
  inMin: number,
  inMax: number,
  value: number,
  inverted: boolean,
): number {
  if (inMin === inMax) return outMax;
  const ratio = inverted
    ? (inMin - value) / (inMin - inMax)
    : (value - inMin) / (inMax - inMin);
  return Math.max(outMin, Math.min(outMax, outMin + ratio * (outMax - outMin)));
}

// --- Metric extraction ---

export interface ParticipantStats {
  // Basic
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  teamPosition: string;
  win: boolean;
  championName: string;
  // Combat
  damagePerMinute: number;
  totalDamageDealtToChampions: number;
  teamDamagePercentage: number;
  killParticipation: number;
  soloKills: number;
  // Multikills
  pentaKills: number;
  quadraKills: number;
  tripleKills: number;
  doubleKills: number;
  // Economy
  goldEarned: number;
  goldPerMinute: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  // Survivability
  totalDamageTaken: number;
  totalHeal: number;
  damageSelfMitigated: number;
  timeSpentDead: number;
  // Vision
  visionScore: number;
  visionScorePerMinute: number;
  wardsPlaced: number;
  wardsKilled: number;
  // Enhanced fields
  timeCCingOthers: number;
  totalHealsOnTeammates: number;
  totalDamageShieldedOnTeammates: number;
  longestTimeSpentLiving: number;
  turretDamageDealt: number;
  riftHeraldTakedowns: number;
  inhibitorTakedowns: number;
  controlWardsPlaced: number;
  enemyJungleMonsterKills: number;
  laneMinionsFirst10Minutes: number;
  jungleCsBefore10Minutes: number;
  // Objective
  baronKills: number;
  dragonKills: number;
  turretTakedowns: number;
  objectivesStolen: number;
  // Other
  timePlayed: number;
  level: number;
}

/**
 * Extract a metric value from participant stats by key.
 * Some keys are derived/computed.
 */
function getMetricValue(p: ParticipantStats, key: string, gameDurationMinutes: number): number {
  const totalCS = p.totalMinionsKilled + p.neutralMinionsKilled;

  switch (key) {
    // Direct fields
    case 'soloKills': return p.soloKills || 0;
    case 'kills': return p.kills;
    case 'deaths': return p.deaths;
    case 'assists': return p.assists;
    case 'kda': return p.kda;
    case 'killParticipation': return p.killParticipation;
    case 'teamDamagePercent': return p.teamDamagePercentage;
    case 'damagePerMin': return p.damagePerMinute;
    case 'goldPerMin': return p.goldPerMinute;
    case 'visionScorePerMin': return p.visionScorePerMinute;
    case 'wardsPlaced': return p.wardsPlaced;
    case 'wardsKilled': return p.wardsKilled;
    case 'dragonKills': return p.dragonKills;
    case 'baronKills': return p.baronKills;
    case 'turretTakedowns': return p.turretTakedowns;
    case 'controlWards': return p.controlWardsPlaced || 0;
    case 'enemyJungleCs': return p.enemyJungleMonsterKills || 0;
    case 'riftHeraldTakedowns': return p.riftHeraldTakedowns || 0;

    // Computed
    case 'csPerMin': return gameDurationMinutes > 0 ? totalCS / gameDurationMinutes : 0;
    case 'damageRatio':
      return p.totalDamageTaken > 0
        ? p.totalDamageDealtToChampions / p.totalDamageTaken
        : 0;
    case 'damageTakenPerMin':
      return gameDurationMinutes > 0 ? p.totalDamageTaken / gameDurationMinutes : 0;
    case 'ccTimeSeconds':
      return (p.timeCCingOthers || 0);
    case 'turretDamage':
      return p.turretDamageDealt || 0;
    case 'deathTimePercent':
      return gameDurationMinutes > 0
        ? p.timeSpentDead / (gameDurationMinutes * 60)
        : 0;
    case 'damageTakenRatio':
      return p.totalDamageDealtToChampions > 0
        ? p.totalDamageTaken / p.totalDamageDealtToChampions
        : 1;
    case 'multiKillScore':
      return (p.doubleKills || 0) * 1 +
        (p.tripleKills || 0) * 2 +
        (p.quadraKills || 0) * 3 +
        (p.pentaKills || 0) * 5;
    case 'healsOnTeammates': return p.totalHealsOnTeammates || 0;
    case 'shieldsOnTeammates': return p.totalDamageShieldedOnTeammates || 0;
    case 'roamingScore':
      // Estimated from KP + assists (supports that roam get more assists)
      return Math.round((p.killParticipation * 10) + (p.assists * 0.5));

    default: return 0;
  }
}

// --- Main scoring function ---

export function mapPositionToRole(teamPosition: string): Role {
  const pos = teamPosition.toUpperCase();
  if (pos === 'TOP') return 'TOP';
  if (pos === 'JUNGLE') return 'JUNGLE';
  if (pos === 'MIDDLE' || pos === 'MID') return 'MID';
  if (pos === 'BOTTOM' || pos === 'ADC') return 'BOTTOM';
  if (pos === 'UTILITY' || pos === 'SUPPORT') return 'UTILITY';
  return 'MID'; // fallback
}

export function calculateRoleScore(
  participant: ParticipantStats,
  role: Role,
  gameDurationMinutes: number,
): RoleScore {
  const benchmarkConfig = ROLE_BENCHMARKS[role];
  const durationFactor = getDurationFactor(gameDurationMinutes);

  const categories: CategoryScore[] = benchmarkConfig.categories.map(
    (catBenchmark: CategoryBenchmark) => {
      const metrics: MetricScore[] = catBenchmark.metrics.map(
        (metricDef: MetricBenchmark) => {
          const rawValue = getMetricValue(participant, metricDef.key, gameDurationMinutes);

          // Adjust benchmark thresholds by duration factor for per-game metrics
          const adjustedBenchmark: BenchmarkThresholds = {
            poor: metricDef.benchmark.poor * durationFactor,
            average: metricDef.benchmark.average * durationFactor,
            good: metricDef.benchmark.good * durationFactor,
            excellent: metricDef.benchmark.excellent * durationFactor,
          };

          // Don't adjust percentage-based or ratio metrics
          const isPercentOrRatio = metricDef.unit === '%' || metricDef.key.includes('Ratio') || metricDef.key.includes('Percent') || metricDef.key === 'killParticipation' || metricDef.key === 'teamDamagePercent';
          const benchmark = isPercentOrRatio ? metricDef.benchmark : adjustedBenchmark;

          const percentile = getPercentile(rawValue, benchmark, metricDef.inverted);
          const grade = getGrade(percentile);

          return {
            name: metricDef.name,
            key: metricDef.key,
            value: rawValue,
            unit: metricDef.unit,
            benchmark,
            percentile,
            grade,
            inverted: !!metricDef.inverted,
          };
        },
      );

      // Category score = average of metric percentiles
      const categoryScore =
        metrics.length > 0
          ? metrics.reduce((sum, m) => sum + m.percentile, 0) / metrics.length
          : 0;

      return {
        name: catBenchmark.name,
        score: categoryScore,
        weight: catBenchmark.weight,
        grade: getGrade(categoryScore),
        metrics,
        tip: catBenchmark.tipTemplate,
      };
    },
  );

  // Total score = weighted sum of category scores
  const totalScore = categories.reduce(
    (sum, cat) => sum + cat.score * cat.weight,
    0,
  );

  const overallGrade = getGrade(totalScore);

  // Strengths: categories with A or better
  const strengths = categories
    .filter((c) => c.score >= 70)
    .sort((a, b) => b.score - a.score)
    .map((c) => c.name);

  // Weaknesses: categories with C or worse
  const weaknesses = categories
    .filter((c) => c.score < 40)
    .sort((a, b) => a.score - b.score)
    .map((c) => c.name);

  return {
    role,
    categories,
    totalScore,
    overallGrade,
    strengths,
    weaknesses,
  };
}
