import { auth } from "@/lib/auth/server";
import { NextResponse } from 'next/server';
import { isAdminEmail } from '@/lib/article-utils';

const handlers = auth.handler();
const allowed = new Set(['get-session', 'sign-in/email', 'sign-out', 'request-password-reset', 'reset-password', 'verify-email']);
function isAllowed(request: Request) {
  const path = new URL(request.url).pathname.replace(/^\/api\/auth\//, '');
  return allowed.has(path) || /^reset-password\/[^/]+$/.test(path);
}
export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  if (!isAllowed(request)) return NextResponse.json({ error: 'Rota não disponível.' }, { status: 404 });
  return handlers.GET(request, context);
}
export async function POST(request: Request, context: { params: Promise<{ path: string[] }> }) {
  if (!isAllowed(request)) return NextResponse.json({ error: 'Rota não disponível.' }, { status: 404 });
  const path = new URL(request.url).pathname;
  if (path.endsWith('/sign-in/email')) {
    const body = await request.clone().json().catch(() => null);
    if (!isAdminEmail(typeof body?.email === 'string' ? body.email : null, process.env.NEON_ADMIN_EMAIL)) {
      return NextResponse.json({ message: 'E-mail ou senha inválidos.' }, { status: 401 });
    }
  }
  return handlers.POST(request, context);
}
