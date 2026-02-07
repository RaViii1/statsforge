import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the main team comp
  const { data: comp, error: compError } = await supabase
    .from('tft_team_comps')
    .select('*')
    .eq('id', id)
    .single();

  if (compError || !comp) {
    return NextResponse.json({ error: 'Team comp not found' }, { status: 404 });
  }

  // Fetch phases
  const { data: phases } = await supabase
    .from('tft_team_comp_phases')
    .select('*')
    .eq('team_comp_id', id);

  // Fetch leveling steps
  const { data: steps } = await supabase
    .from('tft_leveling_steps')
    .select('*')
    .eq('team_comp_id', id)
    .order('sort_order', { ascending: true });

  // Fetch unit positions
  const phaseIds = phases?.map(p => p.id) || [];
  const { data: units } = await supabase
    .from('tft_unit_positions')
    .select('*')
    .in('phase_id', phaseIds);

  return NextResponse.json({ comp, phases, steps, units });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Permission Check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const isAdmin = profile?.role === 'admin';

  const { data: existingComp } = await supabase
    .from('tft_team_comps')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!existingComp) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (existingComp.user_id !== session.user.id && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Delete associated data manually if CASCADE is not set
  const { data: phases } = await supabase
    .from('tft_team_comp_phases')
    .select('id')
    .eq('team_comp_id', id);

  if (phases && phases.length > 0) {
    await supabase.from('tft_unit_positions').delete().in('phase_id', phases.map(p => p.id));
  }

  await supabase.from('tft_team_comp_phases').delete().eq('team_comp_id', id);
  await supabase.from('tft_leveling_steps').delete().eq('team_comp_id', id);
  const { error } = await supabase.from('tft_team_comps').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
