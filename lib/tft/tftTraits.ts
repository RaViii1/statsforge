export const TRAIT_DESCRIPTIONS: Record<string, { description: string; breakpoints?: { count: number; effect: string }[] }> = {
  Freljord: {
    description: "Freljord units gain bonus Health and deal bonus damage.",
    breakpoints: [
      { count: 2, effect: "+150 HP" },
      { count: 4, effect: "+350 HP, +15% DMG" },
      { count: 6, effect: "+600 HP, +30% DMG" },
    ]
  },
  Invoker: {
    description: "Invokers gain bonus Mana on attack.",
    breakpoints: [
      { count: 2, effect: "+3 Mana" },
      { count: 4, effect: "+6 Mana" },
      { count: 6, effect: "+12 Mana" },
    ]
  },
  Zaun: {
    description: "Zaun units create augments that empower allies.",
    breakpoints: [
      { count: 2, effect: "1 Augment" },
      { count: 4, effect: "2 Augments" },
      { count: 6, effect: "3 Augments" },
    ]
  },
  Juggernaut: {
    description: "Juggernauts gain bonus Health and deal bonus damage.",
    breakpoints: [
      { count: 2, effect: "+200 HP" },
      { count: 4, effect: "+500 HP" },
      { count: 6, effect: "+800 HP" },
    ]
  },
  Noxus: {
    description: "Noxus units deal bonus damage and gain Armor.",
    breakpoints: [
      { count: 2, effect: "+10% DMG" },
      { count: 4, effect: "+25% DMG" },
      { count: 6, effect: "+45% DMG" },
    ]
  },
  Slayer: {
    description: "Slayers gain bonus damage and Omnivamp.",
    breakpoints: [
      { count: 2, effect: "+12% Omnivamp" },
      { count: 4, effect: "+25% Omnivamp" },
      { count: 6, effect: "+45% Omnivamp" },
    ]
  },
  Piltover: {
    description: "Piltover units generate T-Hex power. At thresholds, power up T-Hex.",
    breakpoints: [
      { count: 2, effect: "+1 Power" },
      { count: 4, effect: "+3 Power" },
      { count: 6, effect: "+6 Power" },
    ]
  },
  Longshot: {
    description: "Longshots deal bonus damage based on distance to target.",
    breakpoints: [
      { count: 2, effect: "+8% per hex" },
      { count: 4, effect: "+20% per hex" },
      { count: 6, effect: "+35% per hex" },
    ]
  },
  Bilgewater: {
    description: "Bilgewater units plunder loot and gain bonus gold.",
    breakpoints: [
      { count: 2, effect: "+1 Gold" },
      { count: 4, effect: "+3 Gold" },
      { count: 6, effect: "+6 Gold" },
    ]
  },
  Bruiser: {
    description: "Bruisers gain bonus Health.",
    breakpoints: [
      { count: 2, effect: "+25% Health" },
      { count: 4, effect: "+45% Health" },
      { count: 6, effect: "+65% Health" },
    ]
  },
  Demacia: {
    description: "Demacia units gain bonus Armor and Magic Resist.",
    breakpoints: [
      { count: 2, effect: "+15 Armor/MR" },
      { count: 4, effect: "+35 Armor/MR" },
      { count: 6, effect: "+60 Armor/MR" },
    ]
  },
  Defender: {
    description: "Defenders gain bonus Armor.",
    breakpoints: [
      { count: 2, effect: "+30 Armor" },
      { count: 4, effect: "+70 Armor" },
      { count: 6, effect: "+120 Armor" },
    ]
  },
  Ionia: {
    description: "Ionia units gain bonus Attack Speed.",
    breakpoints: [
      { count: 2, effect: "+15% AS" },
      { count: 4, effect: "+35% AS" },
      { count: 6, effect: "+60% AS" },
    ]
  },
  Gunslinger: {
    description: "Gunslingers gain bonus Attack Damage and attack additional targets.",
    breakpoints: [
      { count: 2, effect: "+1 Target" },
      { count: 4, effect: "+2 Targets" },
      { count: 6, effect: "+3 Targets" },
    ]
  },
  Void: {
    description: "Void units gain Mutations that enhance their abilities.",
    breakpoints: [
      { count: 2, effect: "1 Mutation, 8% AS" },
      { count: 4, effect: "2 Mutations, 18% AS" },
      { count: 6, effect: "3 Mutations, 28% AS" },
      { count: 9, effect: "Mutations 50% stronger" },
    ]
  },
  Arcanist: {
    description: "Arcanists gain bonus Ability Power.",
    breakpoints: [
      { count: 2, effect: "+20 AP" },
      { count: 4, effect: "+50 AP" },
      { count: 6, effect: "+90 AP" },
    ]
  },
  Yordle: {
    description: "Yordles gain bonus stats and spawn Yordle allies.",
    breakpoints: [
      { count: 3, effect: "Spawn 1 Yordle" },
      { count: 5, effect: "Spawn 2 Yordles" },
      { count: 7, effect: "Spawn 3 Yordles" },
    ]
  },
  Ixtal: {
    description: "Ixtal units harness elemental power.",
    breakpoints: [
      { count: 2, effect: "+15% DMG" },
      { count: 4, effect: "+35% DMG" },
      { count: 6, effect: "+60% DMG" },
    ]
  },
  "Shadow Isles": {
    description: "Shadow Isles units summon Wraiths that fight alongside them.",
    breakpoints: [
      { count: 2, effect: "1 Wraith" },
      { count: 4, effect: "2 Wraiths" },
      { count: 6, effect: "3 Wraiths" },
    ]
  },
  Quickstriker: {
    description: "Quickstrikers gain bonus Attack Speed that increases over time.",
    breakpoints: [
      { count: 2, effect: "+20% AS" },
      { count: 4, effect: "+45% AS" },
      { count: 6, effect: "+75% AS" },
    ]
  },
  Targon: {
    description: "Targon units shield allies and gain bonus Ability Power.",
    breakpoints: [
      { count: 2, effect: "+150 Shield" },
      { count: 4, effect: "+350 Shield" },
      { count: 6, effect: "+600 Shield" },
    ]
  },
  Disruptor: {
    description: "Disruptors reduce enemy Attack Speed.",
    breakpoints: [
      { count: 2, effect: "-15% AS" },
      { count: 4, effect: "-35% AS" },
      { count: 6, effect: "-55% AS" },
    ]
  },
  Warden: {
    description: "Wardens gain bonus Armor and Magic Resist.",
    breakpoints: [
      { count: 2, effect: "+25 Armor/MR" },
      { count: 4, effect: "+55 Armor/MR" },
      { count: 6, effect: "+95 Armor/MR" },
    ]
  },
  Vanquisher: {
    description: "Vanquishers deal bonus Critical Strike damage.",
    breakpoints: [
      { count: 2, effect: "+15% Crit DMG" },
      { count: 4, effect: "+40% Crit DMG" },
      { count: 6, effect: "+70% Crit DMG" },
    ]
  },
  Shurima: {
    description: "Shurima units ascend after enough time, gaining massive buffs.",
    breakpoints: [
      { count: 2, effect: "Ascend: +30% Stats" },
      { count: 4, effect: "Ascend: +60% Stats" },
      { count: 6, effect: "Ascend: +100% Stats" },
    ]
  },
};