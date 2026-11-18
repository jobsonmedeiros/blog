import FormularioRedefinicaoSenha from "./ResetPasswordForm";

export const dynamic = "force-dynamic";

type Propriedades = { searchParams: Promise<{ token?: string | string[]; error?: string | string[] }> };

export default async function PaginaRedefinicaoSenha({ searchParams }: Propriedades) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token ?? "";
  return <FormularioRedefinicaoSenha token={token} />;
}