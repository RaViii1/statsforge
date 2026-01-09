export interface Item {
  id: string;
  name: string;
  stats: string[];
  description: string;
  image: string;
}

export const items: Item[] = [
  {
    "id": "1001",
    "name": "Boots",
    "stats": [
      "Boots"
    ],
    "description": "25 Move Speed",
    "image": "1001_class_t1_bootsofspeed.png"
  },
  {
    "id": "1004",
    "name": "Faerie Charm",
    "stats": [
      "ManaRegen"
    ],
    "description": "50% Base Mana Regen",
    "image": "1004_class_t1_faeriecharm.png"
  },
  {
    "id": "1006",
    "name": "Rejuvenation Bead",
    "stats": [
      "HealthRegen"
    ],
    "description": "100% Base Health Regen",
    "image": "1006_tank_t1_rejuvenationbead.png"
  },
  {
    "id": "1011",
    "name": "Giant's Belt",
    "stats": [
      "Health"
    ],
    "description": "350 Health",
    "image": "1011_class_t2_giantsbelt.png"
  },
  {
    "id": "1018",
    "name": "Cloak of Agility",
    "stats": [
      "CriticalStrike"
    ],
    "description": "15% Critical Strike Chance",
    "image": "1018_base_t1_cloakagility.png"
  },
  {
    "id": "1026",
    "name": "Blasting Wand",
    "stats": [
      "SpellDamage"
    ],
    "description": "45 Ability Power",
    "image": "1026_mage_t1_blastingwand.png"
  },
  {
    "id": "1027",
    "name": "Sapphire Crystal",
    "stats": [
      "Mana"
    ],
    "description": "300 Mana",
    "image": "1027_base_t1_saphirecrystal.png"
  },
  {
    "id": "1028",
    "name": "Ruby Crystal",
    "stats": [
      "Health"
    ],
    "description": "150 Health",
    "image": "1028_base_t1_rubycrystal.png"
  },
  {
    "id": "1029",
    "name": "Cloth Armor",
    "stats": [
      "Armor"
    ],
    "description": "15 Armor",
    "image": "1029_base_t1_clotharmor.png"
  },
  {
    "id": "1031",
    "name": "Chain Vest",
    "stats": [
      "Armor"
    ],
    "description": "40 Armor",
    "image": "1031_base_t2_chainvest.png"
  },
  {
    "id": "1033",
    "name": "Null-Magic Mantle",
    "stats": [
      "SpellBlock"
    ],
    "description": "20 Magic Resist",
    "image": "1033_base_t1_magicmantle.png"
  },
  {
    "id": "1035",
    "name": "Emberknife",
    "stats": [
      "LifeSteal",
      "SpellVamp",
      "Jungle"
    ],
    "description": "7% Omnivamp against jungle monstersSear: Damaging jungle monsters burns them for  magic damage over 5 seconds.Challenging Path: Smiting 5 times consumes this item and upgrades your Smite to Challenging Smite, increasing its damage to monsters to 900 and damage to minions to 500 +10% target max Health. Challenging Smite marks champions for 4 seconds. Damaging a marked champion deals an additional  true damage to them over 2.5 seconds. You take 10% reduced damage from marked champions.Huntsman: Killing large jungle monsters grants bonus experience.Recoup: Regen up to  Mana (based on missing mana) per second when in the jungle or river. Consuming this item grants all item effects permanently and increases Smite damage to monsters. If you have gained more gold from minions than jungle monsters, gold and experience from minions is heavily reduced. Healing is not reduced on AoE attacks. If two levels behind the average champion level of the game, monster kills grant bonus experience. Only attacks and abilities apply Challenging Smite's burn",
    "image": "1035_alll_t1_emberknife.png"
  },
  {
    "id": "1036",
    "name": "Long Sword",
    "stats": [
      "Damage",
      "Lane"
    ],
    "description": "10 Attack Damage",
    "image": "1036_class_t1_longsword.png"
  },
  {
    "id": "1037",
    "name": "Pickaxe",
    "stats": [
      "Damage"
    ],
    "description": "25 Attack Damage",
    "image": "1037_class_t1_pickaxe.png"
  },
  {
    "id": "1038",
    "name": "B. F. Sword",
    "stats": [
      "Damage"
    ],
    "description": "40 Attack Damage",
    "image": "1038_marksman_t1_bfsword.png"
  },
  {
    "id": "1039",
    "name": "Hailblade",
    "stats": [
      "LifeSteal",
      "SpellVamp",
      "Jungle"
    ],
    "description": "7% Omnivamp against jungle monstersSear: Damaging jungle monsters burns them for  magic damage over 5 seconds.Chilling Path: Smiting 5 times consumes this item and upgrades your Smite to Chilling Smite, increasing its damage to monsters to 900 and damage to minions to 500 +10% target max Health. Chilling Smite deals  true damage to champions and steals 20% of their Move Speed for 2 seconds.Huntsman: Killing large jungle monsters grants bonus experience.Recoup: Regen up to  Mana (based on missing mana) per second when in the jungle or river. Consuming this item grants all item effects permanently and increases Smite damage to monsters. If you have gained more gold from minions than jungle monsters, gold and experience from minions is heavily reduced. Healing is not reduced on AoE attacks. If two levels behind the average champion level of the game, monster kills grant bonus experience.",
    "image": "1039_all_t1_hailblade.png"
  },
  {
    "id": "1040",
    "name": "Obsidian Edge",
    "stats": [
      "LifeSteal",
      "SpellVamp",
      "Jungle"
    ],
    "description": "8% Omnivamp against jungle monstersSear: Damaging jungle monsters burns them for  magic damage over 5 seconds.Auto Path: Smiting 5 times consumes this item and upgrades your Attack-Smite, increasing its damage to monsters to 900.Huntsman: Killing large jungle monsters grants bonus experience.Recoup: Regen up to  Mana (based on missing mana) per second when in the jungle or river. Consuming this item grants all item effects permanently and increases Smite damage to monsters. If you have gained more gold from minions than jungle monsters, gold and experience from minions is heavily reduced. Healing is not reduced on AoE attacks. If two levels behind the average champion level of the game, monster kills grant bonus experience.",
    "image": "1040_obsidianedge.png"
  },
  {
    "id": "1042",
    "name": "Dagger",
    "stats": [
      "AttackSpeed"
    ],
    "description": "10% Attack Speed",
    "image": "1042_base_t1_dagger.png"
  },
  {
    "id": "1043",
    "name": "Recurve Bow",
    "stats": [
      "AttackSpeed",
      "OnHit"
    ],
    "description": "15% Attack SpeedStingAttacks deal 15 bonus physical damage  On-Hit.",
    "image": "1043_base_t2_recurvebow.png"
  },
  {
    "id": "1052",
    "name": "Amplifying Tome",
    "stats": [
      "SpellDamage"
    ],
    "description": "20 Ability Power",
    "image": "1052_mage_t2_amptome.png"
  },
  {
    "id": "1053",
    "name": "Vampiric Scepter",
    "stats": [
      "Damage",
      "LifeSteal"
    ],
    "description": "15 Attack Damage 7% Life Steal",
    "image": "1053_fighter_t2_vampiricscepter.png"
  },
  {
    "id": "1054",
    "name": "Doran's Shield",
    "stats": [
      "Health",
      "HealthRegen",
      "Lane"
    ],
    "description": "110 HealthEnduring FocusRestore 4 Health every 5 seconds. After taking damage from a champion, restore Health over 8 seconds.Helping HandAttacks deal 5 bonus physical damage to minions.",
    "image": "1054_tank_t1_doransshield.png"
  },
  {
    "id": "1055",
    "name": "Doran's Blade",
    "stats": [
      "Health",
      "Damage",
      "SpellVamp",
      "Lane"
    ],
    "description": "10 Attack Damage 80 HealthLife DrainingReturn 2.5% of damage dealt as Health. Reduced to 33.3% effectiveness for area of effect spells and pet damage.",
    "image": "1055_marksman_t1_doransblade.png"
  },
  {
    "id": "1056",
    "name": "Doran's Ring",
    "stats": [
      "Health",
      "Lane",
      "ManaRegen",
      "SpellDamage"
    ],
    "description": "18 Ability Power 90 HealthDrainRestore 1 Mana every second, increased to 2 Mana per second for 5 seconds after dealing damage to an enemy champion. If you can't gain Mana, heal for 45% of this value instead.Helping HandAttacks deal 5 bonus physical damage to minions.",
    "image": "1056_mage_t1_doransring.png"
  },
  {
    "id": "1057",
    "name": "Negatron Cloak",
    "stats": [
      "SpellBlock"
    ],
    "description": "45 Magic Resist",
    "image": "1057_tank_t2_negatroncloak.png"
  },
  {
    "id": "1058",
    "name": "Needlessly Large Rod",
    "stats": [
      "SpellDamage"
    ],
    "description": "65 Ability Power",
    "image": "1058_mage_t1_largerod.png"
  },
  {
    "id": "1082",
    "name": "Dark Seal",
    "stats": [
      "Health",
      "SpellDamage",
      "Lane"
    ],
    "description": "15 Ability Power 50 HealthGloryTakedowns grant Glory, up to 10. 5 Glory is lost on death.Gain 4 Ability Power per Glory.",
    "image": "1082_mage_t1_darkseal.png"
  },
  {
    "id": "1083",
    "name": "Cull",
    "stats": [
      "Damage",
      "OnHit",
      "Lane"
    ],
    "description": "7 Attack DamageReapRestore 3 Health  On-Hit.Killing minions grants 1 gold, up to 100. Reaching the limit grants another 350 gold.",
    "image": "1083_marksman_t1_cull.png"
  },
  {
    "id": "1101",
    "name": "Scorchclaw Pup",
    "stats": [
      "Jungle"
    ],
    "description": "Jungle CompanionsSummon a Scorchclaw that assists you against monsters.Scorchclaw's SlashThe companion grows as you hunt monsters, empowering your Smite. When fully grown, it periodically imbues your next Attack or Ability to burn enemies and Slow them. Killing large monsters readies this immediately.",
    "image": "1101_jungle_t1_scorchclawpup.png"
  },
  {
    "id": "1102",
    "name": "Gustwalker Hatchling",
    "stats": [
      "Jungle"
    ],
    "description": "Jungle CompanionsSummon a Gustwalker that assists you against monsters.Gustwalker's GaitThe companion grows as you hunt monsters, empowering your Smite. When fully grown, it grants Move Speed upon entering brush, increased when killing large monsters.",
    "image": "1102_jungle_t1_gustwalkerhatchling.png"
  },
  {
    "id": "1103",
    "name": "Mosstomper Seedling",
    "stats": [
      "Jungle"
    ],
    "description": "Jungle CompanionsSummon a Mosstomper that assists you against monsters.Mosstomper's CourageThe companion grows as you hunt monsters, empowering your Smite. When fully grown, it grants a shield that regenerates after killing large monsters or out of combat.",
    "image": "1103_jungle_t1_mosstomperseedling.png"
  },
  {
    "id": "1104",
    "name": "Eye of the Herald",
    "stats": [
      "Trinket",
      "Active"
    ],
    "description": "Active - Consume: Crush the Eye of the Herald, begining the ritual to summon Rift Herald. You may click the Rift Herald after it has summoned to control how it charges. This control effect can be done once when it is summoned, and once each time a nearby enemy structure dies.",
    "image": "3513_eyeoftheherald.png"
  },
  {
    "id": "1105",
    "name": "Mosstomper Seedling",
    "stats": [
      "Jungle"
    ],
    "description": "Jungle CompanionsSummon a Mosstomper that assists you against monsters.Mosstomper's CourageThe companion grows as you hunt monsters, empowering your Smite. When fully grown, it grants a shield that regenerates after killing large monsters or out of combat.",
    "image": "1103_testitem2.png"
  },
  {
    "id": "1106",
    "name": "Gustwalker Hatchling",
    "stats": [
      "Jungle"
    ],
    "description": "Jungle CompanionsSummon a Gustwalker that assists you against monsters.Gustwalker's GaitThe companion grows as you hunt monsters, empowering your Smite. When fully grown, it grants Move Speed upon entering brush, increased when killing large monsters.",
    "image": "1102_jungle_t1_gustwalkerhatchling.png"
  },
  {
    "id": "1107",
    "name": "Scorchclaw Pup",
    "stats": [
      "Jungle"
    ],
    "description": "Jungle CompanionsSummon a Scorchclaw that assists you against monsters.Scorchclaw's SlashThe companion grows as you hunt monsters, empowering your Smite. When fully grown, it periodically imbues your next Attack or Ability to burn enemies and Slow them. Killing large monsters readies this immediately.",
    "image": "1101_jungle_t1_scorchclawpup.png"
  },
  {
    "id": "1111",
    "name": "Jarvan I's",
    "stats": [
      "Armor",
      "AttackSpeed",
      "Boots",
      "Tenacity",
      "MagicPenetration",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "25% Attack Speed 100 Move Speed 10 Ability Haste 12 Magic Penetration 25 Armor 20 Magic Resist 30% TenacityJarvan OneGive you stats and passives from all boots.Requires Augment: Quest: SneakerHead",
    "image": "default.png"
  },
  {
    "id": "1500",
    "name": "Penetrating Bullets",
    "stats": [
      "HealthRegen",
      "ManaRegen",
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1500_ExternalDescription",
    "image": "default.png"
  },
  {
    "id": "1501",
    "name": "Fortification",
    "stats": [],
    "description": "",
    "image": "default.png"
  },
  {
    "id": "1502",
    "name": "Reinforced Armor",
    "stats": [
      "Armor",
      "ManaRegen",
      "OnHit"
    ],
    "description": "Reinforced: Reduces incoming damage by 80%, including True Damage, when no enemy Lane Minions or Rift Herald are nearby.",
    "image": "default.png"
  },
  {
    "id": "1503",
    "name": "Warden's Eye",
    "stats": [
      "HealthRegen",
      "ManaRegen",
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1503_ExternalDescription",
    "image": "default.png"
  },
  {
    "id": "1504",
    "name": "Vanguard",
    "stats": [
      "Armor",
      "ManaRegen",
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1504_ExternalDescription",
    "image": "1504_turretshielder.png"
  },
  {
    "id": "1506",
    "name": "Reinforced Armor",
    "stats": [
      "Armor",
      "ManaRegen",
      "OnHit"
    ],
    "description": "Reinforced: Reduces incoming damage by 66%, including True Damage, when no enemy Lane Minions or Rift Herald are nearby.Regeneration: Base turrets have health regeneration, but cannot regenerate past their current segment. Base turrets are segmented at 33%, 66% and 100% health.",
    "image": "default.png"
  },
  {
    "id": "1507",
    "name": "Overcharged",
    "stats": [
      "Armor",
      "ManaRegen",
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1507_ExternalDescription",
    "image": "1507_tournament_suddendeath.png"
  },
  {
    "id": "1508",
    "name": "Anti-tower Socks",
    "stats": [
      "Armor",
      "ManaRegen",
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1508_ExternalDescription",
    "image": "1508_antitowersocks.png"
  },
  {
    "id": "1509",
    "name": "Gusto",
    "stats": [
      "Armor",
      "ManaRegen",
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1509_ExternalDescription",
    "image": "1509_gusto.png"
  },
  {
    "id": "1510",
    "name": "Phreakish Gusto",
    "stats": [
      "Armor",
      "ManaRegen",
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1510_ExternalDescription",
    "image": "1510_phreakishgusto.png"
  },
  {
    "id": "1511",
    "name": "Super Mech Armor",
    "stats": [
      "Armor",
      "ManaRegen",
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1511_ExternalDescription",
    "image": "1511_supermecharmor.png"
  },
  {
    "id": "1512",
    "name": "Super Mech Power Field",
    "stats": [
      "Armor",
      "ManaRegen",
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1512_ExternalDescription",
    "image": "1512_supermechpowerfield.png"
  },
  {
    "id": "1515",
    "name": "Turret Plating",
    "stats": [
      "Armor"
    ],
    "description": "GeneratedTip_Item_1515_ExternalDescription",
    "image": "default.png"
  },
  {
    "id": "1516",
    "name": "Structure Bounty",
    "stats": [
      "HealthRegen",
      "ManaRegen",
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1516_ExternalDescription",
    "image": "default.png"
  },
  {
    "id": "1517",
    "name": "Structure Bounty",
    "stats": [
      "HealthRegen",
      "ManaRegen",
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1516_ExternalDescription",
    "image": "default.png"
  },
  {
    "id": "1518",
    "name": "Structure Bounty",
    "stats": [
      "HealthRegen",
      "ManaRegen",
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1516_ExternalDescription",
    "image": "default.png"
  },
  {
    "id": "1519",
    "name": "Structure Bounty",
    "stats": [
      "HealthRegen",
      "ManaRegen",
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1516_ExternalDescription",
    "image": "default.png"
  },
  {
    "id": "1520",
    "name": "OvererchargedHA",
    "stats": [
      "Armor",
      "ManaRegen",
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1520_ExternalDescription",
    "image": "default.png"
  },
  {
    "id": "1521",
    "name": "Fortification",
    "stats": [
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1521_ExternalDescription",
    "image": "default.png"
  },
  {
    "id": "1522",
    "name": "Tower Power-Up",
    "stats": [
      "Armor",
      "Damage"
    ],
    "description": "GeneratedTip_Item_1522_ExternalDescription",
    "image": "default.png"
  },
  {
    "id": "1523",
    "name": "Overcharged",
    "stats": [
      "Armor",
      "ManaRegen",
      "OnHit"
    ],
    "description": "GeneratedTip_Item_1523_ExternalDescription",
    "image": "1507_tournament_suddendeath.png"
  },
  {
    "id": "2001",
    "name": "Recall",
    "stats": [],
    "description": "GeneratedTip_Item_2001_ExternalDescription",
    "image": "default.png"
  },
  {
    "id": "2003",
    "name": "Health Potion",
    "stats": [
      "HealthRegen",
      "Consumable",
      "Lane",
      "Jungle"
    ],
    "description": "ConsumeRestores 120 Health over 15 seconds.",
    "image": "autoatlas/smallicons/2003_healthpotion_64px.milkshake_env.png"
  },
  {
    "id": "2007",
    "name": "",
    "stats": [],
    "description": "GeneratedTip_Item_2007_ExternalDescription",
    "image": "default.png"
  },
  {
    "id": "2008",
    "name": "",
    "stats": [],
    "description": "GeneratedTip_Item_2008_ExternalDescription",
    "image": "default.png"
  },
  {
    "id": "2010",
    "name": "Total Biscuit of Everlasting Will",
    "stats": [],
    "description": "Active - Consume: Eat the biscuit to restore Health over 5 seconds, increased based on missing health. Consuming or selling a biscuit permanently grants 30 maximum Health.",
    "image": "autoatlas/smallicons/2010_totalbiscuitofeverlastingwill_64px.milkshake_env.png"
  },
  {
    "id": "2015",
    "name": "Kircheis Shard",
    "stats": [
      "Damage",
      "OnHit"
    ],
    "description": "15 Attack DamageJoltEnergized Attacks deal an additional 50 magic damage.",
    "image": "2015_marksman_t2_kirkcheisshard.png"
  },
  {
    "id": "2019",
    "name": "Steel Sigil",
    "stats": [
      "Armor",
      "Damage"
    ],
    "description": "15 Attack Damage 30 Armor",
    "image": "2019_steel_sigil.png"
  },
  {
    "id": "2020",
    "name": "The Brutalizer",
    "stats": [
      "Damage",
      "CooldownReduction",
      "ArmorPenetration"
    ],
    "description": "25 Attack Damage 10 Ability Haste 5 Lethality",
    "image": "2020_thebrutalizer.png"
  },
  {
    "id": "2021",
    "name": "Tunneler",
    "stats": [
      "Health",
      "Damage"
    ],
    "description": "15 Attack Damage 250 Health",
    "image": "2012_tunneler.png"
  },
  {
    "id": "2022",
    "name": "Glowing Mote",
    "stats": [
      "CooldownReduction"
    ],
    "description": "5 Ability Haste",
    "image": "2022_glowingmote.png"
  },
  {
    "id": "2031",
    "name": "Refillable Potion",
    "stats": [
      "HealthRegen",
      "Consumable",
      "Active",
      "Lane",
      "Jungle"
    ],
    "description": "Active (2 charges)Restores 100 Health over 12 seconds. Refills upon visiting the shop.",
    "image": "autoatlas/smallicons/2031_refillablepotion_64px.milkshake_env.png"
  },
  {
    "id": "2033",
    "name": "Corrupting Potion",
    "stats": [
      "Active",
      "Consumable",
      "HealthRegen",
      "Lane",
      "ManaRegen"
    ],
    "description": "Active - Consume: Consumes a charge to restore 100 Health and 75 Mana over 12 seconds. During this time, damaging Abilities and Attacks burn enemy champions for 15 (20 if you cannot gain Mana) magic damage over 3 seconds. Holds up to 3 charges and refills upon visiting the shop.Corrupting damage is reduced to 50% when triggered by area of effect or periodic damage.",
    "image": "2033_class_t1_corruptingpotion.png"
  },
  {
    "id": "2049",
    "name": "Guardian's Amulet",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "CooldownReduction",
      "Lane",
      "AbilityHaste"
    ],
    "description": "15% Heal and Shield Power 20 Ability Power 20 Ability HasteRecoveryRestores 10 Mana every 5 seconds. If you can't gain mana, restores 3 Health instead.",
    "image": "2049_guardiansamulet.png"
  },
  {
    "id": "2050",
    "name": "Guardian's Shroud",
    "stats": [
      "Health",
      "SpellDamage",
      "CooldownReduction",
      "Lane",
      "AbilityHaste"
    ],
    "description": "300 Health 35 Ability Power 15 Ability Haste",
    "image": "3112_aram_t1_guardiansorb.png"
  },
  {
    "id": "2051",
    "name": "Guardian's Horn",
    "stats": [
      "Health",
      "HealthRegen",
      "Lane"
    ],
    "description": "150 HealthRecovery: Restores 20 Health every 5 seconds.Undaunted: Blocks 15 damage from attacks and spells from champions (25% effectiveness vs. damage over time abilities).",
    "image": "2051_aram_t1_guardianshorn.png"
  },
  {
    "id": "2052",
    "name": "Poro-Snax",
    "stats": [],
    "description": "Active - Consume: Serves a scrumptious scoop to a nearby Poro, causing it to grow in size.This savory blend of free-range, grass-fed Avarosan game hens and organic, non-ZMO Freljordian herbs contains the essential nutrients necessary to keep your Poro purring with pleasure.All proceeds will be donated towards fighting Noxian animal cruelty.",
    "image": "2052_poro_snack.png"
  },
  {
    "id": "2055",
    "name": "Control Ward",
    "stats": [
      "Consumable",
      "Lane",
      "Stealth",
      "Vision"
    ],
    "description": "ConsumePlaces a Control Ward that grants vision and reveals enemy Stealth Wards, traps and Camouflaged enemies.",
    "image": "2055_class_t1_controlward.png"
  },
  {
    "id": "2056",
    "name": "Stealth Ward",
    "stats": [
      "Consumable",
      "Lane",
      "Stealth",
      "Vision"
    ],
    "description": "Active - Consume: Places a Stealth Ward on the ground that lasts 60 seconds, is Invisible to enemies but grants your team vision of the surrounding area.",
    "image": "3340_class_t1_wardingtotem.png"
  },
  {
    "id": "2065",
    "name": "Shurelya's Battlesong",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "Active",
      "CooldownReduction",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "50 Ability Power 15 Ability Haste 4% Move Speed 125% Base Mana Regen Inspiring SpeechGrant nearby allies 30% Move Speed for 4 seconds.",
    "image": "2065_tank_t4_shurelyasbattlesong.png"
  },
  {
    "id": "2138",
    "name": "Elixir of Iron",
    "stats": [
      "Health",
      "Consumable",
      "NonbootsMovement",
      "Tenacity"
    ],
    "description": "ConsumeGrants 300 Health, 25% Tenacity and increased size for 3 minutes. While active, you leave a path behind that boosts allied champions' Move Speed by 15%.",
    "image": "autoatlas/smallicons/2138_elixirofiron_64px.milkshake_env.png"
  },
  {
    "id": "2139",
    "name": "Elixir of Sorcery",
    "stats": [
      "Consumable",
      "ManaRegen",
      "SpellDamage"
    ],
    "description": "ConsumeGrants 50 Ability Power and 15% Mana Regen for 3 minutes. While active, damaging a champion or turret deals 25 bonus true damage ( 5s against champions).",
    "image": "autoatlas/smallicons/2139_elixirofsorcery_64px.milkshake_env.png"
  },
  {
    "id": "2140",
    "name": "Elixir of Wrath",
    "stats": [
      "Consumable",
      "Damage",
      "LifeSteal",
      "SpellVamp"
    ],
    "description": "ConsumeGrants 30 Attack Damage and 12% Physical Vamp against champions for 3 minutes.",
    "image": "autoatlas/smallicons/2140_elixirofwrath_64px.milkshake_env.png"
  },
  {
    "id": "2141",
    "name": "Cappa Juice",
    "stats": [
      "Damage",
      "Consumable"
    ],
    "description": "Helps you get on a head. Active - Consume: This juice does nothing.",
    "image": "icon_item_souljuice_funhat.png"
  },
  {
    "id": "2142",
    "name": "Juice of Power",
    "stats": [
      "SpellDamage",
      "Consumable"
    ],
    "description": "Juices do not stack with themselves, but you can have multiple different ones active. Active - Consume: Automatically activates on Combat Start. Drink to gain 30 + 10% bonus Ability Power or 18 + 10% bonus Attack Damage for the next round.Made with 100% real cherries. Warning: May cause imbiber to deal tons of damage.",
    "image": "icon_item_souljuice_abilitypowerattackdamage.png"
  },
  {
    "id": "2143",
    "name": "Juice of Vitality",
    "stats": [
      "Health",
      "Consumable"
    ],
    "description": "Juices do not stack with themselves, but you can have multiple different ones active. Active - Consume: Automatically activates on Combat Start. Drink to gain 300 + 10% Health for the next round.Our specially formulated veggie blend is proven to harden your skin to resist even the strongest attacks!",
    "image": "icons_souljuice_green.png"
  },
  {
    "id": "2144",
    "name": "Juice of Haste",
    "stats": [
      "Consumable",
      "CooldownReduction"
    ],
    "description": "Juices do not stack with themselves, but you can have multiple different ones active. Active - Consume: Automatically activates on Combat Start. Drink to gain 20 + 15% Ability Haste for the next round.For people who gotta go FAST. Made with lightning. REAL lightning!",
    "image": "icons_souljuice_yellow.png"
  },
  {
    "id": "2145",
    "name": "Lucky Dice",
    "stats": [
      "Consumable"
    ],
    "description": "Active - Consume: Roll to gain 1 additional reroll.For when skill isn't enough.",
    "image": "item_consumable_shopreroll.png"
  },
  {
    "id": "2146",
    "name": "Enhanced Lucky Dice",
    "stats": [
      "Consumable"
    ],
    "description": "Active - Consume: Roll to gain 5 additional rerolls.For when skill isn't enough.",
    "image": "item_consumable_shopreroll.png"
  },
  {
    "id": "2150",
    "name": "Elixir of Skill",
    "stats": [
      "Consumable"
    ],
    "description": "ConsumeGrants 1 Skill Point.This item does not increase your level or allow allocating skill points past the normal maximum in a skill",
    "image": "default.png"
  },
  {
    "id": "2151",
    "name": "Elixir of Avarice",
    "stats": [
      "Health",
      "Consumable",
      "Tenacity"
    ],
    "description": "ConsumeGrants 5 true damage on hit against minions for 60 seconds. When this effect expires, gain 60 gold.",
    "image": "default.png"
  },
  {
    "id": "2152",
    "name": "Elixir of Force",
    "stats": [
      "Consumable",
      "Tenacity"
    ],
    "description": "ConsumeGrants 30 Adaptive Force for 60 seconds.",
    "image": "default.png"
  },
  {
    "id": "2161",
    "name": "Bandle Juice of Power",
    "stats": [
      "SpellDamage",
      "Consumable"
    ],
    "description": "Drink to permanently gain 20 + 3% bonus Ability Power or 12 + 3% bonus Attack Damage. And a hat!Made with 100% real cherries. Warning: May cause imbiber to deal tons of damage.",
    "image": "default.png"
  },
  {
    "id": "2162",
    "name": "Bandle Juice of Vitality",
    "stats": [
      "Health",
      "Consumable"
    ],
    "description": "Drink to permanently gain 200 + 3% Health. And a hat!Our specially formulated veggie blend is proven to harden your skin to resist even the strongest attacks!",
    "image": "default.png"
  },
  {
    "id": "2163",
    "name": "Bandle Juice of Haste",
    "stats": [
      "Consumable",
      "CooldownReduction"
    ],
    "description": "Drink to permanently gain 10 + 5% Ability Haste. And a hat!For people who gotta go FAST. Made with lightning. REAL lightning!",
    "image": "default.png"
  },
  {
    "id": "2403",
    "name": "Minion Dematerializer",
    "stats": [],
    "description": "Active - Consume: Kill target lane minion.  (0s)",
    "image": "2403_minion_dematerializer.png"
  },
  {
    "id": "2420",
    "name": "Seeker's Armguard",
    "stats": [
      "Armor",
      "SpellDamage",
      "Active"
    ],
    "description": "40 Ability Power 25 Armor Time Stop (Single use)Enter Stasis for 2.5 seconds.",
    "image": "3191_battlemage_t2_seekersarmguard.png"
  },
  {
    "id": "2421",
    "name": "Shattered Armguard",
    "stats": [],
    "description": "40 Ability Power 25 ArmorShattered TimeArmguard is broken, but can still be upgraded.After breaking one Armguard, the shopkeeper will only sell you Shattered Armguard.",
    "image": "2420_shatteredarmguard.png"
  },
  {
    "id": "2422",
    "name": "Slightly Magical Footwear",
    "stats": [
      "Boots"
    ],
    "description": "25 Move SpeedGrants an additional 10 Move Speed. Boots that build from Slightly Magical Footwear retain this bonus Move Speed.",
    "image": "2422_class_t1_slightlymagicalboots.png"
  },
  {
    "id": "2501",
    "name": "Overlord's Bloodmail",
    "stats": [
      "Health",
      "Damage"
    ],
    "description": "30 Attack Damage 550 HealthTyrannyGain 2.5% of your bonus Health as Attack Damage. RetributionGain up to 12% increased Attack Damage based on your percent missing Health.",
    "image": "7111_overlordsbloodmail.png"
  },
  {
    "id": "2502",
    "name": "Unending Despair",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "400 Health 25 Armor 25 Magic Resist 10 Ability HasteAnguishEvery 4 seconds while in combat with champions, deal magic damage to nearby enemy champions and heal for 250% of the damage dealt.",
    "image": "2502_unendingdespair.png"
  },
  {
    "id": "2503",
    "name": "Blackfire Torch",
    "stats": [
      "SpellDamage",
      "Mana",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "80 Ability Power 600 Mana 20 Ability HasteBaleful BlazeDamaging Abilities deals bonus magic damage for 3 seconds.BlackfireFor each enemy champion, epic and large monster affected by your Baleful Blaze, gain 4% Ability Power.",
    "image": "2503_blackfiretorch64.png"
  },
  {
    "id": "2504",
    "name": "Kaenic Rookern",
    "stats": [
      "Health",
      "SpellBlock",
      "HealthRegen"
    ],
    "description": "400 Health 80 Magic Resist 100% Base Health RegenMagebaneAfter not taking magic damage for 15 seconds, gain a magic shield.",
    "image": "2504_kaenicrookern.png"
  },
  {
    "id": "2508",
    "name": "Fated Ashes",
    "stats": [
      "SpellDamage"
    ],
    "description": "30 Ability PowerInflameDamaging Abilities deal 15 bonus magic damage over 3 seconds.Deals an additional 45 magic damage to monsters.",
    "image": "2508_fatedashes64.png"
  },
  {
    "id": "3001",
    "name": "Evenshroud",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "AbilityHaste"
    ],
    "description": "200 Health 30 Armor 30 Magic Resist 20 Ability HasteCoruscation: After Immobilizing champions or being Immobilized, cause that target and all nearby enemy champions to take 7% increased damage for 5 seconds. Mythic Passive: Grants all other Legendary items 5  Armor and  Magic Resist.",
    "image": "3001_support_lunari.png"
  },
  {
    "id": "3002",
    "name": "Trailblazer",
    "stats": [
      "Health",
      "Armor",
      "NonbootsMovement"
    ],
    "description": "250 Health 40 Armor 4% Move SpeedLead the WayWhile moving, build up to 20 bonus Move Speed. At max speed:Create a trail that grants allied champions Move Speed equal to 15% of yours. If you are Melee, your next Attack Slows the target by 50% for 1 second.",
    "image": "3002_trailblazer.png"
  },
  {
    "id": "3003",
    "name": "Archangel's Staff",
    "stats": [
      "SpellDamage",
      "Mana",
      "AbilityHaste"
    ],
    "description": "70 Ability Power 600 Mana 25 Ability HasteAweGain Ability Power equal to 1% bonus Mana.Manaflow  (8s, max 5 charges)Landing Abilities grants 5 max Mana (doubled vs. champions).Transforms into Seraph's Embrace at 360 max Mana.",
    "image": "3003_mage_t3_archangelstaff.png"
  },
  {
    "id": "3004",
    "name": "Manamune",
    "stats": [
      "Damage",
      "Mana",
      "CooldownReduction",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "35 Attack Damage 500 Mana 15 Ability HasteAweGain  bonus Attack Damage.Manaflow  (8s, max 4 charges)Landing Attacks and Abilities grants 3 max Mana (doubled vs. champions).Transforms into Muramana at 360 max Mana.",
    "image": "3004_marksman_t3_manamune.png"
  },
  {
    "id": "3005",
    "name": "Ghostcrawlers",
    "stats": [
      "Boots"
    ],
    "description": "45 Move Speed Wall Walk  (0s)Gain the ability to walk through walls for 6 seconds. While inside walls, gain 125 move speed. Casting a spell or attacking will end this effect.",
    "image": "3005_fighter_t3_atmasreckoning.png"
  },
  {
    "id": "3006",
    "name": "Berserker's Greaves",
    "stats": [
      "AttackSpeed",
      "Boots"
    ],
    "description": "25% Attack Speed 45 Move Speed",
    "image": "3006_class_t2_berserkersgreaves.png"
  },
  {
    "id": "3009",
    "name": "Boots of Swiftness",
    "stats": [
      "Boots"
    ],
    "description": "55 Move SpeedFleetfootedReduce the effectiveness of Slows by 25%.",
    "image": "3009_class_t2_bootsofswiftness.png"
  },
  {
    "id": "3010",
    "name": "Symbiotic Soles",
    "stats": [
      "Boots"
    ],
    "description": "40 Move SpeedSynchronyGain 10 Move Speed when out of combat.SymbiosisAfter traveling 150000 units of distance, transform into Synchronized Souls.",
    "image": "3010_voidwalkers.png"
  },
  {
    "id": "3011",
    "name": "Chemtech Putrifier",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "AbilityHaste"
    ],
    "description": "35 Ability Power 10% Heal and Shield Power 75% Base Mana Regen 15 Ability HastePuffcap Toxin: Dealing damage applies 40% Grievous Wounds to champions for 3 seconds.Grievous Wounds reduces the effectiveness of Healing and Regeneration effects.",
    "image": "3011_enchanter_t3_chemtechfumigator.png"
  },
  {
    "id": "3012",
    "name": "Chalice of Blessing",
    "stats": [
      "Health",
      "ManaRegen"
    ],
    "description": "200 Health 50% Base Mana RegenHarmony: Gain 25% Base Health Regen per 25% Base Mana Regen.'These blessed waters still carry their power to the worthy.'",
    "image": "3012_blessed_chalice.png"
  },
  {
    "id": "3013",
    "name": "Synchronized Souls",
    "stats": [
      "Boots"
    ],
    "description": "45 Move SpeedVoidbornGain Empowered Recall.SynchronyGain 45 Move Speed when out of combat.",
    "image": "3013_voidwalkers.png"
  },
  {
    "id": "3020",
    "name": "Sorcerer's Shoes",
    "stats": [
      "Boots",
      "MagicPenetration"
    ],
    "description": "12 Magic Penetration 45 Move Speed",
    "image": "3020_class_t2_sorcerersshoes.png"
  },
  {
    "id": "3023",
    "name": "Lifewell Pendant",
    "stats": [
      "Health",
      "Armor",
      "AbilityHaste"
    ],
    "description": "150 Health 25 Armor 5 Ability Haste'Fashionable and functional.'",
    "image": "3023_lifewell_pendant.png"
  },
  {
    "id": "3024",
    "name": "Glacial Buckler",
    "stats": [
      "Armor",
      "Mana",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "25 Armor 300 Mana 10 Ability Haste",
    "image": "3024_tank_t2_glacialshroud.png"
  },
  {
    "id": "3026",
    "name": "Guardian Angel",
    "stats": [
      "Armor",
      "Damage"
    ],
    "description": "55 Attack Damage 45 ArmorRebirthUpon taking lethal damage, restores 50% base Health and 100% max Mana after 4 seconds of Stasis.",
    "image": "3026_fighter_t3_guardianangel.png"
  },
  {
    "id": "3031",
    "name": "Infinity Edge",
    "stats": [
      "CriticalStrike",
      "Damage"
    ],
    "description": "65 Attack Damage 25% Critical Strike Chance 40% Critical Strike Damage",
    "image": "3031_marksman_t3_infinityedge.png"
  },
  {
    "id": "3032",
    "name": "Yun Tal Wildarrows",
    "stats": [
      "Damage",
      "CriticalStrike",
      "AttackSpeed"
    ],
    "description": "55 Attack Damage 35% Attack Speed 0% Critical Strike ChancePractice Makes LethalOn-Attack, gain Critical Strike Chance permanently up to 25%.FlurryOn-Attacking an enemy champion, gain 30% Attack Speed for 6 seconds (30 second cooldown). Attacks reduce this cooldown by 1 second, increased to 2 seconds for Critical Strikes.",
    "image": "3032_yuntalwildarrows.png"
  },
  {
    "id": "3033",
    "name": "Mortal Reminder",
    "stats": [
      "Damage",
      "CriticalStrike",
      "ArmorPenetration"
    ],
    "description": "35 Attack Damage 35% Armor Penetration 25% Critical Strike ChanceGrievous WoundsDealing physical damage applies 40% Wounds to enemy champions for 3 seconds.",
    "image": "3033_marksman_t3_mortalreminder.png"
  },
  {
    "id": "3035",
    "name": "Last Whisper",
    "stats": [
      "ArmorPenetration",
      "Damage"
    ],
    "description": "20 Attack Damage 18% Armor Penetration",
    "image": "3035_marksman_t2_lastwhisper.png"
  },
  {
    "id": "3036",
    "name": "Lord Dominik's Regards",
    "stats": [
      "Damage",
      "CriticalStrike",
      "ArmorPenetration"
    ],
    "description": "35 Attack Damage 40% Armor Penetration 25% Critical Strike Chance",
    "image": "3036_marksman_t3_dominikregards.png"
  },
  {
    "id": "3039",
    "name": "Atma's Reckoning",
    "stats": [
      "Health",
      "CriticalStrike"
    ],
    "description": "700 Health 20% Critical Strike ChanceBig HandsGain  0-30% Critical Strike Chance, scaling with your bonus Health.",
    "image": "3005_fighter_t3_atmasreckoning.png"
  },
  {
    "id": "3040",
    "name": "Seraph's Embrace",
    "stats": [
      "SpellDamage",
      "Mana",
      "AbilityHaste"
    ],
    "description": "70 Ability Power 1000 Mana 25 Ability HasteAweGain  Ability Power.Lifeline  (0s)Taking damage that would reduce your Health below 30% grants a  Shield for 3 seconds.",
    "image": "3048_mage_t3_seraphsembrace.png"
  },
  {
    "id": "3041",
    "name": "Mejai's Soulstealer",
    "stats": [
      "Health",
      "SpellDamage",
      "NonbootsMovement"
    ],
    "description": "20 Ability Power 100 HealthGloryTakedowns grant Glory, up to 25. 10 Glory is lost on death.Gain 5 Ability Power per Glory and 10% Move Speed at 10 or higher Glory.",
    "image": "3041_mage_t2_mejaissoulstealer.png"
  },
  {
    "id": "3042",
    "name": "Muramana",
    "stats": [
      "Damage",
      "Mana",
      "CooldownReduction",
      "OnHit",
      "ArmorPenetration"
    ],
    "description": "35 Attack Damage 860 Mana 15 Ability HasteAweGain 2% max Mana as bonus Attack Damage.ShockAttacks against champions deal 1.2% max Mana as bonus physical damage  On-Hit. Damaging Abilities against champions deal 3% - 4% max Mana as bonus physical damage.",
    "image": "3042_marksman_t3_muramana.png"
  },
  {
    "id": "3044",
    "name": "Phage",
    "stats": [
      "Health",
      "Damage",
      "NonbootsMovement"
    ],
    "description": "15 Attack Damage 200 HealthRageAttacking grants Move Speed for 2 seconds.",
    "image": "3044_fighter_t2_phage.png"
  },
  {
    "id": "3046",
    "name": "Phantom Dancer",
    "stats": [
      "CriticalStrike",
      "AttackSpeed",
      "NonbootsMovement"
    ],
    "description": "65% Attack Speed 25% Critical Strike Chance 10% Move SpeedSpectral WaltzBecome Ghosted.",
    "image": "3046_marksman_t3_phantomdancer.png"
  },
  {
    "id": "3047",
    "name": "Plated Steelcaps",
    "stats": [
      "Armor",
      "Boots"
    ],
    "description": "25 Armor 45 Move SpeedPlatingReduces incoming damage from Attacks by 10%.",
    "image": "3047_class_t2_ninjatabi.png"
  },
  {
    "id": "3050",
    "name": "Zeke's Convergence",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "AbilityHaste"
    ],
    "description": "300 Health 25 Armor 25 Magic Resist 10 Ability HasteFrostfire TempestCasting your Ultimate summons a storm around you for 5 seconds. The storm deals 30 magic damage per second to enemy champions and Slows them by 30%.",
    "image": "3050_enchanter_t3_zekesconvergence.png"
  },
  {
    "id": "3051",
    "name": "Hearthbound Axe",
    "stats": [
      "Damage",
      "AttackSpeed"
    ],
    "description": "20 Attack Damage 20% Attack Speed",
    "image": "3051_fighter_t2_axeofavarosa.png"
  },
  {
    "id": "3053",
    "name": "Sterak's Gage",
    "stats": [
      "Health",
      "Damage",
      "Tenacity"
    ],
    "description": "400 Health 20% TenacityThe Claws that CatchGain bonus Attack Damage.LifelineTaking damage that would reduce your Health below 30% grants a decaying Shield for 4.5 seconds.",
    "image": "3053_steraks_gage.png"
  },
  {
    "id": "3057",
    "name": "Sheen",
    "stats": [
      "OnHit",
      "AbilityHaste"
    ],
    "description": "10 Ability HasteSpellbladeAfter using an Ability, your next Attack deals bonus physical damage  On-Hit.",
    "image": "3057_fighter_t2_sheen.png"
  },
  {
    "id": "3065",
    "name": "Spirit Visage",
    "stats": [
      "Health",
      "SpellBlock",
      "HealthRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "400 Health 50 Magic Resist 10 Ability Haste 100% Base Health RegenBoundless VitalityHeals and Shields on you are increased by 25%.",
    "image": "3065_tank_t3_spiritvisage.png"
  },
  {
    "id": "3066",
    "name": "Winged Moonplate",
    "stats": [
      "Health",
      "NonbootsMovement"
    ],
    "description": "200 Health 4% Move Speed",
    "image": "3066_tank_t3_wingedmoonplate.png"
  },
  {
    "id": "3067",
    "name": "Kindlegem",
    "stats": [
      "Health",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "200 Health 10 Ability Haste",
    "image": "3067_tank_t1_kindlegem.png"
  },
  {
    "id": "3068",
    "name": "Sunfire Aegis",
    "stats": [
      "Health",
      "Armor",
      "Aura",
      "AbilityHaste"
    ],
    "description": "350 Health 50 Armor 10 Ability HasteImmolateAfter taking or dealing damage, deal magic damage per second to nearby enemies for 3 seconds.",
    "image": "3068_tank_t4_sunfireaegis.png"
  },
  {
    "id": "3070",
    "name": "Tear of the Goddess",
    "stats": [
      "Mana",
      "ManaRegen"
    ],
    "description": "240 ManaManaflow  (8s, max 4 charges)Landing Abilities grants 3 max Mana (doubled vs. champions), up to 360.Helping HandAttacks deal an additional 5 physical damage to minions.",
    "image": "3070_all_t1_tearofthegoddess.png"
  },
  {
    "id": "3071",
    "name": "Black Cleaver",
    "stats": [
      "Health",
      "Damage",
      "CooldownReduction",
      "OnHit",
      "NonbootsMovement",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "40 Attack Damage 400 Health 20 Ability HasteCarveDealing physical damage to champions reduces their Armor by 6% for 6 seconds. (stacks 5 times).FervorDealing physical damage grants 20 Move Speed for 2 seconds.",
    "image": "3071_fighter_t3_blackcleaver.png"
  },
  {
    "id": "3072",
    "name": "Bloodthirster",
    "stats": [
      "Damage",
      "LifeSteal"
    ],
    "description": "80 Attack Damage 15% Life StealIchorshieldConvert excess healing from your Lifesteal to a Shield.",
    "image": "3072_fighter_t3_bloodthirster.png"
  },
  {
    "id": "3073",
    "name": "Experimental Hexplate",
    "stats": [
      "Health",
      "Damage",
      "AttackSpeed",
      "CooldownReduction",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "40 Attack Damage 20% Attack Speed 450 HealthHexchargedGain 30 Ultimate Ability Haste.OverdriveAfter casting your Ultimate, gain 50% Attack Speed and 20% Move Speed for 8 seconds.",
    "image": "3073_hexaegis.png"
  },
  {
    "id": "3074",
    "name": "Ravenous Hydra",
    "stats": [
      "Damage",
      "LifeSteal",
      "CooldownReduction",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "65 Attack Damage 15 Ability Haste 12% Life StealCleaveAttacks deal physical damage to nearby enemies. Ravenous CrescentDeal physical damage to enemies around you. Your Life Steal applies to this damage.",
    "image": "3074_fighter_t3_ravenoushydra.png"
  },
  {
    "id": "3075",
    "name": "Thornmail",
    "stats": [
      "Health",
      "Armor"
    ],
    "description": "150 Health 75 ArmorThornsWhen struck by an Attack, deal magic damage to the attacker and apply 40% Wounds for 3 seconds if they are a champion.",
    "image": "3075_tank_t3_thornmail.png"
  },
  {
    "id": "3076",
    "name": "Bramble Vest",
    "stats": [
      "Armor"
    ],
    "description": "30 ArmorThornsWhen hit by an Attack, deal  magic damage to the attacker and apply 40% Wounds for 3 seconds if they are a champion.",
    "image": "3076_tank_t2_bramblevest.png"
  },
  {
    "id": "3077",
    "name": "Tiamat",
    "stats": [
      "Damage",
      "OnHit"
    ],
    "description": "20 Attack DamageCleaveAttacks deal physical damage to nearby enemies. CrescentDeal physical damage to enemies around you.",
    "image": "3077_fighter_t2_tiamat.png"
  },
  {
    "id": "3078",
    "name": "Trinity Force",
    "stats": [
      "Health",
      "Damage",
      "AttackSpeed",
      "CooldownReduction",
      "OnHit",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "36 Attack Damage 30% Attack Speed 333 Health 15 Ability HasteSpellbladeAfter using an Ability, your next Attack deals bonus physical damage  On-Hit. QuickenAttacking grants 20 Move Speed for 2 seconds.",
    "image": "3078_fighter_t4_trinityforce.png"
  },
  {
    "id": "3082",
    "name": "Warden's Mail",
    "stats": [
      "Armor"
    ],
    "description": "40 ArmorRock SolidReduce incoming damage from Attacks.",
    "image": "3082_tank_t2_wardensmail.png"
  },
  {
    "id": "3083",
    "name": "Warmog's Armor",
    "stats": [
      "Health",
      "HealthRegen"
    ],
    "description": "1000 Health 100% Base Health RegenWarmog's Heart If you have 2000 bonus Health and have not taken damage within 8 seconds, restore  Health per second.Warmog's VitalityGain bonus Health equal to 12% of your Item Health (0).",
    "image": "3083_tank_t3_warmogs.png"
  },
  {
    "id": "3084",
    "name": "Heartsteel",
    "stats": [
      "Health",
      "HealthRegen"
    ],
    "description": "900 Health 100% Base Health RegenColossal Consumption  (0s) per targetIf an enemy champion is nearby for a few seconds, your next Attack against them deals 70 plus 6% of your max Health as bonus physical damage and grants 8% of the damage as max Health.GoliathFor each 1000 max Health, gain 3% increased size, up to 30%.",
    "image": "3084_tank_t4_heartsteel.png"
  },
  {
    "id": "3085",
    "name": "Runaan's Hurricane",
    "stats": [
      "CriticalStrike",
      "AttackSpeed",
      "OnHit",
      "NonbootsMovement"
    ],
    "description": "40% Attack Speed 25% Critical Strike Chance 4% Move SpeedWind's FuryAttacks fire bolts at 2 additional enemies near the target.Each bolt deals physical damage and applies  On-Hit effects.",
    "image": "3085_marksman_t3_runaans.png"
  },
  {
    "id": "3086",
    "name": "Zeal",
    "stats": [
      "CriticalStrike",
      "AttackSpeed",
      "NonbootsMovement"
    ],
    "description": "15% Attack Speed 15% Critical Strike Chance 4% Move Speed",
    "image": "3086_fighter_t2_zeal.png"
  },
  {
    "id": "3087",
    "name": "Statikk Shiv",
    "stats": [
      "Damage",
      "AttackSpeed",
      "OnHit",
      "NonbootsMovement"
    ],
    "description": "45 Attack Damage 30% Attack Speed 4% Move SpeedElectrosparkAttacks trigger chain lightning On-Hit, dealing magic damage with a cooldown.Electroshock Takedowns within 3 seconds of damaging the target reset Electrospark's cooldown.",
    "image": "3087_statikk_shiv.png"
  },
  {
    "id": "3089",
    "name": "Rabadon's Deathcap",
    "stats": [
      "SpellDamage"
    ],
    "description": "130 Ability PowerMagical OpusIncreases your total Ability Power by 30%.",
    "image": "3089_mage_t3_deathcap.png"
  },
  {
    "id": "3091",
    "name": "Wit's End",
    "stats": [
      "SpellBlock",
      "AttackSpeed",
      "OnHit",
      "Tenacity"
    ],
    "description": "50% Attack Speed 45 Magic Resist 20% TenacityFrayAttacks deal bonus magic damage  On-Hit.",
    "image": "3091_fighter_t3_witsend.png"
  },
  {
    "id": "3094",
    "name": "Rapid Firecannon",
    "stats": [
      "CriticalStrike",
      "AttackSpeed",
      "NonbootsMovement"
    ],
    "description": "35% Attack Speed 25% Critical Strike Chance 4% Move SpeedSharpshooterYour Energized Attack deals 40 bonus magic damage and gains 35% bonus Attack Range.",
    "image": "3094_marksman_t3_rapidfirehandcannon.png"
  },
  {
    "id": "3095",
    "name": "Stormrazor",
    "stats": [
      "Damage",
      "CriticalStrike",
      "AttackSpeed"
    ],
    "description": "50 Attack Damage 20% Attack Speed 25% Critical Strike ChanceEnergizedMoving and Attacking generates an Energized Attack.BoltYour Energized Attack applies  bonus magic damage and grants 45% Move Speed for 1.5s.",
    "image": "3095_windblade.png"
  },
  {
    "id": "3100",
    "name": "Lich Bane",
    "stats": [
      "SpellDamage",
      "OnHit",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "100 Ability Power 4% Move Speed 10 Ability HasteSpellbladeAfter using an Ability, your next Attack deals bonus magic damage  On-Hit.",
    "image": "3100_mage_t3_lichbane.png"
  },
  {
    "id": "3102",
    "name": "Banshee's Veil",
    "stats": [
      "SpellBlock",
      "SpellDamage"
    ],
    "description": "105 Ability Power 40 Magic ResistAnnulGrants a Spell Shield that blocks the next enemy Ability.",
    "image": "3102_mage_t3_bansheesveil.png"
  },
  {
    "id": "3105",
    "name": "Aegis of the Legion",
    "stats": [
      "SpellBlock",
      "Armor",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "25 Armor 25 Magic Resist 10 Ability Haste",
    "image": "3105_tank_t2_aegisofthelegion.png"
  },
  {
    "id": "3107",
    "name": "Redemption",
    "stats": [
      "Health",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "200 Health 15 Ability Haste 100% Base Mana Regen 10% Heal and Shield Power InterventionRestore 150 - 350 Health to allied units and deal 10% max Health true damage to enemy champions after 2.5 seconds.",
    "image": "3107_enchanter_t3_redemption.png"
  },
  {
    "id": "3108",
    "name": "Fiendish Codex",
    "stats": [
      "SpellDamage",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "25 Ability Power 10 Ability Haste",
    "image": "3108_mage_t2_fiendishcodex.png"
  },
  {
    "id": "3109",
    "name": "Knight's Vow",
    "stats": [
      "Health",
      "HealthRegen",
      "Armor",
      "Aura",
      "Active",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "200 Health 40 Armor 10 Ability Haste 100% Base Health RegenSacrificeWhile near your Worthy ally, take 12% of the damage they receive and heal for 10% of the damage they deal to champions. Pledge  (0s)Designate an ally as Worthy.",
    "image": "3109_tank_t3_knightsvow.png"
  },
  {
    "id": "3110",
    "name": "Frozen Heart",
    "stats": [
      "Armor",
      "Mana",
      "Aura",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "75 Armor 400 Mana 20 Ability HasteWinter's CaressReduce the Attack Speed of nearby champions by 20%.",
    "image": "3110_tank_t3_frozenheart.png"
  },
  {
    "id": "3111",
    "name": "Mercury's Treads",
    "stats": [
      "Boots",
      "SpellBlock",
      "Tenacity"
    ],
    "description": "20 Magic Resist 45 Move Speed 30% Tenacity",
    "image": "3111_class_t2_mercurystreads.png"
  },
  {
    "id": "3112",
    "name": "Guardian's Orb",
    "stats": [
      "Health",
      "SpellDamage",
      "ManaRegen",
      "Lane"
    ],
    "description": "50 Ability Power 150 HealthRecovery: Restores 10 Mana every 5 seconds. If you can't gain mana, restores 15 Health instead.",
    "image": "3112_aram_t1_guardiansorb.png"
  },
  {
    "id": "3113",
    "name": "Aether Wisp",
    "stats": [
      "NonbootsMovement",
      "SpellDamage"
    ],
    "description": "30 Ability Power 4% Move Speed",
    "image": "3113_mage_t2_aetherwisp.png"
  },
  {
    "id": "3114",
    "name": "Forbidden Idol",
    "stats": [
      "ManaRegen"
    ],
    "description": "50% Base Mana Regen 8% Heal and Shield Power",
    "image": "3114_mage_t2_forbiddenidol.png"
  },
  {
    "id": "3115",
    "name": "Nashor's Tooth",
    "stats": [
      "AttackSpeed",
      "SpellDamage",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "80 Ability Power 50% Attack Speed 15 Ability HasteIcathian BiteAttacks deal bonus magic damage  On-Hit.",
    "image": "3115_mage_t3_nashorstooth.png"
  },
  {
    "id": "3116",
    "name": "Rylai's Crystal Scepter",
    "stats": [
      "Health",
      "SpellDamage",
      "Slow"
    ],
    "description": "65 Ability Power 400 HealthRimefrostDamaging Abilities Slow enemies by 30% for 1 second.",
    "image": "3116_mage_t3_rylajscrystalscepter.png"
  },
  {
    "id": "3117",
    "name": "Mobility Boots",
    "stats": [
      "Boots"
    ],
    "description": "25 Move Speed When out of combat for at least 5 seconds, increase this item's effect to  45.",
    "image": "3117_class_t2_bootsofmobility.png"
  },
  {
    "id": "3118",
    "name": "Malignance",
    "stats": [
      "SpellDamage",
      "Mana",
      "AbilityHaste"
    ],
    "description": "90 Ability Power 600 Mana 15 Ability HasteScornGain 20 Ultimate Ability Haste.HatefogDamaging a champion with your Ultimate burns the ground beneath them for 3s, dealing magic damage per second and reducing their Magic Resist.",
    "image": "3118_malignance.png"
  },
  {
    "id": "3119",
    "name": "Winter's Approach",
    "stats": [
      "Health",
      "Mana",
      "AbilityHaste"
    ],
    "description": "550 Health 500 Mana 15 Ability HasteAweGain  Health.Manaflow  (8s, max 4 charges)Landing Attacks and Abilities grant 3 max Mana (doubled vs. champions).Transforms into Fimbulwinter at 360 max Mana.",
    "image": "3119_wintersapproach.png"
  },
  {
    "id": "3121",
    "name": "Fimbulwinter",
    "stats": [
      "Health",
      "Mana",
      "AbilityHaste"
    ],
    "description": "550 Health 860 Mana 15 Ability HasteAweGain  Health.Everlasting  (0s)Immobilizing or Slowing ( Melee only) an enemy champion grants a Shield for 3 seconds. The Shield is increased by 80% if more than one enemy is nearby.",
    "image": "3121_fimbulwinter.png"
  },
  {
    "id": "3123",
    "name": "Executioner's Calling",
    "stats": [
      "Damage"
    ],
    "description": "15 Attack DamageGrievous WoundsDealing physical damage to champions applies 40% Wounds for 3 seconds.",
    "image": "3123_fighter_t2_executionerscalling.png"
  },
  {
    "id": "3124",
    "name": "Guinsoo's Rageblade",
    "stats": [
      "Damage",
      "AttackSpeed",
      "SpellDamage",
      "OnHit"
    ],
    "description": "30 Attack Damage 30 Ability Power 25% Attack SpeedWrathAttacks deal 30 bonus magic damage  On-Hit.Seething StrikeAttacks grant 8% Attack Speed for 3 seconds. (stacks 4 times). While fully stacked, every third Attack applies  On-Hit effects twice.",
    "image": "3124_marksman_t3_guinsoosrageblade.png"
  },
  {
    "id": "3128",
    "name": "Deathfire Grasp",
    "stats": [
      "SpellDamage",
      "CooldownReduction"
    ],
    "description": "120 Ability Power 10 Ability Haste Active - The Silence: Deal magic damage equal to 15% of the Target's Max Health, and then amplify damage they take by 15% for 4 seconds (90 (0s)).",
    "image": "3128_deathfire_grasp.png"
  },
  {
    "id": "3131",
    "name": "Sword of the Divine",
    "stats": [
      "Damage",
      "CriticalStrike",
      "AttackSpeed"
    ],
    "description": "30 Attack Damage 25% Attack Speed 18 Lethality Active - Divine Blessing: Grants 100% Attack Speed and 100% Critical Strike Chance for 3 seconds or 3 basic attacks (90 (0s)).",
    "image": "3131_fighter_t3_swordofthedivine.png"
  },
  {
    "id": "3133",
    "name": "Caulfield's Warhammer",
    "stats": [
      "Damage",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "20 Attack Damage 10 Ability Haste",
    "image": "3133_fighter_t2_caulfieldswarhammer.png"
  },
  {
    "id": "3134",
    "name": "Serrated Dirk",
    "stats": [
      "Damage",
      "ArmorPenetration"
    ],
    "description": "20 Attack Damage 10 Lethality",
    "image": "3134_assassin_t2_serrateddirk.png"
  },
  {
    "id": "3135",
    "name": "Void Staff",
    "stats": [
      "MagicPenetration",
      "SpellDamage"
    ],
    "description": "95 Ability Power 40% Magic Penetration",
    "image": "3135_mage_t3_voidstaff.png"
  },
  {
    "id": "3137",
    "name": "Cryptbloom",
    "stats": [
      "SpellDamage",
      "MagicPenetration",
      "AbilityHaste"
    ],
    "description": "75 Ability Power 30% Magic Penetration 20 Ability HasteLife from DeathWhen a champion that you damaged within 3 seconds dies, a nova spreads from their corpse that heals.",
    "image": "3137_cryptbloom.png"
  },
  {
    "id": "3139",
    "name": "Mercurial Scimitar",
    "stats": [
      "SpellBlock",
      "Damage",
      "LifeSteal",
      "Active",
      "NonbootsMovement",
      "Tenacity"
    ],
    "description": "50 Attack Damage 35 Magic Resist 10% Life Steal ACTIVEQuicksilverRemoves all crowd control debuffs (excluding Airborne) and grants Move Speed.",
    "image": "3139_marksman_t3_mercurialscimitar.png"
  },
  {
    "id": "3140",
    "name": "Quicksilver Sash",
    "stats": [
      "Active",
      "SpellBlock"
    ],
    "description": "30 Magic Resist QuicksilverRemove all crowd control debuffs (excluding Airborne).",
    "image": "3140_marksman_t2_quicksilversash.png"
  },
  {
    "id": "3142",
    "name": "Youmuu's Ghostblade",
    "stats": [
      "Damage",
      "Active",
      "NonbootsMovement",
      "ArmorPenetration"
    ],
    "description": "55 Attack Damage 18 Lethality 4% Move SpeedHaunt Gain  Move Speed while out of combat. Wraith StepGain Move Speed and Ghosting for  seconds.",
    "image": "3142_assassin_t3_youmuusghostblade.png"
  },
  {
    "id": "3143",
    "name": "Randuin's Omen",
    "stats": [
      "Health",
      "Armor",
      "Active",
      "Slow"
    ],
    "description": "350 Health 75 ArmorResilienceReceive 30% less damage from Critical Strikes. HumilitySlow nearby enemies by 70% for 2 seconds.",
    "image": "3143_tank_t3_randuinsomen.png"
  },
  {
    "id": "3144",
    "name": "Scout's Slingshot",
    "stats": [
      "AttackSpeed"
    ],
    "description": "20% Attack SpeedBullseyeDamaging a champion deals bonus magic damage. Attacks reduce this cooldown by 1 second.",
    "image": "3144_scoutslingshot.png"
  },
  {
    "id": "3145",
    "name": "Hextech Alternator",
    "stats": [
      "SpellDamage"
    ],
    "description": "45 Ability PowerRevvedDamaging a champion deals bonus magic damage.",
    "image": "3145_mage_t2_hextechalternator.png"
  },
  {
    "id": "3146",
    "name": "Hextech Gunblade",
    "stats": [
      "Damage",
      "LifeSteal",
      "SpellDamage",
      "Active",
      "SpellVamp"
    ],
    "description": "80 Ability Power 40 Attack Damage 15% Omnivamp ACTIVE  (0s)Lightning BoltShocks the target enemy champion, dealing  magic damage and slowing them by 40% for 2 seconds.",
    "image": "3146_hextechgunblade.png"
  },
  {
    "id": "3147",
    "name": "Haunting Guise",
    "stats": [
      "Health",
      "SpellDamage"
    ],
    "description": "30 Ability Power 200 HealthMadnessFor each second in combat with enemy champions, deal 2% bonus damage, up to 6%.",
    "image": "3147_hauntingguise.png"
  },
  {
    "id": "3152",
    "name": "Hextech Rocketbelt",
    "stats": [
      "Health",
      "SpellDamage",
      "Active",
      "CooldownReduction",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "70 Ability Power 300 Health 20 Ability Haste SupersonicDash in target direction, unleashing missiles that deal magic damage.",
    "image": "3152_mage_t4_hextechrocketbelt.png"
  },
  {
    "id": "3153",
    "name": "Blade of The Ruined King",
    "stats": [
      "Damage",
      "AttackSpeed",
      "LifeSteal",
      "Slow",
      "OnHit"
    ],
    "description": "40 Attack Damage 25% Attack Speed 10% Life StealMist's EdgeAttacks deal a percentage of enemy's current Health as bonus physical damage  On-Hit.Clawing ShadowsAttacking a champion 3 times Slows them by 30% for 1 second.",
    "image": "3153_fighter_t3_bladeoftheruinedking.png"
  },
  {
    "id": "3155",
    "name": "Hexdrinker",
    "stats": [
      "Damage",
      "SpellBlock"
    ],
    "description": "25 Attack Damage 25 Magic ResistLifelineTaking magic damage that would reduce your Health below 30% grants a magic damage Shield for 2.5 seconds.",
    "image": "3155_fighter_t2_hexdrinker.png"
  },
  {
    "id": "3156",
    "name": "Maw of Malmortius",
    "stats": [
      "SpellBlock",
      "Damage",
      "LifeSteal",
      "SpellVamp",
      "AbilityHaste"
    ],
    "description": "60 Attack Damage 15 Ability Haste 40 Magic ResistLifelineTaking magic damage that would reduce your Health below 30% grants a magic damage Shield for 3 seconds and 10% Omnivamp until end of combat.",
    "image": "3156_fighter_t3_mawofmalmortius.png"
  },
  {
    "id": "3157",
    "name": "Zhonya's Hourglass",
    "stats": [
      "Armor",
      "SpellDamage",
      "Active"
    ],
    "description": "105 Ability Power 50 Armor Time StopEnter Stasis for 2.5 seconds.",
    "image": "3157_mage_t3_zhonyashourglass.png"
  },
  {
    "id": "3158",
    "name": "Ionian Boots of Lucidity",
    "stats": [
      "Boots",
      "CooldownReduction"
    ],
    "description": "10 Ability Haste 45 Move SpeedIonian InsightGain 10 Summoner Spell Haste.",
    "image": "3158_class_t2_ionianbootsoflucidity.png"
  },
  {
    "id": "3161",
    "name": "Spear of Shojin",
    "stats": [
      "Health",
      "Damage",
      "AbilityHaste"
    ],
    "description": "45 Attack Damage 450 HealthDragonforce Gain 25 Basic Ability Haste.Focused Will Dealing damage with Abilities increases your Champion's Ability and Passive damage by 3% for 6 seconds. (stacks 4 times).",
    "image": "3161_fighter_t3_spearofshojin.png"
  },
  {
    "id": "3165",
    "name": "Morellonomicon",
    "stats": [
      "Health",
      "SpellDamage",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "75 Ability Power 350 Health 15 Ability HasteGrievous WoundsDealing magic damage to champions applies 40% Wounds for 3 seconds.",
    "image": "3165_mage_t3_morellonomicon.png"
  },
  {
    "id": "3170",
    "name": "Swiftmarch",
    "stats": [
      "Boots"
    ],
    "description": "65 Move SpeedFleetfootedReduce the effectiveness of Slows by 25%.Noxian FervorGain 5% of your Move Speed as Adaptive Force.",
    "image": "boots_tier3_swiftness_64.png"
  },
  {
    "id": "3171",
    "name": "Crimson Lucidity",
    "stats": [
      "CooldownReduction",
      "Boots"
    ],
    "description": "25 Ability Haste 50 Move SpeedIonian InsightGain 10 Summoner Spell Haste.Noxian HasteEmpowering or protecting allies with abilities, dealing damage to enemy Champions with abilities, or casting a Summoner Spell grants  Move Speed for 4 seconds.Noxian Haste can only be triggered once per Ability cast.",
    "image": "boots_tier3_ionianboots_64.png"
  },
  {
    "id": "3172",
    "name": "Gunmetal Greaves",
    "stats": [
      "AttackSpeed",
      "NonbootsMovement"
    ],
    "description": "40% Attack Speed 50 Move SpeedNoxian GaitAttacks against Champions grant Move Speed  On-Hit decaying over 2 seconds.",
    "image": "boots_tier3_berserkersgreaves_64.png"
  },
  {
    "id": "3173",
    "name": "Chainlaced Crushers",
    "stats": [
      "SpellBlock",
      "Boots",
      "Tenacity",
      "MagicResist"
    ],
    "description": "35 Magic Resist 50 Move Speed 30% TenacityNoxian Persistence  (0s)After taking magic damage from a Champion, gain a  magic shield for 4 seconds.",
    "image": "boots_tier3_mercury_64.png"
  },
  {
    "id": "3174",
    "name": "Armored Advance",
    "stats": [
      "Armor",
      "Boots"
    ],
    "description": "40 Armor 50 Move SpeedPlatingReduces incoming damage from Attacks by 10%.Noxian Endurance  (0s)After taking physical damage from a Champion, gain a  physical shield for 4 seconds.",
    "image": "boots_tier3_platedsteelcaps_64.png"
  },
  {
    "id": "3175",
    "name": "Spellslinger's Shoes",
    "stats": [
      "Boots",
      "MagicPenetration"
    ],
    "description": "18 Magic Penetration 7% Magic Penetration 50 Move Speed",
    "image": "boots_tier3_sorceror_64.png"
  },
  {
    "id": "3176",
    "name": "Forever Forward",
    "stats": [
      "Boots"
    ],
    "description": "55 Move SpeedVoidbornGain Empowered Recall.Noxian SynchronyGain 45 Move Speed and 8% total Move Speed when out of combat.",
    "image": "boots_tier3_syncronisedsouls_64.png"
  },
  {
    "id": "3177",
    "name": "Guardian's Blade",
    "stats": [
      "Health",
      "Damage",
      "Lane",
      "AbilityHaste"
    ],
    "description": "30 Attack Damage 150 Health 15 Ability Haste",
    "image": "3177_aram_t1_guardiansblade.png"
  },
  {
    "id": "3179",
    "name": "Umbral Glaive",
    "stats": [
      "Damage",
      "Vision",
      "CooldownReduction",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "55 Attack Damage 15 Lethality 10 Ability HasteBlackoutWhen you are near enemy Stealth Wards and traps, reveal them for 8 seconds.ExtinguishAttacks do bonus damage to Wards.",
    "image": "3179_assassin_t3_umbralglaive.png"
  },
  {
    "id": "3181",
    "name": "Hullbreaker",
    "stats": [
      "Health",
      "Damage",
      "NonbootsMovement"
    ],
    "description": "40 Attack Damage 500 Health 4% Move SpeedSkipperEvery fifth Attack against champions and epic monsters deals bonus physical damage, increased against Structures.Boarding PartyNearby allied siege and super minions gain Armor and Magic Resist.",
    "image": "3181_hullbreaker.png"
  },
  {
    "id": "3184",
    "name": "Guardian's Hammer",
    "stats": [
      "Health",
      "Damage",
      "LifeSteal",
      "Lane"
    ],
    "description": "25 Attack Damage 150 Health 5% Life Steal",
    "image": "3177_aram_t1_guardianshammer.png"
  },
  {
    "id": "3190",
    "name": "Locket of the Iron Solari",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "Aura",
      "Active",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "200 Health 25 Armor 25 Magic Resist 10 Ability Haste DevotionGrant nearby allies a 200 - 360 Shield that decays over 2.5 seconds.",
    "image": "3190_enchanter_t4_locketofironsolari.png"
  },
  {
    "id": "3193",
    "name": "Gargoyle Stoneplate",
    "stats": [
      "SpellBlock",
      "Armor",
      "Active",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "60 Armor 60 Magic Resist 15 Ability HasteFortify: Taking damage from a champion grants a stack of  Armor and  Magic Resist for 6 seconds.Max 5 stacks; 1 per champion. Active - Unbreakable: Gain a Shield that decays and grow in size.",
    "image": "3193_tank_t3_gargoylestoneplate.png"
  },
  {
    "id": "3211",
    "name": "Spectre's Cowl",
    "stats": [
      "Health",
      "HealthRegen",
      "SpellBlock"
    ],
    "description": "200 Health 35 Magic Resist 100% Base Health Regen",
    "image": "3211_tank_t2_spectrescowl.png"
  },
  {
    "id": "3222",
    "name": "Mikael's Blessing",
    "stats": [
      "Health",
      "ManaRegen",
      "Active",
      "CooldownReduction",
      "Tenacity",
      "AbilityHaste"
    ],
    "description": "250 Health 100% Base Mana Regen 12% Heal and Shield Power 15 Ability Haste PurifyRemove all crowd control debuffs (excluding Airborne and Suppression) from an ally champion and restore 100 - 250 Health.",
    "image": "3222_enchanter_t3_mikaelsblessing.png"
  },
  {
    "id": "3302",
    "name": "Terminus",
    "stats": [
      "Damage",
      "AttackSpeed",
      "OnHit",
      "MagicPenetration",
      "ArmorPenetration"
    ],
    "description": "30 Attack Damage 35% Attack SpeedShadowAttacks deal 30 bonus magic damage  On-Hit.JuxtapositionAlternate between Light and Dark Attacks against champions: Light Attacks grant Armor and Magic Resist for 5s. Dark Attacks grant 10% Armor Penetration and Magic Penetration for 5s.",
    "image": "3302_terminus.png"
  },
  {
    "id": "3330",
    "name": "Scarecrow Effigy",
    "stats": [
      "Active",
      "Jungle",
      "Lane",
      "Trinket",
      "Vision"
    ],
    "description": "Cannot be sold Active - Trinket: Places an effigy that lasts for  seconds and appears exactly as Fiddlesticks does to enemies. Stores one charge every  seconds, up to maximum 2 charges.Enemy champions approaching an effigy will activate it, causing the effigy to fake a random action, after which the effigy will fall apart.",
    "image": "default.png"
  },
  {
    "id": "3340",
    "name": "Stealth Ward",
    "stats": [
      "Active",
      "Jungle",
      "Lane",
      "Trinket",
      "Vision"
    ],
    "description": "Active  (210 - 120s, max 2 charges)Places an Invisible Stealth Ward that grants vision for 90-120 seconds.",
    "image": "3340_class_t1_wardingtotem.png"
  },
  {
    "id": "3348",
    "name": "Arcane Sweeper",
    "stats": [
      "Active",
      "Jungle",
      "Lane",
      "Trinket",
      "Vision"
    ],
    "description": "UNIQUE Active - Hunter's Sight: An arcane mist grants vision in the target area for 5 seconds, revealing enemy champions and granting True Sight of traps in the area for 3 seconds (30 second cooldown).",
    "image": "3348_arcanesweeper.png"
  },
  {
    "id": "3349",
    "name": "Lucent Singularity",
    "stats": [
      "Active",
      "Jungle",
      "Lane",
      "Trinket",
      "Vision"
    ],
    "description": "Lucent Singularity",
    "image": "default.png"
  },
  {
    "id": "3363",
    "name": "Farsight Alteration",
    "stats": [
      "Active",
      "Trinket",
      "Vision"
    ],
    "description": "Active  (198 - 99s)Reveals a distant area for 2 seconds and leaves a Ward that expires upon spotting an enemy champion.",
    "image": "3363_class_t1_farsightalteration.png"
  },
  {
    "id": "3364",
    "name": "Oracle Lens",
    "stats": [
      "Active",
      "Trinket",
      "Vision"
    ],
    "description": "Active  (160 - 100s, max 2 charges)Reveals enemy Stealth Wards and traps around you for 6 seconds.",
    "image": "3364_class_t1_oracleslens.png"
  },
  {
    "id": "3398",
    "name": "Small Party Favor",
    "stats": [
      "Consumable",
      "GoldPer"
    ],
    "description": "Obtained from a Cat Shaco Box. Click to Consume: Gain gold.",
    "image": "default.png"
  },
  {
    "id": "3399",
    "name": "Party Favor",
    "stats": [
      "Consumable",
      "GoldPer"
    ],
    "description": "'Party Favor'Obtained from a Party Drake. Click to Consume: Gain a pile of gold, and 1 skill point!Skill Points will not take you over your maximum number of skill points, nor will they make you better at playing League of Legends. Additional terms and conditions may apply.",
    "image": "default.png"
  },
  {
    "id": "3400",
    "name": "Your Cut",
    "stats": [
      "Consumable",
      "GoldPer"
    ],
    "description": "Active - Consume: Gain 0 gold.Bonus gold given to an ally when Pyke executes an enemy champion using his Ultimate Ability. If no ally was involved in the kill, Pyke gets to keep the Cut!",
    "image": "default.png"
  },
  {
    "id": "3430",
    "name": "Rite Of Ruin",
    "stats": [
      "CriticalStrike",
      "SpellDamage",
      "CooldownReduction"
    ],
    "description": "50 Ability Power 15 Ability Haste 25% Critical Strike ChanceWrath and RuinOn spell cast, gain  2.5% critical chance for 6 seconds, stacking up to  20%.Salvage the WreckageYour spells have a chance equal to your crit chance to grant you or your targeted ally a shield for  for 3s.",
    "image": "3430_riteofruin.png"
  },
  {
    "id": "3504",
    "name": "Ardent Censer",
    "stats": [
      "AttackSpeed",
      "SpellDamage",
      "ManaRegen",
      "NonbootsMovement"
    ],
    "description": "45 Ability Power 10% Heal and Shield Power 125% Base Mana Regen 4% Move SpeedSanctifyHealing or Shielding an ally enhances you both for 6 seconds, granting 25% Attack Speed and 20 magic damage  On-Hit.",
    "image": "3504_enchanter_t3_ardentcenser.png"
  },
  {
    "id": "3508",
    "name": "Essence Reaver",
    "stats": [
      "Damage",
      "CriticalStrike",
      "ManaRegen",
      "CooldownReduction",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "60 Attack Damage 15 Ability Haste 25% Critical Strike ChanceEssence DrainAttacks grant Mana  On-Hit.",
    "image": "3508_marksman_t3_essencereaver.png"
  },
  {
    "id": "3513",
    "name": "Eye of the Herald",
    "stats": [
      "Trinket",
      "Active"
    ],
    "description": "Active - Consume: Crush the Eye of the Herald, begining the ritual to summon Rift Herald. You may click the Rift Herald after it has summoned to control how it charges. This control effect can be done once when it is summoned, and once each time a nearby enemy structure dies.",
    "image": "3513_eyeoftheherald.png"
  },
  {
    "id": "3599",
    "name": "Kalista's Black Spear",
    "stats": [
      "Consumable"
    ],
    "description": "Active - Consume: Bind with an ally for the remainder of the game, becoming Oathsworn Allies. Oathsworn empowers you both while near one another.",
    "image": "3599_kalistapassiveitem.png"
  },
  {
    "id": "3600",
    "name": "Kalista's Black Spear",
    "stats": [
      "Consumable"
    ],
    "description": "Active - Consume: Bind with an ally for the remainder of the game, becoming Oathsworn Allies. Oathsworn empowers you both while near one another.Required to use Kalista's Ultimate Ability.",
    "image": "3599_kalistapassiveitem.png"
  },
  {
    "id": "3742",
    "name": "Dead Man's Plate",
    "stats": [
      "Health",
      "Armor",
      "Slow",
      "NonbootsMovement"
    ],
    "description": "350 Health 55 Armor 4% Move SpeedShipwreckerWhile moving, build up to 20 bonus Move Speed. Your next Attack discharges built up Move Speed to deal bonus physical damage.UnsinkableReduce the effectiveness of Slows by 15%.",
    "image": "3742_tank_t3_deadmansplate.png"
  },
  {
    "id": "3748",
    "name": "Titanic Hydra",
    "stats": [
      "Health",
      "HealthRegen",
      "Damage",
      "OnHit"
    ],
    "description": "40 Attack Damage 600 HealthCleaveAttacks deal physical damage on-hit and to enemies behind the target. Titanic CrescentEmpower your next Cleave to deal bonus physical damage  On-Hit and deal bonus physical damage to enemies behind the target.",
    "image": "3748_fighter_t3_titanichydra.png"
  },
  {
    "id": "3801",
    "name": "Crystalline Bracer",
    "stats": [
      "Health",
      "HealthRegen"
    ],
    "description": "200 Health 100% Base Health Regen",
    "image": "3801_tank_t2_crystallinebracer.png"
  },
  {
    "id": "3802",
    "name": "Lost Chapter",
    "stats": [
      "SpellDamage",
      "Mana",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "40 Ability Power 300 Mana 10 Ability HasteEnlightenLevelling up restores 20% max Mana over 3 seconds.",
    "image": "3802_mage_tier2_lostchapter.png"
  },
  {
    "id": "3803",
    "name": "Catalyst of Aeons",
    "stats": [
      "Health",
      "HealthRegen",
      "Mana",
      "ManaRegen"
    ],
    "description": "300 Health 375 ManaEternityRestores 10% of the damage taken from champions as Mana. Casting an Ability heals for 25% of Mana spent.",
    "image": "3803_mage_t2_catalystofaeons.png"
  },
  {
    "id": "3814",
    "name": "Edge of Night",
    "stats": [
      "Health",
      "Damage",
      "ArmorPenetration"
    ],
    "description": "50 Attack Damage 15 Lethality 250 HealthAnnulGrants a Spell Shield that blocks the next enemy Ability.",
    "image": "3814_assassin_t3_edgeofnight.png"
  },
  {
    "id": "3850",
    "name": "Spellthief's Edge",
    "stats": [
      "Health",
      "SpellDamage",
      "ManaRegen",
      "Vision",
      "GoldPer",
      "Lane"
    ],
    "description": "10 Ability Power 25 Health 25% Base Mana Regen 2 Gold Per 10 SecondsTribute: While nearby an ally champion, damaging Abilities and Attacks against champions or buildings grant 20 gold. This can occur up to 3 times every 36 seconds.Quest: Earn 500 gold from this item to transform it into Frostfang, gaining  Active - Warding.This item grants reduced gold from minions if anyone on your team with this item kill excessive numbers of them.",
    "image": "3850_mage_t1_spellthiefsedge.png"
  },
  {
    "id": "3851",
    "name": "Frostfang",
    "stats": [
      "GoldPer",
      "Lane",
      "ManaRegen",
      "SpellDamage"
    ],
    "description": "15 Ability Power 70 Health 50% Base Mana Regen 3 Gold Per 10 SecondsTribute: While nearby an ally champion, damaging Abilities and Attacks against champions or buildings grant 20 gold. This can occur up to 3 times every 36 seconds.Quest: Earn 1000 gold from this item to transform it into World Rune T2.This item grants reduced gold from minions if anyone on your team with this item kill excessive numbers of them. ACTIVEWard Place an Invisible Stealth Ward that grants vision. Stores 0 Stealth Wards, which refill upon visiting the shop.",
    "image": "3851_mage_t2_frostfang.png"
  },
  {
    "id": "3853",
    "name": "Shard of True Ice",
    "stats": [
      "GoldPer",
      "Lane",
      "ManaRegen",
      "SpellDamage"
    ],
    "description": "40 Ability Power 75 Health 100% Base Mana Regen 3 Gold Per 10 SecondsThis item grants reduced gold from minions if anyone on your team with this item kill excessive numbers of them. ACTIVEWard Place an Invisible Stealth Ward that grants vision. Stores 0 Stealth Wards, which refill upon visiting the shop.",
    "image": "3853_mage_t3_shardoftrueice.png"
  },
  {
    "id": "3854",
    "name": "Steel Shoulderguards",
    "stats": [
      "Health",
      "HealthRegen",
      "Damage",
      "Vision",
      "GoldPer",
      "Lane"
    ],
    "description": "GeneratedTip_Item_3854_ExternalDescription",
    "image": "3854_tank_t1_petriciteshoulderguard.png"
  },
  {
    "id": "3855",
    "name": "Runesteel Spaulders",
    "stats": [
      "Health",
      "HealthRegen",
      "GoldPer",
      "Lane"
    ],
    "description": "6 Attack Damage 100 Health 75% Base Health Regen 3 Gold Per 10 SecondsSpoils of War: While nearby an allied champion, Attacks execute minions below 0% of their max Health. Killing a minion grants the same kill gold to the nearest allied champion. These effects recharge every 0 seconds (Max 0 charges).Quest: Earn 1000 gold from this item to transform it into Pauldrons of Whiterock. This item grants reduced gold from minions if anyone on your team with this item kill excessive numbers of them. ACTIVEWard Place an Invisible Stealth Ward that grants vision. Stores 0 Stealth Wards, which refill upon visiting the shop.",
    "image": "3855_tank_t2_runesteelspaulders.png"
  },
  {
    "id": "3857",
    "name": "Pauldrons of Whiterock",
    "stats": [
      "Health",
      "HealthRegen",
      "GoldPer",
      "Lane"
    ],
    "description": "15 Attack Damage 250 Health 100% Base Health Regen 3 Gold Per 10 SecondsThis item grants reduced gold from minions if anyone on your team with this item kill excessive numbers of them. ACTIVEWard Place an Invisible Stealth Ward that grants vision. Stores 0 Stealth Wards, which refill upon visiting the shop.",
    "image": "3857_tank_t3_pauldronsofwhiterock.png"
  },
  {
    "id": "3858",
    "name": "Relic Shield",
    "stats": [
      "Health",
      "HealthRegen",
      "SpellDamage",
      "Vision",
      "GoldPer",
      "Lane"
    ],
    "description": "GeneratedTip_Item_3858_ExternalDescription",
    "image": "3858_tank_t1_relicshield.png"
  },
  {
    "id": "3859",
    "name": "Targon's Buckler",
    "stats": [
      "Health",
      "HealthRegen",
      "GoldPer",
      "Lane"
    ],
    "description": "10 Ability Power 100 Health 75% Base Health Regen 3 Gold Per 10 SecondsSpoils of War: While nearby an allied champion, Attacks execute minions below 0% of their max Health. Killing a minion grants the same kill gold to the nearest allied champion. These effects recharge every 0 seconds (Max 0 charges).Quest: Earn 1000 gold from this item to transform it into Bulwark of the Mountain. This item grants reduced gold from minions if anyone on your team with this item kill excessive numbers of them. ACTIVEWard Place an Invisible Stealth Ward that grants vision. Stores 0 Stealth Wards, which refill upon visiting the shop.",
    "image": "3859_tank_t2_targonsbucker.png"
  },
  {
    "id": "3860",
    "name": "Bulwark of the Mountain",
    "stats": [
      "Health",
      "HealthRegen",
      "GoldPer",
      "Lane"
    ],
    "description": "20 Ability Power 250 Health 100% Base Health Regen 3 Gold Per 10 SecondsThis item grants reduced gold from minions if anyone on your team with this item kill excessive numbers of them. ACTIVEWard Place an Invisible Stealth Ward that grants vision. Stores 0 Stealth Wards, which refill upon visiting the shop.",
    "image": "3860_tank_t3_bulwarkofthemountain.png"
  },
  {
    "id": "3862",
    "name": "Spectral Sickle",
    "stats": [
      "Health",
      "Damage",
      "ManaRegen",
      "Vision",
      "GoldPer",
      "Lane"
    ],
    "description": "6 Attack Damage 25 Health 25% Base Mana Regen 2 Gold Per 10 SecondsTribute: While nearby an ally champion, damaging Abilities and Attacks against champions or buildings grant 20 gold. This can occur up to 3 times every 36 seconds.Quest: Earn 500 gold from this item to transform it into Harrowing Crescent, gaining  Active - Warding.This item grants reduced gold from minions if anyone on your team with this item kill excessive numbers of them.",
    "image": "3862_marksman_t1_spectralsickle.png"
  },
  {
    "id": "3863",
    "name": "Harrowing Crescent",
    "stats": [
      "Health",
      "ManaRegen",
      "GoldPer",
      "Lane"
    ],
    "description": "10 Attack Damage 60 Health 50% Base Mana Regen 3 Gold Per 10 SecondsTribute: While nearby an ally champion, damaging Abilities and Attacks against champions or buildings grant 20 gold. This can occur up to 3 times every 36 seconds.Quest: Earn 1000 gold from this item to transform it into Black Mist Scythe.This item grants reduced gold from minions if anyone on your team with this item kill excessive numbers of them. ACTIVEWard Place an Invisible Stealth Ward that grants vision. Stores 0 Stealth Wards, which refill upon visiting the shop.",
    "image": "3863_marksman_t2_harrowingcrescent.png"
  },
  {
    "id": "3864",
    "name": "Black Mist Scythe",
    "stats": [
      "Health",
      "ManaRegen",
      "GoldPer",
      "Lane"
    ],
    "description": "20 Attack Damage 75 Health 100% Base Mana Regen 3 Gold Per 10 SecondsThis item grants reduced gold from minions if anyone on your team with this item kill excessive numbers of them. ACTIVEWard Place an Invisible Stealth Ward that grants vision. Stores 0 Stealth Wards, which refill upon visiting the shop.",
    "image": "3864_marksman_t3_blackmistscythe.png"
  },
  {
    "id": "3865",
    "name": "World Atlas",
    "stats": [
      "Health",
      "ManaRegen",
      "Vision",
      "GoldPer",
      "Lane"
    ],
    "description": "",
    "image": "3865_worldatlas.png"
  },
  {
    "id": "3866",
    "name": "Runic Compass",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "Vision",
      "GoldPer",
      "Lane"
    ],
    "description": "100 Health 50% Base Health Regen 50% Base Mana Regen 5 Gold Per 10 SecondsSupport QuestEarn 0 gold from this item to transform it into Bounty of Worlds. Shared Riches  (0s, max 0 charges)While near an ally champion, damage enemy champions or kill minions to gain gold. Active (3 charges)Places an Invisible Stealth Ward that grants vision.",
    "image": "3866_runiccompass.png"
  },
  {
    "id": "3867",
    "name": "Bounty of Worlds",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "Vision",
      "GoldPer",
      "Lane"
    ],
    "description": "5 Gold Per 10 Seconds 75% Base Health Regen 75% Base Mana Regen 200 HealthUpgrade This item can be upgraded into Bloodsong, Celestial Opposition, Dream Maker, Zaz'Zak's Realmspike, or Solstice Sleigh for free. Active (4 charges)Places an Invisible Stealth Ward that grants vision.",
    "image": "3867_bountyofworlds.png"
  },
  {
    "id": "3869",
    "name": "Celestial Opposition",
    "stats": [
      "Health",
      "HealthRegen",
      "ManaRegen",
      "Vision",
      "GoldPer",
      "Lane"
    ],
    "description": "200 Health 75% Base Health Regen 75% Base Mana Regen 5 Gold Per 10 SecondsBlessing of the MountainReduce incoming champion damage for 2 seconds after taking damage from a champion. When the effect ends, slow nearby enemies by 50% for 1.5 seconds. Active (4 charges)Places an Invisible Stealth Ward that grants vision.",
    "image": "3869_celestialopposition.png"
  },
  {
    "id": "3870",
    "name": "Dream Maker",
    "stats": [
      "Health",
      "HealthRegen",
      "ManaRegen",
      "Vision",
      "GoldPer",
      "Lane"
    ],
    "description": "200 Health 75% Base Health Regen 75% Base Mana Regen 5 Gold Per 10 SecondsDream MakerHealing or Shielding another ally blows Dream Bubbles to them for 3 seconds. Their next Attack deals bonus magic damage  On-Hit and the next damage they take is reduced. Active (4 charges)Places an Invisible Stealth Ward that grants vision.",
    "image": "3870_dreammaker.png"
  },
  {
    "id": "3871",
    "name": "Zaz'Zak's Realmspike",
    "stats": [
      "Health",
      "HealthRegen",
      "ManaRegen",
      "Vision",
      "GoldPer",
      "Lane"
    ],
    "description": "200 Health 75% Base Health Regen 75% Base Mana Regen 5 Gold Per 10 SecondsVoid ExplosionDealing Ability damage to a champion causes an explosion that deals magic damage. Active (4 charges)Places an Invisible Stealth Ward that grants vision.",
    "image": "3871_zazzaksrealmspike.png"
  },
  {
    "id": "3876",
    "name": "Solstice Sleigh",
    "stats": [
      "Health",
      "HealthRegen",
      "ManaRegen",
      "Vision",
      "GoldPer",
      "Lane"
    ],
    "description": "200 Health 75% Base Health Regen 75% Base Mana Regen 5 Gold Per 10 SecondsGoing SleddingSlowing or Immobilizing an enemy champion near allies restores Health and grants 20% decaying Move Speed for 2.5 seconds to you and a nearby ally.  Active (4 charges)Places an Invisible Stealth Ward that grants vision.",
    "image": "3876_solticesleigh.png"
  },
  {
    "id": "3877",
    "name": "Bloodsong",
    "stats": [
      "Health",
      "HealthRegen",
      "ManaRegen",
      "Vision",
      "GoldPer",
      "Lane"
    ],
    "description": "200 Health 75% Base Health Regen 75% Base Mana Regen 5 Gold Per 10 SecondsSpellbladeAfter using an Ability, your next Attack deals bonus physical damage  On-Hit. If the target is a champion, they take increased damage for 4 seconds. Active (4 charges)Places an Invisible Stealth Ward that grants vision.",
    "image": "3877_bloodsong.png"
  },
  {
    "id": "3901",
    "name": "<rarityLegendary>Fire at Will</rarityLegendary><br><subtitleLeft> <silver>500 Silver Serpents</silver></subtitleLeft>",
    "stats": [],
    "description": "",
    "image": "3901_champ_t0_fireatwillcircle.png"
  },
  {
    "id": "3902",
    "name": "<rarityLegendary>Death's Daughter</rarityLegendary><br><subtitleLeft> <silver>500 Silver Serpents</silver></subtitleLeft>",
    "stats": [],
    "description": "Cannon Barrage additionally fires a mega-cannonball at the center of the Barrage, dealing bonus true damage and Slowing.",
    "image": "3902_champ_t0_deathsdaughtercircle.png"
  },
  {
    "id": "3903",
    "name": "<rarityLegendary>Raise Morale</rarityLegendary><br><subtitleLeft> <silver>500 Silver Serpents</silver></subtitleLeft>",
    "stats": [],
    "description": "Allies in the Cannon Barrage gain bonus Move Speed.",
    "image": "3903_champ_t0_raisemoralecircle.png"
  },
  {
    "id": "3916",
    "name": "Oblivion Orb",
    "stats": [
      "SpellDamage"
    ],
    "description": "25 Ability PowerGrievous WoundsDealing magic damage to champions applies 40% Wounds for 3 seconds.",
    "image": "3916_mage_t2_oblivionorb.png"
  },
  {
    "id": "4003",
    "name": "Lifeline",
    "stats": [
      "Damage",
      "NonbootsMovement",
      "ArmorPenetration"
    ],
    "description": "25 Attack Damage 5 Lethality 4% Move Speed Active - Soul Anchor  (0s)Mark your current location. After 4 seconds, return to that location. You may recast at any point during Soul Anchor's duration to return to your marked location early.",
    "image": "4003_assassin_t2_lifeline.png"
  },
  {
    "id": "4004",
    "name": "Spectral Cutlass",
    "stats": [
      "Damage",
      "NonbootsMovement",
      "ArmorPenetration"
    ],
    "description": "50 Attack Damage 15 Lethality 4% Move Speed Active - Soul Anchor  (0s)Mark your current location. After 4 seconds, return to that location. You may recast at any point during Soul Anchor's duration to return to your marked location early.",
    "image": "4004_assassin_t3_spectralcutlass.png"
  },
  {
    "id": "4005",
    "name": "Imperial Mandate",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "60 Ability Power 20 Ability Haste 125% Base Mana RegenCoordinated Fire  (0s) per targetSlowing or Immobilizing an enemy champion marks them for 5 seconds. Ally champion damage detonates the mark, dealing magic damage equal to 10% of current health.",
    "image": "4005_enchanter_t4_imperialmandate.png"
  },
  {
    "id": "4010",
    "name": "Bloodletter's Curse",
    "stats": [
      "SpellBlock",
      "SpellDamage",
      "CooldownReduction",
      "MagicPenetration"
    ],
    "description": "60 Ability Power 350 Health 15 Ability HasteVile DecayDealing magic damage with abilities or passives to champions reduces their Magic Resist by 7.5% for 6 seconds, up to 30%.",
    "image": "4010_bloodlettersveil.png"
  },
  {
    "id": "4011",
    "name": "Sword of Blossoming Dawn",
    "stats": [
      "Health",
      "SpellDamage",
      "CooldownReduction",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "45 Ability Power 200 Health 12% Heal and Shield Power 15 Ability HasteEffervescenceGain + 1.2% Attack Speed for every  1% Heal and Shield Power you have. Peppermint On-Hit, heal the lowest health ally champion near you for , prioritizing lower health allies.",
    "image": "4011_swordofblossomingdawn.png"
  },
  {
    "id": "4012",
    "name": "Sin Eater",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "Tenacity"
    ],
    "description": "300 Health 45 Armor 45 Magic Resist 30% TenacityThe Feast: Whenever a nearby ally champion becomes affected by an immobilizing crowd control effect, instead you are stunned for that duration. (20 (0s)).",
    "image": "4012_sineater.png"
  },
  {
    "id": "4013",
    "name": "Lightning Braid",
    "stats": [
      "SpellBlock",
      "Armor",
      "SpellDamage",
      "Tenacity"
    ],
    "description": "70 Ability Power 30 Armor 30 Magic Resist 30% TenacityChain Lightning: You deal 20% reduced ability damage. On a 1 second cadence, enemies you've damaged with abilities chain 66.6% of the ability damage you've dealt them to another nearby enemy, prioritizing champions.",
    "image": "4013_lightning_braid.png"
  },
  {
    "id": "4014",
    "name": "Frozen Mallet",
    "stats": [
      "Health",
      "Damage",
      "AttackSpeed",
      "Slow"
    ],
    "description": "GeneratedTip_Item_4014_ExternalDescription",
    "image": "default.png"
  },
  {
    "id": "4015",
    "name": "Perplexity",
    "stats": [
      "SpellDamage",
      "CooldownReduction",
      "NonbootsMovement",
      "MagicPenetration",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "60 Ability Power 5% Move Speed 22% Armor Penetration 30% Magic PenetrationGiant SlayerDeal up to 15% bonus damage against champions with greater max Health than you.Max damage increase reached when Health difference is greater than 2500.",
    "image": "4015_perplexity.png"
  },
  {
    "id": "4016",
    "name": "Wordless Promise",
    "stats": [
      "SpellDamage",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "50 Ability Power 25% Heal and Shield Power 25 Ability HastePromiseGain 20% of your Promised ally's  Ability Power, and grant your Promised ally 20% of your  Ability Haste. ACTIVE  (0s)PromiseMake a Promise to an ally.",
    "image": "4016_wordlesspromise.png"
  },
  {
    "id": "4017",
    "name": "Hellfire Hatchet",
    "stats": [
      "Damage",
      "ArmorPenetration"
    ],
    "description": "35 Attack Damage 12 LethalityChar  (0s)Your next Ability hit Burns enemies for % to % current Health physical damage over 4 seconds, based on how much more max Health they have than you.Bonus damage maximum is reached at 2000 health difference",
    "image": "4017_hellfirehatchet.png"
  },
  {
    "id": "4401",
    "name": "Force of Nature",
    "stats": [
      "Health",
      "SpellBlock",
      "NonbootsMovement"
    ],
    "description": "400 Health 55 Magic Resist 4% Move SpeedSteadfastGain 70 Magic Resist and 6% bonus Move Speed after taking magic damage from Champions 8 times.",
    "image": "4401_tank_t3_forceofnature.png"
  },
  {
    "id": "4402",
    "name": "Innervating Locket",
    "stats": [
      "Health",
      "Damage",
      "Mana",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "30 Attack Damage 400 Health 300 Mana 10 Ability HasteEternity: Restore Mana equal to 15% of premitigation damage taken from champions, and Health equal to 25% of Mana spent, up to 20 Health per cast, per second.Innervate: After using an ability, restore 3% missing Health and 3% missing Mana over 3 seconds.\"Cast down the Noxians\" \u2013 Bobdyr, Temple Guardsman",
    "image": "3032_innervating_locket.png"
  },
  {
    "id": "4403",
    "name": "The Golden Spatula",
    "stats": [
      "Health",
      "SpellBlock",
      "HealthRegen",
      "Armor",
      "Damage",
      "CriticalStrike",
      "AttackSpeed",
      "LifeSteal",
      "SpellDamage",
      "Mana",
      "ManaRegen",
      "CooldownReduction",
      "NonbootsMovement"
    ],
    "description": "70 Attack Damage 120 Ability Power 50% Attack Speed 30% Critical Strike Chance 250 Health 30 Armor 30 Magic Resist 250 Mana 20 Ability Haste 10% Move Speed 10% Life Steal 100% Base Health Regen 100% Base Mana RegenDoing Something: You are permanently On Fire!\"It must do something...Declined, it does EVERYTHING\"",
    "image": "4403_goldenspatula.png"
  },
  {
    "id": "4628",
    "name": "Horizon Focus",
    "stats": [
      "SpellDamage",
      "AbilityHaste"
    ],
    "description": "125 Ability Power 25 Ability HasteHypershotDealing Ability damage to champions at 600 range or greater Reveals them for 6 seconds. FocusWhen Hypershot is triggered, Reveal all other enemy champions within 1400 range of them for 3 seconds.",
    "image": "4628_mage_t3_horizonfocus.png"
  },
  {
    "id": "4629",
    "name": "Cosmic Drive",
    "stats": [
      "Health",
      "SpellDamage",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "70 Ability Power 350 Health 25 Ability Haste 4% Move SpeedSpelldanceDealing magic or true damage to champions grants Move Speed for 4 seconds.",
    "image": "4629_mage_t3_cosmicdrive.png"
  },
  {
    "id": "4630",
    "name": "Blighting Jewel",
    "stats": [
      "MagicPenetration",
      "SpellDamage"
    ],
    "description": "25 Ability Power 13% Magic Penetration",
    "image": "4630_mage_t2_voidcrystal.png"
  },
  {
    "id": "4632",
    "name": "Verdant Barrier",
    "stats": [
      "SpellBlock",
      "SpellDamage"
    ],
    "description": "40 Ability Power 25 Magic ResistAnnulGrants a Spell Shield that blocks the next enemy Ability.",
    "image": "4632_tank_t2_verdantbarrier.png"
  },
  {
    "id": "4633",
    "name": "Riftmaker",
    "stats": [
      "Health",
      "SpellDamage",
      "CooldownReduction",
      "SpellVamp"
    ],
    "description": "70 Ability Power 350 Health 15 Ability HasteVoid CorruptionFor each second in combat with enemy champions, deal 2% bonus damage, up to 8%. At maximum strength, gain Omnivamp.Void InfusionGain 2% of your bonus Health as Ability Power.",
    "image": "4633_mage_t4_riftmaker.png"
  },
  {
    "id": "4635",
    "name": "Leeching Leer",
    "stats": [
      "Health",
      "SpellDamage",
      "SpellVamp"
    ],
    "description": "20 Ability Power 250 Health 5% Omnivamp",
    "image": "4635_mage_t2_leechingleer.png"
  },
  {
    "id": "4636",
    "name": "Night Harvester",
    "stats": [
      "Health",
      "SpellDamage",
      "CooldownReduction",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "90 Ability Power 300 Health 25 Ability HasteSoulrend: Damaging a champion with Attacks or Abilities deals an additional  magic damage and grants you 25% Move Speed for 1.5 seconds (30 (0s) per champion).Mythic Passive: Grants all other Legendary items  5 Ability Haste.Damaging a new champion will extend the duration of the Move Speed bonus.",
    "image": "4636_mage_t4_nightharvester.png"
  },
  {
    "id": "4637",
    "name": "Demonic Embrace",
    "stats": [
      "Health",
      "SpellDamage"
    ],
    "description": "GeneratedTip_Item_4637_ExternalDescription",
    "image": "4637_mage_t3_demonicembrace.png"
  },
  {
    "id": "4638",
    "name": "Watchful Wardstone",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "Vision",
      "Active",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "150 Health 10 Ability Haste 10 Armor 15 Magic ResistArcane CacheThis item can store up to 3 purchased Control Wards.",
    "image": "4638_enchanter_t3_watchfulsightstone.png"
  },
  {
    "id": "4641",
    "name": "Stirring Wardstone",
    "stats": [
      "Health",
      "Damage",
      "SpellDamage",
      "ManaRegen",
      "Vision",
      "Active",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "80 Health 25% Base Mana RegenArcane Cache: This item can store up to 2 purchased Control Wards.",
    "image": "4641_enchanter_t2_stirringsightstone.png"
  },
  {
    "id": "4642",
    "name": "Bandleglass Mirror",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "20 Ability Power 100% Base Mana Regen 10 Ability Haste",
    "image": "4642_enchanter_t2_bandleglassmirror.png"
  },
  {
    "id": "4643",
    "name": "Vigilant Wardstone",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "Vision",
      "Active",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "250 Health 20 Ability Haste 25 Armor 30 Magic ResistArcane CacheThis item can store up to 3 purchased Control Wards.BeholdIncrease your Stealth Ward and Control Ward placement caps by 1.",
    "image": "4643_enchanter_t3_vigilantsightstone.png"
  },
  {
    "id": "4644",
    "name": "Crown of the Shattered Queen",
    "stats": [
      "Health",
      "SpellDamage",
      "Mana",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "85 Ability Power 250 Health 600 Mana 20 Ability HasteSafeguard: You are Safeguarded, reducing incoming champion damage by 40%. Safeguard persists for 2.5 seconds after taking champion damage. (40 (0s)). Mythic Passive: Grants all other Legendary items  1% Move Speed and  8 Ability Power.Item cooldown is restarted when damage is taken from champions.",
    "image": "4644_crown.png"
  },
  {
    "id": "4645",
    "name": "Shadowflame",
    "stats": [
      "SpellDamage",
      "MagicPenetration"
    ],
    "description": "110 Ability Power 15 Magic PenetrationCinderbloomMagic and true damage Critically Strikes enemies below 40% Health, dealing 20% increased damage.",
    "image": "4645_shadowflame.png"
  },
  {
    "id": "4646",
    "name": "Stormsurge",
    "stats": [
      "SpellDamage",
      "GoldPer",
      "NonbootsMovement",
      "MagicPenetration"
    ],
    "description": "90 Ability Power 15 Magic Penetration 6% Move SpeedStormraiderDealing 25% of a champion's maximum Health within 2.5s applies Squall to them.SquallAfter 2 seconds, deal magic damage. If the target dies before Squall triggers, it damages nearby enemies.",
    "image": "4646_stormsurge.png"
  },
    {
    "id": "2522",
    "name": "Actualizer",
    "stats": [
      "SpellDamage",
      "Mana",
      "AbilityHaste",
      "Active"

    ],
    "description": "Ability Power: 90 Mana: 300 Ability Haste: 10, [ACTIVE] Mana Made Real (60s cooldown): For 8 seconds, your mana is Empowered. While Empowered, your spells cost 100% more mana, you gain (15 + .005% bonus mana)% increased ability damage, healing, and shielding, and your basic ability cooldowns progress 30% faster",
    "image": "2522_manaactive.png"
  },
      {
    "id": "2510",
    "name": "Dusk and Dawn",
    "stats": [
      "SpellDamage",
      "Mana",
      "Health",
      "AbilityHaste",
      "AttackSpeed"
    ],
    "description": "Ability Power: 70 Health: 300 Ability Haste: 20 Attack Speed: 25% Spellblade (1.5s cooldown): After using an Ability, your next Attack deals 100% base AD + 10% AP bonus magic damage on-hit and applies on-hit effects an additional time.",
    "image": "2510_apfightersheen.png"
  },
      {
    "id": "2512",
    "name": "Fiendhunter Bolts",
    "stats": [
      "AttackSpeed",
      "CriticalStrike",
      "NonbootsMovement"
    ],
    "description": "Attack Speed: 40% Critical Strike Chance: 25% Movement Speed: 4% Night Vigil: Gain 30 Ultimate Haste. Opening Barrage (45s cooldown): After casting your Ultimate, your next 3 basic attacks within 8s gain 50% attack speed and critically strike for 75% of your normal critical strike damage. If an attack would already critically strike, it deals normal critical strike damage and also deals 10% bonus true damage.",
    "image": "2512_adcallin.png"
  },
    {
    "id": "2517",
    "name": "Endless Hunger",
    "stats": [
      "damage",
      "tenacity",
      "SpellVamp"
    ],
    "description": "Attack Damage: 60 Tenacity: 20% Omnivamp: 5% Famine: Gain (5 + 10% bonus AD) Ability Haste Feast: When a champion that you damaged within 3 seconds dies, gain 15% omnivamp for 8 seconds.",
    "image": "2517_adfighteromnivamp.png"
  },
        {
    "id": "2520",
    "name": "Bastionbreaker",
    "stats": [
      "damage",
      "armorpenetration",
      "abilityhaste"
    ],
    "description": "Attack Damage: 55 Lethality: 22 Ability Haste: 15 Shaped Charge: Dealing Ability damage to a champion or epic monster deals an additional (30 + 150% lethality) true damage. Sabotage: Taking down a champion within 3 seconds of damaging them grants Sabotage for 90 seconds. While you have Sabotage, your next attack against an epic monster or turret deals an additional (300 + 2500% lethality) true damage over 3 seconds.",
    "image": "2520_adassassingameender.png"
  },

  {
    "id": "2523",
    "name": "Hexoptics C44",
    "stats": [
        "attackdamage",
        "critchance"
    ],
    "description": "Attack Damage: 50 Critical Strike Chance: 25% Magnification: Deal up to 10% increased damage with attacks, based on how far away the enemy is (max damage at 750 range). Arcane Aim: When a champion that you damaged within 3 seconds dies, gain 100 additional attack range for 6 seconds.",
    "image": "2523_adcscope.png"
},

{
    "id": "2524",
    "name": "Bandlepipes",
    "stats": [
        "health",
        "armor",
        "magicresist",
        "abilityhaste"
    ],
    "description": "Health: 200 Armor: 20 Magic Resistance: 20 Ability Haste: 15 Fanfare: Slowing or Immobilizing an enemy champion grants Fanfare for 8 (melee) / 4 (ranged) seconds. Fanfare grants 20 Movement Speed. While you have Fanfare, nearby allies, including yourself, gain 30% (melee) / 20% (ranged) attack speed.",
    "image": "2524_tankasaura.png"
},

{
    "id": "2525",
    "name": "Protoplasm Harness",
    "stats": [
        "health",
        "abilityhaste"
    ],
    "description": "Health: 600 Ability Haste: 15 Lifeline: Taking damage that would reduce your health below 30% causes you to gain 200 maximum health for 5 seconds, then heal (200-400 [level scaling] + 250% armor + 250% magic resistance) health over the duration. While regenerating health, you gain 15% increased size, 10% Movement Speed, and 25% tenacity.",
    "image": "2525_tanklifeline.png"
},

{
    "id": "2526",
    "name": "Whispering Circlet",
    "stats": [
        "health",
        "mana",
        "manaregen",
        "healshieldpower"
    ],
    "description": "Health: 200 Mana: 300 Base Mana Regeneration: 75% Heal and Shield Power: 8% Harmony: Gain (.005% bonus mana)% Heal and Shield Power. Manaflow: Landing Abilities grants 4 max mana (doubled vs champions). Transforms into Diadem of Songs at 360 max mana.",
    "image": "2526_enchantertearbase.png"
},

{
    "id": "2530",
    "name": "Diadem of Songs",
    "stats": [
        "health",
        "mana",
        "manaregen",
        "healshieldpower"
    ],
    "description": "Health: 200 Mana: 1000 Base Mana Regeneration: 100% Heal and Shield Power: 8% Harmony: Gain (.005% bonus mana)% Heal and Shield Power. Consonance: While you or any ally you've healed or shielded in the last 3 seconds is in combat with champions, each second, heal the lowest health nearby ally champion for (.008% bonus mana).",
    "image": "2530_enchantertearupgraded.png"
},
  {
    "id": "6029",
    "name": "Ironspike Whip",
    "stats": [
      "Damage",
      "Active"
    ],
    "description": "30 Attack Damage Active - Crescent: Deal damage to nearby enemies.",
    "image": "6029_fighter_t2_ironspikewhip.png"
  },
  {
    "id": "6032",
    "name": "Stat Bonus",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "Damage",
      "CriticalStrike",
      "AttackSpeed",
      "SpellDamage",
      "Mana",
      "Consumable",
      "CooldownReduction",
      "SpellVamp",
      "NonbootsMovement",
      "Tenacity",
      "MagicPenetration",
      "ArmorPenetration",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "Active - Consume: Automatically open a semi-random selection for a permanent stat bonus. And a hat!",
    "image": "220000_statanvil.png"
  },
  {
    "id": "6035",
    "name": "Silvermere Dawn",
    "stats": [
      "Health",
      "SpellBlock",
      "Damage",
      "Active",
      "Tenacity"
    ],
    "description": "40 Attack Damage 300 Health 40 Magic Resist Active - Quicksilver: Remove all crowd control debuffs and gain Tenacity and Slow Resistance.",
    "image": "6035_fighter_t3_silvermeredawn.png"
  },
  {
    "id": "6333",
    "name": "Death's Dance",
    "stats": [
      "Armor",
      "Damage",
      "AbilityHaste"
    ],
    "description": "60 Attack Damage 50 Armor 15 Ability HasteIgnore PainA percentage of damage taken is dealt to you over 3 seconds instead.DefyWhen a champion that you damaged within 3 seconds dies, cleanse Ignore Pain's remaining damage and restore Health over 2 seconds.",
    "image": "6333_fighter_t3_deathsdance.png"
  },
  {
    "id": "6609",
    "name": "Chempunk Chainsword",
    "stats": [
      "Health",
      "Damage",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "45 Attack Damage 450 Health 15 Ability HasteHackshornDealing physical damage applies 40% Wounds to enemy champions for 3 seconds.",
    "image": "6609_fighter_t3_chempunkchainsword.png"
  },
  {
    "id": "6610",
    "name": "Sundered Sky",
    "stats": [
      "Health",
      "Damage",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "40 Attack Damage 400 Health 10 Ability HasteLightshield StrikeYour first Attack against a champion Critically Strikes and restores Health.",
    "image": "6610_sunderedsky.png"
  },
  {
    "id": "6616",
    "name": "Staff of Flowing Water",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "35 Ability Power 10% Heal and Shield Power 125% Base Mana Regen 15 Ability HasteRapidsHealing or Shielding an ally grants you both 45 Ability Power for 6 seconds.",
    "image": "default.png"
  },
  {
    "id": "6617",
    "name": "Moonstone Renewer",
    "stats": [
      "Health",
      "SpellDamage",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "25 Ability Power 200 Health 20 Ability Haste 125% Base Mana RegenStarlit GraceHealing or shielding an ally chains the effect to another ally (excluding yourself), healing 30% or shielding 35% of the original amount.",
    "image": "6617_enchanter_t4_moonstonerenewer.png"
  },
  {
    "id": "6620",
    "name": "Echoes of Helia",
    "stats": [
      "Health",
      "SpellDamage",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "35 Ability Power 200 Health 20 Ability Haste 125% Base Mana RegenSoul SiphonDamaging a champion grants a Soul Shard, up to 2. Healing or Shielding an ally consumes all Soul Shards to restore Health and deal magic damage to the nearest enemy champion per Shard.",
    "image": "6620_echoes_of_helia.png"
  },
  {
    "id": "6621",
    "name": "Dawncore",
    "stats": [
      "SpellDamage",
      "ManaRegen"
    ],
    "description": "45 Ability Power 16% Heal and Shield Power 100% Base Mana RegenFirst LightGain 2% Heal and Shield Power and 10 Ability Power per 100% Base Mana Regen.",
    "image": "6621_dawncore.png"
  },
  {
    "id": "6630",
    "name": "Goredrinker",
    "stats": [
      "Health",
      "Damage",
      "LifeSteal",
      "Active",
      "CooldownReduction",
      "SpellVamp",
      "AbilityHaste"
    ],
    "description": "55 Attack Damage 400 Health 20 Ability Haste 8% OmnivampMythic Passive: Grants all other Legendary items  75 Health and  3 Ability Haste. Active - Thirsting Slash: Deal damage to nearby enemies. Restore Health for each champion hit.",
    "image": "6630_fighter_t4_goredrinker.png"
  },
  {
    "id": "6631",
    "name": "Stridebreaker",
    "stats": [
      "Health",
      "Damage",
      "AttackSpeed",
      "Slow"
    ],
    "description": "40 Attack Damage 25% Attack Speed 450 HealthCleaveAttacks deal physical damage to nearby enemies. Breaking ShockwaveDeal physical damage and Slow nearby enemies by 35%.Gain 35% decaying Move Speed per champion hit for 3 seconds.",
    "image": "6631_fighter_t4_stridebreaker.png"
  },
  {
    "id": "6632",
    "name": "Divine Sunderer",
    "stats": [
      "Health",
      "Damage",
      "CooldownReduction",
      "OnHit",
      "MagicPenetration",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "GeneratedTip_Item_6632_ExternalDescription",
    "image": "6632_fighter_t4_divinedevourer.png"
  },
  {
    "id": "6653",
    "name": "Liandry's Torment",
    "stats": [
      "Health",
      "SpellDamage"
    ],
    "description": "60 Ability Power 300 HealthTormentDamaging Abilities burn enemies for 2% max Health magic damage per second for 3 seconds.SufferingFor each second in combat with enemy champions, deal 2% bonus damage, up to 6%.",
    "image": "6653_mage_t4_liandrysanguish.png"
  },
  {
    "id": "6655",
    "name": "Luden's Companion",
    "stats": [
      "SpellDamage",
      "Mana",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "100 Ability Power 600 Mana 10 Ability HasteFireDamaging Abilities fire 6 Shots that deal bonus magic damage to the target and nearby enemies. Remaining Shots fire on the primary target, dealing 20% damage.",
    "image": "6655_mage_t4_ludenstempest.png"
  },
  {
    "id": "6656",
    "name": "Everfrost",
    "stats": [
      "Health",
      "SpellDamage",
      "Mana",
      "Active",
      "CooldownReduction",
      "Slow",
      "AbilityHaste"
    ],
    "description": "70 Ability Power 250 Health 600 Mana 20 Ability HasteMythic Passive: Grants all other Legendary items  10 Ability Power.  Active - Glaciate: Deal damage in a cone, Slowing enemies hit. Enemies at the center of the cone are Rooted instead.",
    "image": "6656_mage_t4_everfrost.png"
  },
  {
    "id": "6657",
    "name": "Rod of Ages",
    "stats": [
      "Health",
      "HealthRegen",
      "SpellDamage",
      "Mana",
      "ManaRegen"
    ],
    "description": "45 Ability Power 350 Health 500 ManaTimelessThis item gains 10 Health, 30 Mana and 3 Ability Power every 60 seconds up to 10 times. Upon reaching max stacks, gain a level.EternityTaking damage from champions restores 10% of the damage as Mana. Casting an ability heals for 25% of Mana spent.",
    "image": "6657_mage_t4_rodofages.png"
  },
  {
    "id": "6660",
    "name": "Bami's Cinder",
    "stats": [
      "Health",
      "AbilityHaste"
    ],
    "description": "150 Health 5 Ability HasteImmolateAfter taking or dealing damage, deal magic damage to nearby enemies for 3 seconds.",
    "image": "6660_tank_t2_bamiscinder.png"
  },
  {
    "id": "6662",
    "name": "Iceborn Gauntlet",
    "stats": [
      "Health",
      "Armor",
      "CooldownReduction",
      "Slow",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "300 Health 50 Armor 15 Ability HasteSpellbladeAfter using an Ability, your next Attack deals bonus physical damage  On-Hit and creates a frost field for 2s that Slows.",
    "image": "6662_tank_t3_iceborngauntlet.png"
  },
  {
    "id": "6664",
    "name": "Hollow Radiance",
    "stats": [
      "Health",
      "SpellBlock",
      "HealthRegen",
      "Aura",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "400 Health 40 Magic Resist 10 Ability Haste 100% Base Health RegenImmolateAfter taking or dealing damage, deal magic damage per second to nearby enemies for 3 seconds. DesolateKilling an enemy deals magic damage around them.",
    "image": "6664_tank_t4_acceleratedchemtank.png"
  },
  {
    "id": "6665",
    "name": "Jak'Sho, The Protean",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "MagicResist"
    ],
    "description": "350 Health 45 Armor 45 Magic ResistVoidborn ResilienceAfter 5 seconds of champion combat, increase your bonus Armor and Magic Resist by 30% until end of combat.",
    "image": "6665_tank_t4_jakshotheprotean.png"
  },
  {
    "id": "6667",
    "name": "Radiant Virtue",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "Aura",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "350 Health 30 Armor 30 Magic Resist 10 Ability HasteGuiding Light: Upon casting your Ultimate you Transcend, increasing your Max Health by 12.5% for 9s. While Transcended you and allies within 1200 range of you heal for 10% of your max Health over the duration (90 (0s)).Mythic Passive: Grants all other Legendary items  75 Health.",
    "image": "6667_tank_t4_radiantvirtue.png"
  },
  {
    "id": "6670",
    "name": "Noonquiver",
    "stats": [
      "Damage",
      "CriticalStrike"
    ],
    "description": "15 Attack Damage 20% Critical Strike Chance",
    "image": "6670_marksman_t2_noonquiver.png"
  },
  {
    "id": "6671",
    "name": "Galeforce",
    "stats": [
      "Damage",
      "CriticalStrike",
      "AttackSpeed",
      "Active",
      "NonbootsMovement"
    ],
    "description": "50 Attack Damage 15% Attack Speed 20% Critical Strike Chance 7% Move SpeedMythic Passive: Grants all other Legendary items  5 Attack Damage.Maximum missile damage dealt when enemy Health is below 25%.Cloudburst's dash cannot pass through terrain. Active - Cloudburst: Dash in target direction, firing three missiles at the lowest Health enemy near your destination. Deals physical damage, increased against low Health targets.",
    "image": "6671_marksman_t4_galeforce.png"
  },
  {
    "id": "6672",
    "name": "Kraken Slayer",
    "stats": [
      "Damage",
      "AttackSpeed",
      "OnHit",
      "NonbootsMovement"
    ],
    "description": "45 Attack Damage 40% Attack Speed 4% Move SpeedBring It DownEvery third Attack deals bonus physical damage  On-Hit, increased based on their missing Health.",
    "image": "6672_marksman_t4_behemothslayer.png"
  },
  {
    "id": "6673",
    "name": "Immortal Shieldbow",
    "stats": [
      "Damage",
      "CriticalStrike"
    ],
    "description": "55 Attack Damage 25% Critical Strike ChanceLifelineTaking damage that would reduce your Health below 30% grants a Shield for 3 seconds.",
    "image": "6673_marksman_t4_crimsonshieldbow.png"
  },
  {
    "id": "6675",
    "name": "Navori Flickerblade",
    "stats": [
      "CriticalStrike",
      "AttackSpeed",
      "NonbootsMovement"
    ],
    "description": "40% Attack Speed 25% Critical Strike Chance 4% Move SpeedTranscendenceAttacks reduce Basic Ability cooldowns by 15% of their remaining cooldown.",
    "image": "6675_navoriflickerblade.png"
  },
  {
    "id": "6676",
    "name": "The Collector",
    "stats": [
      "Damage",
      "CriticalStrike",
      "ArmorPenetration"
    ],
    "description": "50 Attack Damage 10 Lethality 25% Critical Strike ChanceDeathYour damage executes champions that are below 5% Health.TaxesChampion kills grant 25 bonus gold.",
    "image": "6676_marksman_t3_thecollector.png"
  },
  {
    "id": "6677",
    "name": "Rageknife",
    "stats": [
      "AttackSpeed",
      "OnHit"
    ],
    "description": "25% Attack SpeedWrath: Attacks apply 20 magic damage  On-Hit.Seething Strike: Basic attacks grant 5% Attack Speed, stacking up to 3 times for a maximum of  Attack Speed.",
    "image": "6677_marksman_t2_rageknife.png"
  },
  {
    "id": "6690",
    "name": "Rectrix",
    "stats": [
      "Damage",
      "NonbootsMovement"
    ],
    "description": "15 Attack Damage 4% Move Speed",
    "image": "6690_rectrix.png"
  },
  {
    "id": "6691",
    "name": "Duskblade of Draktharr",
    "stats": [
      "Damage",
      "Stealth",
      "CooldownReduction",
      "Slow",
      "NonbootsMovement",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "60 Attack Damage 18 Lethality 15 Ability HasteNightstalker: Your Abilities deal up to an additional 16% damage based on the target's missing health. When a champion that you have damaged within the last 3 seconds dies, you become Untargetable from non-structures for 1.5 seconds (30 (0s)) until your next action.Mythic Passive: Grants all other Legendary items  5 Ability Haste and  5 Move Speed.",
    "image": "6691_assassin_t4_duskbladeofdraktharr.png"
  },
  {
    "id": "6692",
    "name": "Eclipse",
    "stats": [
      "Damage",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "60 Attack Damage 15 Ability HasteEver Rising MoonHitting a champion with 2 separate Attacks or Abilities within 2 seconds grants you a Shield for 2 seconds.",
    "image": "6692_assassin_t4_eclipse.png"
  },
  {
    "id": "6693",
    "name": "Prowler's Claw",
    "stats": [
      "Damage",
      "CooldownReduction",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "55 Attack Damage 22 Lethality 15 Ability HasteAmbush Predator: After entering a bush your next damaging Attack or Ability on enemy champions deals 10% of their current health over 4 seconds, revealing them and reducing their vision radius for the duration. (5 (0s)).",
    "image": "6693_assassin_t4_prowlersclaw.png"
  },
  {
    "id": "6694",
    "name": "Serylda's Grudge",
    "stats": [
      "Damage",
      "CooldownReduction",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "45 Attack Damage 35% Armor Penetration 15 Ability HasteBitter ColdDamaging Abilities Slow enemies below 50% Health by 30% for 1 second.",
    "image": "6694_assasin_t3_seryldasgrudge.png"
  },
  {
    "id": "6695",
    "name": "Serpent's Fang",
    "stats": [
      "Damage",
      "ArmorPenetration"
    ],
    "description": "55 Attack Damage 15 LethalityShield ReaverDamaging an enemy champion reduces Shields they gain by % for 3 seconds. If they were not already affected by Shield Reaver, reduce Shields on them by %.",
    "image": "6695_assassin_t3_serpentsfang.png"
  },
  {
    "id": "6696",
    "name": "Axiom Arc",
    "stats": [
      "Damage",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "55 Attack Damage 18 Lethality 20 Ability HasteFluxWhen a champion that you damaged within 3 seconds dies, refund some of your Ultimate Ability's total cooldown.",
    "image": "6696_axiomarc.png"
  },
  {
    "id": "6697",
    "name": "Hubris",
    "stats": [
      "Damage",
      "Active",
      "CooldownReduction",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "60 Attack Damage 18 Lethality 10 Ability HasteEminenceWhen a champion that you damaged within 3 seconds dies, gain 15 Attack Damage plus 2 per champion killed for 90 seconds.",
    "image": "6697_hubris.png"
  },
  {
    "id": "6698",
    "name": "Profane Hydra",
    "stats": [
      "Damage",
      "Active",
      "CooldownReduction",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "55 Attack Damage 18 Lethality 10 Ability HasteCleaveAttacks deal physical damage to nearby enemies. Heretical CleaveDeal physical damage around you.",
    "image": "6698_profanehydra.png"
  },
  {
    "id": "6699",
    "name": "Voltaic Cyclosword",
    "stats": [
      "Damage",
      "Active",
      "CooldownReduction",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "55 Attack Damage 18 Lethality 10 Ability HasteGalvanizeDashes and Stealth stack Energized 75% faster.FirmamentYour Energized Attack deals bonus physical damage and Slows for 0.75 seconds.",
    "image": "6699_voltaiccyclosword.png"
  },
  {
    "id": "6700",
    "name": "Shield of the Rakkor",
    "stats": [
      "Armor",
      "Damage",
      "Active",
      "CooldownReduction",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "50 Attack Damage 30 Armor 5% Move SpeedAegis: Every 8 (0s),  block the first Attack that would hit you. While the shield is broken, your first attack against a champion refunds 50% of its current Cooldown and grants  20% Movement Speed for a short duration.",
    "image": "6700_aegis.png"
  },
  {
    "id": "6701",
    "name": "Opportunity",
    "stats": [
      "Damage",
      "Active",
      "NonbootsMovement",
      "ArmorPenetration"
    ],
    "description": "55 Attack Damage 18 LethalityPreparationAfter being out of combat with Champions for 8 seconds gain Lethality. This Lethality lasts for 3 seconds after dealing damage to champions.ExtractionWhen a champion that you damaged within 3 seconds dies, gain 200 decaying Move Speed for 1.5 seconds.",
    "image": "6701_opportunity.png"
  },
  {
    "id": "6702",
    "name": "Scouting Ahead",
    "stats": [
      "Active",
      "Jungle",
      "Lane",
      "Trinket",
      "Vision"
    ],
    "description": "UNIQUE Active: Scout target area, granting vision for 5 seconds. Reveal enemy champions and grant True Sight of traps in the area for 3 seconds (60 second cooldown).",
    "image": "6702_class_t1_oracleslens.brawl.png"
  },
  {
    "id": "7050",
    "name": "Gangplank Placeholder",
    "stats": [],
    "description": "",
    "image": "default.png"
  },
  {
    "id": "8001",
    "name": "Anathema's Chains",
    "stats": [
      "Health",
      "Active",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "650 Health 20 Ability HasteVendettaYou gain Vendetta stacks over time Each stack of Vendetta grants you 1% reduced damage from your Nemesis.VengeanceAt maximum stacks, your Nemesis has reduced Tenacity while near you. ACTIVE  (0s)VowChoose a Nemesis.",
    "image": "8001_tank_t3_anathemaschains.png"
  },
  {
    "id": "8010",
    "name": "Bloodletter's Curse",
    "stats": [
      "Health",
      "SpellDamage",
      "CooldownReduction",
      "MagicPenetration"
    ],
    "description": "65 Ability Power 400 Health 15 Ability HasteVile DecayDealing magic damage with abilities or passives to champions reduces their Magic Resist by 7.5% for 6 seconds, up to 30%.",
    "image": "4010_bloodlettersveil.png"
  },
  {
    "id": "8020",
    "name": "Abyssal Mask",
    "stats": [
      "Health",
      "SpellBlock",
      "CooldownReduction",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "350 Health 45 Magic Resist 15 Ability HasteUnmakeNearby enemy champions take 12% more magic damage.",
    "image": "8020_tank_t3_abyssalmask.png"
  },
  {
    "id": "9168",
    "name": "Locked Weapon Slot",
    "stats": [],
    "description": "Prove yourself, and Miss Fortune will approve an inventory upgrade.[Unlocked by completing achievements.]",
    "image": "default.png"
  },
  {
    "id": "9171",
    "name": "Cyclonic Slicers",
    "stats": [],
    "description": "Orbiting projectiles damage and knock back enemies.Evolve: Health RegenerationDamage, Ability Haste, Area Size, Projectile Count, Duration",
    "image": "default.png"
  },
  {
    "id": "9172",
    "name": "YuumiBot",
    "stats": [],
    "description": "Summons a Yuum.Ai drone. Yuum.Ai damages and knocks up enemies, and also gathers XP.Evolve: Pickup RadiusDamage, Ability Haste, Area Size, Duration, Pickup Radius",
    "image": "default.png"
  },
  {
    "id": "9173",
    "name": "Radiant Field",
    "stats": [],
    "description": "Damages nearby enemies, scaling with your Max Health.Evolve: Max HealthDamage, Area Size, Max Health",
    "image": "default.png"
  },
  {
    "id": "9174",
    "name": "Statikk Sword",
    "stats": [],
    "description": "Fires lightning that bounces between enemies with the highest health.Evolve: Max HealthDamage, Ability Haste, Area Size, Crit Chance, Duration",
    "image": "default.png"
  },
  {
    "id": "9175",
    "name": "Lioness's Lament",
    "stats": [],
    "description": "Fires a crescent shaped projectiles to the left and right of your character.Evolve: Ability HasteDamage, Ability Haste, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9176",
    "name": "Gatling Bunny-Guns",
    "stats": [],
    "description": "Deals area damage over time in a cone.Evolve: DurationDamage, Ability Haste, Duration, Area Size",
    "image": "default.png"
  },
  {
    "id": "9177",
    "name": "Searing Shortbow",
    "stats": [],
    "description": "Fires projectiles that create lingering fire areas.Evolve: Area SizeDamage, Ability Haste, Area Size, Projectile Count, Duration",
    "image": "default.png"
  },
  {
    "id": "9178",
    "name": "The Annihilator",
    "stats": [],
    "description": "A massive explosion that kills all normal enemies and heavily damages Elites. Long cooldown.Evolve: EXPDamage, Ability Haste, Area Size",
    "image": "default.png"
  },
  {
    "id": "9179",
    "name": "Battle Bunny Crossbow",
    "stats": [],
    "description": "Fires a cone of projectiles with bonus crit chance in a random direction. Projectiles pierce on crit.Evolve: Crit ChanceDamage, Ability Haste, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9180",
    "name": "UwU Blaster",
    "stats": [],
    "description": "Rapidly fires projectiles at the nearest enemy, dealing damage to the first target hit.Evolve: Ability HasteDamage, Ability Haste, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9181",
    "name": "Vortex Glove",
    "stats": [],
    "description": "Fires a rotating stream of projectiles.Evolve: Health RegenerationDamage, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9183",
    "name": "Blade-o-rang",
    "stats": [],
    "description": "Fires returning projectiles at the closest enemy.Evolve: Movement SpeedDamage, Ability Haste, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9184",
    "name": "Bunny Mega-Blast",
    "stats": [],
    "description": "Fires orbital strikes with bonus crit chance at random enemies, dealing high damage in a small area.Evolve: Crit ChanceDamage, Ability Haste, Area Size, Crit Chance",
    "image": "default.png"
  },
  {
    "id": "9185",
    "name": "Anti-Shark Sea Mine",
    "stats": [],
    "description": "Fires explosives that bounce between enemies. Evolve: DamageDamage, Ability Haste, Area Size",
    "image": "default.png"
  },
  {
    "id": "9187",
    "name": "T.I.B.B.E.R.S",
    "stats": [],
    "description": "Summons Robo-Tibbers. Robo-Tibbers swipes, dealing area damage. Robo-Tibbers focuses on enemies with the most health.Evolve: DurationDamage, Ability Haste, Area Size, Duration, Movement Speed",
    "image": "default.png"
  },
  {
    "id": "9188",
    "name": "Ani-Mines",
    "stats": [],
    "description": "Drops timed explosive projectiles in a ring that explode for large area damage.Evolve: Area SizeDamage, Ability Haste, Area Size, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9189",
    "name": "Final City Transit",
    "stats": [],
    "description": "Fires a rotating stream of projectiles.Evolve: Health RegenerationDamage, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9190",
    "name": "Echoing Batblades",
    "stats": [],
    "description": "Fires piercing projectiles that bounce off walls.Evolve: Projectile CountDamage, Ability Haste, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9192",
    "name": "Paw Print Poisoner",
    "stats": [],
    "description": "",
    "image": "default.png"
  },
  {
    "id": "9193",
    "name": "Iceblast Armor",
    "stats": [],
    "description": "Blocks damage freezing enemies. Damage scales with Armor and Max Health.Evolve: ArmorDamage, Ability Haste, Area Size, Duration, Armor",
    "image": "default.png"
  },
  {
    "id": "9271",
    "name": "Unceasing Cyclone",
    "stats": [],
    "description": "Permanently orbiting projectiles damage and knock back enemies.Damage, Ability Haste, Projectile Count, Area Size, Duration",
    "image": "default.png"
  },
  {
    "id": "9272",
    "name": "YuumiBot_Final_FINAL",
    "stats": [],
    "description": "Summons a Yuum.Ai drone. Yuum.Ai damages and knocks up enemies, and also gathers XP. After dealing enough damage it will drop a healing pickup.Damage, Ability Haste, Area Size, Duration, Pickup Radius",
    "image": "default.png"
  },
  {
    "id": "9273",
    "name": "Explosive Embrace",
    "stats": [],
    "description": "Damages nearby enemies, scaling with your Max Health. Enemies killed within the burn zone explode.Damage, Area Size, Max Health",
    "image": "default.png"
  },
  {
    "id": "9274",
    "name": "Prumbis's Electrocarver",
    "stats": [],
    "description": "Creates a storm around targeted enemies that deals damage for a duration.Damage, Ability Haste, Area Size, Crit Chance, Duration",
    "image": "default.png"
  },
  {
    "id": "9275",
    "name": "Enveloping Light",
    "stats": [],
    "description": "Fires a beams of light across the screen.Damage, Ability Haste, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9276",
    "name": "Double Bun-Bun Barrage",
    "stats": [],
    "description": "Deals area damage over time in a cone. Enemies damaged are slowed and eventually stunned. Stunned enemies take extra damage.Damage, Ability Haste, Duration, Area Size",
    "image": "default.png"
  },
  {
    "id": "9277",
    "name": "Evolved Embershot",
    "stats": [],
    "description": "Fires projectiles that create lingering fire areas. Areas of fire grow in size and deal increased damage over time.Damage, Ability Haste, Area Size, , Projectiles, Duration",
    "image": "default.png"
  },
  {
    "id": "9278",
    "name": "Animapocalypse",
    "stats": [],
    "description": "A massive explosion that kills all normal enemies and heavily damages Elites. Enemies killed drop increased EXP and have a chance to drop gold. Long cooldown.Damage, Ability Haste, Area Size",
    "image": "default.png"
  },
  {
    "id": "9279",
    "name": "Bunny Prime Ballista",
    "stats": [],
    "description": "Fires a cone of projectiles with bonus crit chance in a random direction. Projectiles pierce on crit.Evolve: Crit ChanceDamage, Ability Haste, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9280",
    "name": "OwO Blaster",
    "stats": [],
    "description": "Fires projectiles extremely rapidly at the nearest enemy, dealing damage to the first target hit.Damage, Ability Haste, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9281",
    "name": "Tempest's Gauntlet",
    "stats": [],
    "description": "Fires two constant streams of missiles around you. The streams rotate in opposite directions.Damage, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9283",
    "name": "Quad-o-rang",
    "stats": [],
    "description": "Fires returning projectiles that explode into smaller projectiles at the closest enemy.Damage, Ability Haste, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9284",
    "name": "Rapid Rabbit Raindown",
    "stats": [],
    "description": "Fires orbital bombardments at random enemies, ending with a large strike.Damage, Ability Haste, Area Size, Crit Chance",
    "image": "default.png"
  },
  {
    "id": "9285",
    "name": "Neverending Mobstomper",
    "stats": [],
    "description": "Fires explosives that bounce endlessly between enemies as long as it can find a target. Damage, Ability Haste, Area Size",
    "image": "default.png"
  },
  {
    "id": "9287",
    "name": "T.I.B.B.E.R.S (B.E.E.G Edition)",
    "stats": [],
    "description": "Summons Enraged Robo-Tibbers. Robo-Tibbers swipes, dealing area damage. Enraged Robo-Tibbers focuses on enemies with the most health and grows larger, faster and deals more damage over the duration.Damage, Ability Haste, Area Size, Duration, Movement Speed",
    "image": "default.png"
  },
  {
    "id": "9288",
    "name": "Jinx's Tri-Namite",
    "stats": [],
    "description": "Drops timed explosive projectiles in a ring that explode and release additional explosions for massive area damage.Damage, Ability Haste, Area Size, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9289",
    "name": "FC Limited Express",
    "stats": [],
    "description": "A train randomly drives through enemies. Trains generate explosions in their wake and knock up enemies. Enemies killed have a chance to drop gold.Damage, Ability Haste, Crit Chance, Armor",
    "image": "default.png"
  },
  {
    "id": "9290",
    "name": "Vayne's Chromablades",
    "stats": [],
    "description": "Fires projectiles that bounce off walls, damaging all enemies they pass through. Arrows deal more damage each time they bounce.Damage, Ability Haste, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9292",
    "name": "Bearfoot Chem-Dispenser",
    "stats": [],
    "description": "",
    "image": "default.png"
  },
  {
    "id": "9293",
    "name": "Deep Freeze",
    "stats": [],
    "description": "Blocks damage freezing enemies and granting a shield. Damage scales with Armor and shield scales with Max health. When the shield expires it freezes all nearby enemies again.Damage, Ability Haste, Area Size, Duration, Max Health, Armor",
    "image": "default.png"
  },
  {
    "id": "9300",
    "name": "Meow Meow",
    "stats": [],
    "description": "Jinx shoots out a barrage of bullets in a target direction.Evolve:  Ability HasteDamage, Ability Haste, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9301",
    "name": "Shield Slam",
    "stats": [],
    "description": "Leona slams her shield, dealing damage in a cone that scales with her armor.Evolve: ArmorDamage, Ability Haste, Area Size, Crit Chance, Armor",
    "image": "default.png"
  },
  {
    "id": "9302",
    "name": "Sound Wave",
    "stats": [],
    "description": "Seraphine sends out a wave of sound, damaging and slowing enemies hit.Evolve:  Projectile CountDamage, Ability Haste, Crit Chance, Projectile Count, Duration",
    "image": "default.png"
  },
  {
    "id": "9303",
    "name": "Pillory Swipe",
    "stats": [],
    "description": "Briar sweeps in front of her, dealing damage that scales with her Max Health.Evolve:  Max HealthDamage, Ability Haste, Area Size, Crit Chance, Max Health",
    "image": "default.png"
  },
  {
    "id": "9304",
    "name": "Steel Tempest",
    "stats": [],
    "description": "Yasuo gains 25 Flow per second, and more when he moves and dashes.At 100 Flow, he lets out a whirlwind. damaging all enemies in a line. Evolve:  Crit ChanceDamage, Ability Haste, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9305",
    "name": "Tentacle Slam",
    "stats": [],
    "description": "Illaoi slams the ground with her idol, dealing damage in an area around the impact and spawning a tentacle that will attack nearby enemies.Evolve:  DurationDamage, Ability Haste, Area Size, Duration",
    "image": "default.png"
  },
  {
    "id": "9306",
    "name": "Winged Dagger",
    "stats": [],
    "description": "Xayah throws out a dagger infront of her that pierces through enemies, dealing less damage to subsequent enemies and leaves a Dagger in the ground.Evolve:  Pickup RadiusDamage, Ability Haste, Crit Chance, Projectile Count, Duration",
    "image": "default.png"
  },
  {
    "id": "9307",
    "name": "Guiding Hex",
    "stats": [],
    "description": "Aurora shoots a hex through the air, guiding it as it flies. Enemies hit take damage and are  Hexed. Every 3rd cast, she purges Hexed targets, dealing bonus damage.Evolve:  Exp GainDamage, Ability Haste, Crit Chance, Projectiles, Exp",
    "image": "default.png"
  },
  {
    "id": "9308",
    "name": "Bunny Hop",
    "stats": [],
    "description": "Riven passively gains Move Speed and gains charge as she moves. At max charge she jumps forward, dealing damage in an area. Every second cast knocks up.Evolve:  Movement SpeedDamage, Area Size, Crit Chance, Movement Speed",
    "image": "default.png"
  },
  {
    "id": "9400",
    "name": "Battle Cat Barrage",
    "stats": [],
    "description": "Jinx shoots out a barrage of bullets in a target direction. Bullets now pierce, dealing less damage to targets hit after the first. Cooldown is heavily reduced.Damage, Ability Haste, Crit Chance, Projectile Count",
    "image": "default.png"
  },
  {
    "id": "9401",
    "name": "Light of the Lion",
    "stats": [],
    "description": "Hits a larger area and applies Sunlight to enemies. Sunlight can be detonated by allies or other weapons for bonus damage.Damage, Ability Haste, Area Size, Crit Chance, Armor",
    "image": "default.png"
  },
  {
    "id": "9402",
    "name": "Anima Echo",
    "stats": [],
    "description": "Waves now come back upon reaching their end point, dealing damage again and shooting past SeraphineDamage, Ability Haste, Crit Chance, Projectile Count, Duration",
    "image": "default.png"
  },
  {
    "id": "9403",
    "name": "Savage Slice",
    "stats": [],
    "description": "Briar sweeps in front of her, applying a stacking bleed and dealing damage that scales with her Max Health.Damage, Ability Haste, Area Size, Crit Chance, Max Health",
    "image": "default.png"
  },
  {
    "id": "9404",
    "name": "Wandering Storms",
    "stats": [],
    "description": "Yasuo hones his energy, shooting fewer and larger tornadoes that curve through the air and leave damaging tempests at their end point.Damage, Abilty Haste, Crit Chance, Projectile Count, Area Size, Duration",
    "image": "default.png"
  },
  {
    "id": "9405",
    "name": "Grizzly Smash",
    "stats": [],
    "description": "Illaoi slams the ground with her idol, dealing damage in an area around the impact and spawning a tentacle that will attack nearby enemies. There is a chance to summon a GIANT TENTACLE that deals increased damage.Damage, Ability Haste, Area Size, Duration",
    "image": "default.png"
  },
  {
    "id": "9406",
    "name": "Lover's Ricochet",
    "stats": [],
    "description": "Xayah now also throws a familiar dagger behind her. This special dagger will bounce from enemy to enemy, dealing damage and then return to Xayah granting her a small shield.Damage, Ability Haste, Crit Chance, Projectile Count, Duration",
    "image": "default.png"
  },
  {
    "id": "9407",
    "name": "Hopped-Up Hex",
    "stats": [],
    "description": "Aurora now shoots more hexes and her purge now deals damage in an area around  Hexedtarget. Damage, Ability Haste, Crit Chance, Projectiles, Duration, Exp",
    "image": "default.png"
  },
  {
    "id": "9408",
    "name": "Carrot Crash",
    "stats": [],
    "description": "Riven passively gains Move Speed and gains charge as she moves. At max charge she jumps forward, dealing damage in an area. Every second cast knocks up enemies and ruptures the area, causing a second detonation that damages and knocks up again.Damage, Area Size, Crit Chance, Movement Speed",
    "image": "default.png"
  },
  {
    "id": "123430",
    "name": "Rite of Ruin",
    "stats": [
      "CriticalStrike",
      "SpellDamage",
      "CooldownReduction",
      "NonbootsMovement"
    ],
    "description": "55 Ability Power 10 Ability Haste 25% Critical Strike Chance 4% Move SpeedWrath and RuinOn spell cast, gain  2.5% critical chance for 6 seconds, stacking up to  20%.Salvage the WreckageYour spells have a chance equal to your crit chance to grant you or your targeted ally a shield for  for 3s.",
    "image": "default.png"
  },
  {
    "id": "124011",
    "name": "Sword of Blossoming Dawn",
    "stats": [
      "Health",
      "SpellDamage",
      "CooldownReduction",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "45 Ability Power 200 Health 12% Heal and Shield Power 15 Ability HasteEffervescenceGain + 1.2% Attack Speed for every  1% Heal and Shield Power you have. Peppermint On-Hit, heal the lowest health ally champion near you for , prioritizing lower health allies.",
    "image": "4011_swordofblossomingdawn.png"
  },
  {
    "id": "126697",
    "name": "Hubris",
    "stats": [
      "Damage",
      "Active",
      "CooldownReduction",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "60 Attack Damage 18 Lethality 15 Ability HasteEminenceGain temporary AD based on champion kills on kill.",
    "image": "6697_hubris.png"
  },
  {
    "id": "220000",
    "name": "Stat Bonus",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "Damage",
      "CriticalStrike",
      "AttackSpeed",
      "SpellDamage",
      "Mana",
      "Consumable",
      "CooldownReduction",
      "SpellVamp",
      "NonbootsMovement",
      "Tenacity",
      "MagicPenetration",
      "ArmorPenetration",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "Active - Consume: Automatically open a semi-random selection for a permanent stat bonus.",
    "image": "220000_statanvil.png"
  },
  {
    "id": "220001",
    "name": "Legendary Fighter Item",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "Damage",
      "AttackSpeed",
      "LifeSteal",
      "Mana",
      "Consumable",
      "CooldownReduction",
      "SpellVamp",
      "OnHit",
      "NonbootsMovement",
      "Tenacity",
      "ArmorPenetration",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "Active - Consume: Automatically open a semi-random selection for a Legendary Fighter item.",
    "image": "220001_fighteranvil.png"
  },
  {
    "id": "220002",
    "name": "Legendary Marksman Item",
    "stats": [
      "Health",
      "Armor",
      "Damage",
      "CriticalStrike",
      "AttackSpeed",
      "LifeSteal",
      "Mana",
      "Consumable",
      "CooldownReduction",
      "OnHit",
      "NonbootsMovement",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "Active - Consume: Automatically open a semi-random selection for a Legendary Marksman item.",
    "image": "220002_marksmananvil.png"
  },
  {
    "id": "220003",
    "name": "Legendary Assassin Item",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "Damage",
      "AttackSpeed",
      "Consumable",
      "Active",
      "CooldownReduction",
      "NonbootsMovement",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "Active - Consume: Automatically open a semi-random selection for a Legendary Assassin item.",
    "image": "220003_assassinanvil.png"
  },
  {
    "id": "220004",
    "name": "Legendary Mage Item",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "CriticalStrike",
      "AttackSpeed",
      "SpellDamage",
      "Mana",
      "Consumable",
      "Active",
      "CooldownReduction",
      "Slow",
      "SpellVamp",
      "OnHit",
      "NonbootsMovement",
      "MagicPenetration",
      "ArmorPenetration",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "Active - Consume: Automatically open a semi-random selection for a Legendary Mage item.",
    "image": "220004_mageanvil.png"
  },
  {
    "id": "220005",
    "name": "Legendary Tank Item",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "CriticalStrike",
      "SpellDamage",
      "Consumable",
      "Active",
      "CooldownReduction",
      "Slow",
      "NonbootsMovement",
      "MagicPenetration",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "Active - Consume: Automatically open a semi-random selection for a Legendary Tank item.",
    "image": "220005_tankanvil.png"
  },
  {
    "id": "220006",
    "name": "Legendary Support Item",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "AttackSpeed",
      "SpellDamage",
      "ManaRegen",
      "Consumable",
      "Active",
      "CooldownReduction",
      "Slow",
      "OnHit",
      "NonbootsMovement",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "Active - Consume: Automatically open a semi-random selection for a Legendary Support item.",
    "image": "220006_supportanvil.png"
  },
  {
    "id": "220007",
    "name": "Prismatic Item",
    "stats": [
      "Health",
      "SpellBlock",
      "HealthRegen",
      "Armor",
      "Damage",
      "CriticalStrike",
      "AttackSpeed",
      "LifeSteal",
      "SpellDamage",
      "Mana",
      "ManaRegen",
      "Consumable",
      "Active",
      "CooldownReduction",
      "Slow",
      "SpellVamp",
      "OnHit",
      "NonbootsMovement",
      "Tenacity",
      "MagicPenetration",
      "ArmorPenetration",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "Active - Consume: Automatically open a semi-random selection for a Prismatic item.",
    "image": "220007_prismaticanvil.png"
  },
  {
    "id": "220008",
    "name": "Anvil Voucher",
    "stats": [],
    "description": "Redeem during a Shopping Phase to gain a Stat Anvil!",
    "image": "3865_worldatlas.png"
  },
  {
    "id": "220009",
    "name": "Gold Stat Anvil Voucher",
    "stats": [],
    "description": "Redeem during a Shopping Phase to gain a Stat Anvil!",
    "image": "3865_worldatlas.png"
  },
  {
    "id": "220010",
    "name": "Prismatic Stat Voucher",
    "stats": [],
    "description": "Redeem during a Shopping Phase to gain a Stat Anvil!",
    "image": "3865_worldatlas.png"
  },
  {
    "id": "220011",
    "name": "Bravery Voucher",
    "stats": [],
    "description": "Redeem during a Shopping Phase to gain a Stat Anvil and 1 bonus rerolls!",
    "image": "3865_worldatlas.png"
  },
  {
    "id": "221011",
    "name": "Giant's Belt",
    "stats": [
      "Health"
    ],
    "description": "300 Health",
    "image": "1011_class_t2_giantsbelt.png"
  },
  {
    "id": "221026",
    "name": "Blasting Wand",
    "stats": [
      "SpellDamage"
    ],
    "description": "45 Ability Power",
    "image": "1026_mage_t1_blastingwand.png"
  },
  {
    "id": "221031",
    "name": "Chain Vest",
    "stats": [
      "Armor"
    ],
    "description": "40 Armor",
    "image": "1031_base_t2_chainvest.png"
  },
  {
    "id": "221038",
    "name": "B. F. Sword",
    "stats": [
      "Damage"
    ],
    "description": "40 Attack Damage",
    "image": "1038_marksman_t1_bfsword.png"
  },
  {
    "id": "221043",
    "name": "Recurve Bow",
    "stats": [
      "AttackSpeed",
      "OnHit"
    ],
    "description": "15% Attack SpeedStingAttacks deal 15 bonus physical damage  On-Hit.",
    "image": "1043_base_t2_recurvebow.png"
  },
  {
    "id": "221053",
    "name": "Vampiric Scepter",
    "stats": [
      "Damage",
      "LifeSteal"
    ],
    "description": "15 Attack Damage 7% Life Steal",
    "image": "1053_fighter_t2_vampiricscepter.png"
  },
  {
    "id": "221057",
    "name": "Negatron Cloak",
    "stats": [
      "SpellBlock"
    ],
    "description": "30 Magic Resist",
    "image": "1057_tank_t2_negatroncloak.png"
  },
  {
    "id": "221058",
    "name": "Needlessly Large Rod",
    "stats": [
      "SpellDamage"
    ],
    "description": "120 Ability Power",
    "image": "1058_mage_t1_largerod.png"
  },
  {
    "id": "222022",
    "name": "Glowing Mote",
    "stats": [
      "CooldownReduction"
    ],
    "description": "5 Ability Haste",
    "image": "2022_glowingmote.png"
  },
  {
    "id": "222051",
    "name": "Guardian's Horn",
    "stats": [
      "Health",
      "HealthRegen",
      "Lane"
    ],
    "description": "300 HealthRecoveryRestores 20 Health every 5 seconds.UndauntedBlocks 12 damage from attacks and spells from champions (25% effectiveness vs. damage over time abilities).",
    "image": "2051_aram_t1_guardianshorn.png"
  },
  {
    "id": "222065",
    "name": "Shurelya's Battlesong",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "Active",
      "CooldownReduction",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "55 Ability Power 15 Ability Haste 6% Move Speed 150% Base Mana RegenInspiring SpeechGrants nearby allies Move Speed for a few seconds.",
    "image": "2065_tank_t4_shurelyasbattlesong.png"
  },
  {
    "id": "222141",
    "name": "Cappa Juice",
    "stats": [
      "Damage",
      "Consumable"
    ],
    "description": "Helps you get on a head. Active - Consume: This juice does nothing.",
    "image": "default.png"
  },
  {
    "id": "222502",
    "name": "Unending Despair",
    "stats": [
      "Health",
      "Armor",
      "CooldownReduction",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "350 Health 25 Armor 10 Ability Haste 25 Magic ResistAnguishEvery 4 seconds while in combat with champions, deal magic damage to nearby enemy champions and heal for 250% of the damage dealt.",
    "image": "2502_unendingdespair.png"
  },
  {
    "id": "222503",
    "name": "Blackfire Torch",
    "stats": [
      "SpellDamage",
      "Mana",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "60 Ability Power 600 Mana 20 Ability HasteBaleful BlazeDealing damage with Abilities causes enemies to burn. This damage increases to Monsters.BlackfireFor each enemy Champion, Epic Monster, and Large Monster affected by your Baleful Blaze, gain Ability Power.",
    "image": "2503_blackfiretorch64.png"
  },
  {
    "id": "222504",
    "name": "Kaenic Rookern",
    "stats": [
      "Health",
      "SpellBlock",
      "HealthRegen"
    ],
    "description": "350 Health 80 Magic ResistMagebaneAfter not taking magic damage for 15 seconds, gain a magic shield.",
    "image": "2504_kaenicrookern.png"
  },
  {
    "id": "223001",
    "name": "Evenshroud",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "AbilityHaste"
    ],
    "description": "200 Health 30 Armor 30 Magic Resist 20 Ability HasteCoruscation: After Immobilizing champions or being Immobilized, cause that target and all nearby enemy champions to take 7% increased damage for 5 seconds. Mythic Passive: Grants all other Legendary items 5  Armor and  Magic Resist",
    "image": "3001_support_lunari.png"
  },
  {
    "id": "223002",
    "name": "Trailblazer",
    "stats": [
      "Health",
      "Armor",
      "NonbootsMovement"
    ],
    "description": "300 Health 45 Armor 6% Move SpeedLead the WayWhile moving, build up to 20 bonus Move Speed. At max speed:Create a trail that grants allied champions Move Speed equal to 15% of yours. If you are Melee, your next Attack Slows the target by 50% for 1 second.",
    "image": "3002_trailblazer.png"
  },
  {
    "id": "223003",
    "name": "Archangel's Staff",
    "stats": [
      "SpellDamage",
      "Mana",
      "AbilityHaste"
    ],
    "description": "55 Ability Power 600 Mana 25 Ability HasteAwe Gain Ability Power equal to 2% bonus Mana.Mana ChargeAfter 2 combat rounds, this item transforms into Seraph's Embrace.",
    "image": "3003_mage_t3_archangelstaff.png"
  },
  {
    "id": "223004",
    "name": "Manamune",
    "stats": [
      "Damage",
      "Mana",
      "CooldownReduction",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "40 Attack Damage 600 Mana 15 Ability HasteAweGain bonus Attack Damage equal to . Mana ChargeAfter 2 combat rounds, this item transforms into Muramana.",
    "image": "3004_marksman_t3_manamune.png"
  },
  {
    "id": "223005",
    "name": "Ghostcrawlers",
    "stats": [
      "Boots"
    ],
    "description": "70 Move Speed Wall Walk  (0s)Gain the ability to walk through walls for 6 seconds. While inside walls, gain 300 move speed. Casting a spell or attacking will end this effect.",
    "image": "3005_fighter_t3_atmasreckoning.png"
  },
  {
    "id": "223006",
    "name": "Berserker's Greaves",
    "stats": [
      "AttackSpeed",
      "Boots"
    ],
    "description": "35% Attack Speed 55 Move Speed",
    "image": "3006_class_t2_berserkersgreaves.png"
  },
  {
    "id": "223009",
    "name": "Boots of Swiftness",
    "stats": [
      "Boots"
    ],
    "description": "70 Move SpeedThe strength of movement slowing effects is reduced by 40%.",
    "image": "3009_class_t2_bootsofswiftness.png"
  },
  {
    "id": "223011",
    "name": "Chemtech Putrifier",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "AbilityHaste"
    ],
    "description": "35 Ability Power 10% Heal and Shield Power 75% Base Mana Regen 15 Ability HastePuffcap ToxinDealing damage applies 40% Grievous Wounds to champions for 3 seconds.If an enemy heals for more than 80% of their maximum health while continously affected by Grievous Wounds, it is increased to 60% Grievous Wounds.Grievous Wounds reduces the effectiveness of Healing and Regeneration effects.",
    "image": "3011_enchanter_t3_chemtechfumigator.png"
  },
  {
    "id": "223020",
    "name": "Sorcerer's Shoes",
    "stats": [
      "Boots",
      "MagicPenetration"
    ],
    "description": "20 Magic Penetration 55 Move Speed",
    "image": "3020_class_t2_sorcerersshoes.png"
  },
  {
    "id": "223026",
    "name": "Guardian Angel",
    "stats": [
      "Armor",
      "Damage"
    ],
    "description": "55 Attack Damage 45 ArmorSaving Grace:Upon taking lethal damage, restores 50% base Health and 100% max Mana after 4 seconds of stasis. This effect has a one round cooldown.",
    "image": "3026_fighter_t3_guardianangel.png"
  },
  {
    "id": "223031",
    "name": "Infinity Edge",
    "stats": [
      "CriticalStrike",
      "Damage"
    ],
    "description": "55 Attack Damage 25% Critical Strike Chance 40% Critical Strike Damage",
    "image": "3031_marksman_t3_infinityedge.png"
  },
  {
    "id": "223032",
    "name": "Yun Tal Wildarrows",
    "stats": [
      "Damage",
      "CriticalStrike"
    ],
    "description": "45 Attack Damage 25% Attack SpeedPractice Makes LethalOn-Attack, gain Critical Strike Chance permanently, up to 25%.Flurry On-Attacking an enemy champion, gain Attack Speed for 5 seconds. Attacks reduce this cooldown.",
    "image": "3032_yuntalwildarrows.png"
  },
  {
    "id": "223033",
    "name": "Mortal Reminder",
    "stats": [
      "Damage",
      "CriticalStrike",
      "ArmorPenetration"
    ],
    "description": "30 Attack Damage 30% Armor Penetration 25% Critical Strike ChanceSepsisDealing physical damage applies 40% Grievous Wounds to enemy champions for 3 seconds.If an enemy heals for more than 60% of their maximum health while continously affected by Grievous Wounds, it is increased to 80% Grievous Wounds.Grievous Wounds reduces the effectiveness of Healing and Regeneration effects.",
    "image": "3033_marksman_t3_mortalreminder.png"
  },
  {
    "id": "223036",
    "name": "Lord Dominik's Regards",
    "stats": [
      "Damage",
      "CriticalStrike",
      "ArmorPenetration"
    ],
    "description": "30 Attack Damage 40% Armor Penetration 25% Critical Strike Chance",
    "image": "3036_marksman_t3_dominikregards.png"
  },
  {
    "id": "223039",
    "name": "Atma's Reckoning",
    "stats": [
      "Health",
      "CriticalStrike",
      "Lane"
    ],
    "description": "700 Health 20% Critical Strike ChanceBig HandsGain  0-30% Critical Strike Chance, scaling with your bonus Health.",
    "image": "3005_fighter_t3_atmasreckoning.png"
  },
  {
    "id": "223040",
    "name": "Seraph's Embrace",
    "stats": [
      "SpellDamage",
      "Mana",
      "AbilityHaste"
    ],
    "description": "60 Ability Power 1200 Mana 25 Ability HasteAweGain Ability Power equal to 4% bonus Mana. (0).LifelineUpon taking damage that would reduce your Health below 30%, gain a 350 + 20% maximum Mana Shield for 3s  (0s).",
    "image": "3048_mage_t3_seraphsembrace.png"
  },
  {
    "id": "223042",
    "name": "Muramana",
    "stats": [
      "Damage",
      "Mana",
      "CooldownReduction",
      "OnHit",
      "ArmorPenetration"
    ],
    "description": "40 Attack Damage 1000 Mana 15 Ability HasteAweGain bonus Attack Damage based on Mana. ShockAttacks against champions deal additional physical damage.",
    "image": "3042_marksman_t3_muramana.png"
  },
  {
    "id": "223046",
    "name": "Phantom Dancer",
    "stats": [
      "CriticalStrike",
      "AttackSpeed",
      "NonbootsMovement"
    ],
    "description": "60% Attack Speed 8% Move Speed 25% Critical Strike ChanceSpectral WaltzBecome Ghosted.",
    "image": "3046_marksman_t3_phantomdancer.png"
  },
  {
    "id": "223047",
    "name": "Plated Steelcaps",
    "stats": [
      "Armor",
      "Boots"
    ],
    "description": "25 Armor 30 Move SpeedReduces incoming damage from Attacks by 14%.",
    "image": "3047_class_t2_ninjatabi.png"
  },
  {
    "id": "223050",
    "name": "Zeke's Convergence",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "AbilityHaste"
    ],
    "description": "300 Health 25 Armor 15 Ability Haste 30 Magic ResistFrostfire TempestCasting your Ultimate summons a storm around you. The storm deals magic damage per second to enemy Champions and Slows them.",
    "image": "3050_enchanter_t3_zekesconvergence.png"
  },
  {
    "id": "223053",
    "name": "Sterak's Gage",
    "stats": [
      "Health",
      "Damage",
      "Tenacity"
    ],
    "description": "300 Health 20% TenacityThe Claws that CatchGain  bonus Attack Damage.Lifeline  (0s)Upon taking damage that would reduce your Health below 30%, gain a  Shield decaying over 4.5 seconds.",
    "image": "3053_steraks_gage.png"
  },
  {
    "id": "223057",
    "name": "Sheen",
    "stats": [
      "OnHit",
      "AbilityHaste"
    ],
    "description": "10 Ability HasteSpellbladeAfter using an Ability, your next Attack is enhanced with additional damage.",
    "image": "3057_fighter_t2_sheen.png"
  },
  {
    "id": "223065",
    "name": "Spirit Visage",
    "stats": [
      "Health",
      "SpellBlock",
      "HealthRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "300 Health 40 Magic Resist 10 Ability HasteBoundless VitalityIncreases all Healing and Shielding effectiveness on you by 30%.",
    "image": "3065_tank_t3_spiritvisage.png"
  },
  {
    "id": "223067",
    "name": "Kindlegem",
    "stats": [
      "Health",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "200 Health 10 Ability Haste",
    "image": "3067_tank_t1_kindlegem.png"
  },
  {
    "id": "223068",
    "name": "Sunfire Aegis",
    "stats": [
      "Health",
      "Armor",
      "Aura",
      "AbilityHaste"
    ],
    "description": "350 Health 40 Armor 10 Ability HasteImmolateAfter taking or dealing damage, deal  magic damage per second to nearby enemies for 3 seconds.",
    "image": "3068_tank_t4_sunfireaegis.png"
  },
  {
    "id": "223071",
    "name": "Black Cleaver",
    "stats": [
      "Health",
      "Damage",
      "CooldownReduction",
      "OnHit",
      "NonbootsMovement",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "40 Attack Damage 350 Health 20 Ability HasteCarveDealing physical damage to champions applies a stack of 6% Armor reduction for 6 seconds, up to 30% Armor reduction.FervorDealing physical damage grants 20 Move Speed for 2 seconds.",
    "image": "3071_fighter_t3_blackcleaver.png"
  },
  {
    "id": "223072",
    "name": "Bloodthirster",
    "stats": [
      "Damage",
      "LifeSteal"
    ],
    "description": "70 Attack Damage 18% Life StealIchorshieldConvert excess healing from your Lifesteal to a Shield.",
    "image": "3072_fighter_t3_bloodthirster.png"
  },
  {
    "id": "223073",
    "name": "Experimental Hexplate",
    "stats": [
      "Health",
      "Damage",
      "AttackSpeed",
      "CooldownReduction",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "40 Attack Damage 30% Attack Speed 450 HealthHexchargedGain 30 Ultimate Ability Haste.OverdriveAfter casting your Ultimate, gain 50% Attack Speed and 20% Move Speed for 8 seconds.",
    "image": "3073_hexaegis.png"
  },
  {
    "id": "223074",
    "name": "Ravenous Hydra",
    "stats": [
      "Damage",
      "LifeSteal",
      "CooldownReduction",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "70 Attack Damage 15 Ability Haste 15% Life StealCleave: Attacks and Abilities deal physical damage to other nearby enemies. Activate to hit nearby enemies. Ravenous CrescentDeal physical damage to enemies around you. Your Life Steal applies to this damage.",
    "image": "3074_fighter_t3_ravenoushydra.png"
  },
  {
    "id": "223075",
    "name": "Thornmail",
    "stats": [
      "Health",
      "Armor"
    ],
    "description": "300 Health 60 ArmorThorns:When struck by an Attack, deal damage to the attacker and apply 40% Grievous Wounds if they are a champion.Grievous Wounds reduces the effectiveness of Healing and Regeneration effects.",
    "image": "3075_tank_t3_thornmail.png"
  },
  {
    "id": "223078",
    "name": "Trinity Force",
    "stats": [
      "Health",
      "Damage",
      "AttackSpeed",
      "CooldownReduction",
      "OnHit",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "35 Attack Damage 25% Attack Speed 333 Health 20 Ability HasteSpellbladeAfter using an Ability, your next Attack is enhanced with  additional physical damage.QuickenBasic attacks grant Move Speed.",
    "image": "3078_fighter_t4_trinityforce.png"
  },
  {
    "id": "223084",
    "name": "Heartsteel",
    "stats": [
      "Health"
    ],
    "description": "700 HealthColossal Consumption  (0s) per targetCharge up a powerful attack against a champion over time while near them. The charged attack deals bonus physical damage and grants permanent max Health.GoliathGain increased size based on Total Health.",
    "image": "3084_tank_t4_heartsteel.png"
  },
  {
    "id": "223085",
    "name": "Runaan's Hurricane",
    "stats": [
      "CriticalStrike",
      "AttackSpeed",
      "OnHit",
      "NonbootsMovement"
    ],
    "description": "45% Attack Speed 25% Critical Strike Chance 4% Move SpeedWind's FuryWhen Attacking, bolts are fired at up to 2 enemies near the target. Bolts apply On-Hit effects and can Critically Strike.Item is for  Ranged champions only.",
    "image": "3085_marksman_t3_runaans.png"
  },
  {
    "id": "223087",
    "name": "Statikk Shiv",
    "stats": [
      "Damage",
      "AttackSpeed",
      "OnHit",
      "NonbootsMovement"
    ],
    "description": "45 Attack Damage 40% Attack Speed 4% Move SpeedElectrosparkAttacks trigger chain lightning On-Hit, dealing magic damage with a cooldown.Electroshock Takedowns within 3 seconds of damaging the target reset Electrospark's cooldown.",
    "image": "3087_statikk_shiv.png"
  },
  {
    "id": "223089",
    "name": "Rabadon's Deathcap",
    "stats": [
      "SpellDamage"
    ],
    "description": "65 Ability PowerMagical OpusIncreases your total Ability Power by 30%.",
    "image": "3089_mage_t3_deathcap.png"
  },
  {
    "id": "223091",
    "name": "Wit's End",
    "stats": [
      "SpellBlock",
      "AttackSpeed",
      "OnHit",
      "Tenacity"
    ],
    "description": "50% Attack Speed 40 Magic Resist 20% TenacityFray: Attacks apply magic damage On-Hit and grant Move Speed.",
    "image": "3091_fighter_t3_witsend.png"
  },
  {
    "id": "223094",
    "name": "Rapid Firecannon",
    "stats": [
      "CriticalStrike",
      "AttackSpeed",
      "NonbootsMovement"
    ],
    "description": "30% Attack Speed 25% Critical Strike Chance 4% Move SpeedEnergizedMoving and Attacking generates an Energized Attack.SharpshooterYour Energized Attack applies 200 bonus magic damage. In addition, Energized attacks gain up to 35% bonus Attack Range.Energized stacks twice as fast in Arena.",
    "image": "3094_marksman_t3_rapidfirehandcannon.png"
  },
  {
    "id": "223095",
    "name": "Stormrazor",
    "stats": [
      "Damage",
      "CriticalStrike"
    ],
    "description": "45 Attack Damage 25% Attack Speed 25% Critical Strike ChanceEnergizedMoving and Attacking generates an Energized Attack.BoltYour Energized Attack applies  bonus magic damage and grants 45% Move Speed for 1.5s.Energized stacks twice as fast in Arena.",
    "image": "3095_windblade.png"
  },
  {
    "id": "223100",
    "name": "Lich Bane",
    "stats": [
      "SpellDamage",
      "OnHit",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "80 Ability Power 10% Move Speed 20 Ability HasteSpellblade  (0s)After using an Ability, your next Attack is enhanced with an additional  magic damage  On-Hit.",
    "image": "3100_mage_t3_lichbane.png"
  },
  {
    "id": "223102",
    "name": "Banshee's Veil",
    "stats": [
      "SpellBlock",
      "SpellDamage"
    ],
    "description": "80 Ability Power 40 Magic ResistAnnulGrants a Spell Shield that blocks the next enemy Ability.Item cooldown is restarted if you take damage from champions before it is completed.",
    "image": "3102_mage_t3_bansheesveil.png"
  },
  {
    "id": "223105",
    "name": "Aegis of the Legion",
    "stats": [
      "SpellBlock",
      "Armor",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "30 Armor 30 Magic Resist 10 Ability Haste",
    "image": "3105_tank_t2_aegisofthelegion.png"
  },
  {
    "id": "223107",
    "name": "Redemption",
    "stats": [
      "Health",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "300 Health 15 Ability Haste 100% Base Mana Regen 16% Heal and Shield Power ACTIVE  (0s)InterventionTarget an area within. After 2.5 seconds, call down a beam of light to restore Health to allies and damage enemy champions.",
    "image": "3107_enchanter_t3_redemption.png"
  },
  {
    "id": "223109",
    "name": "Knight's Vow",
    "stats": [
      "Health",
      "Armor",
      "Aura",
      "Active",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "400 Health 50 Armor 15 Ability HasteSacrificeWhile near your Worthy ally, take 12% of the damage they receive and heal for 10% of the damage they deal to Champions. ACTIVE  (0s)PledgeDesignate an ally who is Worthy.",
    "image": "3109_tank_t3_knightsvow.png"
  },
  {
    "id": "223110",
    "name": "Frozen Heart",
    "stats": [
      "Armor",
      "Mana",
      "Aura",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "90 Armor 450 Mana 15 Ability HasteWinter's CaressReduces the Attack Speed of nearby enemies.",
    "image": "3110_tank_t3_frozenheart.png"
  },
  {
    "id": "223111",
    "name": "Mercury's Treads",
    "stats": [
      "Boots",
      "SpellBlock",
      "Tenacity"
    ],
    "description": "30 Magic Resist 30 Move Speed 30% Tenacity",
    "image": "3111_class_t2_mercurystreads.png"
  },
  {
    "id": "223112",
    "name": "Guardian's Orb",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "CooldownReduction",
      "Lane"
    ],
    "description": "55 Ability Power 25 Ability HasteRecoveryRestores 10 Mana every 5 seconds. If you can't gain mana, restores 15 Health instead.",
    "image": "3112_aram_t1_guardiansorb.png"
  },
  {
    "id": "223115",
    "name": "Nashor's Tooth",
    "stats": [
      "AttackSpeed",
      "SpellDamage",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "70 Ability Power 45% Attack Speed 10 Ability HasteIcathian BiteAttacks apply magic damage  On-Hit.",
    "image": "3115_mage_t3_nashorstooth.png"
  },
  {
    "id": "223116",
    "name": "Rylai's Crystal Scepter",
    "stats": [
      "Health",
      "SpellDamage",
      "Slow"
    ],
    "description": "60 Ability Power 350 HealthRimefrostDamaging Abilities Slow enemies by 30% for 1 second.",
    "image": "3116_mage_t3_rylajscrystalscepter.png"
  },
  {
    "id": "223118",
    "name": "Malignance",
    "stats": [
      "SpellDamage",
      "Mana",
      "AbilityHaste"
    ],
    "description": "70 Ability Power 600 Mana 20 Ability HasteScornYour Ultimate spells gain Ability Haste.HatefogDamaging a champion with your Ultimate Burns the ground beneath them, dealing damage and reducing their Magic Resist.",
    "image": "3118_malignance.png"
  },
  {
    "id": "223119",
    "name": "Winter's Approach",
    "stats": [
      "Health",
      "Mana",
      "AbilityHaste"
    ],
    "description": "400 Health 600 Mana 15 Ability HasteAwe: Gain bonus Health equal to Total Mana.Mana Charge: After 2 combat rounds, this item transforms into Fimbulwinter.",
    "image": "3119_wintersapproach.png"
  },
  {
    "id": "223121",
    "name": "Fimbulwinter",
    "stats": [
      "Health",
      "Mana",
      "AbilityHaste"
    ],
    "description": "400 Health 1000 Mana 15 Ability HasteAwe: Gain bonus Health based on Mana.Everlasting: Immobilizing or Slowing an enemy champion grants a Shield. The Shield is increased if more than one enemy is nearby.",
    "image": "3121_fimbulwinter.png"
  },
  {
    "id": "223124",
    "name": "Guinsoo's Rageblade",
    "stats": [
      "Damage",
      "AttackSpeed",
      "SpellDamage",
      "OnHit"
    ],
    "description": "20 Attack Damage 25 Ability Power 25% Attack SpeedAttacks apply 30 magic damage  On-Hit.Seething StrikeBasic attacks grant 8% Attack Speed, stacking up to 4 times for a maximum of  Attack Speed. While fully stacked, every third Attack applies your  On-Hit effects twice.",
    "image": "3124_marksman_t3_guinsoosrageblade.png"
  },
  {
    "id": "223135",
    "name": "Void Staff",
    "stats": [
      "MagicPenetration",
      "SpellDamage"
    ],
    "description": "65 Ability Power 40% Magic Penetration",
    "image": "3135_mage_t3_voidstaff.png"
  },
  {
    "id": "223137",
    "name": "Cryptbloom",
    "stats": [
      "SpellDamage",
      "MagicPenetration",
      "AbilityHaste"
    ],
    "description": "60 Ability Power 30% Magic Penetration 15 Ability HasteLife from DeathWhen a champion that you damaged within 3 seconds dies, a nova spreads from their corpse that heals.",
    "image": "3137_cryptbloom.png"
  },
  {
    "id": "223139",
    "name": "Mercurial Scimitar",
    "stats": [
      "SpellBlock",
      "Damage",
      "LifeSteal",
      "Active",
      "NonbootsMovement",
      "Tenacity"
    ],
    "description": "45 Attack Damage 40 Magic Resist 10% Life Steal Active - Quicksilver: Remove all crowd control debuffs and gain Move Speed.",
    "image": "3139_marksman_t3_mercurialscimitar.png"
  },
  {
    "id": "223142",
    "name": "Youmuu's Ghostblade",
    "stats": [
      "Damage",
      "Active",
      "NonbootsMovement",
      "ArmorPenetration"
    ],
    "description": "55 Attack Damage 22 Lethality 4% Move SpeedHaunt Gain  Move Speed while out of combat. ACTIVE  (0s)Wraith StepGain Move Speed and Ghosting.",
    "image": "3142_assassin_t3_youmuusghostblade.png"
  },
  {
    "id": "223143",
    "name": "Randuin's Omen",
    "stats": [
      "Health",
      "Armor",
      "Active",
      "Slow"
    ],
    "description": "300 Health 75 ArmorResilienceCritical Strikes deal 30% less damage to you.HumilitySlow nearby enemies. ACTIVE  (0s)HumilityBriefly Slow nearby enemies by 70% for 2 seconds.",
    "image": "3143_tank_t3_randuinsomen.png"
  },
  {
    "id": "223146",
    "name": "Hextech Gunblade",
    "stats": [
      "Damage",
      "LifeSteal",
      "SpellDamage",
      "Active",
      "SpellVamp"
    ],
    "description": "90 Ability Power 45 Attack Damage 15% Omnivamp ACTIVE  (0s)Lightning BoltShocks the target enemy champion, dealing  magic damage and slowing them by 40% for 2 seconds.",
    "image": "3146_hextechgunblade.png"
  },
  {
    "id": "223152",
    "name": "Hextech Rocketbelt",
    "stats": [
      "Health",
      "SpellDamage",
      "Active",
      "CooldownReduction",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "95 Ability Power 400 Health 20 Ability Haste Active - Supersonic: Dash in target direction, unleashing an arc of magic missiles that deal damage.",
    "image": "3152_mage_t4_hextechrocketbelt.png"
  },
  {
    "id": "223153",
    "name": "Blade of The Ruined King",
    "stats": [
      "Damage",
      "AttackSpeed",
      "LifeSteal",
      "Slow",
      "OnHit"
    ],
    "description": "30 Attack Damage 20% Attack Speed 10% Life StealMist's EdgeAttacks apply an additional enemy current Health physical damage  On-Hit.Clawing Shadows  (0s)Attacking a champion 3 times Slows them.",
    "image": "3153_fighter_t3_bladeoftheruinedking.png"
  },
  {
    "id": "223156",
    "name": "Maw of Malmortius",
    "stats": [
      "SpellBlock",
      "Damage",
      "LifeSteal",
      "SpellVamp",
      "AbilityHaste"
    ],
    "description": "50 Attack Damage 15 Ability Haste 40 Magic ResistLifelineUpon taking magic damage that would reduce Health below 30%, gain a magic damage Shield. When Lifeline triggers, gain Omnivamp until the end of combat.",
    "image": "3156_fighter_t3_mawofmalmortius.png"
  },
  {
    "id": "223157",
    "name": "Zhonya's Hourglass",
    "stats": [
      "Armor",
      "SpellDamage",
      "Active"
    ],
    "description": "80 Ability Power 50 Armor Active - Stasis: You become Invulnerable and Untargetable for 2.5 seconds, but are prevented from taking any other actions during this time (120s).",
    "image": "3157_mage_t3_zhonyashourglass.png"
  },
  {
    "id": "223158",
    "name": "Ionian Boots of Lucidity",
    "stats": [
      "Boots",
      "CooldownReduction"
    ],
    "description": "40 Ability Haste 45 Move SpeedGain 10 Summoner Spell Haste.",
    "image": "3158_class_t2_ionianbootsoflucidity.png"
  },
  {
    "id": "223161",
    "name": "Spear of Shojin",
    "stats": [
      "Health",
      "Damage",
      "AbilityHaste"
    ],
    "description": "40 Attack Damage 350 HealthDragonforce Gain 25 Basic Ability Haste.Focused Will Dealing damage with Abilities increases your Champion's Ability and Passive damage by 3% for 6 seconds. (stacks 4 times).",
    "image": "3161_fighter_t3_spearofshojin.png"
  },
  {
    "id": "223165",
    "name": "Morellonomicon",
    "stats": [
      "Health",
      "SpellDamage",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "90 Ability Power 250 Health 15 Ability HasteAfflictionDealing magic damage applies 40% Grievous Wounds to enemy champions for 3 seconds.If an enemy heals for more than 60% of their maximum health while continously affected by Grievous Wounds, it is increased to 80% Grievous Wounds.Grievous Wounds reduces the effectiveness of Healing and Regeneration effects.",
    "image": "3165_mage_t3_morellonomicon.png"
  },
  {
    "id": "223172",
    "name": "Zephyr",
    "stats": [
      "AttackSpeed",
      "CooldownReduction",
      "OnHit",
      "NonbootsMovement",
      "Tenacity"
    ],
    "description": "50% Attack Speed 10% Move Speed 30 Ability Haste 20% TenacityLike the WindGain 5% Move Speed  On-Hit for 6 seconds, stacking up to 25% Move Speed.Tenacity reduces the duration of Stun, Slow, Taunt, Fear, Silence, Blind, Polymorph and Immobilizing effects. It has no effect on Airborne or Suppression.",
    "image": "3172_zephyr.png"
  },
  {
    "id": "223177",
    "name": "Guardian's Blade",
    "stats": [
      "Health",
      "Damage",
      "Lane",
      "AbilityHaste"
    ],
    "description": "25 Attack Damage 250 Health 15 Ability Haste",
    "image": "3177_aram_t1_guardianshammer.png"
  },
  {
    "id": "223181",
    "name": "Hullbreaker",
    "stats": [
      "Health",
      "Damage",
      "NonbootsMovement"
    ],
    "description": "40 Attack Damage 500 Health 4% Move SpeedSkipperEvery fifth Attack against champions and epic monsters deals  bonus physical damage, increased to  against structures.Solo PartyWhile no allied champions are within 1500 range, you gain  Armor and Magic Resist.",
    "image": "3181_hullbreaker.png"
  },
  {
    "id": "223184",
    "name": "Guardian's Hammer",
    "stats": [
      "Health",
      "Damage",
      "LifeSteal",
      "Lane"
    ],
    "description": "25 Attack Damage 35% Attack Speed 5% Life Steal",
    "image": "3177_aram_t1_guardianshammer.png"
  },
  {
    "id": "223185",
    "name": "Guardian's Dirk",
    "stats": [
      "Damage",
      "ArmorPenetration",
      "Lane"
    ],
    "description": "25 Attack Damage 11 Lethality 10 Ability HasteAgricultural Reaper Increases effects of Power Flower by 20%. Gain 100 Move speed for 3s after attacking a plant.",
    "image": "3181_sanguineblade.png"
  },
  {
    "id": "223190",
    "name": "Locket of the Iron Solari",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "Aura",
      "Active",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "400 Health 25 Armor 35 Magic Resist 25 Ability HasteDevotionGrant nearby allies a Shield, decaying over time.",
    "image": "3190_enchanter_t4_locketofironsolari.png"
  },
  {
    "id": "223193",
    "name": "Gargoyle Stoneplate",
    "stats": [
      "SpellBlock",
      "Armor",
      "Active",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "60 Armor 60 Magic Resist 15 Ability HasteFortify: Taking damage from a champion grants a stack of  Armor and  Magic Resist for 6 seconds.Max 5 stacks; 1 per champion. Active - Unbreakable: Gain a Shield that decays and grow in size.",
    "image": "3193_tank_t3_gargoylestoneplate.png"
  },
  {
    "id": "223222",
    "name": "Mikael's Blessing",
    "stats": [
      "Health",
      "ManaRegen",
      "Active",
      "CooldownReduction",
      "Tenacity",
      "AbilityHaste"
    ],
    "description": "400 Health 100% Base Mana Regen 16% Heal and Shield Power ACTIVE  (0s)PurifyRestore Health and Remove all crowd control debuffs (except Knockups and Suppression) from an ally champion.",
    "image": "3222_enchanter_t3_mikaelsblessing.png"
  },
  {
    "id": "223302",
    "name": "Terminus",
    "stats": [
      "Damage",
      "AttackSpeed",
      "OnHit",
      "MagicPenetration",
      "ArmorPenetration"
    ],
    "description": "30 Attack Damage 25% Attack SpeedShadowAttacks deal 30 bonus magic damage  On-Hit.JuxtapositionAlternate between Light and Dark Attacks against champions: Light Attacks grant Armor and Magic Resist for 5s. Dark Attacks grant 8% Armor Penetration and Magic Penetration for 5s.",
    "image": "3302_terminus.png"
  },
  {
    "id": "223504",
    "name": "Ardent Censer",
    "stats": [
      "AttackSpeed",
      "SpellDamage",
      "ManaRegen",
      "NonbootsMovement"
    ],
    "description": "40 Ability Power 12% Heal and Shield Power 150% Base Mana Regen 6% Move SpeedSanctifyHealing or Shielding another ally enhances you both for 6 seconds, granting your Attacks 40% Attack Speed and 25 magic damage  On-Hit.",
    "image": "3504_enchanter_t3_ardentcenser.png"
  },
  {
    "id": "223508",
    "name": "Essence Reaver",
    "stats": [
      "Damage",
      "CriticalStrike",
      "ManaRegen",
      "CooldownReduction",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "50 Attack Damage 20 Ability Haste 25% Critical Strike ChanceEssence DrainBasic attacks refund mana on-hit.",
    "image": "3508_marksman_t3_essencereaver.png"
  },
  {
    "id": "223742",
    "name": "Dead Man's Plate",
    "stats": [
      "Health",
      "Armor",
      "Slow",
      "NonbootsMovement"
    ],
    "description": "300 Health 40 Armor 7% Move SpeedShipwreckerWhile moving, build up  Move Speed. Your next Attack discharges built up Move Speed to deal damage. If dealt by a Melee champion at top speed, the Attack also Slows the target.UnsinkableThe strength of movement slowing effects is reduced.",
    "image": "3742_tank_t3_deadmansplate.png"
  },
  {
    "id": "223748",
    "name": "Titanic Hydra",
    "stats": [
      "Health",
      "HealthRegen",
      "Damage",
      "OnHit"
    ],
    "description": "40 Attack Damage 400 HealthColossus: Gain bonus Attack Damage based off of bonus Health.Cleave: Attacks apply additional damage  On-Hit, creating a shockwave that deals damage to enemies behind the target. Titanic CrescentEmpower your next Cleave to deal bonus physical damage  On-Hit and deal bonus physical damage to enemies behind the target.",
    "image": "3748_fighter_t3_titanichydra.png"
  },
  {
    "id": "223814",
    "name": "Edge of Night",
    "stats": [
      "Health",
      "Damage",
      "ArmorPenetration"
    ],
    "description": "45 Attack Damage 14 Lethality 375 HealthAnnul  (0s)Gain a Spell Shield that blocks the next enemy Ability.Item's cooldown is restarted if you take damage before it is completed.",
    "image": "3814_assassin_t3_edgeofnight.png"
  },
  {
    "id": "224004",
    "name": "Spectral Cutlass",
    "stats": [
      "Damage",
      "ArmorPenetration"
    ],
    "description": "55 Attack Damage 21 Lethality Active - Soul Anchor  (0s)Mark your current location. After 5 seconds, return to that location. You may recast at any point during Soul Anchor's duration to return to your marked location early.",
    "image": "4004_assassin_t3_spectralcutlass.png"
  },
  {
    "id": "224005",
    "name": "Imperial Mandate",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "60 Ability Power 35 Ability Haste 150% Base Mana RegenCoordinated Fire  (0s) per targetSlowing or Immobilizing an enemy champion marks them for 5 seconds. Ally champion damage detonates the mark, dealing magic damage equal to 20% of current health.",
    "image": "4005_enchanter_t4_imperialmandate.png"
  },
  {
    "id": "224401",
    "name": "Force of Nature",
    "stats": [
      "Health",
      "SpellBlock",
      "NonbootsMovement"
    ],
    "description": "400 Health 50 Magic Resist 4% Move SpeedAbsorbTaking magic damage from enemy Champions grants a stack of Steadfast (max 10) for 7 seconds. Enemy Immobilizing effects grant an additional 2 stacks.DissipateWhile at 10 stacks of Steadfast, gain 50 Magic Resist and 14% increased Move Speed.One spell can add a new stack of Steadfast every 1 second.",
    "image": "4401_tank_t3_forceofnature.png"
  },
  {
    "id": "224403",
    "name": "The Golden Spatula",
    "stats": [
      "Health",
      "SpellBlock",
      "HealthRegen",
      "Armor",
      "Damage",
      "CriticalStrike",
      "AttackSpeed",
      "LifeSteal",
      "SpellDamage",
      "Mana",
      "ManaRegen",
      "CooldownReduction",
      "NonbootsMovement"
    ],
    "description": "90 Attack Damage 125 Ability Power 60% Attack Speed 25% Critical Strike Chance 250 Health 30 Armor 30 Magic Resist 250 Mana 20 Ability Haste 10% Move Speed 10% Omnivamp 100% Base Health Regen 100% Base Mana RegenDoing SomethingYou are permanently On Fire!\"It must do something...Declined, it does EVERYTHING\"",
    "image": "4403_goldenspatula.png"
  },
  {
    "id": "224628",
    "name": "Horizon Focus",
    "stats": [
      "SpellDamage",
      "AbilityHaste"
    ],
    "description": "90 Ability Power 25 Ability HasteHypershot: Damaging a champion with a non-targeted Ability at over 600 range or Slowing or Immobilizing them Reveals them and increases their damage taken from you.The Ability that triggers Hypershot also benefits from the damage increase. Pets and non-immobilizing traps do not trigger this effect. Only the initial placement of zone Abilities will trigger this effect. Distance is measured from the Ability cast position.",
    "image": "4628_mage_t3_horizonfocus.png"
  },
  {
    "id": "224629",
    "name": "Cosmic Drive",
    "stats": [
      "Health",
      "SpellDamage",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "65 Ability Power 350 Health 35 Ability Haste 4% Move SpeedSpelldanceDealing magic or true damage to champions grants  Move Speed for 4 seconds.",
    "image": "4629_mage_t3_cosmicdrive.png"
  },
  {
    "id": "224633",
    "name": "Riftmaker",
    "stats": [
      "Health",
      "SpellDamage",
      "CooldownReduction",
      "SpellVamp"
    ],
    "description": "60 Ability Power 350 Health 15 Ability HasteVoid CorruptionFor each second in combat with enemy champions, deal 2% bonus damage, up to 8%. At maximum strength, gain Omnivamp.Void InfusionGain 2% of your bonus Health as Ability Power.",
    "image": "4633_mage_t4_riftmaker.png"
  },
  {
    "id": "224636",
    "name": "Night Harvester",
    "stats": [
      "Health",
      "SpellDamage",
      "CooldownReduction",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "90 Ability Power 300 Health 25 Ability HasteSoulrendDamaging a champion with Attacks or Abilities deals an additional  magic damage and grants you 25% Move Speed for 1.5 seconds (30 (0s) per champion).Damaging a new champion will extend the duration of the Move Speed bonus.",
    "image": "4636_mage_t4_nightharvester.png"
  },
  {
    "id": "224637",
    "name": "Demonic Embrace",
    "stats": [
      "Health",
      "SpellDamage"
    ],
    "description": "GeneratedTip_Item_224637_ExternalDescription",
    "image": "4637_mage_t3_demonicembrace.png"
  },
  {
    "id": "224644",
    "name": "Crown of the Shattered Queen",
    "stats": [
      "Health",
      "SpellDamage",
      "Mana",
      "AbilityHaste"
    ],
    "description": "85 Ability Power 250 Health 600 Mana 20 Ability HasteSafeguardYou are Safeguarded, reducing incoming champion damage by 40%. Safeguard persists for 2.5 seconds after taking champion damage. ( (0s). Item cooldown is restarted when damage is taken from champions.",
    "image": "4644_crown.png"
  },
  {
    "id": "224645",
    "name": "Shadowflame",
    "stats": [
      "SpellDamage",
      "MagicPenetration"
    ],
    "description": "90 Ability Power 10 Magic PenetrationCinderbloomMagic and true damage Critically Strikes enemies below 40% Health, dealing 15% increased damage.",
    "image": "4645_shadowflame.png"
  },
  {
    "id": "224646",
    "name": "Stormsurge",
    "stats": [
      "SpellDamage",
      "GoldPer",
      "NonbootsMovement",
      "MagicPenetration"
    ],
    "description": "90 Ability Power 15 Magic Penetration 4% Move SpeedStormraiderDealing 25% of a champion's maximum Health within 2.5s applies Squall to them and grants 25% Move Speed for 1.5 seconds.SquallAfter 2 seconds, deal magic damage. If the target dies before Squall triggers, it damages nearby enemies and you gain 25% Move Speed for 1.5 seconds.",
    "image": "4646_stormsurge.png"
  },
  {
    "id": "226035",
    "name": "Silvermere Dawn",
    "stats": [
      "Health",
      "SpellBlock",
      "Damage",
      "Active",
      "Tenacity"
    ],
    "description": "40 Attack Damage 300 Health 40 Magic Resist Active - Quicksilver: Remove all crowd control debuffs and gain Tenacity and Slow Resistance.",
    "image": "6035_fighter_t3_silvermeredawn.png"
  },
  {
    "id": "226333",
    "name": "Death's Dance",
    "stats": [
      "Armor",
      "Damage",
      "AbilityHaste"
    ],
    "description": "60 Attack Damage 10 Ability Haste 45 ArmorIgnore PainDamage taken is dealt to you over time instead.DefyChampion takedowns cleanse Ignore Pain's remaining damage pool and restore Health over time.",
    "image": "6333_fighter_t3_deathsdance.png"
  },
  {
    "id": "226609",
    "name": "Chempunk Chainsword",
    "stats": [
      "Health",
      "Damage",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "45 Attack Damage 450 Health 15 Ability HasteHackshornDealing physical damage applies 40% Grievous Wounds to enemy champions for 3 seconds.If an enemy heals for more than 60% of their maximum health while continously affected by Grievous Wounds, it is increased to 80% Grievous Wounds.Grievous Wounds reduces the effectiveness of Healing and Regeneration effects.",
    "image": "6609_fighter_t3_chempunkchainsword.png"
  },
  {
    "id": "226610",
    "name": "Sundered Sky",
    "stats": [
      "Health",
      "Damage",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "40 Attack Damage 350 Health 10 Ability HasteLightshield StrikeYour first Attack against a champion Critically Strikes and restores Health.",
    "image": "6610_sunderedsky.png"
  },
  {
    "id": "226616",
    "name": "Staff of Flowing Water",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "65 Ability Power 14% Heal and Shield Power 150% Base Mana Regen 15 Ability HasteRapidsHealing or Shielding an ally grants you both  Ability Power for 4 seconds.",
    "image": "default.png"
  },
  {
    "id": "226617",
    "name": "Moonstone Renewer",
    "stats": [
      "Health",
      "SpellDamage",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "35 Ability Power 200 Health 30 Ability Haste 125% Base Mana RegenStarlit GraceHealing or shielding yourself or an ally chains to the other champion, healing 20% or shielding 25% of the original amount.",
    "image": "6617_enchanter_t4_moonstonerenewer.png"
  },
  {
    "id": "226620",
    "name": "Echoes of Helia",
    "stats": [
      "Health",
      "SpellDamage",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "40 Ability Power 300 Health 30 Ability Haste 150% Base Mana RegenSoul Siphon: Damaging a champion grants a Soul Shard. Healing or Shielding an ally consumes all Soul Shards to restore Health and deals magic damage per Shard to the nearest enemy champion.",
    "image": "6620_echoes_of_helia.png"
  },
  {
    "id": "226621",
    "name": "Dawncore",
    "stats": [
      "SpellDamage",
      "ManaRegen"
    ],
    "description": "45 Ability Power 16% Heal and Shield Power 200% Base Mana RegenFirst LightGain 3% Heal and Shield Power and 10 Ability Power per 100% Base Mana Regen.",
    "image": "6621_dawncore.png"
  },
  {
    "id": "226630",
    "name": "Goredrinker",
    "stats": [
      "Health",
      "Damage",
      "Active",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "55 Attack Damage 400 Health 20 Ability Haste 10% Omnivamp Active - Thirsting Slash: Deal damage to nearby enemies. Restore Health for each champion hit.",
    "image": "6630_fighter_t4_goredrinker.png"
  },
  {
    "id": "226631",
    "name": "Stridebreaker",
    "stats": [
      "Health",
      "Damage",
      "AttackSpeed",
      "Slow",
      "NonbootsMovement"
    ],
    "description": "40 Attack Damage 15% Attack Speed 375 HealthCleaveAttacks deal physical damage to nearby enemies. Breaking ShockwaveDeal physical damage and Slow nearby enemies by 40%.Gain 40% decaying Move Speed per champion hit for 3 seconds.",
    "image": "6631_fighter_t4_stridebreaker.png"
  },
  {
    "id": "226632",
    "name": "Divine Sunderer",
    "stats": [
      "Health",
      "Damage",
      "CooldownReduction",
      "OnHit",
      "MagicPenetration",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "GeneratedTip_Item_226632_ExternalDescription",
    "image": "6632_fighter_t4_divinedevourer.png"
  },
  {
    "id": "226653",
    "name": "Liandry's Anguish",
    "stats": [
      "Health",
      "SpellDamage"
    ],
    "description": "50 Ability Power 250 HealthTormentDamaging Abilities Burn enemies for 2% max Health magic damage per second for 3 seconds.SufferingFor each second in combat with enemy champions, deal 2% bonus damage, up to 6%.",
    "image": "6653_mage_t4_liandrysanguish.png"
  },
  {
    "id": "226655",
    "name": "Luden's Companion",
    "stats": [
      "SpellDamage",
      "Mana",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "85 Ability Power 600 Mana 25 Ability HasteFireDamaging Abilities consume all the charges to deal an additional magic damage to the target and one additional nearby target per charge. If there are insufficient targets in range, for each remaining shot, repeat the damage on the primary target.",
    "image": "6655_mage_t4_ludenstempest.png"
  },
  {
    "id": "226656",
    "name": "Everfrost",
    "stats": [
      "Health",
      "SpellDamage",
      "Mana",
      "Active",
      "CooldownReduction",
      "Slow",
      "AbilityHaste"
    ],
    "description": "70 Ability Power 250 Health 600 Mana 20 Ability Haste ACTIVE  (0s)Glaciate Deal damage in a cone, Slowing enemies hit. Enemies at the center of the cone are Rooted instead.",
    "image": "6656_mage_t4_everfrost.png"
  },
  {
    "id": "226657",
    "name": "Rod of Ages",
    "stats": [
      "Health",
      "HealthRegen",
      "SpellDamage",
      "Mana",
      "ManaRegen"
    ],
    "description": "60 Ability Power 350 Health 300 ManaTimelessAfter 2 combat rounds, this item gains an additional 50 Ability Power, 300 Health, and 400 Mana, and you gain a level.EternityTaking damage from champions restores 7% of premitigation damage as Mana. Casting an ability heals for 25% of Mana spent, up to 20 Health per cast, per second.",
    "image": "6657_mage_t4_rodofages.png"
  },
  {
    "id": "226662",
    "name": "Iceborn Gauntlet",
    "stats": [
      "Health",
      "Armor",
      "CooldownReduction",
      "Slow",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "300 Health 45 Armor 10 Ability HasteSpellbladeAfter using an Ability, your next Attack deals bonus physical damage  On-Hit and creates a frost field for 2s that Slows.",
    "image": "6662_tank_t3_iceborngauntlet.png"
  },
  {
    "id": "226664",
    "name": "Hollow Radiance",
    "stats": [
      "Health",
      "SpellBlock",
      "Aura",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "450 Health 40 Magic Resist 10 Ability HasteImmolateAfter taking or dealing damage, deal magic damage per second to nearby enemies for 3 seconds. DesolateKilling an enemy deals magic damage around them.",
    "image": "6664_tank_t4_acceleratedchemtank.png"
  },
  {
    "id": "226665",
    "name": "Jak'Sho, The Protean",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "MagicResist"
    ],
    "description": "350 Health 35 Armor 35 Magic ResistVoidborn ResilienceAfter 5 seconds of champion combat, increase your bonus Armor and Magic Resist by 40% until end of combat.",
    "image": "6665_tank_t4_jakshotheprotean.png"
  },
  {
    "id": "226667",
    "name": "Radiant Virtue",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "Aura",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "350 Health 30 Armor 30 Magic Resist 10 Ability HasteGuiding Light: Upon casting your Ultimate you Transcend, increasing your Max Health by 12.5% for 9s. While Transcended you and allies within 1200 range of you heal for 10% of your max Health over the duration (90 (0s)).Mythic Passive: Grants all other Legendary items  75 Health.",
    "image": "6667_tank_t4_radiantvirtue.png"
  },
  {
    "id": "226671",
    "name": "Galeforce",
    "stats": [
      "Damage",
      "CriticalStrike",
      "AttackSpeed",
      "Active",
      "NonbootsMovement"
    ],
    "description": "50 Attack Damage 15% Attack Speed 20% Critical Strike Chance 7% Move SpeedMythic Passive: Grants all other Legendary items  5 Attack Damage.Maximum missile damage dealt when enemy Health is below 25%.Cloudburst's dash cannot pass through terrain. Active - Cloudburst: Dash in target direction, firing three missiles at the lowest Health enemy near your destination. Deals physical damage, increased against low Health targets.",
    "image": "6671_marksman_t4_galeforce.png"
  },
  {
    "id": "226672",
    "name": "Kraken Slayer",
    "stats": [
      "Damage",
      "AttackSpeed",
      "OnHit",
      "NonbootsMovement"
    ],
    "description": "40 Attack Damage 35% Attack Speed 7% Move SpeedBring It DownEvery third Attack deals bonus physical damage  On-Hit, increased based on their missing Health.",
    "image": "6672_marksman_t4_behemothslayer.png"
  },
  {
    "id": "226673",
    "name": "Immortal Shieldbow",
    "stats": [
      "Damage",
      "CriticalStrike"
    ],
    "description": "55 Attack Damage 25% Critical Strike ChanceLifelineTaking damage that would reduce your Health below 30% grants a Shield for 3 seconds.",
    "image": "6673_marksman_t4_crimsonshieldbow.png"
  },
  {
    "id": "226675",
    "name": "Navori Flickerblades",
    "stats": [
      "CriticalStrike",
      "AttackSpeed",
      "NonbootsMovement"
    ],
    "description": "35% Attack Speed 25% Critical Strike Chance 4% Move SpeedTranscendenceYour Attacks reduce your non-Ultimate Ability cooldowns by 15% of their remaining cooldown.",
    "image": "6675_navoriflickerblade.png"
  },
  {
    "id": "226676",
    "name": "The Collector",
    "stats": [
      "Damage",
      "CriticalStrike",
      "ArmorPenetration"
    ],
    "description": "45 Attack Damage 12 Lethality 25% Critical Strike ChanceDeathYour damage executes champions that are below 5% Health.TaxesChampion kills grant 125 bonus gold.",
    "image": "6676_marksman_t3_thecollector.png"
  },
  {
    "id": "226691",
    "name": "Duskblade of Draktharr",
    "stats": [
      "Damage",
      "Stealth",
      "CooldownReduction",
      "Slow",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "60 Attack Damage 18 Lethality 15 Ability HasteNightstalker: Your Abilities deal up to an additional 16% damage based on the target's missing health. When a champion that you have damaged within the last 3 seconds dies, you become Untargetable from non-structures for 1.5 seconds (30 (0s)) until your next action.Mythic Passive: Grants all other Legendary items  5 Ability Haste and  5 Move Speed.",
    "image": "6691_assassin_t4_duskbladeofdraktharr.png"
  },
  {
    "id": "226692",
    "name": "Eclipse",
    "stats": [
      "Damage",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "50 Attack Damage 10 Ability HasteEver Rising MoonHitting a champion with 2 separate Attacks or Abilities within 2 seconds grants you a Shield for 2 seconds.",
    "image": "6692_assassin_t4_eclipse.png"
  },
  {
    "id": "226693",
    "name": "Prowler's Claw",
    "stats": [
      "Damage",
      "CooldownReduction",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "55 Attack Damage 22 Lethality 15 Ability HasteSandswipeDash through target enemy, dealing a part of the target's maximum Health as bonus Physical Damage. For the next 3 seconds, you deal increased damage to the target.",
    "image": "6693_assassin_t4_prowlersclaw.png"
  },
  {
    "id": "226694",
    "name": "Serylda's Grudge",
    "stats": [
      "Damage",
      "CooldownReduction",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "40 Attack Damage 40% Armor Penetration 10 Ability HasteBitter ColdDamaging Abilities Slow enemies below 50% Health by 30% for 1 second.",
    "image": "6694_assasin_t3_seryldasgrudge.png"
  },
  {
    "id": "226695",
    "name": "Serpent's Fang",
    "stats": [
      "Damage",
      "ArmorPenetration"
    ],
    "description": "55 Attack Damage 19 LethalityShield ReaverDealing damage to an enemy champion reduces any shields they gain. When you damage an enemy who is unaffected by Shield Reaver, reduce all shields on them.Item performance differs for  melee and  ranged users.",
    "image": "6695_assassin_t3_serpentsfang.png"
  },
  {
    "id": "226696",
    "name": "Axiom Arc",
    "stats": [
      "Damage",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "45 Attack Damage 18 Lethality 20 Ability HasteApophthegmYour Ultimate Abilities deal 20% increased damage.",
    "image": "6696_axiomarc.png"
  },
  {
    "id": "226697",
    "name": "Hubris",
    "stats": [
      "Damage",
      "Active",
      "CooldownReduction",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "50 Attack Damage 18 Lethality 10 Ability HasteEminenceWhen a champion that you have damaged with the last 3 seconds dies, gain 15 Attack Damage for the rest of the round, or until slain. Eminence's Attack Damage is permanently increased by 2 each time this triggers.",
    "image": "6697_hubris.png"
  },
  {
    "id": "226698",
    "name": "Profane Hydra",
    "stats": [
      "Damage",
      "Active",
      "CooldownReduction",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "50 Attack Damage 18 Lethality 15 Ability HasteCleaveAttacks deal physical damage to nearby enemies. Heretical Cleave  (0s)Deal  physical damage around you.",
    "image": "6698_profanehydra.png"
  },
  {
    "id": "226699",
    "name": "Voltaic Cyclosword",
    "stats": [
      "Damage",
      "Active",
      "CooldownReduction",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "50 Attack Damage 18 Lethality 20 Ability HasteGalvanizeDashes and Stealth stack Energized 75% faster.FirmamentYour Energized Attack deals bonus physical damage and Slows for 0.75 seconds.",
    "image": "6699_voltaiccyclosword.png"
  },
  {
    "id": "226701",
    "name": "Opportunity",
    "stats": [
      "Damage",
      "Active",
      "NonbootsMovement",
      "ArmorPenetration"
    ],
    "description": "50 Attack Damage 15 LethalityPreparationAfter being out of combat with Champions for 8 seconds gain Lethality. This Lethality lasts for 3 seconds after dealing damage to champions.ExtractionWhen a champion that you damaged within 3 seconds dies, gain 200 decaying Move Speed for 1.5 seconds.",
    "image": "6701_opportunity.png"
  },
  {
    "id": "228001",
    "name": "Anathema's Chains",
    "stats": [
      "Health",
      "Active",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "650 Health 20 Ability HasteVendetta:Take reduced damage against your Nemesis. They have reduced Tenacity while near you.Active can be cast at global range.\"She swore to dedicate her life to his destruction...\" Active - Vow: Choose a Nemesis (90s).",
    "image": "8001_tank_t3_anathemaschains.png"
  },
  {
    "id": "228002",
    "name": "Wooglet's Witchcap",
    "stats": [
      "Armor",
      "SpellDamage",
      "Active"
    ],
    "description": "300 Ability Power 50 Armor 20 Ability HasteMagical OpusIncreases your total Ability Power by 50%.Requires Augment: Quest: Wooglet's Witchcap Time StopEnter Stasis for 2.5 seconds.",
    "image": "3385_forge_wooglets_witchcap.png"
  },
  {
    "id": "228003",
    "name": "Deathblade",
    "stats": [
      "Damage",
      "CriticalStrike",
      "ArmorPenetration"
    ],
    "description": "150 Attack Damage 20% Critical Strike Chance 45% Critical Strike Damage 20 LethalityDeath and Taxes: Dealing damage that would leave an enemy champion below 7% Health executes them. Champion kills grant an additional 250 gold and heal you for 30% of the targets max health.",
    "image": "1035_alll_t1_emberknife.png"
  },
  {
    "id": "228004",
    "name": "Adaptive Helm",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "MagicResist"
    ],
    "description": "800 Health 50 Armor 100 Magic ResistVoidborn Resilience: For each second in champion combat gain a stack granting 2 Armor and Magic Resist, up to 8 stacks max. At max stacks become empowered, instantly draining enemies around you for magic damage (healing you for the same amount), and increasing your bonus resists by 20% until end of combat. The drain repeats every 4s as long as you stay in combat.Absorb: Taking magic damage from enemy Champions grants a stack of Steadfast (max 8) for 7 seconds. Enemy Immobilizing effects grant an additional 2 stacks.Dissipate: While at 8 stacks of Steadfast, gain 50 Magic Resist and 14% increased Move Speed.One spell can add a new stack of Steadfast every 1 second.",
    "image": "default.png"
  },
  {
    "id": "228005",
    "name": "Obsidian Cleaver",
    "stats": [
      "Health",
      "Damage",
      "CooldownReduction",
      "OnHit",
      "NonbootsMovement",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "70 Attack Damage 700 Health 40 Ability HasteCarveDealing physical damage to champions reduces their Armor by 7% for 0.1 seconds. (stacks 5 times).FervorDealing physical damage grants 20 Move Speed for 2 seconds.",
    "image": "3380_the_forge_cleaver.png"
  },
  {
    "id": "228006",
    "name": "Sanguine Blade",
    "stats": [
      "Damage",
      "LifeSteal",
      "CooldownReduction",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "130 Attack Damage 40% Attack Speed 15 Ability Haste 30% Life StealCleaveAttacks deal physical damage to nearby enemies. Ravenous CrescentDeal physical damage to enemies around you. Your Life Steal applies to this damage.",
    "image": "3181_sanguineblade.png"
  },
  {
    "id": "228008",
    "name": "Runeglaive",
    "stats": [
      "Health",
      "Damage",
      "AttackSpeed",
      "CooldownReduction",
      "OnHit",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "65 Attack Damage 85 Ability Power 30% Attack Speed 25 Ability Haste 600 Health 50 Armor 10% Move Speed 20% Critical Strike Chance",
    "image": "1402_enchantment_runeglaive.png"
  },
  {
    "id": "228020",
    "name": "Abyssal Mask",
    "stats": [
      "Health",
      "SpellBlock",
      "SpellDamage",
      "CooldownReduction",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "350 Health 50 Magic Resist 15 Ability HasteUnmakeNearby enemy champions take 12% more magic damage.",
    "image": "8020_tank_t3_abyssalmask.png"
  },
  {
    "id": "322065",
    "name": "Shurelya's Battlesong",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "Active",
      "CooldownReduction",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "65 Ability Power 15 Ability Haste 6% Move Speed 150% Base Mana Regen Inspiring SpeechGrant nearby allies 30% Move Speed for 4 seconds.",
    "image": "2065_tank_t4_shurelyasbattlesong.png"
  },
  {
    "id": "323002",
    "name": "Trailblazer",
    "stats": [
      "Health",
      "Armor",
      "NonbootsMovement"
    ],
    "description": "300 Health 45 Armor 6% Move SpeedLead the WayWhile moving, build up to 20 bonus Move Speed. At max speed:Create a trail that grants allied champions Move Speed equal to 15% of yours. If you are Melee, your next Attack Slows the target by 50% for 1 second.",
    "image": "3002_trailblazer.png"
  },
  {
    "id": "323003",
    "name": "Archangel's Staff",
    "stats": [
      "SpellDamage",
      "Mana",
      "AbilityHaste"
    ],
    "description": "70 Ability Power 600 Mana 25 Ability HasteAweGain Ability Power equal to 1% bonus Mana.Manaflow  (8s, max 5 charges)Landing Abilities grants 9.5 max Mana (doubled vs. champions).Transforms into Seraph's Embrace at 360 max Mana.",
    "image": "3003_mage_t3_archangelstaff.png"
  },
  {
    "id": "323004",
    "name": "Manamune",
    "stats": [
      "Damage",
      "Mana",
      "CooldownReduction",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "35 Attack Damage 500 Mana 15 Ability HasteAweGain  bonus Attack Damage.Manaflow  (8s, max 4 charges)Landing Attacks and Abilities grants 6.5 max Mana (doubled vs. champions).Transforms into Muramana at 360 max Mana.",
    "image": "3004_marksman_t3_manamune.png"
  },
  {
    "id": "323040",
    "name": "Seraph's Embrace",
    "stats": [
      "SpellDamage",
      "Mana",
      "AbilityHaste"
    ],
    "description": "70 Ability Power 1000 Mana 25 Ability HasteAweGain  Ability Power.Lifeline  (0s)Taking damage that would reduce your Health below 30% grants a  Shield for 3 seconds.",
    "image": "3048_mage_t3_seraphsembrace.png"
  },
  {
    "id": "323042",
    "name": "Muramana",
    "stats": [
      "Damage",
      "Mana",
      "CooldownReduction",
      "OnHit",
      "ArmorPenetration"
    ],
    "description": "35 Attack Damage 860 Mana 15 Ability HasteAweGain 2% max Mana as bonus Attack Damage.ShockAttacks against champions deal 1.2% max Mana as bonus physical damage  On-Hit. Damaging Abilities against champions deal 3% - 4% max Mana as bonus physical damage.",
    "image": "3042_marksman_t3_muramana.png"
  },
  {
    "id": "323050",
    "name": "Zeke's Convergence",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "AbilityHaste"
    ],
    "description": "350 Health 30 Armor 30 Magic Resist 10 Ability HasteFrostfire TempestCasting your Ultimate summons a storm around you for 5 seconds. The storm deals 30 magic damage per second to enemy champions and Slows them by 30%.",
    "image": "3050_enchanter_t3_zekesconvergence.png"
  },
  {
    "id": "323070",
    "name": "Tear of the Goddess",
    "stats": [
      "Mana",
      "ManaRegen"
    ],
    "description": "240 ManaManaflow  (8s, max 4 charges)Landing Abilities grants 6.5 max Mana (doubled vs. champions), up to 360.Helping HandAttacks deal an additional 5 physical damage to minions.",
    "image": "3070_all_t1_tearofthegoddess.png"
  },
  {
    "id": "323075",
    "name": "Thornmail",
    "stats": [
      "Health",
      "Armor"
    ],
    "description": "200 Health 85 ArmorThornsWhen struck by an Attack, deal magic damage to the attacker and apply 40% Wounds for 3 seconds if they are a champion.",
    "image": "3075_tank_t3_thornmail.png"
  },
  {
    "id": "323107",
    "name": "Redemption",
    "stats": [
      "Health",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "400 Health 15 Ability Haste 100% Base Mana Regen 10% Heal and Shield Power InterventionRestore 150 - 350 Health to allied units and deal 10% max Health true damage to enemy champions after 2.5 seconds.",
    "image": "3107_enchanter_t3_redemption.png"
  },
  {
    "id": "323109",
    "name": "Knight's Vow",
    "stats": [
      "Health",
      "HealthRegen",
      "Armor",
      "Aura",
      "Active",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "300 Health 50 Armor 10 Ability Haste 150% Base Health RegenSacrificeWhile near your Worthy ally, take 12% of the damage they receive and heal for 10% of the damage they deal to champions. Pledge  (0s)Designate an ally as Worthy.",
    "image": "3109_tank_t3_knightsvow.png"
  },
  {
    "id": "323110",
    "name": "Frozen Heart",
    "stats": [
      "Armor",
      "Mana",
      "Aura",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "75 Armor 500 Mana 25 Ability HasteWinter's CaressReduce the Attack Speed of nearby champions by 20%.",
    "image": "3110_tank_t3_frozenheart.png"
  },
  {
    "id": "323119",
    "name": "Winter's Approach",
    "stats": [
      "Health",
      "Mana",
      "AbilityHaste"
    ],
    "description": "550 Health 500 Mana 15 Ability HasteAweGain  Health.Manaflow  (8s, max 4 charges)Landing Attacks and Abilities grant 6.5 max Mana (doubled vs. champions).Transforms into Fimbulwinter at 360 max Mana.",
    "image": "3119_wintersapproach.png"
  },
  {
    "id": "323121",
    "name": "Fimbulwinter",
    "stats": [
      "Health",
      "Mana",
      "AbilityHaste"
    ],
    "description": "550 Health 860 Mana 15 Ability HasteAweGain  Health.Everlasting  (0s)Immobilizing or Slowing ( Melee only) an enemy champion grants a Shield for 3 seconds. The Shield is increased by 80% if more than one enemy is nearby.",
    "image": "3121_fimbulwinter.png"
  },
  {
    "id": "323190",
    "name": "Locket of the Iron Solari",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "Aura",
      "Active",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "250 Health 30 Armor 30 Magic Resist 10 Ability Haste DevotionGrant nearby allies a 200 - 360 Shield that decays over 2.5 seconds.",
    "image": "3190_enchanter_t4_locketofironsolari.png"
  },
  {
    "id": "323222",
    "name": "Mikael's Blessing",
    "stats": [
      "Health",
      "ManaRegen",
      "Active",
      "CooldownReduction",
      "Tenacity",
      "AbilityHaste"
    ],
    "description": "400 Health 100% Base Mana Regen 15% Heal and Shield Power 15 Ability Haste PurifyRemove all crowd control debuffs (excluding Airborne and Suppression) from an ally champion and restore 100 - 250 Health.",
    "image": "3222_enchanter_t3_mikaelsblessing.png"
  },
  {
    "id": "323504",
    "name": "Ardent Censer",
    "stats": [
      "AttackSpeed",
      "SpellDamage",
      "ManaRegen",
      "NonbootsMovement"
    ],
    "description": "55 Ability Power 10% Heal and Shield Power 150% Base Mana Regen 6% Move SpeedSanctifyHealing or Shielding an ally enhances you both for 6 seconds, granting 25% Attack Speed and 20 magic damage  On-Hit.",
    "image": "3504_enchanter_t3_ardentcenser.png"
  },
  {
    "id": "324005",
    "name": "Imperial Mandate",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "65 Ability Power 20 Ability Haste 150% Base Mana RegenCoordinated Fire  (0s) per targetSlowing or Immobilizing an enemy champion marks them for 5 seconds. Ally champion damage detonates the mark, dealing magic damage equal to 10% of current health.",
    "image": "4005_enchanter_t4_imperialmandate.png"
  },
  {
    "id": "326616",
    "name": "Staff of Flowing Water",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "45 Ability Power 10% Heal and Shield Power 150% Base Mana Regen 15 Ability HasteRapidsHealing or Shielding an ally grants you both 45 Ability Power for 6 seconds.",
    "image": "3744_enchanter_t3_staffofflowingwater.png"
  },
  {
    "id": "326617",
    "name": "Moonstone Renewer",
    "stats": [
      "Health",
      "SpellDamage",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "35 Ability Power 400 Health 20 Ability Haste 150% Base Mana RegenStarlit GraceHealing or shielding an ally chains the effect to another ally (excluding yourself), healing 30% or shielding 35% of the original amount.",
    "image": "6617_enchanter_t4_moonstonerenewer.png"
  },
  {
    "id": "326620",
    "name": "Echoes of Helia",
    "stats": [
      "Health",
      "SpellDamage",
      "ManaRegen",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "35 Ability Power 250 Health 20 Ability Haste 150% Base Mana RegenSoul SiphonDamaging a champion grants a Soul Shard, up to 2. Healing or Shielding an ally consumes all Soul Shards to restore Health and deal magic damage to the nearest enemy champion per Shard.",
    "image": "6620_echoes_of_helia.png"
  },
  {
    "id": "326621",
    "name": "Dawncore",
    "stats": [
      "SpellDamage",
      "ManaRegen"
    ],
    "description": "50 Ability Power 20% Heal and Shield Power 150% Base Mana RegenFirst LightGain 2% Heal and Shield Power and 10 Ability Power per 100% Base Mana Regen.",
    "image": "6621_dawncore.png"
  },
  {
    "id": "326657",
    "name": "Rod of Ages",
    "stats": [
      "Health",
      "HealthRegen",
      "SpellDamage",
      "Mana",
      "ManaRegen"
    ],
    "description": "45 Ability Power 350 Health 500 ManaTimelessThis item gains 10 Health, 30 Mana and 3 Ability Power every 60 seconds up to 10 times. Upon reaching max stacks, gain a level.EternityTaking damage from champions restores 10% of the damage as Mana. Casting an ability heals for 25% of Mana spent.",
    "image": "6657_mage_t4_rodofages.png"
  },
  {
    "id": "328020",
    "name": "Abyssal Mask",
    "stats": [
      "Health",
      "SpellBlock",
      "CooldownReduction",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "350 Health 50 Magic Resist 15 Ability HasteUnmakeNearby enemy champions take 12% more magic damage.",
    "image": "8020_tank_t3_abyssalmask.png"
  },
  {
    "id": "443054",
    "name": "Darksteel Talons",
    "stats": [
      "Armor",
      "AttackSpeed",
      "NonbootsMovement"
    ],
    "description": "50% Attack Speed 55 Armor 5% Move SpeedGashAttacks apply  true damage on hit.",
    "image": "3054_silversteeltalons.png"
  },
  {
    "id": "443055",
    "name": "Fulmination",
    "stats": [
      "Damage",
      "AttackSpeed",
      "NonbootsMovement"
    ],
    "description": "55 Attack Damage 45% Attack Speed 15% Move SpeedPolarityOn Attack, if the target is different from the target you most recently triggered an Energized Attack on, ready Energize. DynamoEnergized Attacks deal an additional magic damage based on the Target's Current Health.",
    "image": "3055_fulmination.png"
  },
  {
    "id": "443056",
    "name": "Demon King's Crown",
    "stats": [
      "Health",
      "Armor",
      "Damage",
      "AttackSpeed",
      "SpellDamage",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "SupremacyIncreases your Health, Armor, Magic Resist, Attack Damage, Ability Power, Attack Speed, and Ability Haste by 26%, increased by 0% per round win and -3% each round lost after acquiring this item.",
    "image": "3056_demonkingscrown.png"
  },
  {
    "id": "443058",
    "name": "Shield of Molten Stone",
    "stats": [
      "Health",
      "Armor"
    ],
    "description": "300 Health 100 ArmorImmovable as the EarthIncrease your armor by 20%, and gain Block Chance based on your Armor.",
    "image": "3058_shieldofmoltenstone.png"
  },
  {
    "id": "443059",
    "name": "Cloak of Starry Night",
    "stats": [
      "Health",
      "SpellBlock"
    ],
    "description": "300 Health 100 Magic ResistLimitless as the StarsIncrease your Magic Resist by 20%. Reduce all damage you take from non-Basic Attack sources by a percentage, scaling with your Magic Resist up to a cap of 50%.",
    "image": "3059_cloakofstarrynight.png"
  },
  {
    "id": "443060",
    "name": "Sword of the Divine",
    "stats": [
      "Damage",
      "CriticalStrike",
      "SpellDamage"
    ],
    "description": "110 Adaptive Force 50% Critical Strike ChanceExcoriateEach Critical strike deals random bonus Critical Strike Damage, scaling up to 50% of your Critical Strike Chance.",
    "image": "3131_fighter_t3_swordofthedivine.png"
  },
  {
    "id": "443061",
    "name": "Force Of Entropy",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "CriticalStrike"
    ],
    "description": "900 Health 30 Ability Haste 25% Critical Strike ChanceAtrophyImmobilizing Crowd Control effects you apply roll your Critical Chance to increase their duration by 0.25 +33% seconds.",
    "image": "3061_forceofentropy.png"
  },
  {
    "id": "443062",
    "name": "Sanguine Gift",
    "stats": [
      "SpellDamage",
      "SpellVamp",
      "AbilityHaste"
    ],
    "description": "80 Ability Power 20 Ability Haste 15% Heal and Shield PowerPatronageStore 15% of the total damage you've dealt to enemies. Whenever this exceeds 333, consume it to heal yourself and your nearest ally for that amount.",
    "image": "3062_sanguinegift.png"
  },
  {
    "id": "443063",
    "name": "Eleisa's Miracle",
    "stats": [
      "SpellBlock",
      "Armor",
      "AbilityHaste"
    ],
    "description": "50 Armor 50 Magic Resist 25 Ability HasteEnduring VitalityGain + 2.5% Heal and Shield Power per 100 Missing Health, up to 60%.",
    "image": "3063_elishasmiracle.png"
  },
  {
    "id": "443064",
    "name": "Talisman Of Ascension",
    "stats": [
      "Health",
      "SpellBlock",
      "HealthRegen",
      "Armor",
      "Damage",
      "CriticalStrike",
      "AttackSpeed",
      "LifeSteal",
      "SpellDamage",
      "Mana",
      "ManaRegen",
      "Active",
      "CooldownReduction",
      "SpellVamp",
      "NonbootsMovement",
      "MagicPenetration",
      "ArmorPenetration",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "? Attack Damage ? Attack Speed ? Critical Strike Chance ? Critical Strike Damage ?  Ability Power ? Ability Haste ? Health ?% Base Health Regen ? Mana ?% Base Mana Regen ? Armor ? Magic Resist ? || ?% Lethality and Armor Penetration ? || ?% Magic Penetration ?% Lifesteal ?% Omnivamp ? || ?% Move Speed ?% Heal and Shield Power ACTIVEImbricate Re-roll the stats on Talisman of Ascension. Each time you do so, the stats get stronger.  Twice Per Round (Thrice with Apex Inventor).",
    "image": "3064_talismanofascension.png"
  },
  {
    "id": "443069",
    "name": "Hamstringer",
    "stats": [
      "Damage",
      "CriticalStrike",
      "AttackSpeed"
    ],
    "description": "45 Attack Damage 40% Attack Speed 25% Critical Strike ChanceScourOn Critical Strike: Apply a bleed, dealing 25% of the damage done +  physical damage on hit over 2 seconds. This effect stacks any number of times. Apply a 7% Slow for 2 seconds. This effect stacks up to 35%.",
    "image": "3069_hamstringer.png"
  },
  {
    "id": "443079",
    "name": "Turbo Chemtank",
    "stats": [
      "Health",
      "Active",
      "NonbootsMovement"
    ],
    "description": "600 Health 80 Adaptive Force ACTIVE  (0s)SuperchargedRemove all crowd control debuffs (excluding Airborne) and become Unstoppable for 3 seconds.",
    "image": "6664_tank_t4_acceleratedchemtank.png"
  },
  {
    "id": "443080",
    "name": "Twin Mask",
    "stats": [
      "Health",
      "Armor",
      "Damage",
      "AttackSpeed",
      "SpellDamage",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "UnanimityGain a percent of your teammate's Health, Armor, Magic Resist, Attack Damage, Ability Power, Attack Speed, and Ability Haste, increased significantly if they also have Twin Mask and are alive.",
    "image": "443080_twinmasks.png"
  },
  {
    "id": "443081",
    "name": "Hexbolt Companion",
    "stats": [
      "Health",
      "AttackSpeed"
    ],
    "description": "75% Attack Speed 500 HealthCovering FireWhile near an allied champion,  On-Hit gain a stack of Edict, At 1 stacks, the next time you would apply an  On-Hit, your teammate also fires a bolt at the target, dealing  physical damage and applying their  On-Hit effects.Covering Fire cannot trigger other Covering Fire.",
    "image": "443081_hexboltcompanion.png"
  },
  {
    "id": "443083",
    "name": "Warmog's Armor",
    "stats": [
      "Health",
      "HealthRegen",
      "NonbootsMovement"
    ],
    "description": "1100 Health 4% Move SpeedWarmog's HeartRequires 1350 bonus Health.Restore  Health per second. If you have not taken damage within 4 seconds, restore an additional  Health per second.",
    "image": "3083_tank_t3_warmogs.png"
  },
  {
    "id": "443090",
    "name": "Reaper's Toll",
    "stats": [
      "Damage",
      "AttackSpeed",
      "SpellDamage",
      "OnHit",
      "NonbootsMovement"
    ],
    "description": "40 Adaptive Force 50% Attack Speed 5% Move SpeedSowIncrease your Attack Speed from all sources by 15%.Reap On-Hit, deal max Health true damage, and reduce their Max Health by the damage dealt for the rest of the round. Consecutive hits against the same enemy increase this amount by 0.1%.",
    "image": "443090_reaperstoll.png"
  },
  {
    "id": "443193",
    "name": "Gargoyle Stoneplate",
    "stats": [
      "SpellBlock",
      "Armor",
      "Active",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "65 Armor 65 Magic Resist 15 Ability Haste 10% Move Speed Active - Unbreakable: Gain a Shield that decays and grow in size.",
    "image": "3193_tank_t3_gargoylestoneplate.png"
  },
  {
    "id": "444636",
    "name": "Night Harvester",
    "stats": [
      "Health",
      "SpellDamage",
      "CooldownReduction",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "90 Ability Power 300 Health 25 Ability HasteSoulrend  (0s) per championDamaging a champion with Attacks or Abilities deals an additional  magic damage and grants you 40% Move Speed for 1.5 seconds.Damaging a new champion will extend the duration of the Move Speed bonus.",
    "image": "4636_mage_t4_nightharvester.png"
  },
  {
    "id": "444637",
    "name": "Demonic Embrace",
    "stats": [
      "Health",
      "SpellDamage"
    ],
    "description": "80 Ability Power 700 HealthSinister PactGain +1.5% Ability Power and 1.5% Move Speed per 100 Missing Health, up to 45%.",
    "image": "4637_mage_t3_demonicembrace.png"
  },
  {
    "id": "444644",
    "name": "Crown of the Shattered Queen",
    "stats": [
      "Health",
      "SpellDamage",
      "Mana",
      "AbilityHaste"
    ],
    "description": "85 Ability Power 300 Health 600 Mana 25 Ability HasteSafeguardYou are Safeguarded, reducing incoming champion damage by 40%. Safeguard persists for 3 seconds after taking champion damage.  (0s). Item Cooldown is restarted when damage is taken from champions.",
    "image": "4644_crown.png"
  },
  {
    "id": "446632",
    "name": "Divine Sunderer",
    "stats": [
      "Health",
      "Damage",
      "CooldownReduction",
      "OnHit",
      "MagicPenetration",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "55 Attack Damage 350 Health 20 Ability HasteSpellbladeAfter using an Ability, your next Attack is enhanced with additional damage. If the target is a champion, also heal.",
    "image": "6632_fighter_t4_divinedevourer.png"
  },
  {
    "id": "446656",
    "name": "Everfrost",
    "stats": [
      "Health",
      "SpellDamage",
      "Mana",
      "Active",
      "CooldownReduction",
      "Slow",
      "AbilityHaste"
    ],
    "description": "100 Ability Power 250 Health 600 Mana 25 Ability Haste ACTIVE  (0s)Glaciate Deal damage in a cone, Slowing enemies hit. Enemies at the center of the cone are Rooted instead.",
    "image": "6656_mage_t4_everfrost.png"
  },
  {
    "id": "446667",
    "name": "Radiant Virtue",
    "stats": [
      "Health",
      "SpellBlock",
      "Armor",
      "Aura",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "400 Health 35 Armor 35 Magic Resist 12% Heal and Shield PowerGuiding LightUpon casting your Ultimate you Transcend, increasing your Max Health by  for 9s. While Transcended, you and allies within 1200 range of you heal for  () over the duration  (0s).",
    "image": "6667_tank_t4_radiantvirtue.png"
  },
  {
    "id": "446671",
    "name": "Galeforce",
    "stats": [
      "Damage",
      "CriticalStrike",
      "AttackSpeed",
      "Active",
      "NonbootsMovement"
    ],
    "description": "65 Attack Damage 30% Attack Speed 25% Critical Strike Chance 6% Move SpeedCloudburst II Dash in target direction over terrain, firing three missiles at the lowest Health enemy near your destination. Deals physical damage, increased against low Health targets.",
    "image": "6671_marksman_t4_galeforce.png"
  },
  {
    "id": "446691",
    "name": "Duskblade of Draktharr",
    "stats": [
      "Damage",
      "Stealth",
      "CooldownReduction",
      "Slow",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "50 Attack Damage 20 Lethality 20 Ability HasteNightstalkerYour Abilities deal up to an additional percent damage based on the target's missing health. When a champion that you have damaged within the last 3 seconds dies, you become Untargetable from non-structures for 1.5 seconds  (0s).",
    "image": "6691_assassin_t4_duskbladeofdraktharr.png"
  },
  {
    "id": "446693",
    "name": "Prowler's Claw",
    "stats": [
      "Damage",
      "CooldownReduction",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "60 Attack Damage 20 Lethality 20 Ability HasteSandswipeDash through target enemy, dealing a part of the target's maximum Health as bonus Physical Damage. For the next 3 seconds, you deal increased damage to the target.",
    "image": "6693_assassin_t4_prowlersclaw.png"
  },
  {
    "id": "447100",
    "name": "Mirage Blade",
    "stats": [
      "Damage",
      "AttackSpeed",
      "SpellDamage",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "65 Adaptive Force 60% Attack Speed 6% Move SpeedBlurOn-Hit reduce the remaining cooldowns of your Dash and Blink Abilities by 12% (reduced to 4% for Ultimates).",
    "image": "7100_mirageblade.png"
  },
  {
    "id": "447101",
    "name": "Gambler's Blade",
    "stats": [
      "AttackSpeed",
      "NonbootsMovement",
      "AbilityHaste"
    ],
    "description": "70% Attack Speed 40 Ability Haste 8% Move SpeedMoney In The BankYour Attacks and Abilities have a 12% chance to bank between 30 and 245 Gold when they hit an enemy. On Round Win, cash out. On Round Lose, lose 25% of your bank.",
    "image": "7101_gamblers_blade.png"
  },
  {
    "id": "447102",
    "name": "Reality Fracture",
    "stats": [
      "Health",
      "AttackSpeed",
      "SpellDamage"
    ],
    "description": "80 Ability Power 40% Attack Speed 300 HealthZZ'Rot  (0s)On Attack or when damaging an enemy with an ability, summon 8 Voidgrubs to Attack the target. Voidgrubs deal  magic damage and live for up to 3 seconds.When you die, spawn 6.",
    "image": "7102_realityfracture.png"
  },
  {
    "id": "447103",
    "name": "Hemomancer's Helm",
    "stats": [
      "Damage",
      "SpellVamp",
      "AbilityHaste"
    ],
    "description": "60 Attack Damage 30 Ability Haste 15% OmnivampScarlet AllegianceThreshold 30% Lifesteal/Omnivamp: Gain 500 Max Health. Drain 10% of all damage nearby enemies take.",
    "image": "7103_hemomancershelm.png"
  },
  {
    "id": "447104",
    "name": "Innervating Locket",
    "stats": [
      "Health",
      "SpellDamage",
      "AbilityHaste"
    ],
    "description": "70 Ability Power 20 Ability Haste 200 HealthFill the SoulAny Ability cast within 800 range grants you a charge.At 30 charges, gain  Shield,  Ability Power, and  Move Speed for the rest of the round.",
    "image": "3032_innervating_locket.png"
  },
  {
    "id": "447105",
    "name": "Empyrean Promise",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "AbilityHaste"
    ],
    "description": "70 Ability Power 18% Heal and Shield Power 30 Ability Haste 125% Base Mana Regen ACTIVE  (0s)VigilanceTeleport to your ally and grant  shield for 5s when landing. Can be used when Ally is downed.",
    "image": "7105_angelicpromise.png"
  },
  {
    "id": "447106",
    "name": "Dragonheart",
    "stats": [
      "Health",
      "HealthRegen",
      "Armor",
      "Damage",
      "AttackSpeed",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "Inner FlameIncreases your Health, Armor, Magic Resist, Attack Damage, Ability Power, Attack Speed, and Ability Haste by 4% per Dragon Soul you possess.Every 2 rounds, gain a Dragon Soul.If you already have every elemental soul and would gain another, an ancient power awakens within...When purchased, if it is past round 5, immediately gain 1 soul, plus 1 for every 2 rounds beyond round 5.",
    "image": "7106_dragonheart.png"
  },
  {
    "id": "447107",
    "name": "Decapitator",
    "stats": [
      "Damage",
      "AttackSpeed",
      "SpellDamage",
      "NonbootsMovement"
    ],
    "description": "80 Adaptive Force 50% Attack Speed 6% Move SpeedAttacks and Non-Ultimate Abilities grant stacks. Gain Ultimate Damage and Ultimate Ability Haste per stack.",
    "image": "7107_decapitator.png"
  },
  {
    "id": "447108",
    "name": "Runecarver",
    "stats": [
      "SpellDamage",
      "NonbootsMovement"
    ],
    "description": "80 Ability Power 20 Ability Haste 4% Move SpeedHelixMoving, attacking, and dealing damage with an ability grants 30 Energized stacks and triggers Energized Attacks if it is ready.Spiral OutOn Energized Attack, gain a Rune stack for the rest of the round. Then fire a missile at the target for each Rune stack, dealing  magic damage.",
    "image": "7108_runecarver.png"
  },
  {
    "id": "447109",
    "name": "Cruelty",
    "stats": [
      "Armor",
      "SpellDamage",
      "MagicResist"
    ],
    "description": "80 Ability Power 30 Armor 30 Magic ResistWatch Them FallOn Immobilize or Grounding an enemy champion, summon a comet above them. The comet lands after 1 second, dealing additional  magic damage in the area. This effect has a 6s cooldown per target per spell cast.",
    "image": "6035_fighter_t3_silvermeredawn.png"
  },
  {
    "id": "447110",
    "name": "Moonflair Spellblade",
    "stats": [
      "Health",
      "SpellDamage",
      "Tenacity"
    ],
    "description": "85 Ability Power 400 Health 30% TenacityRelentlessWhen you use an Ability, reset your auto attack timer and gain 90% Attack Speed for your next 2 Attacks.When you Attack, reduce your Ability Cooldowns by 0.5 seconds.",
    "image": "7110_moonflairspellblade.png"
  },
  {
    "id": "447111",
    "name": "Overlord's Bloodmail",
    "stats": [
      "Health",
      "Damage"
    ],
    "description": "40 Attack Damage 400 HealthTyrannyGain  AD equal to 3% Bonus HP.RetributionGain up to 17.5% increased AD based on your percent missing Health.",
    "image": "7111_overlordsbloodmail.png"
  },
  {
    "id": "447112",
    "name": "Flesheater",
    "stats": [
      "Damage",
      "SpellDamage",
      "MagicPenetration",
      "ArmorPenetration"
    ],
    "description": "70 Adaptive Force 500 Health 20 Ability HasteHack the MeatDealing damage shreds 3 Armor and Magic Resist for 5 seconds, stacking up to 10 times. Applying stacks has a 1 second cooldown per Ability.CannibalizeOn Champion Takedown, Heal yourself and your ally for 18% of the Target's Max Health.",
    "image": "7112_flesheater.png"
  },
  {
    "id": "447113",
    "name": "Detonation Orb",
    "stats": [
      "SpellDamage",
      "Mana",
      "MagicPenetration"
    ],
    "description": "90 Ability Power 12 Magic Penetration 600 Mana 20 Ability HasteThe BombAbility damage marks the target, storing 20% of the damage dealt (increased to 25% against Immobilized enemies). 3 seconds after you last damage the target with an ability, detonate the stored damage on them. If at any point the damage is enough to kill the target, detonate immediately.",
    "image": "7113_detonationorb.png"
  },
  {
    "id": "447114",
    "name": "Reverberation",
    "stats": [
      "Health",
      "Armor",
      "AttackSpeed",
      "OnHit",
      "MagicResist"
    ],
    "description": "35 Armor 35 Magic Resist 40% Attack SpeedReverberateAt combat start gain 50 max Health per 10% bonus Attack Speed.ResonateAttacks deal  magic damage  On-Hit.RumbleImmobilizing or Grounding an enemy champion grants 25 stacks for 10 seconds. While at 100 stacks, Immobilizing an enemy champion applies  On-Hit effects 3 times.",
    "image": "447114_reverberation.png"
  },
  {
    "id": "447115",
    "name": "Regicide",
    "stats": [
      "Damage",
      "NonbootsMovement",
      "ArmorPenetration"
    ],
    "description": "60 Attack Damage 15 Lethality 8% Move SpeedEnd the LineAt the start of each round, declare the lowest health enemy the Regent. Getting a takedown on the Regent grants you a permanent 10 Attack Damage and refreshes your Ultimate's Cooldown.",
    "image": "447115_regicide.png"
  },
  {
    "id": "447116",
    "name": "Kinkou Jitte",
    "stats": [
      "Health",
      "Damage",
      "SpellDamage",
      "AbilityHaste"
    ],
    "description": "70 Adaptive Force 400 Health 30 Ability HasteBetween the RibsYou can see weakpoints in nearby enemy champions. Dealing damage through the weakpoint deals an additional  max Health true damage and grants  Move Speed for 1.5 seconds.",
    "image": "447116_kinkoujitte.png"
  },
  {
    "id": "447118",
    "name": "Pyromancer's Cloak",
    "stats": [
      "Health",
      "Damage",
      "SpellDamage",
      "SpellVamp"
    ],
    "description": "85 Adaptive Force 400 Health 15 Ability HasteSpark (5s) CooldownAttack or Ability hits against an enemy champion Burn them for  magic damage over 3 seconds.Cleansing Flame  (0s) per championApplying a Burn to an enemy champion creates a nearby Blaze for 5 seconds. While in a Blaze, you gain  Move Speed and restore  Health per second, while enemies take  magic damage per second.The size and strength of each Blaze scale the number unique Burn sources you have.",
    "image": "447118_pyromancerscloak.png"
  },
  {
    "id": "447119",
    "name": "Lightning Rod",
    "stats": [
      "Damage",
      "AttackSpeed"
    ],
    "description": "500 Health 30 Armor 30 Magic Resist 8% Move SpeedCall LightningEvery 16 seconds, Autocast summon a stormcloud above you, which after a brief delay fires a lightning bolt, dealing  plus 10% max Health magic damage and Slowing by 30% for 2 seconds.If you are struck by the lightning, gain a  Shield for 2 seconds.Fully AutomatedYour Autocast Cooldowns are reduced by 1 seconds and benefit from your Ability Haste.Call Lighting has a minimum cooldown of 5 seconds.",
    "image": "447119_lightningrod.png"
  },
  {
    "id": "447120",
    "name": "Diamond-Tipped Spear",
    "stats": [
      "Damage",
      "AttackSpeed"
    ],
    "description": "75 Adaptive Force 30% Attack SpeedReach WeaponIncrease your attack range by 75.Sweet SpotDeal up to 30% increased damage with Attacks and 40% with Abilities based on how far your target is from you. Damage caps at 1000 units.",
    "image": "447120_diamondtippedspear.png"
  },
  {
    "id": "447121",
    "name": "Twilight's Edge",
    "stats": [
      "Health",
      "Armor",
      "Damage",
      "AttackSpeed",
      "SpellDamage",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "70 Attack Damage 100 Ability PowerThe Path BetweenThreshold 130 bonus AD and 180 AP: Chakram orbit you, dealing continuous damage to enemies they strike.Spirit World: Gain Ability Power and Ability Haste.Material World: Gain Attack Damage and Attack Speed.",
    "image": "447121_twilightsedge.png"
  },
  {
    "id": "447122",
    "name": "Black Hole Gauntlet",
    "stats": [
      "SpellBlock",
      "AttackSpeed",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "900 Health 25 Ability HasteAccretion On-Hit, gain 1 stack of Accretion, and 5 stacks for immobilizing an enemy champion. These stacks last for the rest of the round, up to 50. Each stack increases your size by 2%. ACTIVE  (0s)Dark StarSummon a Black Hole that scales with your size. Slowing nearby enemies by 30% while those in the center are pulled closer and take  magic damage each second, granting you 1 stack of Accretion. The Black Hole lasts for  seconds.Increases in size every 10 stacks.",
    "image": "447122_blackholegauntlet.png"
  },
  {
    "id": "447123",
    "name": "Puppeteer",
    "stats": [
      "SpellDamage",
      "ManaRegen",
      "AbilityHaste"
    ],
    "description": "30% Attack Speed 15% Heal and Shield Power 40 Ability Haste 150% Base Mana RegenPull Their Strings Attacking a champion adds a stack for 15 seconds. At 4 stacks, Berserk them for 2 seconds. You grant Berserk enemies an additional  Attack Speed and 40% Move Speed. (25 second Cooldown).Healing, Shielding, or buffing yourself or an ally with an Ability reduces the Cooldown by 5 seconds.If only one enemy is alive, instead Fear them for the same duration.",
    "image": "447123_puppeteer.png"
  },
  {
    "id": "663039",
    "name": "Atma's Reckoning",
    "stats": [
      "Health",
      "CriticalStrike",
      "Lane"
    ],
    "description": "500 Health 20% Critical Strike ChanceBig HandsGain  0-30% Critical Strike Chance, scaling with your bonus Health.",
    "image": "3005_fighter_t3_atmasreckoning.png"
  },
  {
    "id": "663056",
    "name": "Demon King's Crown",
    "stats": [
      "Health",
      "Armor",
      "Damage",
      "AttackSpeed",
      "SpellDamage",
      "MagicResist",
      "AbilityHaste"
    ],
    "description": "SupremacyIncreases your Health, Armor, Magic Resist, Attack Damage, Ability Power, Attack Speed, and Ability Haste by 20%, increased by 0% perTakedown and -3% per Death after acquiring this item.",
    "image": "3056_demonkingscrown.png"
  },
  {
    "id": "663058",
    "name": "Shield of Molten Stone",
    "stats": [
      "Health",
      "Armor"
    ],
    "description": "250 Health 80 ArmorImmovable as the EarthIncrease your armor by 20%, and gain Block Chance based on your Armor.",
    "image": "3058_shieldofmoltenstone.png"
  },
  {
    "id": "663059",
    "name": "Cloak of Starry Night",
    "stats": [
      "Health",
      "SpellBlock"
    ],
    "description": "250 Health 60 Magic ResistLimitless as the StarsIncrease your Magic Resist by 10%. Reduce all damage you take from non-Basic Attack sources by a percentage, scaling with your Magic Resist up to a cap of 25%.",
    "image": "3059_cloakofstarrynight.png"
  },
  {
    "id": "663060",
    "name": "Sword of the Divine",
    "stats": [
      "Damage",
      "CriticalStrike",
      "SpellDamage"
    ],
    "description": "90 Adaptive Force 50% Critical Strike ChanceExcoriateEach Critical strike deals random bonus Critical Strike Damage, scaling up to 50% of your Critical Strike Chance.",
    "image": "3131_fighter_t3_swordofthedivine.png"
  },
  {
    "id": "663064",
    "name": "Veigar's Talisman of Ascension",
    "stats": [],
    "description": "Gain 100% Extra ExperienceOffers no stats, and cannot be sold......But will be worth it if you reach Level 30.",
    "image": "default.png"
  },
  {
    "id": "663146",
    "name": "Hextech Gunblade",
    "stats": [
      "Damage",
      "LifeSteal",
      "SpellDamage",
      "Active",
      "SpellVamp"
    ],
    "description": "90 Ability Power 45 Attack Damage 15% Omnivamp ACTIVE  (0s)Lightning BoltShocks the target enemy champion, dealing  magic damage and slowing them by 40% for 2 seconds.",
    "image": "3146_hextechgunblade.png"
  },
  {
    "id": "663172",
    "name": "Zephyr",
    "stats": [
      "AttackSpeed",
      "CooldownReduction",
      "OnHit",
      "NonbootsMovement",
      "Tenacity"
    ],
    "description": "40% Attack Speed 8% Move Speed 25 Ability Haste 20% TenacityLike the WindGain 5% Move Speed  On-Hit for 6 seconds, stacking up to 25% Move Speed.Tenacity reduces the duration of Stun, Slow, Taunt, Fear, Silence, Blind, Polymorph and Immobilizing effects. It has no effect on Airborne or Suppression.",
    "image": "3172_zephyr.png"
  },
  {
    "id": "663193",
    "name": "Gargoyle Stoneplate",
    "stats": [
      "SpellBlock",
      "Armor",
      "Active",
      "CooldownReduction",
      "AbilityHaste"
    ],
    "description": "55 Armor 55 Magic Resist 10 Ability Haste 8% Move Speed Active - Unbreakable: Gain a Shield that decays and grow in size.",
    "image": "3193_tank_t3_gargoylestoneplate.png"
  },
  {
    "id": "664011",
    "name": "Sword of Blossoming Dawn",
    "stats": [
      "Health",
      "SpellDamage",
      "CooldownReduction",
      "OnHit",
      "AbilityHaste"
    ],
    "description": "35 Ability Power 150 Health 10% Heal and Shield Power 10 Ability HasteEffervescenceGain + 1% Attack Speed for every  1% Heal and Shield Power you have. Peppermint On-Hit, heal the lowest health ally champion near you for , prioritizing lower health allies.",
    "image": "4011_swordofblossomingdawn.png"
  },
  {
    "id": "664403",
    "name": "The Golden Spatula",
    "stats": [
      "Health",
      "SpellBlock",
      "HealthRegen",
      "Armor",
      "Damage",
      "CriticalStrike",
      "AttackSpeed",
      "LifeSteal",
      "SpellDamage",
      "Mana",
      "ManaRegen",
      "CooldownReduction",
      "NonbootsMovement"
    ],
    "description": "90 Attack Damage 125 Ability Power 30% Attack Speed 25% Critical Strike Chance 250 Health 10 Armor 10 Magic Resist 250 Mana 20 Ability Haste 10% Life Steal 100% Base Health Regen 100% Base Mana Regen\"It must do something...Declined, it does EVERYTHING\"",
    "image": "4403_goldenspatula.png"
  },
  {
    "id": "664644",
    "name": "Crown of the Shattered Queen",
    "stats": [
      "Health",
      "SpellDamage",
      "Mana",
      "AbilityHaste"
    ],
    "description": "65 Ability Power 250 Health 600 Mana 15 Ability HasteSafeguardYou are Safeguarded, reducing incoming champion damage by 40%. Safeguard persists for 3 seconds after taking champion damage.  (0s). Item Cooldown is restarted when damage is taken from champions.",
    "image": "4644_crown.png"
  },
  {
    "id": "667101",
    "name": "Gambler's Blade",
    "stats": [
      "Damage",
      "NonbootsMovement",
      "MagicPenetration",
      "ArmorPenetration",
      "AbilityHaste"
    ],
    "description": "55 Adaptive Force 10 Ability Haste 15 Lethality 15 Magic Penetration 15% Move SpeedPlaying for TimeChampion takedowns while using Gambler's Blade delays Doom-boss Veigar's arrival by an additional 10 seconds. Deaths while carrying the Blade accelerate it by 10 seconds. (Will not lose time past the 14:30 minute mark)Double DownChampion takedowns grant a stack, each granting 10 bonus gold on kill. Also take 5% increased damage per stack. Lose all stacks on death.",
    "image": "7101_gamblers_blade.png"
  },
  {
    "id": "667109",
    "name": "Cruelty",
    "stats": [
      "Armor",
      "SpellDamage",
      "MagicResist"
    ],
    "description": "60 Ability Power 25 Armor 25 Magic ResistWatch Them FallOn Immobilize or Grounding an enemy champion, summon a comet above them. The comet lands after 1 second, dealing additional  magic damage in the area. This effect has a 6s cooldown per target per spell cast.",
    "image": "6035_fighter_t3_silvermeredawn.png"
  },
  {
    "id": "667112",
    "name": "Flesheater",
    "stats": [
      "Damage",
      "SpellDamage",
      "MagicPenetration",
      "ArmorPenetration"
    ],
    "description": "55 Adaptive Force 500 HealthHack the MeatDealing damage shreds 3 Armor and Magic Resist for 5 seconds, stacking up to 10 times. Applying stacks has a 1 second cooldown per Ability.CannibalizeOn Champion Takedown, Heal yourself and your ally for 18% of the Target's Max Health.",
    "image": "7112_flesheater.png"
  },
  {
    "id": "667666",
    "name": "The Collector",
    "stats": [
      "Damage",
      "CriticalStrike",
      "ArmorPenetration"
    ],
    "description": "50 Attack Damage 10 Lethality 25% Critical Strike ChanceDeathYour damage executes champions that are below 5% Health.TaxesChampion kills grant 25 bonus gold.",
    "image": "6676_marksman_t3_thecollector.png"
  },
  {
    "id": "994403",
    "name": "Golden Spatula",
    "stats": [
      "Health",
      "SpellBlock",
      "HealthRegen",
      "Armor",
      "Damage",
      "CriticalStrike",
      "AttackSpeed",
      "LifeSteal",
      "SpellDamage",
      "Mana",
      "ManaRegen",
      "CooldownReduction",
      "NonbootsMovement"
    ],
    "description": "60 Attack Damage 80 Ability Power 40% Attack Speed 15% Critical Strike Chance 200 Health 20 Armor 20 Magic Resist 200 Mana 20 Ability Haste 10% Move Speed 10% Life Steal 50% Base Health Regen 100% Base Mana RegenDoing SomethingYou are permanently On Fire!\"It must do something...Declined, it does EVERYTHING\"",
    "image": "4403_goldenspatula.png"
  }
];

export function getItemName(id: string): string | undefined {
  const item = items.find(i => i.id === id);
  return item?.name;
}

export function getItemImage(id: string): string | undefined {
  const item = items.find(i => i.id === id);
  // console.log("id", id, "item", item?.name);
  return item?.image;
}

export function getItemDescription(id: string): string | undefined {
  const item = items.find(i => i.id === id);
  return item?.description;
}