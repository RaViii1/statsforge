// Diamond+ level static benchmarks for role-specific scoring
// Benchmarks are per-game values unless noted otherwise (e.g. /min suffix)

export type Role = 'TOP' | 'JUNGLE' | 'MID' | 'BOTTOM' | 'UTILITY';

export interface BenchmarkThresholds {
  poor: number;
  average: number;
  good: number;
  excellent: number;
}

export interface MetricBenchmark {
  key: string;
  name: string;
  unit: string; // "/min", "%", "", "s", etc.
  benchmark: BenchmarkThresholds;
  inverted?: boolean; // true if lower is better (e.g. deaths)
}

export interface CategoryBenchmark {
  name: string;
  weight: number;
  metrics: MetricBenchmark[];
  tipTemplate: string; // Template for improvement tip
}

export interface RoleBenchmarkConfig {
  categories: CategoryBenchmark[];
}

export const ROLE_BENCHMARKS: Record<Role, RoleBenchmarkConfig> = {
  TOP: {
    categories: [
      {
        name: "Dueling",
        weight: 0.25,
        metrics: [
          { key: "soloKills", name: "Solo Kills", unit: "", benchmark: { poor: 0, average: 1, good: 2, excellent: 4 } },
          { key: "damageRatio", name: "Dmg Dealt/Taken", unit: "", benchmark: { poor: 0.8, average: 1.0, good: 1.3, excellent: 1.8 } },
        ],
        tipTemplate: "Trade when the enemy uses a key ability on the wave. Track their cooldowns (most top lane abilities are 8-14s early). Freeze near your tower to force them into bad trades or deny CS. Use brush control to drop minion aggro between trades.",
      },
      {
        name: "Frontline",
        weight: 0.25,
        metrics: [
          { key: "damageTakenPerMin", name: "Dmg Taken/min", unit: "/min", benchmark: { poor: 400, average: 600, good: 800, excellent: 1000 } },
          { key: "ccTimeSeconds", name: "CC Time", unit: "s", benchmark: { poor: 10, average: 25, good: 40, excellent: 60 } },
        ],
        tipTemplate: "Wait for enemy key cooldowns before engaging (e.g. Ezreal E, Zeri E). Flank from fog of war when possible instead of running at the enemy head-on. Layer your CC with teammates rather than dumping everything at once.",
      },
      {
        name: "Split Push",
        weight: 0.20,
        metrics: [
          { key: "turretDamage", name: "Turret Damage", unit: "", benchmark: { poor: 1000, average: 2500, good: 4000, excellent: 6000 } },
          { key: "csPerMin", name: "CS/min", unit: "/min", benchmark: { poor: 5.5, average: 7.0, good: 8.0, excellent: 9.5 } },
        ],
        tipTemplate: "Push the opposite side lane before major objectives spawn (30s before dragon/baron). Only split when you have TP or your team can safely 4v4. Hit turret plates between waves - each plate is 160g. Catch waves crashing into your side lanes that other teammates ignore.",
      },
      {
        name: "Team Impact",
        weight: 0.15,
        metrics: [
          { key: "killParticipation", name: "Kill Participation", unit: "%", benchmark: { poor: 0.35, average: 0.45, good: 0.55, excellent: 0.65 } },
          { key: "teamDamagePercent", name: "Team Damage %", unit: "%", benchmark: { poor: 0.15, average: 0.20, good: 0.25, excellent: 0.30 } },
        ],
        tipTemplate: "Save TP for cross-map plays rather than using it to get back to lane. Look at the minimap every 3-5 seconds for TP opportunities. Group with your team when dragon/baron spawns within 60s instead of staying top.",
      },
      {
        name: "Survival",
        weight: 0.15,
        metrics: [
          { key: "deaths", name: "Deaths", unit: "", benchmark: { poor: 8, average: 5, good: 3, excellent: 1 }, inverted: true },
          { key: "deathTimePercent", name: "Death Time %", unit: "%", benchmark: { poor: 0.20, average: 0.12, good: 0.08, excellent: 0.04 }, inverted: true },
        ],
        tipTemplate: "Ward the river bush and tri-brush at 2:30 (enemy jungle first clear timing). If you don't see the enemy jungler on the map, play as if they're in your river. After 20 min, every death costs 30-50s - don't contest without vision.",
      },
    ],
  },

  JUNGLE: {
    categories: [
      {
        name: "Objective Control",
        weight: 0.30,
        metrics: [
          { key: "dragonKills", name: "Dragon Takedowns", unit: "", benchmark: { poor: 1, average: 2, good: 3, excellent: 4 } },
          { key: "baronKills", name: "Baron Takedowns", unit: "", benchmark: { poor: 0, average: 0.5, good: 1, excellent: 2 } },
          { key: "riftHeraldTakedowns", name: "Herald Takedowns", unit: "", benchmark: { poor: 0, average: 0.5, good: 1, excellent: 2 } },
        ],
        tipTemplate: "Start setting up vision 60s before objective spawns. Clear the area with Oracle Lens 30s before. If the enemy jungler shows on the opposite side of the map, immediately call for the objective. Save Smite for secure - don't Smite camps when an objective spawns within 90s.",
      },
      {
        name: "Ganking",
        weight: 0.25,
        metrics: [
          { key: "killParticipation", name: "Kill Participation", unit: "%", benchmark: { poor: 0.50, average: 0.60, good: 0.70, excellent: 0.80 } },
          { key: "assists", name: "Assists", unit: "", benchmark: { poor: 3, average: 6, good: 10, excellent: 14 } },
        ],
        tipTemplate: "Check lanes after every camp clear - look for overextended enemies or lanes with CC. Gank lanes where the enemy has used their escape ability. Path towards the lane with the biggest wave crashing in (the enemy will be stuck last-hitting). Dive-ready lanes (low HP under tower) are free kills with proper setup.",
      },
      {
        name: "Farming",
        weight: 0.15,
        metrics: [
          { key: "csPerMin", name: "CS/min", unit: "/min", benchmark: { poor: 4.0, average: 5.0, good: 6.0, excellent: 7.0 } },
          { key: "goldPerMin", name: "Gold/min", unit: "/min", benchmark: { poor: 300, average: 350, good: 400, excellent: 450 } },
        ],
        tipTemplate: "Never walk past a camp that's up - always clear it on the way to a gank. If a gank fails within 10s, immediately take the nearest camp. Catch lane minions only when your laner has backed and the wave is crashing into tower. Avoid sitting in bushes for more than 15s waiting for a gank.",
      },
      {
        name: "Vision Control",
        weight: 0.15,
        metrics: [
          { key: "visionScorePerMin", name: "Vision/min", unit: "/min", benchmark: { poor: 0.8, average: 1.0, good: 1.3, excellent: 1.6 } },
          { key: "controlWards", name: "Control Wards", unit: "", benchmark: { poor: 1, average: 3, good: 5, excellent: 8 } },
        ],
        tipTemplate: "Place a deep ward in the enemy jungle when you know their jungler is on the opposite side. Control ward one of: dragon pit, baron pit, or the pixel brush near mid. Buy a control ward on every back - it pays for itself if it spots one gank.",
      },
      {
        name: "Map Presence",
        weight: 0.15,
        metrics: [
          { key: "enemyJungleCs", name: "Enemy Jungle CS", unit: "", benchmark: { poor: 0, average: 5, good: 15, excellent: 30 } },
          { key: "deaths", name: "Deaths", unit: "", benchmark: { poor: 7, average: 4, good: 2, excellent: 1 }, inverted: true },
        ],
        tipTemplate: "Invade the opposite quadrant from where the enemy jungler was last seen. Only invade when at least one adjacent lane has priority (their laner will be first to rotate). Counter-jungle after successful ganks when the enemy jungler is dead or on the other side.",
      },
    ],
  },

  MID: {
    categories: [
      {
        name: "Damage Output",
        weight: 0.30,
        metrics: [
          { key: "damagePerMin", name: "Damage/min", unit: "/min", benchmark: { poor: 400, average: 550, good: 700, excellent: 900 } },
          { key: "teamDamagePercent", name: "Team Damage %", unit: "%", benchmark: { poor: 0.20, average: 0.25, good: 0.30, excellent: 0.35 } },
        ],
        tipTemplate: "Poke with abilities before all-inning to get the enemy in kill range. In teamfights, position to hit 2+ enemies with AoE. Use ability combos in the correct order (burst combo, not random). Auto-attack between abilities to maximize DPS during trades.",
      },
      {
        name: "Roaming Impact",
        weight: 0.20,
        metrics: [
          { key: "killParticipation", name: "Kill Participation", unit: "%", benchmark: { poor: 0.45, average: 0.55, good: 0.65, excellent: 0.75 } },
          { key: "assists", name: "Assists", unit: "", benchmark: { poor: 4, average: 7, good: 10, excellent: 14 } },
        ],
        tipTemplate: "Shove the wave with abilities before roaming so you don't lose CS and XP. The best roam timings are after a cannon wave (larger window). Coordinate with your jungler's pathing - if they're going bot, follow. Roam towards the side where your jungler is for 2v1 or 3v2 numbers advantage.",
      },
      {
        name: "Laning",
        weight: 0.20,
        metrics: [
          { key: "csPerMin", name: "CS/min", unit: "/min", benchmark: { poor: 6.0, average: 7.5, good: 8.5, excellent: 10.0 } },
          { key: "soloKills", name: "Solo Kills", unit: "", benchmark: { poor: 0, average: 1, good: 2, excellent: 4 } },
        ],
        tipTemplate: "Use abilities to last-hit AND poke simultaneously (hit the enemy when they walk up to CS). At 7 CS/min, you're missing ~30% of minions - practice last-hitting in Practice Tool for 10 minutes before queuing. Look for solo kills when the enemy wastes a key cooldown (e.g. after they miss their skillshot).",
      },
      {
        name: "Survival",
        weight: 0.15,
        metrics: [
          { key: "deaths", name: "Deaths", unit: "", benchmark: { poor: 7, average: 4, good: 2, excellent: 1 }, inverted: true },
        ],
        tipTemplate: "Track the enemy jungler's position by watching which lane they ganked last and timing their clear. Keep the river warded on the side the enemy jungler was last seen. Don't push past the midpoint without vision on both sides. Respect level 6 all-in potential from assassins.",
      },
      {
        name: "Multikills",
        weight: 0.15,
        metrics: [
          { key: "multiKillScore", name: "Multikill Score", unit: "", benchmark: { poor: 0, average: 1, good: 3, excellent: 6 } },
        ],
        tipTemplate: "Wait 1-2 seconds into a teamfight before committing your burst so enemies group up. Position on the flank to hit the backline with AoE. Hold your ultimate for when multiple enemies are clustered (especially around objectives in tight spaces).",
      },
    ],
  },

  BOTTOM: {
    categories: [
      {
        name: "Damage Output",
        weight: 0.35,
        metrics: [
          { key: "damagePerMin", name: "Damage/min", unit: "/min", benchmark: { poor: 450, average: 600, good: 750, excellent: 950 } },
          { key: "teamDamagePercent", name: "Team Damage %", unit: "%", benchmark: { poor: 0.22, average: 0.28, good: 0.33, excellent: 0.40 } },
        ],
        tipTemplate: "Always be auto-attacking in teamfights - attack-move click (A+click) the closest target rather than trying to click on the carry. Your job is sustained DPS, not assassinating. In lane, auto the enemy ADC when they go for a last-hit (they can't auto back without losing CS).",
      },
      {
        name: "Farming",
        weight: 0.25,
        metrics: [
          { key: "csPerMin", name: "CS/min", unit: "/min", benchmark: { poor: 6.5, average: 8.0, good: 9.0, excellent: 10.5 } },
          { key: "goldPerMin", name: "Gold/min", unit: "/min", benchmark: { poor: 350, average: 400, good: 450, excellent: 520 } },
        ],
        tipTemplate: "After laning phase, catch side waves that are crashing into your towers - each wave is worth ~125g. Don't group mid permanently (ARAM syndrome). Before objectives, push out the nearest side wave first then rotate. Practice last-hitting under tower: 2 tower shots + 1 auto for melee, 1 auto + tower shot + 1 auto for casters.",
      },
      {
        name: "Positioning",
        weight: 0.20,
        metrics: [
          { key: "deaths", name: "Deaths", unit: "", benchmark: { poor: 6, average: 4, good: 2, excellent: 1 }, inverted: true },
          { key: "damageTakenRatio", name: "Dmg Taken Ratio", unit: "", benchmark: { poor: 0.8, average: 0.5, good: 0.35, excellent: 0.2 }, inverted: true },
        ],
        tipTemplate: "Stay at max auto-attack range and kite backwards when enemies dive you. Never flash forward unless the fight is 100% won. Position on the opposite side of the enemy assassin/diver. If an assassin is fed, save your Flash/Heal specifically for their engage. Your life is worth more than getting a few extra autos.",
      },
      {
        name: "Teamfighting",
        weight: 0.15,
        metrics: [
          { key: "killParticipation", name: "Kill Participation", unit: "%", benchmark: { poor: 0.45, average: 0.55, good: 0.65, excellent: 0.75 } },
          { key: "multiKillScore", name: "Multikills", unit: "", benchmark: { poor: 0, average: 1, good: 2, excellent: 4 } },
        ],
        tipTemplate: "Group with your support for major objectives. In teamfights, let your frontline engage first then follow up. Attack the closest target - killing tanks quickly is better than dying trying to reach the backline. Save movement abilities for dodging, not engaging.",
      },
      {
        name: "Objective DPS",
        weight: 0.05,
        metrics: [
          { key: "turretDamage", name: "Turret Damage", unit: "", benchmark: { poor: 1000, average: 2500, good: 4000, excellent: 6000 } },
        ],
        tipTemplate: "Hit turrets whenever it's safe - ADCs deal the most turret damage in the game. After winning a fight, always prioritize turrets over chasing kills. Each turret plate is 160g (810g total for first turret + 5 plates).",
      },
    ],
  },

  UTILITY: {
    categories: [
      {
        name: "Vision Control",
        weight: 0.30,
        metrics: [
          { key: "visionScorePerMin", name: "Vision/min", unit: "/min", benchmark: { poor: 1.2, average: 1.6, good: 2.0, excellent: 2.5 } },
          { key: "wardsPlaced", name: "Wards Placed", unit: "", benchmark: { poor: 15, average: 25, good: 35, excellent: 50 } },
          { key: "wardsKilled", name: "Wards Cleared", unit: "", benchmark: { poor: 3, average: 6, good: 10, excellent: 15 } },
        ],
        tipTemplate: "Swap to Oracle Lens after your ward quest completes. Ward defensively when behind, offensively when ahead. Key ward spots: dragon pit entrance, baron pit, river pixel brush, and jungle entry points. Clear wards with Oracle Lens before objectives (30s window). Buy a control ward on every back.",
      },
      {
        name: "Utility",
        weight: 0.25,
        metrics: [
          { key: "healsOnTeammates", name: "Heals on Allies", unit: "", benchmark: { poor: 1000, average: 3000, good: 6000, excellent: 10000 } },
          { key: "shieldsOnTeammates", name: "Shields on Allies", unit: "", benchmark: { poor: 500, average: 2000, good: 4000, excellent: 7000 } },
          { key: "ccTimeSeconds", name: "CC Time", unit: "s", benchmark: { poor: 20, average: 40, good: 60, excellent: 90 } },
        ],
        tipTemplate: "Shield/heal proactively BEFORE damage hits, not reactively after. Layer CC with your teammates - don't overlap stuns. Prioritize peeling for your fed carry over engaging. Items like Redemption and Locket can swing teamfights - use active items immediately, don't hold them.",
      },
      {
        name: "Engagement",
        weight: 0.20,
        metrics: [
          { key: "killParticipation", name: "Kill Participation", unit: "%", benchmark: { poor: 0.50, average: 0.60, good: 0.70, excellent: 0.80 } },
          { key: "assists", name: "Assists", unit: "", benchmark: { poor: 6, average: 10, good: 15, excellent: 22 } },
        ],
        tipTemplate: "Roam to mid after your ADC backs or when the wave is pushing into your tower. Move with your jungler for invades and objective setup. Look for engages when you spot an enemy out of position (even just landing one CC can start a fight). Be present for every skirmish around objectives.",
      },
      {
        name: "Survival",
        weight: 0.15,
        metrics: [
          { key: "deaths", name: "Deaths", unit: "", benchmark: { poor: 7, average: 5, good: 3, excellent: 1 }, inverted: true },
          { key: "goldPerMin", name: "Gold Efficiency", unit: "/min", benchmark: { poor: 200, average: 250, good: 300, excellent: 350 } },
        ],
        tipTemplate: "Your life is valuable - a dead support provides no vision, no peel, no heals. Only sacrifice yourself if it directly saves a carry who can clean up. In lane, don't take trades that cost you more HP than the enemy ADC. Stand behind minions vs hook champions and to the side vs poke mages.",
      },
      {
        name: "Roaming",
        weight: 0.10,
        metrics: [
          { key: "roamingScore", name: "Roaming Impact", unit: "", benchmark: { poor: 2, average: 4, good: 7, excellent: 12 } },
        ],
        tipTemplate: "Roam when your ADC is safe under tower or has backed. The best roam window is after a successful bot lane trade. Walk through river (not through lane) to avoid being spotted. Ping your ADC to play safe before you leave. Even a failed roam that forces summoner spells is worth it.",
      },
    ],
  },
};

// Game duration adjustment factors
export const DURATION_ADJUSTMENTS = {
  short: { maxMinutes: 25, factor: 0.85 },
  medium: { minMinutes: 25, maxMinutes: 35, factor: 1.0 },
  long: { minMinutes: 35, factor: 1.15 },
};

export function getDurationFactor(gameDurationMinutes: number): number {
  if (gameDurationMinutes < 25) return DURATION_ADJUSTMENTS.short.factor;
  if (gameDurationMinutes > 35) return DURATION_ADJUSTMENTS.long.factor;
  return DURATION_ADJUSTMENTS.medium.factor;
}