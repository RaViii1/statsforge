
export interface TFTItem {
  id: string;
  set_id?: number;
  name: string;
  description: string;
  image_path?: string;
  stats?: {
    hp?: number;
    ap?: number;
    ad?: number;
    armor?: number;
    mr?: number;
    as?: number;
    mana?: number;
    crit?: number;
    crit_dmg?: number;
    healing?: number;
    shield?: number;
    lifesteal?: number;
    dmgAmp?: number;
  };
  is_component?: boolean;
  is_artifact?: boolean;
  is_radiant?: boolean;
  is_seasonal?: boolean;
  created_at?: string;
  build_path?: string[]; // Array of component item IDs that build into this item
  Riot_Api_Name?: string;
}

export const itemstft: TFTItem[] = [
  {
    "id": "TFT13_Crime_Bronze_ChemGrips",
    "name": "Crime bronze chemgrips",
    "image_path": "tft13_crime_bronze_chemgrips.tft_set13.png",
    "description": "Bronze quality chemgrips."
  },
  {
    "id": "TFT13_Crime_Bronze_Mageguard",
    "name": "Crime bronze mageguard",
    "image_path": "tft13_crime_bronze_mageguard.tft_set13.png",
    "description": "Bronze quality mageguard."
  },
  {
    "id": "TFT13_Crime_Bronze_MiningGauntlet",
    "name": "Crime bronze mininggauntlet",
    "image_path": "tft13_crime_bronze_mininggauntlet.tft_set13.png",
    "description": "Bronze quality mining gauntlet."
  },
  {
    "id": "TFT13_Crime_Consumable_LesserShimmerDuplicator",
    "name": "Crime consumable lesser shimmer duplicator",
    "image_path": "tft13_crime_consumable_lessershimmerduplicator.png",
    "description": "Lesser shimmer duplicator."
  },
  {
    "id": "TFT13_Crime_Consumable_PerfectedShimmer",
    "name": "Crime consumable perfected shimmer",
    "image_path": "tft13_crime_consumable_perfectedshimmer.tft_set13.png",
    "description": "Perfected shimmer consumable."
  },
  {
    "id": "TFT13_Crime_Consumable_ShimmerDuplicator",
    "name": "Crime consumable shimmer duplicator",
    "image_path": "tft13_crime_consumable_shimmerduplicator.tft_set13.png",
    "description": "Shimmer duplicator."
  },
  {
    "id": "TFT13_Crime_Gold",
    "name": "Crime gold",
    "image_path": "tft13_crime_gold.tft_set13.png",
    "description": "Gold crime item."
  },
  {
    "id": "TFT13_Crime_Gold_DestabilizedChemtank",
    "name": "Crime gold destabilized chemtank",
    "image_path": "tft13_crime_gold_destabilizedchemtank.tft_set13.png",
    "description": "Gold quality destabilized chemtank."
  },
  {
    "id": "TFT13_Crime_Gold_ExecutionersVorpalBlade",
    "name": "Crime gold executioners vorpal blade",
    "image_path": "tft13_crime_gold_executionersvorpalblade.tft_set13.png",
    "description": "Gold quality executioner's vorpal blade."
  },
  {
    "id": "TFT13_Crime_Gold_Fleshripper",
    "name": "Crime gold fleshripper",
    "image_path": "tft13_crime_gold_fleshripper.tft_set13.png",
    "description": "Gold quality fleshripper."
  },
  {
    "id": "TFT13_Crime_Gold_PiltovenHexplating",
    "name": "Crime gold piltoven hexplating",
    "image_path": "tft13_crime_gold_piltovenhexplating.tft_set13.png",
    "description": "Gold quality piltoven hexplating."
  },
  {
    "id": "TFT13_Crime_Gold_Shimmerbloom",
    "name": "Crime gold shimmerbloom",
    "image_path": "tft13_crime_gold_shimmerbloom.tft_set13.png",
    "description": "Gold quality shimmerbloom."
  },
  {
    "id": "TFT13_Crime_Gold_UnleashedToxins",
    "name": "Crime gold unleashed toxins",
    "image_path": "tft13_crime_gold_unleashedtoxins.tft_set13.png",
    "description": "Gold quality unleashed toxins."
  },
  {
    "id": "TFT13_Crime_Gold_VirulentVirus",
    "name": "Crime gold virulent virus",
    "image_path": "tft13_crime_gold_virulentvirus.tft_set13.png",
    "description": "Gold quality virulent virus."
  },
  {
    "id": "TFT13_Crime_Gold_VoltaicSaber",
    "name": "Crime gold voltaic saber",
    "image_path": "tft13_crime_gold_voltaicsaber.tft_set13.png",
    "description": "Gold quality voltaic saber."
  },
  {
    "id": "TFT13_Crime_OmegaPrismatic_DimensionalHeirloom",
    "name": "Crime omegaprismatic dimensional heirloom",
    "image_path": "tft13_crime_omegaprismatic_dimensionalheirloom.tft_set13.png",
    "description": "Omega prismatic dimensional heirloom."
  },
  {
    "id": "TFT13_Crime_Prismatic_DestabilizedChemtank",
    "name": "Crime prismatic destabilized chemtank",
    "image_path": "tft13_crime_prismatic_destabilizedchemtank.tft_set13.png",
    "description": "Prismatic quality destabilized chemtank."
  },
  {
    "id": "TFT13_Crime_Prismatic_ExecutionersVorpalBlade",
    "name": "Crime prismatic executioners vorpal blade",
    "image_path": "tft13_crime_prismatic_executionersvorpalblade.tft_set13.png",
    "description": "Prismatic quality executioner's vorpal blade."
  },
  {
    "id": "TFT13_Crime_Prismatic_Fleshripper",
    "name": "Crime prismatic fleshripper",
    "image_path": "tft13_crime_prismatic_fleshripper.tft_set13.png",
    "description": "Prismatic quality fleshripper."
  },
  {
    "id": "TFT13_Crime_Prismatic_PiltovenHexplating",
    "name": "Crime prismatic piltoven hexplating",
    "image_path": "tft13_crime_prismatic_piltovenhexplating.tft_set13.png",
    "description": "Prismatic quality piltoven hexplating."
  },
  {
    "id": "TFT13_Crime_Prismatic_Shimmerbloom",
    "name": "Crime prismatic shimmerbloom",
    "image_path": "tft13_crime_prismatic_shimmerbloom.tft_set13.png",
    "description": "Prismatic quality shimmerbloom."
  },
  {
    "id": "TFT13_Crime_Prismatic_UnleashedToxins",
    "name": "Crime prismatic unleashed toxins",
    "image_path": "tft13_crime_prismatic_unleashedtoxins.tft_set13.png",
    "description": "Prismatic quality unleashed toxins."
  },
  {
    "id": "TFT13_Crime_Prismatic_VirulentVirus",
    "name": "Crime prismatic virulent virus",
    "image_path": "tft13_crime_prismatic_virulentvirus.tft_set13.png",
    "description": "Prismatic quality virulent virus."
  },
  {
    "id": "TFT13_Crime_Prismatic_VoltaicSaber",
    "name": "Crime prismatic voltaic saber",
    "image_path": "tft13_crime_prismatic_voltaicsaber.tft_set13.png",
    "description": "Prismatic quality voltaic saber."
  },
  {
    "id": "TFT13_Crime_Silver_DestabilizedChemtank",
    "name": "Crime silver destabilized chemtank",
    "image_path": "tft13_crime_silver_destabilizedchemtank.tft_set13.png",
    "description": "Silver quality destabilized chemtank."
  },
  {
    "id": "TFT13_Crime_Silver_ExecutionersVorpalBlade",
    "name": "Crime silver executioners vorpal blade",
    "image_path": "tft13_crime_silver_executionersvorpalblade.tft_set13.png",
    "description": "Silver quality executioner's vorpal blade."
  },
  {
    "id": "TFT13_Crime_Silver_Fleshripper",
    "name": "Crime silver fleshripper",
    "image_path": "tft13_crime_silver_fleshripper.tft_set13.png",
    "description": "Silver quality fleshripper."
  },
  {
    "id": "TFT13_Crime_Silver_PiltovenHexplating",
    "name": "Crime silver piltoven hexplating",
    "image_path": "tft13_crime_silver_piltovenhexplating.tft_set13.png",
    "description": "Silver quality piltoven hexplating."
  },
  {
    "id": "TFT13_Crime_Silver_Shimmerbloom",
    "name": "Crime silver shimmerbloom",
    "image_path": "tft13_crime_silver_shimmerbloom.tft_set13.png",
    "description": "Silver quality shimmerbloom."
  },
  {
    "id": "TFT13_Crime_Silver_UnleashedToxins",
    "name": "Crime silver unleashed toxins",
    "image_path": "tft13_crime_silver_unleashedtoxins.tft_set13.png",
    "description": "Silver quality unleashed toxins."
  },
  {
    "id": "TFT13_Crime_Silver_VirulentVirus",
    "name": "Crime silver virulent virus",
    "image_path": "tft13_crime_silver_virulentvirus.tft_set13.png",
    "description": "Silver quality virulent virus."
  },
  {
    "id": "TFT13_Crime_Silver_VoltaicSaber",
    "name": "Crime silver voltaic saber",
    "image_path": "tft13_crime_silver_voltaicsaber.tft_set13.png",
    "description": "Silver quality voltaic saber."
  },
  {
    "id": "TFT13_Goopbuff_Miniaturize_Item",
    "name": "Goopbuff miniaturize item",
    "image_path": "tft13_goopbuff_miniaturize_item.tft_set13.png",
    "description": "Goopbuff miniaturize item."
  },
  {
    "id": "TFT13_Item_Crime_ArmoryCashout",
    "name": "Crime armory cashout",
    "image_path": "tft13_item_crime_armorycashout.tft_set13.png",
    "description": "Crime armory cashout item."
  },
  {
    "id": "TFT13_Item_Crime_ArmoryContinue",
    "name": "Crime armory continue",
    "image_path": "tft13_item_crime_armorycontinue.tft_set13.png",
    "description": "Crime armory continue item."
  },
  {
    "id": "TFT13_Item_SquadStolenItem",
    "name": "Squad stolen item",
    "image_path": "tft13_item_squadstolenitem.tft_set13.png",
    "description": "Squad stolen item."
  },
  {
    "id": "TFT14_Consumable_Salvager",
    "name": "Consumable salvager",
    "image_path": "tft14_consumable_salvager.tft14_hacks_batch2.png",
    "description": "Consumable salvager item."
  },
  {
    "id": "TFT14_Consumable_SizeUp",
    "name": "Consumable size up",
    "image_path": "tft14_consumable_sizeup.tft14_hacks_batch2.png",
    "description": "Consumable size up item."
  },
  {
    "id": "TFT14_Consumable_SpeedUp",
    "name": "Consumable speed up",
    "image_path": "tft14_consumable_speedup.tft14_hacks_batch2.png",
    "description": "Consumable speed up item."
  },
  {
    "id": "TFT15_CrystalRoseHellion_ItemIcon",
    "name": "Crystal rose hellion",
    "image_path": "tft15_crystalrosehellion_itemicon.tft_set15.png",
    "description": "Crystal rose hellion item."
  },
  {
    "id": "TFT15_Ravenous_LightSnack",
    "name": "Ravenous light snack",
    "image_path": "tft15_ravenous_lightsnack.tft_set15.png",
    "description": "Ravenous light snack item."
  },
  {
    "id": "TFT15_Roboranger_GalioSlicer",
    "name": "Roboranger galio slicer",
    "image_path": "tft15_roboranger_galioslicer.tft_set15.png",
    "description": "Roboranger galio slicer item."
  },
  {
    "id": "TFT15_Roboranger_GalioSword",
    "name": "Roboranger galio sword",
    "image_path": "tft15_roboranger_galiosword.tft_set15.png",
    "description": "Roboranger galio sword item."
  },
  {
    "id": "TFT15_ShieldMatrix",
    "name": "Shield matrix",
    "image_path": "tft15_shieldmatrix.tft_set15.png",
    "description": "Shield matrix item."
  },
  {
    "id": "TFT16_Artifact_EternalPact",
    "name": "Artifact eternal pact",
    "image_path": "tft16_artifact_eternalpact.tft_set16.png",
    "description": "Artifact eternal pact."
  },
  {
    "id": "TFT16_Artifact_KappaJuice",
    "name": "Artifact kappa juice",
    "image_path": "tft16_artifact_kappajuice.tft_set16.png",
    "description": "Artifact kappa juice."
  },
  {
    "id": "TFT16_Artifact_LesserMirroredPersona",
    "name": "Artifact lesser mirrored persona",
    "image_path": "tft16_artifact_lessermirroredpersona.tft_set16.png",
    "description": "Artifact lesser mirrored persona."
  },
  {
    "id": "TFT16_Artifact_MendingEchoes",
    "name": "Artifact mending echoes",
    "image_path": "tft16_artifact_mendingechoes.tft_set16.png",
    "description": "Artifact mending echoes."
  },
  {
    "id": "TFT16_Artifact_MirroredPersona",
    "name": "Artifact mirrored persona",
    "image_path": "tft16_artifact_mirroredpersona.tft_set16.png",
    "description": "Artifact mirrored persona."
  },
  {
    "id": "TFT16_Artifact_ShadowPuppet",
    "name": "Artifact shadow puppet",
    "image_path": "tft16_artifact_shadowpuppet.tft_set16.png",
    "description": "Artifact shadow puppet."
  },
  {
    "id": "TFT16_Artifact_VoidGauntlet",
    "name": "Artifact void gauntlet",
    "image_path": "tft16_artifact_voidgauntlet.tft_set16.png",
    "description": "Artifact void gauntlet."
  },
  {
    "id": "TFT16_CarouselOfChaos_TimeUndiltor",
    "name": "Carousel of chaos time undiltor",
    "image_path": "tft16_carouselofchaos_timeundiltor.tft_set16_carouselofchaos.png",
    "description": "Carousel of chaos time undiltor."
  },
  {
    "id": "TFT16_Consumable_GwensScissors",
    "name": "Consumable gwens scissors",
    "image_path": "tft16_consumable_gwensscissors.tft_set16.png",
    "description": "Gwen's scissors consumable."
  },
  {
    "id": "TFT16_TheDarkinAegis",
    "name": "The Darkin Aegis",
    "image_path": "tft16_thedarkinaegis.tft_set16.png",
    "description": "A powerful Darkin shield."
  },
  {
    "id": "TFT16_TheDarkinBow",
    "name": "The Darkin Bow",
    "image_path": "tft16_thedarkinbow.tft_set16.png",
    "description": "A powerful Darkin bow."
  },
  {
    "id": "TFT16_TheDarkinScythe",
    "name": "The Darkin Scythe",
    "image_path": "tft16_thedarkinscythe.tft_set16.png",
    "description": "A powerful Darkin weapon."
  },
  {
    "id": "TFT16_TheDarkinStaff",
    "name": "The Darkin Staff",
    "image_path": "tft16_thedarkinstaff.tft_set16.png",
    "description": "A powerful Darkin staff."
  },
  {
    "id": "TFT16_VoidMutation_AdrenalineModules",
    "name": "Void mutation adrenaline modules",
    "image_path": "tft16_voidmutation_adrenalinemodules.tft_set16.png",
    "description": "Void mutation: Adrenaline modules."
  },
  {
    "id": "TFT4_Item_OrnnAnimaVisage",
    "name": "Anima Visage",
    "image_path": "tft4_item_ornnanimavisage.tft_set13.png",
    "description": "Regenerate 2.5% maximum Health each second."
  },
  {
    "id": "TFT4_Item_OrnnDeathsDefiance",
    "name": "Death's Defiance",
    "image_path": "tft4_item_ornndeathsdefiance.tft_set13.png",
    "description": "50% of damage taken is instead dealt over 4 seconds as non-lethal damage."
  },
  {
    "id": "TFT4_Item_OrnnEternalWinter",
    "name": "Eternal Winter",
    "image_path": "tft4_item_ornneternalwinter.tft_set13.png",
    "description": "Enemies who damage the wearer are Chilled for 2 seconds. After being Chilled 7 times, the attacker is Frozen instead."
  },
    {
    "id": "TFT_Item_FrozenHeart",
    "name": "Protector's Vow",
    "image_path": "tft_item_frozenheart.tft_set13.png",
    "description": "Combat Start: Gain 20 Mana. At 40% Health, gain 15 Mana and a Shield equal to 20% max Health."
  },
      {
    "id": "TFT_Item_FrozenHeartRadiant",
    "name": "Radiant Protector's Vow",
    "image_path": "tft5_item_frozenheartradiant.tft_set13.png",
    "description": "Combat Start: Gain 40 Mana. At 40% Health, gain 30 Mana and a Shield equal to 40% max Health."
  },
    {
    "id": "TFT_Item_Artifact_AegisOfDusk",
    "name": "Aegis of Dusk",
    "image_path": "tft_item_artifact_aegisofdusk.tft_set16.png",
    "description": "Every 2.5 seconds, steal 5 Magic Resist from enemies within 1 hex and deal 15 of the holder's Magic Resist as magic damage."
  },
    {
    "id": "TFT_Item_Artifact_AegisOfDawn",
    "name": "Aegis of Dawn",
    "image_path": "tft_item_artifact_aegisofdawn.tft_set16.png",
    "description": "Every 2.5 seconds, steal 5 Armor from enemies within 1-hex and heal 15 of the holder's Armor."
  },
      {
    "id": "TFT_Item_EmptyBag",
    "name": "Empty Bag",
    "image_path": "tft_item_emptybag.tft_set13.png",
    "description": ""
  },

  {
    "id": "TFT4_Item_OrnnInfinityForce",
    "name": "Infinity Force",
    "image_path": "tft4_item_ornninfinityforce.tft_set13.png",
    "description": "Tons of Stats!"
  },
  {
    "id": "TFT4_Item_OrnnMuramana",
    "name": "Manazane",
    "image_path": "tft4_item_ornnmuramana.tft_set13.png",
    "description": "After casting the first time each combat, restore 120 Mana over 5 seconds."
  },
  {
    "id": "TFT4_Item_OrnnObsidianCleaver",
    "name": "Obsidian Cleaver",
    "image_path": "tft4_item_ornnobsidiancleaver.tft_set13.png",
    "description": "Attacks and abilities shred 30% Armor and Magic Resist for 5 seconds."
  },
  {
    "id": "TFT4_Item_OrnnRanduinsSanctum",
    "name": "Randuin's Omen",
    "image_path": "tft4_item_ornnranduinssanctum.tft_set13.png",
    "description": "At the start of combat, grant 40 Armor and 40 Magic Resistance to the wearer and adjacent allies."
  },
  {
    "id": "TFT4_Item_OrnnTheCollector",
    "name": "The Collector",
    "image_path": "tft4_item_ornnthecollector.tft_set13.png",
    "description": "Executes enemies below 12% Health. Executions grant 1 gold."
  },
  {
    "id": "TFT4_Item_OrnnZhonyasParadox",
    "name": "Zhonya's Paradox",
    "image_path": "tft4_item_ornnzhonyasparadox.tft_set13.png",
    "description": "Once per combat at 40% Health, become invulnerable and untargetable for 3 seconds."
  },
  {
    "id": "TFT5_Item_AdaptiveHelmRadiant",
    "name": "Jak'Sho, the Protean",
    "image_path": "tft5_item_adaptivehelmradiant.tft_set13.png",
    "description": "Radiant Adaptive Helm."
  },
  {
    "id": "TFT5_Item_ArchangelsStaffRadiant",
    "name": "Urf-Angel's Staff",
    "image_path": "tft5_item_archangelsstaffradiant.tft_set13.png",
    "description": "Radiant Archangel's Staff."
  },
  {
    "id": "TFT5_Item_BloodthirsterRadiant",
    "name": "Blessed Bloodthirster",
    "image_path": "tft5_item_bloodthirsterradiant.tft_set13.png",
    "description": "Radiant Bloodthirster."
  },
  {
    "id": "TFT5_Item_BlueBuffRadiant",
    "name": "Radiant Blue Buff",
    "image_path": "tft5_item_bluebuffradiant.tft_set13.png",
    "description": "Radiant Blue Buff."
  },
    {
    "id": "TFT_Item_BlueBuff",
    "name": "Blue Buff",
    "image_path": "tft_item_bluebuff.tft_set13.png",
    "description": "Blue Buff."
  },
    {
    "id": "TFT_Item_RedBuff",
    "name": "Sunfire Cape",
    "image_path": "tft_item_redbuff.tft_set13.png",
    "description": "Gain 8% max Health. Every 2 seconds, deal 1% Burn and 33% Wound to an enemy within 2 hexes for 10 seconds."
  },
  {
    "id": "TFT5_Item_BrambleVestRadiant",
    "name": "Rosethorn Vest",
    "image_path": "tft5_item_bramblevestradiant.tft_set13.png",
    "description": "Radiant Bramble Vest."
  },
  {
    "id": "TFT5_Item_CrownguardRadiant",
    "name": "Royal Crownguard",
    "image_path": "tft5_item_crownguardradiant.tft_set13.png",
    "description": "Radiant Crownguard."
  },
  {
    "id": "TFT5_Item_DeathbladeRadiant",
    "name": "Luminous Deathblade",
    "image_path": "tft5_item_deathbladeradiant.tft_set13.png",
    "description": "Radiant Deathblade."
  },
  {
    "id": "TFT5_Item_DragonsClawRadiant",
    "name": "Dragon's Will",
    "image_path": "tft5_item_dragonsclawradiant.tft_set13.png",
    "description": "Radiant Dragon's Claw."
  },
  {
    "id": "TFT5_Item_GargoyleStoneplateRadiant",
    "name": "Dvarapala Stoneplate",
    "image_path": "tft5_item_gargoylestoneplateradiant.tft_set13.png",
    "description": "Radiant Gargoyle Stoneplate."
  },
  {
    "id": "TFT5_Item_GiantSlayerRadiant",
    "name": "Demonslayer",
    "image_path": "tft5_item_giantslayerradiant.tft_set13.png",
    "description": "Radiant Giant Slayer."
  },
  {
    "id": "TFT5_Item_GuinsoosRagebladeRadiant",
    "name": "Guinsoo's Reckoning",
    "image_path": "tft5_item_guinsoosragebladeradiant.tft_set13.png",
    "description": "Radiant Guinsoo's Rageblade."
  },
  {
    "id": "TFT5_Item_HandOfJusticeRadiant",
    "name": "Fist of Fairness",
    "image_path": "tft5_item_handofjusticeradiant.tft_set13.png",
    "description": "Radiant Hand of Justice."
  },
  {
    "id": "TFT5_Item_HextechGunbladeRadiant",
    "name": "Hextech Lifeblade",
    "image_path": "tft5_item_hextechgunbladeradiant.tft_set13.png",
    "description": "Radiant Hextech Gunblade."
  },
  {
    "id": "TFT5_Item_InfinityEdgeRadiant",
    "name": "Radiant Infinity Edge",
    "image_path": "tft5_item_infinityedgeradiant.tft_set13.png",
    "description": "Abilities can critically strike. If the holder's abilities can already critically strike, gain 10% Critical Strike "
  },
  {
    "id": "TFT5_Item_IonicSparkRadiant",
    "name": "Covalent Spark",
    "image_path": "tft5_item_ionicsparkradiant.tft_set13.png",
    "description": "Radiant Ionic Spark."
  },
  {
    "id": "TFT5_Item_JeweledGauntletRadiant",
    "name": "Glamourous Gauntlet",
    "image_path": "tft5_item_jeweledgauntletradiant.tft_set13.png",
    "description": "Radiant Jeweled Gauntlet."
  },
  {
    "id": "TFT5_Item_LastWhisperRadiant",
    "name": "Eternal Whisper",
    "image_path": "tft5_item_lastwhisperradiant.tft_set13.png",
    "description": "Radiant Last Whisper."
  },
  {
    "id": "TFT5_Item_MorellonomiconRadiant",
    "name": "Morellonomicon-ish",
    "image_path": "tft5_item_morellonomiconradiant.tft_set13.png",
    "description": "Radiant Morellonomicon."
  },
  {
    "id": "TFT5_Item_QuicksilverRadiant",
    "name": "Quickestsilver",
    "image_path": "tft5_item_quicksilverradiant.tft_set13.png",
    "description": "Radiant Quicksilver."
  },
  {
    "id": "TFT5_Item_RabadonsDeathcapRadiant",
    "name": "Rabadon's Ascended Deathcap",
    "image_path": "tft5_item_rabadonsdeathcapradiant.tft_set13.png",
    "description": "Radiant Rabadon's Deathcap."
  },
  {
    "id": "TFT5_Item_SpearOfShojinRadiant",
    "name": "Spear of Hirana",
    "image_path": "tft5_item_spearofshojinradiant.tft_set13.png",
    "description": "Radiant Spear of Shojin."
  },
  {
    "id": "TFT5_Item_StatikkShivRadiant",
    "name": "Statikk Favor",
    "image_path": "tft5_item_statikkshivradiant.tft_set13.png",
    "description": "Radiant Statikk Shiv."
  },
  {
    "id": "TFT5_Item_SteraksGageRadiant",
    "name": "Sterak's Megagage",
    "image_path": "tft5_item_steraksgageradiant.tft_set13.png",
    "description": "Radiant Sterak's Gage."
  },
  {
    "id": "TFT5_Item_SunfireCapeRadiant",
    "name": "Sunlight Cape",
    "image_path": "tft5_item_sunfirecaperadiant.tft_set13.png",
    "description": "Radiant Sunfire Cape."
  },
  {
    "id": "TFT_Item_Artifact_HellfireHatchet",
    "name": "Hellfire Hatchet",
    "image_path": "tft_item_artifact_hellfirehatchet.tft_set16.png",
    "description": "Attacks deal 2% of the holder's max Health as bonus physical damage. For every 1% missing Health, gain 1% Attack Speed."
  },
{
    "id": "TFT_Item_Artifact_TitanicHydra",
    "name": "Titanic Hydra",
    "image_path": "tft_item_artifact_titanichydra.tft_tft14_5.png",
    "description": "Attacks deal 3% of the holder's max Health plus 8% of their Attack Damage as bonus physical damage to the target and adjacent enemies."
  },

  {
    "id": "TFT5_Item_ThiefsGlovesRadiant",
    "name": "Rascal's Gloves",
    "image_path": "tft5_item_thiefsglovesradiant.tft_set13.png",
    "description": "Radiant Thief's Gloves."
  },
  {
    "id": "TFT5_Item_TitansResolveRadiant",
    "name": "Titan's Vow",
    "image_path": "tft5_item_titansresolveradiant.tft_set13.png",
    "description": "Radiant Titan's Resolve."
  },
  {
    "id": "TFT5_Item_WarmogsArmorRadiant",
    "name": "Warmog's Pride",
    "image_path": "tft5_item_warmogsarmorradiant.tft_set13.png",
    "description": "Radiant Warmog's Armor."
  },
  {
    "id": "TFT7_Item_ShimmerscaleDiamondHands",
    "name": "Diamond Hands",
    "image_path": "tft7_item_shimmerscalediamondhands.tft_set13.png",
    "description": "Once per combat at 66% and 33% Health, gain 1 gold and become invulnerable for 1 second."
  },
  {
    "id": "TFT7_Item_ShimmerscaleGamblersBlade",
    "name": "Gambler's Blade",
    "image_path": "tft7_item_shimmerscalegamblersblade.tft_set13.png",
    "description": "Grant 1% Attack Speed per gold in your bank (up to 80%). Each attack has a 7% chance to drop 1 gold."
  },
  {
    "id": "TFT7_Item_ShimmerscaleMogulsMail",
    "name": "Mogul's Mail",
    "image_path": "tft7_item_shimmerscalemogulsmail.tft_set13.png",
    "description": "Grants 1 Armor, 1 Magic Resist, and 8 Health when taking damage, stacking up to 40 times. At full stacks, grant 2 gold."
  },
  {
    "id": "TFT9_Item_OrnnDeathfireGrasp",
    "name": "Deathfire Grasp",
    "image_path": "tft9_item_ornndeathfiregrasp.tft_set13.png",
    "description": "At the start of combat, blast the current target for 20% of their maximum Health as magic damage."
  },
  {
    "id": "TFT_Item_GuinsoosRageblade",
    "name": "Guinsoo's Rageblade",
    "image_path": "tft_item_guinsoosrageblade.tft_set13.png",
    "description": "Attacks grant 5% stacking Attack Speed. This effect stacks infinitely."
  },
  {
    "id": "TFT_Item_InfinityEdge",
    "name": "Infinity Edge",
    "image_path": "tft_item_infinityedge.tft_set13.png",
    "description": "Grants 35% Attack Damage and 15% Critical Strike Chance. Physical damage from abilities can critically strike."
  },
    {
    "id": "TFT_Item_GuardianAngel",
    "name": "Edge of Night",
    "image_path": "tft_item_guardianangel.tft_set13.png",
    "description": "At 60% Health, briefly become untargetable and shed negative effects."
  },
    {
    "id": "TFT_Item_GuardianAngelRadiant",
    "name": "Radiant Edge of Night",
    "image_path": "tft5_item_guardianangelradiant.tft_set13.png",
    "description": "At 60% Health, briefly become untargetable, shed negative effects, and heal all missing health."
  },
    {
    "id": "TFT_Item_UnstableConcoction",
    "name": "Hand of Justice",
    "image_path": "tft_item_unstableconcoction.tft_set13.png",
    "description": "Gain 2 effects:15% Attack Damage and 15% Ability Power. 12% Omnivamp."
  },
    {
    "id": "TFT_Item_UnstableConcoctionRadiant",
    "name": "RadiantHand of Justice",
    "image_path": "tft5_item_handofjusticeradiant.tft_set13.png",
    "description": "Gain 2 effects: 30% Attack Damage and 30% Ability Power. 24% Omnivamp."
  },
    {
    "id": "TFT_Item_StatikkShiv",
    "name": "Void Staff",
    "image_path": "tft_item_voidstaff.tft_tft14_5.png",
    "description": "Damage from attacks and Abilities 30% Shred the target for 5 seconds. This effect does not stack."
  },
  {
    "id": "TFT_Item_RapidFireCannon",
    "name": "Red Buff",
    "image_path": "tft_item_rapidfirecannon.tft_set13.png",
    "description": "Attacks deal 1% maximum Health as true damage and reduce healing by 33% for 5 seconds."
  },
    {
    "id": "TFT_Item_NightHarvester",
    "name": "Steadfast Heart",
    "image_path": "tft_item_nightharvester.tft_set13.png",
    "description": "Gain 10% Durability. While above 50% Health, instead gain 18% Durability."
  },
      {
    "id": "TFT_Item_NightHarvesterRadiant",
    "name": "Steadfast Heart",
    "image_path": "tft5_item_nightharvesterradiant.tft_set13.png",
    "description": "Gain 20% durability. While above 50% Health, instead gain 36% Durability."
  },
  {
    "id": "TFT_Item_GargoyleStoneplate",
    "name": "Gargoyle Stoneplate",
    "image_path": "tft_item_gargoylestoneplate.tft_set13.png",
    "description": "Grants 13 Armor and 13 Magic Resist for each enemy targeting the holder."
  },
  {
    "id": "TFT_Item_SpearOfShojin",
    "name": "Spear of Shojin",
    "image_path": "tft_item_spearofshojin.tft_set13.png",
    "description": "Attacks grant 15 additional Mana."
  },
  {
    "id": "TFT_Item_Bloodthirster",
    "name": "Bloodthirster",
    "image_path": "tft_item_bloodthirster.tft_set13.png",
    "description": "Grants 20% Omnivamp. Once per combat at 40% Health, gain a 25% maximum Health shield for 5 seconds."
  },
  {
    "id": "TFT_Item_MadredsBloodrazor",
    "name": "Giant Slayer",
    "image_path": "tft_item_madredsbloodrazor.tft_set13.png",
    "description": "Abilities and attacks deal 25% more damage to enemies with more than 1600 maximum Health."
  },
  {
    "id": "TFT_Item_WarmogsArmor",
    "name": "Warmog's Armor",
    "image_path": "tft_item_warmogsarmor.tft_set13.png",
    "description": "Grants 600 bonus Health."
  },
  {
    "id": "TFT_Item_BFSword",
    "name": "B.F. Sword",
    "image_path": "tft_item_bfsword.tft_set13.png",
    "description": "+10% Attack Damage"
  },
  {
    "id": "TFT_Item_ChainVest",
    "name": "Chain Vest",
    "image_path": "tft_item_chainvest.tft_set13.png",
    "description": "+20 Armor"
  },
  {
    "id": "TFT_Item_GiantsBelt",
    "name": "Giant's Belt",
    "image_path": "tft_item_giantsbelt.tft_set13.png",
    "description": "+150 Health"
  },
  {
    "id": "TFT_Item_NeedlesslyLargeRod",
    "name": "Needlessly Large Rod",
    "image_path": "tft_item_needlesslylargerod.tft_set13.png",
    "description": "+10 Ability Power"
  },
  {
    "id": "TFT_Item_NegatronCloak",
    "name": "Negatron Cloak",
    "image_path": "tft_item_negatroncloak.tft_set13.png",
    "description": "+20 Magic Resist"
  },
  {
    "id": "TFT_Item_RecurveBow",
    "name": "Recurve Bow",
    "image_path": "tft_item_recurvebow.tft_set13.png",
    "description": "+10% Attack Speed"
  },
  {
    "id": "TFT_Item_SparringGloves",
    "name": "Sparring Gloves",
    "image_path": "tft_item_sparringgloves.tft_set13.png",
    "description": "+20% Critical Strike Chance"
  },
  {
    "id": "TFT_Item_TearOfTheGoddess",
    "name": "Tear of the Goddess",
    "image_path": "tft_item_tearofthegoddess.tft_set13.png",
    "description": "+15 Mana"
  },
  {
    "id": "TFT_Item_ArchangelsStaff",
    "name": "Archangel's Staff",
    "image_path": "tft_item_archangelsstaff.tft_set13.png",
    "description": "Grants 20 Ability Power. During combat, gain 30 Ability Power every 5 seconds."
  },
  {
    "id": "TFT_Item_BansheesVeil",
    "name": "Banshee's Veil",
    "image_path": "tft_item_bansheesveil.tft_set13.png",
    "description": "At the start of combat, grant the wearer and allies within 1 hex in the same row immunity to crowd control for 18 seconds."
  },
  {
    "id": "TFT_Item_BrambleVest",
    "name": "Bramble Vest",
    "image_path": "tft_item_bramblevest.tft_set13.png",
    "description": "Grants 30 Armor. Negates 50% bonus damage from incoming critical strikes."
  },
  {
    "id": "TFT_Item_Crownguard",
    "name": "Crownguard",
    "image_path": "tft_item_crownguard.tft_set13.png",
    "description": "Start of combat: Gain a shield equal to 30% of maximum health for 8 seconds. When the shield expires, gain 40 Ability Power."
  },
    {
    "id": "TFT_Item_Redemption",
    "name": "Spirit Visage",
    "image_path": "tft_item_spiritvisagerr.tft_tft14_5.png",
    "description": "Increases all healing received by 25%. Grants 40 Magic Resist and 400 Health."
  },
    {
    "id": "TFT_Item_PowerGauntlet",
    "name": "Striker's Flail",
    "image_path": "tft_item_powergauntlet.tft_set13.png",
    "description": "Critical Strikes grant 5% Damage Amp for 5 seconds, stacking up to 4 times."
  },
    {
    "id": "TFT_Item_Leviathan",
    "name": "Nashor's Tooth",
    "image_path": "tft_item_leviathan.tft_set13.png",
    "description": "Attacks grant 2 bonus Mana, increased to 4 if they critically strike."
  },
      {
    "id": "TFT_Item_LeviathanRadiant",
    "name": "Radiant Nashor's Tooth",
    "image_path": "tft5_item_leviathanradiant.tft_set13.png",
    "description": "Attacks grant 4 bonus Mana, increased to 8 if they critically strike."
  },
  {
    "id": "TFT_Item_Deathblade",
    "name": "Deathblade",
    "image_path": "tft_item_deathblade.tft_set13.png",
    "description": "Grants 66% Attack Damage."
  },
  {
    "id": "TFT_Item_DragonsClaw",
    "name": "Dragon's Claw",
    "image_path": "tft_item_dragonsclaw.tft_set13.png",
    "description": "Grants 65 Magic Resist. Every 2 seconds, regenerate 5% maximum health."
  },
  
  {
    "id": "TFT_Item_HextechGunblade",
    "name": "Hextech Gunblade",
    "image_path": "tft_item_hextechgunblade.tft_set13.png",
    "description": "Grants 22% Omnivamp. Damage heals the lowest health ally for the same amount."
  },
  {
    "id": "TFT_Item_IonicSpark",
    "name": "Ionic Spark",
    "image_path": "tft_item_ionicspark.tft_set13.png",
    "description": "Enemies within 2 hexes have their Magic Resist reduced by 50%. When they cast an ability, they are shocked for magic damage."
  },
    {
    "id": "TFT_Item_Artifact_SilvermereDawn",
    "name": "Silvermere Dawn",
    "image_path": "tft_item_artifact_silvermeredawn.tft_set13.png",
    "description": "Grants immunity to Stuns and the holder's attacks Stun the target for 0.8 seconds."
  },
  {
    "id": "TFT_Item_JeweledGauntlet",
    "name": "Jeweled Gauntlet",
    "image_path": "tft_item_jeweledgauntlet.tft_set13.png",
    "description": "Grants 30 Ability Power and 15% Critical Strike Chance. Magic and true damage from abilities can critically strike."
  },
  {
    "id": "TFT_Item_LastWhisper",
    "name": "Last Whisper",
    "image_path": "tft_item_lastwhisper.tft_set13.png",
    "description": "Grants 10% Attack Damage. Dealing physical damage reduces the target's Armor by 30% for 5 seconds."
  },
    {
    "id": "TFT_Item_RunaansHurricane",
    "name": "Kraken's Fury",
    "image_path": "tft_item_krakenslayer.tft_tft14_5.png",
    "description": "Attacks grant 3.5% stacking Attack Damage, up to 15 attacks. After 15 attacks, gain 30% Attack Speed."
  },
    {
    "id": "TFT_Item_RunaansHurricaneRadiant",
    "name": "Radiant Kraken's Fury",
    "image_path": "tft_item_krakenslayerradiant.tft_tft14_5.png",
    "description": "Attacks grant 7% stacking Attack Damage, up to 15 attacks. After 15 attacks, gain 60% Attack Speed."
  },
    {
    "id": "TFT_Item_AdaptiveHelm",
    "name": "Adaptive Helm",
    "image_path": "tft_item_adaptivehelm.tft_set13.png",
    "description": "Gain an additional 15% Mana from all sources. The holder gains an additional bonus based on their Role:Tanks and Fighters:\n\n Gain 45 Armor and Magic Resistance.\n\nOther Roles: Gain 10% Attack Damage and Ability Power. "
  },
    {
    "id": "TFT_Item_AdaptiveHelmRadiant",
    "name": "Radiant Adaptive Helm",
    "image_path": "tft5_item_adaptivehelmradiant.tft_set13.png",
    "description": "Gain an additional 30% Mana from all sources. The wearer gains an additional bonus based on their Role:\n\nTank/Fighter: Gain 100 Armor and Magic Resistance.\n\nMarksman/Caster: Gain 25% Attack Damage and Ability Power. "
  },
  {
    "id": "TFT_Item_Morellonomicon",
    "name": "Morellonomicon",
    "image_path": "tft_item_morellonomicon.tft_set13.png",
    "description": "Grants 25 Ability Power. Dealing magic or true damage with an ability burns the target for 10% maximum health over 10 seconds and reduces healing by 33%."
  },
  {
    "id": "TFT_Item_Quicksilver",
    "name": "Quicksilver",
    "image_path": "tft_item_quicksilver.tft_set13.png",
    "description": "Grants 20% Attack Speed. Immunity to crowd control for 18 seconds."
  },
  {
    "id": "TFT_Item_RabadonsDeathcap",
    "name": "Rabadon's Deathcap",
    "image_path": "tft_item_rabadonsdeathcap.tft_set13.png",
    "description": "Grants 70 Ability Power."
  },
    {
    "id": "TFT_Item_SpectralGauntlet",
    "name": "Evenshroud",
    "image_path": "tft_item_spectralgauntlet.tft_set13.png",
    "description": "30% Sunder enemies within 2 hexes. Gain 25 Armor and Magic Resist for the first 15 seconds of combat."
  },
      {
    "id": "TFT_Item_SpectralGauntletRadiant",
    "name": "Radiant Evenshroud",
    "image_path": "tft5_item_spectralgauntletradiant.tft_set13.png",
    "description": "30% Sunder enemies within 3 hexes. Gain 50 Armor and Magic Resist for the first 20 seconds of combat."
  },
  {
    "id": "TFT_Item_Artifact_StatikkShiv",
    "name": "Statikk Shiv",
    "image_path": "tft_item_statikkshiv.tft_set13.png",
    "description": "Every 3rd attack unleashes chain lightning that deals 30 magic damage and reduces Magic Resist by 30% for 5 seconds to 4 enemies."
  },
  {
    "id": "TFT_Item_SteraksGage",
    "name": "Sterak's Gage",
    "image_path": "tft_item_steraksgage.tft_set13.png",
    "description": "Once per combat at 60% health, gain 20% maximum health and 35% Attack Damage."
  },
  {
    "id": "TFT_Item_SunfireCape",
    "name": "Sunfire Cape",
    "image_path": "tft_item_sunfirecaper.tft_set13.png",
    "description": "Every 2 seconds, a random enemy within 2 hexes is burned for 10% maximum health over 10 seconds and has healing reduced by 33%."
  },
  {
    "id": "TFT_Item_ThiefsGloves",
    "name": "Thief's Gloves",
    "image_path": "tft_item_thiefsgloves.tft_set13.png",
    "description": "Each round: equip 2 temporary items. [Requires 2 empty item slots]"
  },
  {
    "id": "TFT_Item_TitansResolve",
    "name": "Titan's Resolve",
    "image_path": "tft_item_titansresolve.tft_set13.png",
    "description": "When taking damage or dealing a critical strike, gain 2% Attack Damage and 2 Ability Power, stacking up to 25 times. At full stacks, gain 20 Armor and Magic Resist."
  },
  {
    "id": "TFT_Item_Spatula",
    "name": "Spatula",
    "image_path": "tft_item_spatula.tft_set13.png",
    "description": "It must do something..."
  }
];

export function getItemDescription(id: string): string | undefined {
  const item = itemstft.find(i => i.id === id);
  return item?.description;
}

export function getItemName(id: string): string | undefined {
  const item = itemstft.find(i => i.id === id);
  return item?.name;
}

export const getItemImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '/images/noitem.png';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.includes('/')) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/${imagePath}`;
  }
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/tft-items/${imagePath}`;
};