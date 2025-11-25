"use client";

import { Swords, Shield, FlameIcon, Star, Flag, Trophy, Coins, CoinsIcon } from "lucide-react";
import { Match, MatchParticipant } from "@/app/types/lolInterfaces";
import { 
  isArena, 
  formatCSDisplay,
  getTeamIcon 
} from "@/lib/lol/lolfunctions";
import { getSummonerSpellName, getSummonerSpellIcon } from "@/lib/summoner-spells";
import { getRuneName, getRuneDescription, getRuneIcon, getRuneTreeName, getRuneTreeIcon } from "@/lib/runes";
import { getArenaAugmentName, getArenaAugmentIcon } from "@/lib/arena-augments";
import { getItemImage, getItemDescription } from "@/lib/items";

interface MatchDetailsTabProps {
  match: Match;
  summonerPuuid: string;
  playerData: MatchParticipant;
  onPlayerClick: (gameName: string, tagLine: string) => void;
}

export function MatchDetailsTab({ match, summonerPuuid, playerData, onPlayerClick }: MatchDetailsTabProps) {
  const arena = isArena(match.info.queueId);
  
  // Calculate highest damage dealt and taken in the match
  const highestDamageDealt = Math.max(...match.info.participants.map((p: MatchParticipant) => p.totalDamageDealtToChampions));
  const highestDamageTaken = Math.max(...match.info.participants.map((p: MatchParticipant) => p.totalDamageTaken));

  // Split teams
  const team1 = match.info.participants.filter((p: MatchParticipant) => p.teamId === 100);
  const team2 = match.info.participants.filter((p: MatchParticipant) => p.teamId === 200);
  
  // Check for team surrenders
  const team1Surrendered = match.info.teams?.find((t: any) => t.teamId === 100)?.teamEarlySurrendered || false;
  const team2Surrendered = match.info.teams?.find((t: any) => t.teamId === 200)?.teamEarlySurrendered || false;

  // Arena teams - group by playerSubteamId and sort by subteamPlacement
  const arenaTeams: { [key: number]: MatchParticipant[] } = {};
  if (arena) {
    match.info.participants.forEach((p: MatchParticipant) => {
      if (p.playerSubteamId !== undefined) {
        if (!arenaTeams[p.playerSubteamId]) {
          arenaTeams[p.playerSubteamId] = [];
        }
        arenaTeams[p.playerSubteamId].push(p);
      }
    });
  }

  if (arena && Object.keys(arenaTeams).length > 0) {
    return (
      <>
        {/* Arena Augments - Enhanced Display */}
        <div className="mb-6 p-5 bg-linear-to-br from-purple-950/30 via-purple-900/20 to-purple-950/30 border-2 border-purple-800/40 rounded-xl shadow-lg">
          <h4 className="text-base font-bold text-purple-300 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-900/50 border border-purple-700 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            {playerData.riotIdGameName}'s Arena Augments
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              playerData.playerAugment1,
              playerData.playerAugment2,
              playerData.playerAugment3,
              playerData.playerAugment4,
              playerData.playerAugment5,
            ].filter(Boolean).map((augmentId, idx) => {
              const augmentIcon = getArenaAugmentIcon(augmentId);
              const augmentName = getArenaAugmentName(augmentId);
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col items-center gap-2 p-3 bg-purple-950/30 border-2 border-purple-800/50 rounded-xl hover:bg-purple-900/40 hover:border-purple-600 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-purple-900/30"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-900/40 border-2 border-purple-700 overflow-hidden shrink-0 group-hover:border-purple-500 transition-colors">
                    {augmentIcon ? (
                      <img
                        src={augmentIcon}
                        alt={augmentName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-purple-400" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-center text-purple-200 font-semibold leading-tight line-clamp-2">{augmentName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Arena Teams Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(arenaTeams)
            .sort(([, aPlayers], [, bPlayers]) => {
              const aPlacement = aPlayers[0]?.subteamPlacement ?? 99;
              const bPlacement = bPlayers[0]?.subteamPlacement ?? 99;
              return aPlacement - bPlacement;
            })
            .map(([subteamId, players]) => {
              const teamWon = players[0]?.win;
              const placement = players[0]?.subteamPlacement ?? Number(subteamId);
              const teamIconUrl = getTeamIcon(Number(subteamId));
              
              return (
                <div
                  key={subteamId}
                  className={`p-5 rounded-xl border-2 shadow-xl transition-all duration-300 ${
                    teamWon 
                      ? 'bg-linear-to-br from-emerald-950/30 via-zinc-900 to-zinc-900 border-emerald-700/50 hover:border-emerald-600' 
                      : 'bg-linear-to-br from-zinc-900 via-zinc-900 to-zinc-800 border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  {/* Team Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-zinc-700/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg overflow-hidden `}>
                        <img
                          src={teamIconUrl}
                          alt={`Team ${subteamId}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = getTeamIcon(Number(subteamId));
                          }}
                        />
                      </div>
                    <div className="flex justify-between items-center w-full">
                    {/* Left side */}
                    <div className="flex items-center gap-2">
                        <span className="text-md font-bold text-white">
                        Team {subteamId}
                        </span>
                        {teamWon && <Trophy className="w-5 h-5 text-green-400" />}
                    </div>

                    {/* Right side */}
                    <span className="text-md text-zinc-400">
                        Place: #{placement}
                    </span>
                    </div>

                    </div>
                  </div>

                  {/* Players List */}
                  <div className="space-y-3">
                    {players.map((participant) => {
                      const isPlayer = participant.puuid === summonerPuuid;
                      
                      const augmentIds = [
                        participant.playerAugment1,
                        participant.playerAugment2,
                        participant.playerAugment3,
                        participant.playerAugment4,
                        participant.playerAugment5,
                      ];
                      const itemIds = [
                        participant.item0,
                        participant.item1,
                        participant.item2,
                        participant.item3,
                        participant.item4,
                        participant.item5,
                      ];
                      const normalizedItems = itemIds.map(id => id === 0 ? null : id);

                      return (
                        <div
                          key={participant.puuid}
                          className={`p-3 rounded-xl shadow-lg transition-all duration-200 border-2 ${
                            isPlayer
                              ? 'bg-linear-to-r from-orange-950/40 to-orange-900/20 border-orange-600/60 hover:border-orange-500'
                              : 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800/70 hover:border-zinc-600'
                          }`}
                        >
                          {/* Player Header */}
                          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-zinc-700/50">
                            <img
                              src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${participant.championName}.png`}
                              alt={participant.championName}
                              className="w-12 h-12 rounded-lg border-2 border-zinc-600 shrink-0 shadow-md"
                            />
                            <div className="flex flex-col gap-1 shrink-0">
                              {[participant.summoner1Id, participant.summoner2Id].map((spellId, idx) => (
                                <div 
                                  key={idx} 
                                  className="group relative w-5 h-5 rounded border-2 border-zinc-600 overflow-hidden hover:border-orange-500 transition-colors"
                                  title={getSummonerSpellName(spellId)}
                                >
                                  <img
                                    src={getSummonerSpellIcon(spellId)}
                                    alt={getSummonerSpellName(spellId)}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => onPlayerClick(participant.riotIdGameName, participant.riotIdTagline)}
                                className="text-sm font-bold text-white truncate hover:text-orange-400 transition-colors cursor-pointer text-left w-full"
                                title={`${participant.riotIdGameName}`}
                              >
                                {participant.riotIdGameName}
                              </button>
                              <p className="text-sm font-semibold">
                                <span className="text-green-400">{participant.kills}</span>
                                <span className="text-zinc-500"> / </span>
                                <span className="text-red-400">{participant.deaths}</span>
                                <span className="text-zinc-500"> / </span>
                                <span className="text-blue-400">{participant.assists}</span>
                              </p>
                            </div>
                          </div>

                          {/* Augments & Items Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Augments */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="w-4 h-4 text-purple-400" />
                                <p className="text-xs font-bold text-purple-300 uppercase tracking-wide">Augments</p>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {augmentIds.map((augmentId, idx) => {
                                  const augmentIcon = getArenaAugmentIcon(augmentId);
                                  const augmentName = getArenaAugmentName(augmentId);
                                  const hasAugment = augmentId && augmentId !== 0;

                                  return (
                                    <div
                                      key={`augment-${idx}`}
                                      className={`group relative w-9 h-9 rounded-lg overflow-hidden transition-all duration-200 ${
                                        hasAugment
                                          ? 'bg-purple-900/40 border-2 border-purple-700 hover:border-purple-400 hover:scale-110 shadow-md hover:shadow-purple-500/30'
                                          : 'bg-zinc-700/30 border-2 border-dashed border-zinc-600/50'
                                      }`}
                                      title={hasAugment ? augmentName : 'Empty Augment Slot'}
                                    >
                                      {hasAugment && augmentIcon ? (
                                        <img
                                          src={augmentIcon}
                                          alt={augmentName}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-purple-400 text-sm font-bold">A</div>';
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                          <span className="text-xs">?</span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Items */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <FlameIcon className="w-4 h-4 text-orange-400" />
                                <p className="text-xs font-bold text-orange-300 uppercase tracking-wide">Items</p>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {normalizedItems.map((itemId, idx) => {
                                  const isEmpty = !itemId;
                                  const itemName = itemId ? getItemDescription(itemId.toString()) : 'Empty Item Slot';

                                  return (
                                    <div
                                      key={`item-${idx}`}
                                      className={`group relative w-9 h-9 rounded-lg overflow-hidden transition-all duration-200 ${
                                        isEmpty
                                          ? 'bg-zinc-700/30 border-2 border-dashed border-zinc-600/50'
                                          : 'bg-zinc-700 border-2 border-zinc-600 hover:border-orange-500 hover:scale-110 shadow-md hover:shadow-orange-500/30'
                                      }`}
                                      title={itemName}
                                    >
                                      {itemId && (
                                        <img
                                          src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getItemImage(itemId.toString())}`}
                                          alt={itemName}
                                          className="w-full h-full object-cover"
                                        />
                                      )}
                                    </div>
                                  );
                                })}

                                {/* Trinket */}
                                <div 
                                  className={`group relative w-9 h-9 rounded-lg overflow-hidden transition-all duration-200 ${
                                    participant.item6 && participant.item6 !== 0
                                      ? 'bg-zinc-700 border-2 border-amber-600 hover:border-amber-400 hover:scale-110 shadow-md hover:shadow-amber-500/30'
                                      : 'bg-zinc-700/30 border-2 border-dashed border-zinc-600/50'
                                  }`}
                                  title={participant.item6 && participant.item6 !== 0 ? `Trinket: ${getItemDescription(participant.item6.toString())}` : 'Empty Trinket Slot'}
                                >
                                  {participant.item6 && participant.item6 !== 0 && (
                                    <img
                                      src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getItemImage(participant.item6.toString())}`}
                                      alt={`Trinket ${participant.item6}`}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </>
    );
  }

  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[
        { team: team1, name: "Blue Team", surrendered: team1Surrendered },
        { team: team2, name: "Red Team", surrendered: team2Surrendered }
      ].map(({ team, name, surrendered }) => (
        <div key={name} className="overflow-visible">
        <div className={`group relative mb-4 overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
        team[0]?.win
            ? 'border-emerald-500/40 bg-linear-to-r from-emerald-950/80 via-emerald-900/20 to-zinc-950 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]'
            : 'border-rose-500/40 bg-linear-to-r from-red-950/80 via-red-900/20 to-zinc-950 shadow-[0_0_20px_-5px_rgba(244,63,94,0.2)]'
        }`}>
        
        {/* Subtle Shine Effect on Hover */}
        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        <div className="relative flex items-center justify-between p-5">
            {/* Left: Icon & Status */}
            <div className="flex items-center gap-4">
            {/* Icon Circle Container */}
            <div className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-inner backdrop-blur-sm ${
                team[0]?.win
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20'
            }`}>
                {team[0]?.win ? <Trophy className="h-6 w-6 drop-shadow-md" /> : <Flag className="h-6 w-6 drop-shadow-md" />}
            </div>

            {/* Text Hierarchy */}
            <div>
                <h3 className={`text-2xl font-black uppercase italic tracking-widest ${
                team[0]?.win 
                    ? 'text-transparent bg-clip-text bg-linear-to-r from-emerald-200 to-emerald-600' 
                    : 'text-transparent bg-clip-text bg-linear-to-r from-rose-200 to-rose-600'
                }`}>
                {team[0]?.win ? 'Victory' : 'Defeat'}
                </h3>
                <div className={`h-0.5 w-full rounded-full mt-1 ${team[0]?.win ? 'bg-emerald-500/30' : 'bg-rose-500/30'}`} />
            </div>
            </div>

            {/* Right: Player Info & Surrender Tag */}
            <div className="text-right">
            <p className="text-lg font-bold text-white drop-shadow-sm tracking-tight">{name}</p>
            
            {surrendered && (
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-black/40 px-2 py-0.5 border border-zinc-800/50">
                <Flag className="h-3 w-3 text-zinc-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Surrendered
                </span>
                </div>
            )}
            </div>
        </div>
        </div>
          
          <div className="space-y-3 overflow-visible">
            {team.map((participant: any) => {
              const participantCSDisplay = formatCSDisplay(match, participant);
              const participantPrimaryKeystone = participant.perks?.styles?.[0]?.selections?.[0]?.perk;
              const participantSecondaryTree = participant.perks?.styles?.[1]?.style;
              const damageDealtPercent = (participant.totalDamageDealtToChampions / highestDamageDealt) * 100;
              const damageTakenPercent = (participant.totalDamageTaken / highestDamageTaken) * 100;
              const itemIds = [
                        participant.item0,
                        participant.item1,
                        participant.item2,
                        participant.item3,
                        participant.item4,
                        participant.item5,
                      ];
              
              return (
                <div 
                  key={participant.puuid}
                  className={`p-3 rounded-xl transition-all duration-200 overflow-visible border-2 shadow-md ${
                    participant.puuid === summonerPuuid 
                      ? 'bg-linear-to-r from-orange-950/40 to-orange-900/20 border-orange-600/60 hover:border-orange-500 hover:shadow-orange-900/30' 
                      : 'bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60 hover:border-zinc-600 hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Champion + Spells + Runes */}
                    <div className="flex items-center gap-2 overflow-visible shrink-0">
                      <div className="relative group">
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${participant.championName}.png`}
                          alt={participant.championName}
                          className="w-12 h-12 rounded-lg border-2 border-zinc-600 group-hover:border-orange-500 shadow-md transition-all"
                          title={participant.championName}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="w-6 h-6 rounded border-2 border-zinc-700 overflow-hidden hover:border-orange-500 transition-colors shadow-sm" title={getSummonerSpellName(participant.summoner1Id)}>
                          <img src={getSummonerSpellIcon(participant.summoner1Id)} alt={getSummonerSpellName(participant.summoner1Id)} className="w-full h-full object-cover" />
                        </div>
                        <div className="w-6 h-6 rounded border-2 border-zinc-700 overflow-hidden hover:border-orange-500 transition-colors shadow-sm" title={getSummonerSpellName(participant.summoner2Id)}>
                          <img src={getSummonerSpellIcon(participant.summoner2Id)} alt={getSummonerSpellName(participant.summoner2Id)} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      {!arena && participantPrimaryKeystone && (
                        <div className="flex flex-col gap-1 overflow-visible">
                          <div className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-visible flex items-center justify-center group relative hover:z-[9999] hover:border-orange-500 transition-colors shadow-sm" title={getRuneName(participantPrimaryKeystone)}>
                            <img src={getRuneIcon(participantPrimaryKeystone)} onError={(e) => { e.currentTarget.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png"; }} alt={getRuneName(participantPrimaryKeystone)} className="w-4 h-4 object-contain" />
                            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-[9999] w-64 p-3 bg-zinc-900 border-2 border-orange-500/60 rounded-xl shadow-2xl pointer-events-none">
                              <p className="text-sm font-bold text-orange-400 mb-1.5">{getRuneName(participantPrimaryKeystone)}</p>
                              <p className="text-xs text-zinc-300 leading-relaxed">{getRuneDescription(participantPrimaryKeystone)}</p>
                            </div>
                          </div>
                          {participantSecondaryTree && (
                            <div className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden flex items-center justify-center hover:border-orange-500 transition-colors shadow-sm" title={getRuneTreeName(participantSecondaryTree)}>
                              <img src={getRuneTreeIcon(participantSecondaryTree)} alt={getRuneTreeName(participantSecondaryTree)} className="w-3.5 h-3.5 object-contain" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Player Name & KDA */}
                    <div className="flex-1 min-w-[120px]">
                      <button onClick={() => onPlayerClick(participant.riotIdGameName, participant.riotIdTagline)} className="text-sm font-bold text-white truncate hover:text-orange-400 transition-colors cursor-pointer text-left w-full mb-1">
                        {participant.riotIdGameName}
                      </button>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold whitespace-nowrap">
                          <span className="text-green-400">{participant.kills}</span>
                          <span className="text-zinc-500"> / </span>
                          <span className="text-red-400">{participant.deaths}</span>
                          <span className="text-zinc-500"> / </span>
                          <span className="text-blue-400">{participant.assists}</span>
                        </p>
                        <span className="text-xs text-zinc-400 font-medium">{participantCSDisplay.totalCS} CS</span>
                        <p className="flex items-center" title="Gold earned">
                            <span className="text-xs text-zinc-400 font-medium">{participant.goldEarned} </span>
                            <CoinsIcon className="w-4 h-4 text-yellow-400" />
                        </p>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto sm:min-w-[110px] shrink-0 mt-2 sm:mt-0">
                      <div className="mb-2">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5">
                            <Swords className="w-4 h-4 text-red-400" />
                            <p className="text-xs font-semibold text-zinc-300">Dealt</p>
                          </div>
                          <p className="text-xs font-bold text-white">{(participant.totalDamageDealtToChampions / 1000).toFixed(1)}k</p>
                        </div>
                        <div className="w-full h-2 bg-zinc-700/50 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-linear-to-r from-red-600 via-red-500 to-red-700 rounded-full transition-all duration-300 shadow-md" style={{ width: `${damageDealtPercent}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-orange-400" />
                            <p className="text-xs font-semibold text-zinc-300">Taken</p>
                          </div>
                          <p className="text-xs font-bold text-white">{(participant.totalDamageTaken / 1000).toFixed(1)}k</p>
                        </div>
                        <div className="w-full h-2 bg-zinc-700/50 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-linear-to-r from-orange-600 via-orange-500 to-orange-400 rounded-full transition-all duration-300 shadow-md" style={{ width: `${damageTakenPercent}%` }} />
                        </div>
                      </div>
                    </div>
                      <div className="flex flex-wrap gap-1.5 shrink-0">
                      {itemIds.map((itemId, idx) => {
                        const itemName = itemId && itemId !== 0 ? getItemDescription(itemId.toString()) : 'Empty Item Slot';
                        return (
                          <div
                            key={`item-${idx}`}
                            className={`group relative w-8 h-8 rounded-lg overflow-hidden transition-all duration-200 ${
                              !itemId || itemId === 0
                                ? 'bg-zinc-700/30 border-2 border-dashed border-zinc-600/50'
                                : 'bg-zinc-700 border-2 border-zinc-600 hover:border-orange-500 hover:scale-110 shadow-md hover:shadow-orange-500/30'
                            }`}
                            title={itemName}
                          >
                            {itemId && itemId !== 0 ? (
                              <img
                                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getItemImage(itemId.toString())}`}
                                alt={itemName}
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                        );
                      })}
                      {/* Trinket */}
                      <div
                        className={`group relative w-8 h-8 rounded-lg overflow-hidden transition-all duration-200 ${
                          participant.item6 && participant.item6 !== 0
                            ? 'bg-zinc-700 border-2 border-amber-600 hover:border-amber-400 hover:scale-110 shadow-md hover:shadow-amber-500/30'
                            : 'bg-zinc-700/30 border-2 border-dashed border-zinc-600/50'
                        }`}
                        title={participant.item6 && participant.item6 !== 0 ? `Trinket: ${getItemDescription(participant.item6.toString())}` : 'Empty Trinket Slot'}
                      >
                        {participant.item6 && participant.item6 !== 0 ? (
                          <img
                            src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getItemImage(participant.item6.toString())}`}
                            alt={`Trinket ${participant.item6}`}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}