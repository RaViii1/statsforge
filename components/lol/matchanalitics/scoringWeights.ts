// types/scoringWeights.ts

export interface CombatWeights {
  killParticipation: number;
  kda: number;
  damage: number;
  teamDamage: number;
  cc: number;
  healingShielding: number;
  multikills: number;
}

export interface ObjectiveWeights {
  totalObjectives: number;
  objectivesStolen: number;
  baronKills: number;
  dragonKills: number;
  riftHerald: number;
  turretTakedowns: number;
  inhibitors: number;
  perfectDragonSoulBonus: number;  // Changed to Bonus - only adds, never subtracts
  firstTurret: number;
}

export interface EconomyWeights {
  goldPerMin: number;
  cs: number;
}

export interface VisionWeights {
  visionScore: number;
  wardsPlaced: number;
  wardsKilled: number;
  controlWards: number;
}

export interface SurvivalWeights {
  deathPenalty: number;
  damageMitigated: number;
  timeAlive: number;
  longestLiving: number;
}

export interface ScoreCategoryWeights {
  combat: number;
  objectives: number;
  economy: number;
  survival: number;
  vision: number;
  macro: number;
}

export const combatWeightsByRole = {
  DEFAULT: {
    killParticipation: 0.35,  
    kda: 0.20,               
    damage: 0.10,            
    teamDamage: 0.05,        
    cc: 0.05,                
    healingShielding: 0.05,  
    multikills: 0.10,        
    // New weights
    mostKillsBonus: 0.05,    
    mostAssistsBonus: 0.05   
  },
  SUPPORT: {
    killParticipation: 0.45, 
    kda: 0.1,               
    damage: 0.00,
    teamDamage: 0.00,
    cc: 0.20,
    healingShielding: 0.20,
    multikills: 0.00,
    mostKillsBonus: 0.00,
    mostAssistsBonus: 0.05  
  },
  JUNGLE: {
    killParticipation: 0.40,
    kda: 0.15,
    damage: 0.10,
    teamDamage: 0.05,
    cc: 0.05,
    healingShielding: 0.05,
    multikills: 0.15,
    mostKillsBonus: 0.03,
    mostAssistsBonus: 0.02
  },
  CARRY: {
    killParticipation: 0.25,
    kda: 0.20,
    damage: 0.20,
    teamDamage: 0.10,
    cc: 0.05,
    healingShielding: 0.00,
    multikills: 0.10,
    mostKillsBonus: 0.07,
    mostAssistsBonus: 0.03
  },
  TOP: {
    killParticipation: 0.30,
    kda: 0.20,
    damage: 0.15,
    teamDamage: 0.10,
    cc: 0.10,
    healingShielding: 0.00,
    multikills: 0.10,
    mostKillsBonus: 0.03,
    mostAssistsBonus: 0.02
  }
};

// Add these helper functions to scoringWeights.ts

export const getMostKillsBonus = (position: string, isHighestKills: boolean): number => {
  if (!isHighestKills) return 0;
  
  const isCarry = position === "MID" || position === "BOTTOM";
  const isJungle = position === "JUNGLE";
  const isSupport = position === "UTILITY" || position === "SUPPORT";
  
  if (isCarry) return 7;  // Carries get +7 points for most kills
  if (isJungle) return 5;
  if (isSupport) return 0;  // Supports don't get kill bonus
  return 4;
};

export const getMostAssistsBonus = (position: string, isHighestAssists: boolean): number => {
  if (!isHighestAssists) return 0;
  
  const isSupport = position === "UTILITY" || position === "SUPPORT";
  const isJungle = position === "JUNGLE";
  
  if (isSupport) return 8;  // Supports get +8 points for most assists
  if (isJungle) return 5;
  return 3;
};

export const objectiveWeightsByRole = {
  DEFAULT: {
    totalObjectives: 0.35,
    objectivesStolen: 0.10,
    baronKills: 0.15,
    dragonKills: 0.15,
    riftHerald: 0.10,
    turretTakedowns: 0.10,
    inhibitors: 0.05,
    perfectDragonSoulBonus: 0,  // Pure bonus, not part of base score
    firstTurret: 0.02
  },
  JUNGLE: {
    totalObjectives: 0.34,
    objectivesStolen: 0.05,
    baronKills: 0.20,       
    dragonKills: 0.30, 
    riftHerald: 0.15, 
    turretTakedowns: 0.04,  
    inhibitors: 0.00, 
    perfectDragonSoulBonus: 0,  // Pure bonus, not part of base score
    firstTurret: 0.01 
  },
  SUPPORT: {
    totalObjectives: 0.25,
    objectivesStolen: 0.15,
    baronKills: 0.10,
    dragonKills: 0.10,
    riftHerald: 0.10,
    turretTakedowns: 0.15,
    inhibitors: 0.05,
    perfectDragonSoulBonus: 0,  // Pure bonus, not part of base score
    firstTurret: 0.08
  },
  CARRY: {
    totalObjectives: 0.30,
    objectivesStolen: 0.05,
    baronKills: 0.10,
    dragonKills: 0.10,
    riftHerald: 0.05,
    turretTakedowns: 0.25,
    inhibitors: 0.10,
    perfectDragonSoulBonus: 0,  // Pure bonus, not part of base score
    firstTurret: 0.03
  },
  TOP: {
    totalObjectives: 0.30,
    objectivesStolen: 0.05,
    baronKills: 0.10,
    dragonKills: 0.10,
    riftHerald: 0.10,
    turretTakedowns: 0.20,
    inhibitors: 0.10,
    perfectDragonSoulBonus: 0,  // Pure bonus, not part of base score
    firstTurret: 0.03
  }
};

// Bonus points for perfect dragon soul (added on top of score, not normalized)
export const perfectDragonSoulBonusPoints = {
  DEFAULT: 15,
  JUNGLE: 20,  // Junglers get extra bonus for securing dragon soul
  SUPPORT: 12,
  CARRY: 15,
  TOP: 15
};

// Objective multipliers by role
export const objectiveMultipliers = {
  JUNGLE: 1.8, 
  SUPPORT: 0.9,
  CARRY: 0.8,
  TOP: 1.0,
  DEFAULT: 1.0
};

// Dragon bonus multipliers (applied to dragon kills)
export const dragonBonusMultipliers = {
  JUNGLE: 1.8,      
  SUPPORT: 1.0,
  CARRY: 1.0,
  TOP: 1.0,
  DEFAULT: 1.0
};

// ============ ECONOMY WEIGHTS BY ROLE ============
export const economyWeightsByRole = {
  DEFAULT: {
    goldPerMin: 0.60,
    cs: 0.40
  },
  SUPPORT: {
    goldPerMin: 0.85,
    cs: 0.15
  }
};

// ============ SURVIVAL WEIGHTS ============
export const survivalWeights: SurvivalWeights = {
  deathPenalty: 0.40,
  damageMitigated: 0.25,
  timeAlive: 0.20,
  longestLiving: 0.15
};

// ============ VISION WEIGHTS ============
export const visionWeights: VisionWeights = {
  visionScore: 0.60,
  wardsPlaced: 0.15,
  wardsKilled: 0.15,
  controlWards: 0.10
};

export const visionMultipliers = {
  SUPPORT: {
    multiplier: 1.1,
    penalties: {
      low: { threshold: 50, penalty: 0.4 },
      medium: { threshold: 70, penalty: 0.7 }
    }
  },
  DEFAULT: {
    multiplier: 2,
    penalties: {}
  }
};

// ============ SCORE CATEGORY WEIGHTS ============
export const scoreCategoryWeights: ScoreCategoryWeights = {
  combat: 0.25,
  objectives: 0.25,
  economy: 0.15,
  survival: 0.15,
  vision: 0.10,
  macro: 0.10
};

// ============ MACRO SCORE BONUSES ============
export const macroBonuses = {
  win: 50,
  perfectDragonSoul: 25,  // Pure bonus
  firstTurret: 15
};

// ============ HELPER FUNCTIONS ============

export const getCombatWeights = (position: string): CombatWeights => {
  const isSupport = position === "UTILITY" || position === "SUPPORT";
  const isJungle = position === "JUNGLE";
  const isCarry = position === "MID" || position === "BOTTOM";
  const isTop = position === "TOP";
  
  if (isSupport) return combatWeightsByRole.SUPPORT;
  if (isJungle) return combatWeightsByRole.JUNGLE;
  if (isCarry) return combatWeightsByRole.CARRY;
  if (isTop) return combatWeightsByRole.TOP;
  return combatWeightsByRole.DEFAULT;
};

export const getObjectiveWeights = (position: string): ObjectiveWeights => {
  const isJungle = position === "JUNGLE";
  const isSupport = position === "UTILITY" || position === "SUPPORT";
  const isCarry = position === "MID" || position === "BOTTOM";
  const isTop = position === "TOP";
  
  if (isJungle) return objectiveWeightsByRole.JUNGLE;
  if (isSupport) return objectiveWeightsByRole.SUPPORT;
  if (isCarry) return objectiveWeightsByRole.CARRY;
  if (isTop) return objectiveWeightsByRole.TOP;
  return objectiveWeightsByRole.DEFAULT;
};

export const getPerfectDragonSoulBonus = (position: string, hasPerfectDragonSoul: boolean): number => {
  if (!hasPerfectDragonSoul) return 0;
  
  const isJungle = position === "JUNGLE";
  const isSupport = position === "UTILITY" || position === "SUPPORT";
  
  if (isJungle) return perfectDragonSoulBonusPoints.JUNGLE;
  if (isSupport) return perfectDragonSoulBonusPoints.SUPPORT;
  return perfectDragonSoulBonusPoints.DEFAULT;
};

export const getObjectiveMultiplier = (position: string): number => {
  const isJungle = position === "JUNGLE";
  const isSupport = position === "UTILITY" || position === "SUPPORT";
  const isCarry = position === "MID" || position === "BOTTOM";
  
  if (isJungle) return objectiveMultipliers.JUNGLE;
  if (isSupport) return objectiveMultipliers.SUPPORT;
  if (isCarry) return objectiveMultipliers.CARRY;
  return objectiveMultipliers.DEFAULT;
};

export const getDragonBonusMultiplier = (position: string): number => {
  const isJungle = position === "JUNGLE";
  
  if (isJungle) return dragonBonusMultipliers.JUNGLE;
  return dragonBonusMultipliers.DEFAULT;
};

export const getEconomyWeights = (position: string): EconomyWeights => {
  const isSupport = position === "UTILITY" || position === "SUPPORT";
  
  if (isSupport) return economyWeightsByRole.SUPPORT;
  return economyWeightsByRole.DEFAULT;
};

export const getVisionMultiplier = (position: string, visionPercent: number): number => {
  const isSupport = position === "UTILITY" || position === "SUPPORT";
  
  if (isSupport) {
    const multiplier = visionMultipliers.SUPPORT.multiplier;
    let penalty = 1.1;
    
    if (visionPercent < visionMultipliers.SUPPORT.penalties.low.threshold) {
      penalty = visionMultipliers.SUPPORT.penalties.low.penalty;
    } else if (visionPercent < visionMultipliers.SUPPORT.penalties.medium.threshold) {
      penalty = visionMultipliers.SUPPORT.penalties.medium.penalty;
    }
    
    return multiplier * penalty;
  }
  
  return visionMultipliers.DEFAULT.multiplier;
};

export const getMacroScore = (
  win: boolean,
  perfectDragonSoulsTaken: number,
  firstTurretKilled: number
): number => {
  let macroScore = (win ? macroBonuses.win : 0) * 0.60;
  
  // Pure bonus - only adds, never subtracts
  if (perfectDragonSoulsTaken) {
    macroScore += macroBonuses.perfectDragonSoul;
  }
  
  if (firstTurretKilled) {
    macroScore += macroBonuses.firstTurret;
  }
  
  return macroScore * scoreCategoryWeights.macro;
};

// ============ MVP MULTIPLIERS ============
export const mvpMultipliers = {
  killParticipation: {
    high: { threshold: 0.65, multiplier: 1.20 },
    medium: { threshold: 0.40, multiplier: 1.10 },
    low: { threshold: 0.30, multiplier: 0.85 }
  },
  perfectKDA: 1.10,
  pentaKill: 1.08,
  perfectDragonSoul: 1.15,  // Pure bonus multiplier for MVP calculation
  firstTurret: 1.05,
  highDeaths: { threshold: 8, multiplier: 0.80 },
  
  // Role specific
  support: {
    lowKPPenalty: { threshold: 0.5, multiplier: 0.70 },
    highVisionBonus: 1.10
  },
  jungle: {
    highDragons: { threshold: 4, multiplier: 1.25 },
    highObjectives: { threshold: 6, multiplier: 1.20 },
    mediumObjectives: { threshold: 3, multiplier: 1.10 },
    lowObjectives: { multiplier: 0.90 }
  },
  carry: {
    highKDA: { threshold: 5, multiplier: 1.10 },
    highDamageShare: { threshold: 0.3, multiplier: 1.10 }
  }
};