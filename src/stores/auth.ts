// src/stores/auth.ts
import { atom } from 'nanostores';
import type { User } from '@supabase/supabase-js';

export const user = atom<User | null>(null);
export const loading = atom<boolean>(true);

export function setUser(newUser: User | null) {
  user.set(newUser);
}

export function setLoading(val: boolean) {
  loading.set(val);
}
