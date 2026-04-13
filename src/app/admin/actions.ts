"use server";

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function searchUsers(query: string) {
  if (!query) return { data: [] };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('email', `%${query}%`)
    .limit(10);
    
  if (error) return { error: error.message };
  return { data };
}

export async function getCourses() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('courses').select('*');
  if (error) return { error: error.message };
  return { data };
}

export async function promoteUserRole(userId: string, courseId: string, role: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('enrollments')
    .upsert(
      { user_id: userId, course_id: courseId, role }, 
      { onConflict: 'user_id, course_id' }
    );
    
  if (error) return { error: error.message };
  revalidatePath('/admin');
  return { success: true };
}
