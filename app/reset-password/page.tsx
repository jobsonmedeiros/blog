import ResetPasswordForm from "./ResetPasswordForm";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ token?: string | string[]; error?: string | string[] }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token ?? "";
  return <ResetPasswordForm token={token} />;
}