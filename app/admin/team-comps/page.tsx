import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Sword, Users } from "lucide-react";
import Link from "next/link";
import TeamCompsList from "./TeamCompsList";
import { TeamComp } from "@/lib/tft/teamplanner-types";
import { TFTSet } from "@/lib/tft/champions";

export default async function AdminTeamCompsPage() {
  const supabase = await createClient();

  // Fetch comps with related data
  const { data: compsData } = await supabase
    .from("tft_team_comps")
    .select(`
      *,
      tft_sets (id, name, set_number),
      tft_team_comp_phases (
        id,
        phase,
        notes,
        tft_unit_positions (*)
      ),
      tft_leveling_steps (*)
    `)
    .order("created_at", { ascending: false });

  const { data: sets } = await supabase
    .from("tft_sets")
    .select("id, name, set_number")
    .order("set_number", { ascending: false });

  const { data: champions } = await supabase
    .from("tft_champions")
    .select("*");

  const { data: items } = await supabase
    .from("tft_items")
    .select("*");

  const { data: traits } = await supabase
    .from("tft_traits")
    .select("*");

  // Transform comps data
  const transformedComps: TeamComp[] = (compsData || []).map((comp: any) => {
    const phases: any = {
      early: { units: [], notes: '' },
      mid: { units: [], notes: '' },
      final: { units: [], notes: '' }
    };

    comp.tft_team_comp_phases?.forEach((phase: any) => {
      phases[phase.phase] = {
        notes: phase.notes || '',
        units: phase.tft_unit_positions.map((u: any) => ({
          id: u.id,
          characterId: u.champion_id,
          name: '',
          row: u.row,
          col: u.col,
          stars: u.stars,
          items: u.items || []
        }))
      };
    });

    return {
      id: comp.id,
      name: comp.name,
      description: comp.description || '',
      patch: comp.patch || '16.1',
      tier: comp.tier,
      difficulty: comp.difficulty,
      mainCarryIds: comp.main_carry_ids || [],
      synergiesList: comp.synergies_list || [],
      activePresetId: comp.active_preset_id,
      user_id: comp.user_id,
      set_id: comp.set_id,
      phases,
      levelingSteps: (comp.tft_leveling_steps || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((s: any) => ({
          level: s.level,
          stage: s.stage,
          gold: s.gold,
          description: s.description
        }))
    };
  });

  return (
    <div className="min-h-screen bg-[#0a0a0b] pb-24">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] bg-[#0d0d0f]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center gap-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-400 transition-colors text-[11px] font-semibold tracking-[0.12em] uppercase group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Admin Panel
          </Link>
          <span className="text-white/10 text-lg font-thin">/</span>
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-orange-400">
            Team Comps
          </span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pt-10 space-y-10">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
              <Sword className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Team Composition Management
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                View and edit TFT team compositions and strategies
              </p>
            </div>
          </div>

          <Link
            href="/tft/planner"
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-orange-900/20 hover:shadow-orange-500/20"
          >
            <Users className="w-4 h-4" />
            Create New
          </Link>
        </div>

        {/* Team comps list */}
        <TeamCompsList
          initialComps={transformedComps}
          sets={(sets as (TFTSet & { id: number })[]) || []}
          champions={champions || []}
          items={items || []}
          traits={traits || []}
        />
      </div>
    </div>
  );
}
