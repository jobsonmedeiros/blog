import 'server-only';
import { createNeonAuth } from '@neon/auth/next/server';
import { isAdminEmail } from '@/lib/article-utils';

export const auth = createNeonAuth({ baseUrl: process.env.NEON_AUTH_BASE_URL!, cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! } });

export async function getAdminUser() {
  const { data } = await auth.getSession();
  const user = data?.user;
  return user && isAdminEmail(user.email, process.env.NEON_ADMIN_EMAIL) ? user : null;
}
