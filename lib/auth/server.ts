import 'server-only';
import { createNeonAuth } from '@neon/auth/next/server';
import { isAdminEmail } from '@/lib/article-utils';

let auth: ReturnType<typeof createNeonAuth> | undefined;

export function getAuth() {
  if (auth) return auth;

  const baseUrl = process.env.NEON_AUTH_BASE_URL?.trim();
  const secret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl) throw new Error('Configure NEON_AUTH_BASE_URL para usar a autenticação.');
  if (!secret || secret.length < 32) {
    throw new Error('Configure NEON_AUTH_COOKIE_SECRET com pelo menos 32 caracteres.');
  }

  auth = createNeonAuth({ baseUrl, cookies: { secret } });
  return auth;
}

export async function getAdminUser() {
  const { data } = await getAuth().getSession();
  const user = data?.user;
  return user && isAdminEmail(user.email, process.env.NEON_ADMIN_EMAIL) ? user : null;
}
