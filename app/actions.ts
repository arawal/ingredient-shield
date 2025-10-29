'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type Rule = {
  id: string;
  type: 'allergy' | 'ethics' | 'health';
  value: string;
  created_at: string;
};

export async function getRules() {
  const supabase = await createClient();
  const { data: rules, error } = await supabase
    .from('rules')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching rules:', error);
    return [];
  }

  return rules as Rule[];
}

export async function addRule(formData: FormData) {
  const supabase = await createClient();
  
  const type = formData.get('type') as Rule['type'];
  const value = formData.get('value') as string;

  if (!type || !value) {
    throw new Error('Type and value are required');
  }

  const { error } = await supabase
    .from('rules')
    .insert([{ type, value }]);

  if (error) {
    console.error('Error adding rule:', error);
    throw error;
  }

  revalidatePath('/profile');
}

export async function deleteRule(formData: FormData) {
  const supabase = await createClient();
  
  const id = formData.get('id') as string;

  if (!id) {
    throw new Error('Rule ID is required');
  }

  const { error } = await supabase
    .from('rules')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting rule:', error);
    throw error;
  }

  revalidatePath('/profile');
}