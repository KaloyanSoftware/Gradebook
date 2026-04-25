import type { AppUser } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL as string;

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchMe(token: string): Promise<AppUser | null> {
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: authHeaders(token),
  });
  if (!res.ok) return null;
  return res.json();
}
