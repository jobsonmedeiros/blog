import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';
import jwt from 'jsonwebtoken';

function verifyToken(req: Request) {
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;

  try {
    return jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET!) as any;
  } catch {
    return null;
  }
}

export async function GET() {
  const articles = await sql`
    SELECT id, title, content, slug, created_at 
    FROM articles 
    ORDER BY created_at DESC
  `;

  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const { title, content, slug } = await request.json();

  await sql`
    INSERT INTO articles (title, content, slug) 
    VALUES (${title}, ${content}, ${slug})
  `;

  return NextResponse.json({ message: 'Artigo criado' });
}

export async function PUT(request: Request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const { id, title, content, slug } = await request.json();

  await sql`
    UPDATE articles 
    SET title = ${title}, content = ${content}, slug = ${slug} 
    WHERE id = ${id}
  `;

  return NextResponse.json({ message: 'Artigo atualizado' });
}

export async function DELETE(request: Request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  await sql`DELETE FROM articles WHERE id = ${id}`;

  return NextResponse.json({ message: 'Artigo excluído' });
}