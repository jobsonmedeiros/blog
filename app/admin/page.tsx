import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth/server";
import { isDatabaseConfigured, getDatabase } from "@/lib/db";
import type { CmsArticle } from "@/lib/article-utils";
import AdminEditor from "./AdminEditor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/login");
  if (!isDatabaseConfigured()) throw new Error("Configure DATABASE_URL para usar o painel.");

  const sql = getDatabase();
  const rows = await sql`
    SELECT id, slug, title, category, author, reading_time, excerpt, emoji, content, published_at
    FROM articles ORDER BY updated_at DESC
  `;
  const articles = rows as unknown as CmsArticle[];

  return <AdminEditor initialArticles={articles} email={user.email ?? ""} />;
}