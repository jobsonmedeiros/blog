import { createNeonAuth } from "@neon/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
});

export async function getAdminUser() {
  const { data } = await auth.getSession();
  const user = data?.user;
  const adminEmail = process.env.NEON_ADMIN_EMAIL?.trim().toLowerCase();

  if (!user || !adminEmail || user.email?.toLowerCase() !== adminEmail) return null;
  return user;
}
