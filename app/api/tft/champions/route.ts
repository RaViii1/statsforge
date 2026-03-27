import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const setIdParam = searchParams.get("set_id");  // New param

    const supabase = await createClient();

    let targetSetId: number;

    if (setIdParam) {
      // Frontend specified set_id - use it directly
      targetSetId = parseInt(setIdParam);
    } else {
      // No set_id - use first active set
      const { data: setData, error: setError } = await supabase
        .from("tft_sets")
        .select("id")
        .eq("is_active", true)
        .order("set_number", { ascending: false })  // Latest active first
        .limit(1);

      if (setError || !setData?.length) {
        return NextResponse.json({ error: "Active set not found" }, { status: 404 });
      }
      targetSetId = setData[0].id;
    }

    let query = supabase
      .from("tft_champions")
      .select(`
        *,
        tft_champion_traits (
          tft_traits (
            *,
            tft_trait_tiers(*)
          )
        ),
        tft_champion_best_items (
          tft_items (
            *
          )
        )
      `)
      .eq("set_id", targetSetId);

    if (name) {
      const nameWithSpaces = name.replace(/-/g, " ");
      query = query.or(`name.ilike."${name}",name.ilike."${nameWithSpaces}"`);
    }

    const { data: champions, error } = await query.order("cost", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedChampions = champions.map((champ: any) => ({
      ...champ,
      traits: champ.tft_champion_traits?.map((ct: any) => ct.tft_traits.name) || [],
      trait_details: champ.tft_champion_traits?.map((ct: any) => ct.tft_traits) || [],
      tft_champion_best_items: champ.tft_champion_best_items?.map((bi: any) => bi.tft_items) || []
    }));

    // Fetch team comps for each champion
    const championsWithTeamComps = await Promise.all(
      formattedChampions.map(async (champ: any) => {
        const { data: teamCompsData, error: teamCompsError } = await supabase
          .from('tft_team_comps')
          .select(`
            id,
            name,
            description,
            patch,
            tier,
            difficulty,
            set_id,
            main_carry_ids,
            synergies_list,
            active_preset_id,
            tft_team_comp_phases (
              id,
              phase,
              notes,
              tft_unit_positions (*)
            ),
            tft_leveling_steps (*)
          `)
          .eq('set_id', targetSetId);

        if (!teamCompsError) {
          // Filter team comps that include this champion
          const championTeamComps = teamCompsData.filter(comp => {
            return comp.tft_team_comp_phases?.some((phase: any) => {
              return phase.tft_unit_positions?.some((unit: any) => unit.champion_id === champ.id);
            });
          });

          // Transform team comps to match frontend format
          const transformedTeamComps = championTeamComps.map(comp => {
            const phases: any = {
              early: { units: [], notes: '' },
              mid: { units: [], notes: '' },
              final: { units: [], notes: '' }
            };

            comp.tft_team_comp_phases?.forEach((p: any) => {
              phases[p.phase] = {
                notes: p.notes || '',
                units: p.tft_unit_positions.map((u: any) => ({
                  id: u.id,
                  characterId: u.champion_id,
                  name: '', // Will be filled by client if needed
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

          return {
            ...champ,
            teamcomps: transformedTeamComps
          };
        }

        return {
          ...champ,
          teamcomps: []
        };
      })
    );

    if (name && championsWithTeamComps.length > 0) {
      return NextResponse.json(championsWithTeamComps[0]);
    }

    return NextResponse.json(championsWithTeamComps);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

