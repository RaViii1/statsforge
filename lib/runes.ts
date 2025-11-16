// League of Legends Runes (Season 2024)
// Source: https://ddragon.leagueoflegends.com/cdn/14.1.1/data/en_US/runesReforged.json
// Icons from Community Dragon CDN

export interface Rune {
  id: number;
  name: string;
  shortDesc: string;
  longDesc: string;
}

export interface RuneTree {
  id: number;
  key: string;
  name: string;
  icon: string;
}

export const STAT_SHARDS_GRID: number[][] = [
  [5008, 5005, 5007],  // Offensive
  [5008, 5002, 5001],  // Flex
  [5011, 5017, 5001],  // Defensive/scaling health
];

// Rune Trees (Paths)
export const RUNE_TREES: Record<number, RuneTree> = {
  8000: { id: 8000, key: "Precision", name: "Precision", icon: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/7201_precision.png" },
  8100: { id: 8100, key: "Domination", name: "Domination", icon: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/7200_domination.png" },
  8200: { id: 8200, key: "Sorcery", name: "Sorcery", icon: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/7202_sorcery.png" },
  8300: { id: 8300, key: "Inspiration", name: "Inspiration", icon: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/7203_whimsy.png" },
  8400: { id: 8400, key: "Resolve", name: "Resolve", icon: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/7204_resolve.png" },
};

// All Runes with descriptions
export const RUNES: Record<number, Rune> = {
  // Precision Keystones
  8005: { 
    id: 8005, 
    name: "Press the Attack", 
    shortDesc: "Attacking an enemy champion 3 consecutive times deals bonus damage",
    longDesc: "Hitting an enemy champion with 3 consecutive basic attacks deals 40-180 bonus adaptive damage and makes them vulnerable, increasing the damage they take by 8-12% from all sources for 6s."
  },
  8008: { 
    id: 8008, 
    name: "Lethal Tempo", 
    shortDesc: "Gain attack speed when attacking enemy champions",
    longDesc: "1.5s after damaging a champion gain 40-110% attack speed for 6s. Attacking a champion extends this duration for 1.5s."
  },
  8021: { 
    id: 8021, 
    name: "Fleet Footwork", 
    shortDesc: "Attacking and moving builds Energy stacks. At 100 stacks, heal and gain movement speed",
    longDesc: "Attacking and moving builds Energy stacks. At 100 stacks, your next attack heals you for 10-100 and grants 20% movement speed for 1s."
  },
  8010: { 
    id: 8010, 
    name: "Conqueror", 
    shortDesc: "Gain stacks of adaptive force when attacking enemy champions",
    longDesc: "Gain 2 stacks of Conqueror for 5s when damaging enemy champions (max 12 stacks). Each stack grants 1.8-4.7 bonus Adaptive Force. At max stacks, heal for 8% of damage dealt to champions."
  },

  // Precision Slot 1
  9101: { 
    id: 9101, 
    name: "Absorb life", 
    shortDesc: "Killing an enemy heals you for 1-23 (based on level)",
    longDesc: "Killing an enemy heals you for 1-23 (based on level)"
  },
  9111: { 
    id: 9111, 
    name: "Triumph", 
    shortDesc: "Takedowns restore health and grant bonus gold",
    longDesc: "Takedowns restore 5% of your missing health and grant an additional 20 gold."
  },
  8009: { 
    id: 8009, 
    name: "Presence of Mind", 
    shortDesc: "Takedowns restore mana/energy and increase max mana",
    longDesc: "Damaging an enemy champion increases your mana regeneration by 1.5-11 mana per second for 4 seconds. Takedowns restore 15% of your maximum mana and permanently increase your maximum mana by 100 (max 500)."
  },

  // Precision Slot 2
  9104: { 
    id: 9104, 
    name: "Legend: Alacrity", 
    shortDesc: "Gain attack speed per Legend stack",
    longDesc: "Gain 3% attack speed plus an additional 1.5% for every Legend stack (max 10 stacks). Earn progress toward Legend stacks for every champion takedown, epic monster takedown, large monster kill, and minion kill."
  },
  9105: { 
    id: 9105, 
    name: "Legend: Haste", 
    shortDesc: "Gain ability haste per Legend stack",
    longDesc: "Gain 5 ability haste plus an additional 2 ability haste for every Legend stack (max 10 stacks). Earn progress toward Legend stacks for every champion takedown, epic monster takedown, large monster kill, and minion kill."
  },
  9103: { 
    id: 9103, 
    name: "Legend: Bloodline", 
    shortDesc: "Gain life steal per Legend stack",
    longDesc: "Gain 0.6% life steal for every Legend stack (max 10 stacks). Earn progress toward Legend stacks for every champion takedown, epic monster takedown, large monster kill, and minion kill."
  },

  // Precision Slot 3
  8014: { 
    id: 8014, 
    name: "Coup de Grace", 
    shortDesc: "Deal more damage to low health enemies",
    longDesc: "Deal 8% more damage to champions who have less than 40% health."
  },
  8017: { 
    id: 8017, 
    name: "Cut Down", 
    shortDesc: "Deal more damage to high health enemies",
    longDesc: "Deal 5% to 15% more damage to champions with more max health than you."
  },
  8299: { 
    id: 8299, 
    name: "Last Stand", 
    shortDesc: "Deal more damage when at low health",
    longDesc: "Deal 5% to 11% increased damage to champions while you are below 60% health. Max damage reached at 30% health."
  },

  // Domination Keystones
  8112: { 
    id: 8112, 
    name: "Electrocute", 
    shortDesc: "Hitting a champion with 3 separate attacks or abilities deals bonus damage",
    longDesc: "Hitting a champion with 3 separate attacks or abilities within 3s deals bonus adaptive damage (25-70 + 40% bonus AD + 25% AP)."
  },
  8128: { 
    id: 8128, 
    name: "Dark Harvest", 
    shortDesc: "Damaging low health champions deals adaptive damage and harvests their soul",
    longDesc: "Damaging a champion below 50% health deals adaptive damage and harvests their soul, permanently increasing Dark Harvest's damage by 5 (20-80 + 5 per Soul + 25% bonus AD + 15% AP)."
  },
  9923: { 
    id: 9923, 
    name: "Hail of Blades", 
    shortDesc: "Gain attack speed for your first 3 attacks",
    longDesc: "Gain 110% attack speed when you attack an enemy champion for up to 3 attacks. Cooldown: 12s out of combat with champions."
  },

  // Domination Slot 1
  8126: { 
    id: 8126, 
    name: "Cheap Shot", 
    shortDesc: "Deal bonus true damage to champions with impaired movement",
    longDesc: "Damaging champions with impaired movement or actions deals 10-45 bonus true damage. Cooldown: 4s."
  },
  8139: { 
    id: 8139, 
    name: "Taste of Blood", 
    shortDesc: "Heal when damaging an enemy champion",
    longDesc: "Heal when you damage an enemy champion (18-35 + 20% bonus AD + 10% AP). Cooldown: 20s."
  },
  8143: { 
    id: 8143, 
    name: "Sudden Impact", 
    shortDesc: "Gain lethality and magic penetration after using a dash, leap, blink, or teleport",
    longDesc: "After exiting stealth or using a dash, leap, blink, or teleport, dealing damage to a champion grants 7 Lethality and 6 Magic Penetration for 5s. Cooldown: 4s."
  },

  // Domination Slot 2
  8136: { 
    id: 8136, 
    name: "Zombie Ward", 
    shortDesc: "Takedowns on enemy wards cause friendly Zombie Wards to sprout",
    longDesc: "After killing a ward, a friendly Zombie Ward is raised in its place for 120s. When your wards expire, they also reanimate as Zombie Wards. Gain adaptive force for every Zombie Ward spawned plus additional adaptive force for each Zombie Ward active."
  },
  8120: { 
    id: 8120, 
    name: "Ghost Poro", 
    shortDesc: "Gain adaptive force when entering brush without nearby allies",
    longDesc: "When your wards expire, they leave behind a Ghost Poro. The Ghost Poro grants vision until discovered. Gain 1.2-14.4 adaptive force per Ghost Poro spawned plus 1.2-14.4 adaptive force if you have at least 10 spawned."
  },
  8138: { 
    id: 8138, 
    name: "Eyeball Collection", 
    shortDesc: "Collect eyeballs for champion and ward takedowns",
    longDesc: "Collect 1 eyeball per champion takedown or ward killed (max 10). Gain 1.2 adaptive force per eyeball plus 6 adaptive force upon completing your collection."
  },

  // Domination Slot 3
  8135: { 
    id: 8135, 
    name: "Treasure Hunter", 
    shortDesc: "Gain gold for unique champion takedowns",
    longDesc: "Gain 50 gold + 20 gold per Bounty Hunter stack for champion takedowns (assists count for half). Bounty Hunter stacks are earned the first time you get a takedown on each enemy champion (max 5 stacks)."
  },
  8105: { 
    id: 8105, 
    name: "Relentless Hunter", 
    shortDesc: "Gain out of combat movement speed per unique champion takedown",
    longDesc: "Gain 5 out of combat movement speed plus 8 per Bounty Hunter stack. Bounty Hunter stacks are earned the first time you get a takedown on each enemy champion."
  },
  8106: { 
    id: 8106, 
    name: "Ultimate Hunter", 
    shortDesc: "Gain ultimate haste per unique champion takedown",
    longDesc: "Gain 6 ultimate haste plus 5 per Bounty Hunter stack. Bounty Hunter stacks are earned the first time you get a takedown on each enemy champion."
  },

  // Sorcery Keystones
  8214: { 
    id: 8214, 
    name: "Summon Aery", 
    shortDesc: "Damaging champions sends Aery to them, shielding allies or damaging enemies",
    longDesc: "Damaging enemy champions with basic attacks or abilities sends Aery to them, dealing 10-40 + 10% AP + 15% bonus AD. Healing or shielding allies sends Aery to them, shielding for 35-80 + 22.5% AP + 35% bonus AD."
  },
  8229: { 
    id: 8229, 
    name: "Arcane Comet", 
    shortDesc: "Damaging a champion hurls a comet at their location",
    longDesc: "Damaging a champion with an ability hurls a comet at their location, dealing 30-100 + 20% AP + 35% bonus AD adaptive damage. Cooldown: 20-8s."
  },
  8230: { 
    id: 8230, 
    name: "Phase Rush", 
    shortDesc: "Gain movement speed after hitting 3 separate attacks or abilities",
    longDesc: "Hitting an enemy champion with 3 attacks or separate abilities within 4s grants 25-40% movement speed and 75% slow resistance for 3s."
  },

  // Sorcery Slot 1
  8224: { 
    id: 8224, 
    name: "Axiom arcanist", 
    shortDesc: "Your ultimate has increased damage, healing, and shielding, takedown reduces ults cooldown.",
    longDesc: "Your ultimate has 12% increased damage (reduced to 8% for area of effect abilities), An icon representing the keyword Heal healing and An icon representing the keyword Shield shielding"
  },
  8226: { 
    id: 8226, 
    name: "Manaflow Band", 
    shortDesc: "Restore mana when hitting an enemy champion with an ability",
    longDesc: "Hitting an enemy champion with an ability permanently increases your maximum mana by 25, up to 250 mana. Upon earning 250 mana, restore 1% of your missing mana every 5 seconds."
  },
  8275: { 
    id: 8275, 
    name: "Nimbus Cloak", 
    shortDesc: "Gain movement speed after casting a summoner spell",
    longDesc: "After casting a Summoner Spell, gain 5-25% movement speed for 2.5s based on the Summoner Spell's cooldown."
  },

  // Sorcery Slot 2
  8210: { 
    id: 8210, 
    name: "Transcendence", 
    shortDesc: "Gain bonus ability haste scaling with level",
    longDesc: "Gain bonuses upon reaching the following levels: Level 5: +5 ability haste, Level 8: +5 ability haste, Level 11: +5 ability haste. For each champion takedown you have within 10s of them dying, reduce your basic abilities' remaining cooldowns by 20%."
  },
  8234: { 
    id: 8234, 
    name: "Celerity", 
    shortDesc: "Gain movement speed and extra AP or AD based on bonus movement speed",
    longDesc: "Gain 1% movement speed and add 7% of your bonus movement speed to your AP or AD, adaptive."
  },
  8233: { 
    id: 8233, 
    name: "Absolute Focus", 
    shortDesc: "Gain adaptive force while above 70% health",
    longDesc: "While above 70% health, gain 1.8-18 adaptive force based on level."
  },

  // Sorcery Slot 3
  8237: { 
    id: 8237, 
    name: "Scorch", 
    shortDesc: "Damaging abilities burn enemies",
    longDesc: "Damaging abilities burn enemies for 15-35 magic damage over 1s. Cooldown: 10s."
  },
  8232: { 
    id: 8232, 
    name: "Waterwalking", 
    shortDesc: "Gain movement speed and AP or AD in the river",
    longDesc: "Gain 25 movement speed and 18 adaptive force when in the river. May be out of combat only."
  },
  8236: { 
    id: 8236, 
    name: "Gathering Storm", 
    shortDesc: "Gain increasing amounts of adaptive force as the game goes on",
    longDesc: "Every 10 min gain 8 AP or 5 AD, adaptive. After 30 min, gain 24 AP or 14 AD every 10 min. After 40 min, gain 48 AP or 29 AD every 10 min."
  },

  // Resolve Keystones
  8437: { 
    id: 8437, 
    name: "Grasp of the Undying", 
    shortDesc: "Every 4s your next attack on a champion deals bonus damage and heals you",
    longDesc: "Every 4s in combat, your next attack on a champion deals bonus magic damage equal to 4% of your max health, heals you for 2% of your max health, and permanently increases your health by 5."
  },
  8439: { 
    id: 8439, 
    name: "Aftershock", 
    shortDesc: "Gain resistances after immobilizing an enemy champion",
    longDesc: "After immobilizing an enemy champion, increase your Armor and Magic Resist by 35 + 80% of your bonus resists for 2.5s. Then explode, dealing magic damage to nearby enemies."
  },
  8465: { 
    id: 8465, 
    name: "Guardian", 
    shortDesc: "Guard allies you cast spells on and allies that are very nearby",
    longDesc: "Guard allies within 350 units. If you or a guarded ally would take damage, both of you gain a shield for 1.5s. Cooldown: 90s."
  },

  // Resolve Slot 1
  8446: { 
    id: 8446, 
    name: "Demolish", 
    shortDesc: "Deal bonus damage to towers after being near them",
    longDesc: "Charge up a powerful attack against a tower over 3s while within 600 range of it. The charged attack deals 100 + 35% of your max health as bonus physical damage. Cooldown: 45s."
  },
  8463: { 
    id: 8463, 
    name: "Font of Life", 
    shortDesc: "Impairing enemy champions marks them",
    longDesc: "Impairing the movement of an enemy champion marks them for 4s. Ally champions who attack marked enemies heal for 5 + 1% of your max health over 2s."
  },
  8401: { 
    id: 8401, 
    name: "Shield Bash", 
    shortDesc: "Gain resistances while shielded and deal bonus damage when shield expires",
    longDesc: "While shielded, gain 1-10 Armor and Magic Resist based on level. Whenever you gain a shield, your next basic attack against a champion deals 5-30 + 1.5% max health + 8.5% new shield amount as bonus adaptive damage."
  },

  // Resolve Slot 2
  8429: { 
    id: 8429, 
    name: "Conditioning", 
    shortDesc: "Gain bonus resistances after 12 minutes",
    longDesc: "After 12 min gain 8 Armor and 8 Magic Resist and increase your total Armor and Magic Resist by 3%."
  },
  8444: { 
    id: 8444, 
    name: "Second Wind", 
    shortDesc: "Regenerate health after taking damage from an enemy champion",
    longDesc: "After taking damage from an enemy champion, regenerate 4 + 2% of your missing health over 10s."
  },
  8473: { 
    id: 8473, 
    name: "Bone Plating", 
    shortDesc: "After taking damage, block the next 3 instances of damage",
    longDesc: "After taking damage from an enemy champion, the next 3 spells or attacks you receive from them deal 30-60 less damage. Duration: 1.5s. Cooldown: 45s."
  },

  // Resolve Slot 3
  8451: { 
    id: 8451, 
    name: "Overgrowth", 
    shortDesc: "Gain permanent health from nearby minion or monster deaths",
    longDesc: "Absorb life essence from monsters or enemy minions that die near you, permanently gaining 3 maximum health per stack. After gaining 120 health, gain an additional 3.5% max health."
  },
  8453: { 
    id: 8453, 
    name: "Revitalize", 
    shortDesc: "Heals and shields are stronger",
    longDesc: "Heals and shields you cast or receive are 5% stronger and increased by an additional 10% on targets below 40% health."
  },
  8242: { 
    id: 8242, 
    name: "Unflinching", 
    shortDesc: "Gain tenacity and slow resist based on missing health",
    longDesc: "Gain 10% Tenacity and 10% Slow Resist. These values increase by up to an additional 20% Tenacity and 20% Slow Resist based on missing health. Maximum value achieved at 30% health."
  },

  // Inspiration Keystones
  8351: { 
    id: 8351, 
    name: "Glacial Augment", 
    shortDesc: "Immobilizing an enemy creates zones that slow enemies",
    longDesc: "Immobilizing an enemy champion creates 3 glacial rays that emanate from them towards nearby champions and large monsters. Rays slow enemies by 30% + 3% per 10% heal and shield power and reduce their damage by 15% against your allies (not yourself)."
  },
  8360: { 
    id: 8360, 
    name: "Unsealed Spellbook", 
    shortDesc: "Swap summoner spells while out of combat",
    longDesc: "Swap one of your equipped Summoner Spells to a new, single use Summoner Spell. Each unique Summoner Spell you swap to permanently decreases your swap cooldown by 25s."
  },
  8369: { 
    id: 8369, 
    name: "First Strike", 
    shortDesc: "Deal bonus damage and gain gold when striking first",
    longDesc: "Damaging an enemy champion before they damage you grants 5 gold and First Strike for 3s, causing you to deal 9% extra damage and granting 70% of that damage dealt as gold."
  },

  // Inspiration Slot 1
  8306: { 
    id: 8306, 
    name: "Hextech Flashtraption", 
    shortDesc: "While Flash is on cooldown gain access to Hexflash",
    longDesc: "While Flash is on cooldown it is replaced with Hexflash. Hexflash: Channel for 2s to blink to a new location. Cooldown: 20s. Hexflash goes on a 10s cooldown when you enter champion combat."
  },
  8304: { 
    id: 8304, 
    name: "Magical Footwear", 
    shortDesc: "Gain free boots at 12 minutes",
    longDesc: "You get free Slightly Magical Boots at 12 min, but you cannot buy boots before then. For each takedown you acquire the boots 45s sooner. Slightly Magical Boots grant an additional 10 movement speed."
  },
  8313: { 
    id: 8313, 
    name: "Cashback", 
    shortDesc: "Gain gold back on item purchases",
    longDesc: "Gain 8% of the gold spent on item purchases back as gold."
  },

  // Inspiration Slot 2
  8321: { 
    id: 8321, 
    name: "Triple Tonic", 
    shortDesc: "Passive: Gain an Elixir upon reaching each of the following levels (3, 6, 9)",
    longDesc: "Passive: Gain an Elixir upon reaching each of the following levels: Level 3: An icon for the item Elixir of Avarice Elixir of Avarice | Level 6: An icon for the item Elixir of Force Elixir of Force | Level 9: An icon for the item Elixir of Skill Elixir of Skill"
  },
  8316: { 
    id: 8316, 
    name: "Minion Dematerializer", 
    shortDesc: "Start the game with 3 Minion Dematerializers",
    longDesc: "Start with 3 Minion Dematerializers that kill and absorb lane minions instantly. Dematerializing a minion increases your damage dealt to that type of minion by 6%."
  },
  8345: { 
    id: 8345, 
    name: "Biscuit Delivery", 
    shortDesc: "Gain a biscuit every 2 minutes",
    longDesc: "Gain a Total Biscuit of Everlasting Will every 2 min, until 6 min. Biscuits restore 10% of your missing health and mana over 5s. Consuming any Biscuit increases your mana cap by 40 mana permanently."
  },

  // Inspiration Slot 3
  8347: { 
    id: 8347, 
    name: "Cosmic Insight", 
    shortDesc: "Gain ability haste and summoner spell haste",
    longDesc: "Gain 18 summoner spell haste and 10 item haste."
  },
  8410: { 
    id: 8410, 
    name: "Approach Velocity", 
    shortDesc: "Gain movement speed towards immobile allies or enemies you've impaired",
    longDesc: "Gain 7.5% movement speed towards nearby enemy champions that are movement impaired, increased to 15% for enemy champions that you impair. Activation range for this effect is doubled for enemy champions you immobilize."
  },
  8352: { 
    id: 8352, 
    name: "Time Warp Tonic", 
    shortDesc: "Potions and biscuits grant movement speed and restore health/mana instantly",
    longDesc: "Consuming a potion or biscuit grants 4% movement speed and 30% of the health/mana over time from that consumable is granted immediately."
  },

  

  // Stat Shards (Minor Runes)
  5008: { id: 5008, name: "+9 Adaptive Force", shortDesc: "+9 Adaptive Force", longDesc: "Gain 9 Adaptive Force." },
  5005: { id: 5005, name: "+10% Attack Speed", shortDesc: "+10% Attack Speed", longDesc: "Gain 10% Attack Speed." },
  5007: { id: 5007, name: "+8 Ability Haste", shortDesc: "+8 Ability Haste", longDesc: "Gain 8 Ability Haste." },
  5002: { id: 5007, name: "+8 Ability Haste", shortDesc: "+8 Ability Haste", longDesc: "Gain 8 Ability Haste." },
  5006: { id: 5006, name: "+2% Movement Speed", shortDesc: "+2% Movement Speed", longDesc: "Gain 2% Movement Speed." },
  5001: { id: 5001, name: "+10-180 Scaling Health", shortDesc: "+10-180 Scaling Health", longDesc: "Gain 10 to 180 Health based on champion level." },
  5017: { id: 5017, name: "+10% Slow Resist + Tenacity", shortDesc: "+10% Slow Resist + Tenacity", longDesc: "Gain 10% slow resistance and tenacity (reduces the duration of crowd control effects)." },
  5016: { id: 5016, name: "+10% Slow Resist + Tenacity", shortDesc: "+10% Slow Resist + Tenacity", longDesc: "Gain 10% slow resistance and tenacity (reduces the duration of crowd control effects)." },
  5013: { id: 5013, name: "+10-180 Scaling Health", shortDesc: "+10-180 Scaling Health", longDesc: "Gain 10 to 180 Health based on champion level." },
  5011: { id: 5011, name: "+65 Health", shortDesc: "+65 Health", longDesc: "+65 Health" },
  
};

// Helper function to get rune tree name
export function getRuneTreeName(treeId: number | undefined): string {
  if (!treeId) return "Unknown Tree";
  return RUNE_TREES[treeId]?.name || `Tree ${treeId}`;
}

// Helper function to get rune tree icon
export function getRuneTreeIcon(treeId: number | undefined): string {
  if (!treeId) return "";
  return RUNE_TREES[treeId]?.icon || "";
}

export function getRuneName(runeId: number | undefined): string {
  if (!runeId) return "No Rune";
  return RUNES[runeId]?.name || `Rune ${runeId}`;
}

export function getRuneIcon(runeId: number | undefined): string {
  if (!runeId) return "";
  
  // Check if it's a rune tree (primary/secondary path)
  const tree = RUNE_TREES[runeId];
  if (tree) {
    return tree.icon;
  }
  
  // Individual rune icon - use Community Dragon CDN with fallback
  const runePath = getRuneIconPath(runeId);
  
  if (!runePath) {
    return "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png";
  }
  
  return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/${runePath}`;
}

function getRuneIconPath(runeId: number): string {
  // Map rune IDs to their icon paths on Community Dragon
  const iconPaths: Record<number, string> = {
    // Precision Keystones
    8005: "styles/precision/presstheattack/presstheattack.png",
    8008: "styles/precision/lethaltempo/lethaltempotemp.png",
    8021: "styles/precision/fleetfootwork/fleetfootwork.png",
    8010: "styles/precision/conqueror/conqueror.png",
    
    // Precision Slot 1
    9101: "styles/precision/absorblife/absorblife.png",
    9111: "styles/precision/triumph.png",
    8009: "styles/precision/presenceofmind/presenceofmind.png",
    
    // Precision Slot 2
    9104: "styles/precision/legendalacrity/legendalacrity.png",
    9105: "styles/precision/legendhaste/legendhaste.png",
    9103: "styles/precision/legendbloodline/legendbloodline.png",
    
    // Precision Slot 3
    8014: "styles/precision/coupdegrace/coupdegrace.png",
    8017: "styles/precision/cutdown/cutdown.png",
    8299: "styles/precision/laststand/laststand.png",
    
    // Domination Keystones
    8112: "styles/domination/electrocute/electrocute.png",
    8124: "styles/domination/predator/predator.png",
    8128: "styles/domination/darkharvest/darkharvest.png",
    9923: "styles/domination/hailofblades/hailofblades.png",
    
    // Domination Slot 1
    8126: "styles/domination/cheapshot/cheapshot.png",
    8139: "styles/domination/tasteofblood/greenterror_tasteofblood.png",
    8143: "styles/domination/suddenimpact/suddenimpact.png",
    
    // Domination Slot 2
    8136: "styles/domination/zombieward/zombieward.png",
    8120: "styles/domination/ghostporo/ghostporo.png",
    8138: "styles/domination/eyeballcollection/eyeballcollection.png",
    
    // Domination Slot 3
    8135: "styles/domination/treasurehunter/treasurehunter.png",
    8105: "styles/domination/relentlesshunter/relentlesshunter.png",
    8106: "styles/domination/ultimatehunter/ultimatehunter.png",
    
    // Sorcery Keystones
    8214: "styles/sorcery/summonaery/summonaery.png",
    8229: "styles/sorcery/arcanecomet/arcanecomet.png",
    8230: "styles/sorcery/phaserush/phaserush.png",
    
    // Sorcery Slot 1
    8224: "styles/sorcery/nullifyingorb/axiom_arcanist.png",
    8226: "styles/sorcery/manaflowband/manaflowband.png",
    8275: "styles/sorcery/nimbuscloak/6361.png",
    
    // Sorcery Slot 2
    8210: "styles/sorcery/transcendence/transcendence.png",
    8234: "styles/sorcery/celerity/celeritytemp.png",
    8233: "styles/sorcery/absolutefocus/absolutefocus.png",
    
    // Sorcery Slot 3
    8237: "styles/sorcery/scorch/scorch.png",
    8232: "styles/sorcery/waterwalking/waterwalking.png",
    8236: "styles/sorcery/gatheringstorm/gatheringstorm.png",
    
    // Resolve Keystones
    8437: "styles/resolve/graspoftheundying/graspoftheundying.png",
    8439: "styles/resolve/veteranaftershock/veteranaftershock.png",
    8465: "styles/resolve/guardian/guardian.png",
    
    // Resolve Slot 1
    8446: "styles/resolve/demolish/demolish.png",
    8463: "styles/resolve/fontoflife/fontoflife.png",
    8401: "styles/resolve/mirrorshell/mirrorshell.png",
    
    // Resolve Slot 2
    8429: "styles/resolve/conditioning/conditioning.png",
    8444: "styles/resolve/secondwind/secondwind.png",
    8473: "styles/resolve/boneplating/boneplating.png",
    
    // Resolve Slot 3
    8451: "styles/resolve/overgrowth/overgrowth.png",
    8453: "styles/resolve/revitalize/revitalize.png",
    8242: "styles/resolve/unflinching/unflinching.png",
    
    // Inspiration Keystones
    8351: "styles/inspiration/glacialaugment/glacialaugment.png",
    8360: "styles/inspiration/unsealedspellbook/unsealedspellbook.png",
    8369: "styles/inspiration/firststrike/firststrike.png",
    
    // Inspiration Slot 1
    8306: "styles/inspiration/hextechflashtraption/hextechflashtraption.png",
    8304: "styles/inspiration/magicalfootwear/magicalfootwear.png",
    8313: "styles/inspiration/cashback/cashback2.png",
    
    // Inspiration Slot 2
    8321: "styles/inspiration/perfecttiming/alchemistcabinet.png",
    8316: "styles/inspiration/timewarptonic/timewarptonic.png",
    8345: "styles/inspiration/biscuitdelivery/biscuitdelivery.png",
    
    // Inspiration Slot 3
    8347: "styles/inspiration/cosmicinsight/cosmicinsight.png",
    8410: "styles/resolve/approachvelocity/approachvelocity.png",
    8352: "styles/inspiration/timewarptonic/timewarptonic.png",
    
    // Stat Shards
    5008: "statmods/statmodsadaptiveforceicon.png",
    5005: "statmods/statmodsattackspeedicon.png",
    5007: "statmods/statmodscdrscalingicon.png",
    5002: "statmods/statmodsmovementspeedicon.png",
    5003: "statmods/statmodsmagicresicon.png",
    5001: "statmods/statmodshealthscalingicon.png",
    5017: "statmods/statmodstenacityicon.png",
    5013: "statmods/statmodshealthscalingicon.png",
    5011: "statmods/statmodshealthscalingicon.png",
    
  };
  
  return iconPaths[runeId] || "precision/presenceofmind/presenceofmind.png";
}

export function getRuneDescription(runeId: number | undefined): string {
  if (!runeId) return "";
  return RUNES[runeId]?.longDesc || RUNES[runeId]?.shortDesc || "";
}

export function getRuneTreeForRune(runeId: number): number | null {
  // Precision: 8000-8999
  if (runeId >= 8000 && runeId < 8100) return 8000;
  if (runeId >= 9100 && runeId < 9200) return 8000;
  
  // Domination: 8100-8199
  if (runeId >= 8100 && runeId < 8200) return 8100;
  
  // Sorcery: 8200-8299
  if (runeId >= 8200 && runeId < 8300) return 8200;
  
  // Inspiration: 8300-8399
  if (runeId >= 8300 && runeId < 8400) return 8300;
  
  // Resolve: 8400-8499
  if (runeId >= 8400 && runeId < 8500) return 8400;
  
  return null;
}

// Get all runes for a specific tree
export function getRunesForTree(treeId: number): number[][] {
  const treeRunes: Record<number, number[][]> = {
    // Precision
    8000: [
      [8005, 8008, 8021, 8010], // Keystones
      [9101, 9111, 8009], // Slot 1
      [9104, 9105, 9103], // Slot 2
      [8014, 8017, 8299], // Slot 3
    ],
    // Domination
    8100: [
      [8112, 8128, 9923], // Keystones
      [8126, 8139, 8143], // Slot 1
      [8136, 8120, 8138], // Slot 2
      [8135, 8105, 8106], // Slot 3
    ],
    // Sorcery
    8200: [
      [8214, 8229, 8230], // Keystones
      [8224, 8226, 8275], // Slot 1
      [8210, 8234, 8233], // Slot 2
      [8237, 8232, 8236], // Slot 3
    ],
    // Resolve
    8400: [
      [8437, 8439, 8465], // Keystones
      [8446, 8463, 8401], // Slot 1
      [8429, 8444, 8473], // Slot 2
      [8451, 8453, 8242], // Slot 3
    ],
    // Inspiration
    8300: [
      [8351, 8360, 8369], // Keystones
      [8306, 8304, 8313], // Slot 1
      [8321, 8316, 8345], // Slot 2
      [8347, 8410, 8352], // Slot 3
    ],
    // Stat Shards
    5000: [
      [5008, 5005, 5007], // slot
      [5008,5002, 5003 ], // Slot 1
      [5017, 5011, 5001], // Slot 2
    ],
  };
  
  return treeRunes[treeId] || [];
}