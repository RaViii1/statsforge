'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function upsertChampion(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const cost = parseInt(formData.get('cost') as string)
  const set_id = parseInt(formData.get('set_id') as string)
  const image_path = formData.get('image_path') as string

  const { error } = await supabase
    .from('tft_champions')
    .upsert({
      id,
      name,
      cost,
      set_id,
      image_path,
      updated_at: new Date().toISOString()
    })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/champions')
}

export async function deleteChampion(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('tft_champions')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/champions')
}
