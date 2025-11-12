// Summoner Spell ID to Name mapping
// Source: https://darkintaqt.com/blog/summoner-ids
export const SUMMONER_SPELL_NAMES: Record<number, string> = {
  1: "Cleanse",
  3: "Exhaust",
  4: "Flash",
  6: "Ghost",
  7: "Heal",
  11: "Smite",
  13: "Clarity",
  14: "Ignite",
  21: "Barrier",
  30: "To the King!",
  31: "Poro Toss",
  39: "Mark",
  12: "Teleport",
  2201: "Flee",
  2202: "Flash", // Cherry variant
};

export function getSummonerSpellName(spellId: number): string {
  return SUMMONER_SPELL_NAMES[spellId] || "Unknown";
}

// Get icon URL for summoner spell
export function getSummonerSpellIcon(spellId: number): string {
  // Map spell IDs to their Data Dragon names
  const spellKeyMap: Record<number, string> = {
    1: "SummonerBoost", // Cleanse
    3: "SummonerExhaust",
    4: "SummonerFlash",
    6: "SummonerHaste", // Ghost
    7: "SummonerHeal",
    11: "SummonerSmite",
    12: "SummonerTeleport",
    13: "SummonerMana", // Clarity
    14: "SummonerDot", // Ignite
    21: "SummonerBarrier",
    30: "SummonerPoroRecall", // To the King!
    31: "SummonerPoroThrow", // Poro Toss
    39: "SummonerSnowball", // Mark
    2201: "SummonerCherryHold",
    2202: "SummonerCherryFlash",
  };

  const spellKey = spellKeyMap[spellId] || "SummonerFlash";
  return `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/spell/${spellKey}.png`;
}
