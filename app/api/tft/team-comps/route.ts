import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const setId = searchParams.get('set_id');
  const championId = searchParams.get('champion_id');
  
  const supabase = await createClient();
  
  // Fetch all team comps with their final phase units for the list view
  let query = supabase
    .from('tft_team_comps')
    .select(`
      *,
      tft_team_comp_phases (
        id,
        phase,
        notes,
        tft_unit_positions (*)
      ),
      tft_leveling_steps (*)
    `)
    .order('created_at', { ascending: false });

  if (setId) {
    query = query.eq('set_id', parseInt(setId));
  }

  const { data: allComps, error: fetchError } = await query;

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  // Filter team comps by champion_id if provided
  let filteredComps = allComps;
  if (championId) {
    filteredComps = allComps.filter(comp => {
      return comp.tft_team_comp_phases?.some((phase: any) => {
        return phase.tft_unit_positions?.some((unit: any) => unit.champion_id === championId);
      });
    });
  }

  // Transform to match the frontend expectations
  const transformedComps = filteredComps.map(comp => {
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

  return NextResponse.json(transformedComps);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { comp, userId } = body;

  if (!comp || !userId) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  // Permission Check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const isAdmin = profile?.role === 'admin';
  
  // If updating an existing comp, verify ownership/admin
  if (comp.id && comp.id.length > 15) {
    const { data: existingComp } = await supabase
      .from('tft_team_comps')
      .select('user_id')
      .eq('id', comp.id)
      .single();

    if (existingComp && existingComp.user_id !== session.user.id && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // 1. Upsert tft_team_comps
   const { data: savedComp, error: compError } = await supabase
    .from('tft_team_comps')
    .upsert({
      id: (comp.id && comp.id.length > 15) ? comp.id : undefined,
      user_id: (comp.id && comp.id.length > 15) ? undefined : session.user.id, // Only set user_id on creation if not admin or if new
      name: comp.name,
      description: comp.description,
      patch: comp.patch,
      tier: comp.tier,
      difficulty: comp.difficulty,
      main_carry_ids: comp.mainCarryIds,
      synergies_list: comp.synergiesList,
      active_preset_id: comp.activePresetId,
      set_id: comp.set_id,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (compError) {
    return NextResponse.json({ error: compError.message }, { status: 500 });
  }

  const teamCompId = savedComp.id;

  // 2. Handle Phases and Units
  for (const [phaseKey, phaseData] of Object.entries(comp.phases)) {
    const pData = phaseData as any;
    
    // Check if phase exists
    const { data: existingPhase } = await supabase
      .from('tft_team_comp_phases')
      .select('id')
      .eq('team_comp_id', teamCompId)
      .eq('phase', phaseKey)
      .single();

    let phaseId;
    if (existingPhase) {
      phaseId = existingPhase.id;
      await supabase.from('tft_team_comp_phases').update({ notes: pData.notes }).eq('id', phaseId);
    } else {
      const { data: newPhase } = await supabase
        .from('tft_team_comp_phases')
        .insert({ team_comp_id: teamCompId, phase: phaseKey, notes: pData.notes })
        .select()
        .single();
      phaseId = newPhase?.id;
    }

    if (phaseId) {
      await supabase.from('tft_unit_positions').delete().eq('phase_id', phaseId);
      if (pData.units.length > 0) {
        await supabase.from('tft_unit_positions').insert(
          pData.units.map((u: any) => ({
            phase_id: phaseId,
            champion_id: u.characterId,
            row: u.row,
            col: u.col,
            stars: u.stars,
            items: u.items
          }))
        );
      }
    }
  }

  // 3. Handle Leveling Steps
  await supabase.from('tft_leveling_steps').delete().eq('team_comp_id', teamCompId);
  if (comp.levelingSteps.length > 0) {
    await supabase.from('tft_leveling_steps').insert(
      comp.levelingSteps.map((s: any, idx: number) => ({
        team_comp_id: teamCompId,
        level: s.level,
        stage: s.stage,
        gold: s.gold,
        description: s.description,
        sort_order: idx
      }))
    );
  }

  return NextResponse.json({ id: teamCompId });
}
