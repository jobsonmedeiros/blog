"use client";
import { useState } from "react";

// Versículos curados – rotação por dia do mês
const VERSICULOS = [
  { texto: "O Senhor é o meu pastor; nada me faltará.", ref: "Salmos 23:1" },
  { texto: "Pois Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna.", ref: "João 3:16" },
  { texto: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
  { texto: "O Senhor é a minha luz e a minha salvação; a quem temerei?", ref: "Salmos 27:1" },
  { texto: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.", ref: "Provérbios 3:5" },
  { texto: "Mas os que esperam no Senhor renovam as suas forças.", ref: "Isaías 40:31" },
  { texto: "A tua palavra é lâmpada que ilumina os meus passos e luz que clareia o meu caminho.", ref: "Salmos 119:105" },
  { texto: "Alegrem-se sempre no Senhor! Repito: alegrem-se!", ref: "Filipenses 4:4" },
  { texto: "Deem graças em todas as circunstâncias, pois esta é a vontade de Deus para vocês em Cristo Jesus.", ref: "1 Tessalonicenses 5:18" },
  { texto: "Sejam fortes e corajosos. Não se apavorem nem desanimem, pois o Senhor, o seu Deus, estará com vocês por onde andarem.", ref: "Josué 1:9" },
  { texto: "Não vos conformeis com este século, mas transformai-vos pela renovação da vossa mente.", ref: "Romanos 12:2" },
  { texto: "Porque eu bem sei os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro.", ref: "Jeremias 29:11" },
  { texto: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.", ref: "1 Coríntios 13:4" },
  { texto: "Pedi e dar-se-vos-á; buscai e encontrareis; batei e abrir-se-vos-á.", ref: "Mateus 7:7" },
  { texto: "Não andem ansiosos por coisa alguma, mas em tudo, mediante oração e súplica, apresentem seus pedidos a Deus.", ref: "Filipenses 4:6" },
  { texto: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.", ref: "Salmos 46:1" },
  { texto: "Porque nele vivemos, nos movemos e existimos.", ref: "Atos 17:28" },
  { texto: "Bem-aventurados os de coração puro, porque verão a Deus.", ref: "Mateus 5:8" },
  { texto: "O Senhor guardará a tua saída e a tua entrada, desde agora e para sempre.", ref: "Salmos 121:8" },
  { texto: "Nenhuma arma forjada contra ti prosperará.", ref: "Isaías 54:17" },
  { texto: "Humilhai-vos, pois, sob a poderosa mão de Deus, para que ele vos exalte no momento oportuno.", ref: "1 Pedro 5:6" },
  { texto: "Aguarda o Senhor; tem bom ânimo e ele fortalecerá o teu coração.", ref: "Salmos 27:14" },
  { texto: "A paz de Deus, que excede todo o entendimento, guardará os vossos corações e as vossas mentes em Cristo Jesus.", ref: "Filipenses 4:7" },
  { texto: "Mas eu, com a minha oração, dirijo-me a ti, Senhor, no tempo da tua graça.", ref: "Salmos 69:13" },
  { texto: "O fruto do Espírito, porém, é: amor, alegria, paz, paciência, amabilidade, bondade, fidelidade.", ref: "Gálatas 5:22" },
  { texto: "Deleita-te no Senhor, e ele te concederá os desejos do teu coração.", ref: "Salmos 37:4" },
  { texto: "Ora, a fé é o firme fundamento das coisas que se esperam e a prova das coisas que se não veem.", ref: "Hebreus 11:1" },
  { texto: "Escolhe hoje a quem servirás… quanto a mim e à minha família, serviremos ao Senhor.", ref: "Josué 24:15" },
  { texto: "Aproximai-vos de Deus, e ele se aproximará de vós.", ref: "Tiago 4:8" },
  { texto: "A graça do Senhor Jesus Cristo seja com o vosso espírito.", ref: "Filipenses 4:23" },
  { texto: "Eu sou o caminho, a verdade e a vida.", ref: "João 14:6" },
];

export default function VersiculoDoDia() {
  const hoje = new Date().getDate(); // 1-31
  const idx = (hoje - 1) % VERSICULOS.length;
  const versiculo = VERSICULOS[idx];

  const [copiado, setCopiado] = useState(false);

  const copiar = () => {
    navigator.clipboard.writeText(`"${versiculo.texto}" — ${versiculo.ref}`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div
      className="rounded-2xl p-8 md:p-14 text-center relative overflow-hidden shadow-[0_16px_38px_rgba(45,33,27,0.16)]"
      style={{ background: "var(--ink)", color: "var(--parchment)" }}
    >
      {/* Ornamento de fundo */}
      <div
        className="absolute -right-10 -top-20 opacity-[0.07] select-none pointer-events-none text-[14rem] leading-none"
        aria-hidden
      >
        “
      </div>

      <p
        className="font-sans text-xs uppercase tracking-[0.22em] mb-7"
        style={{ color: "var(--gold-light)" }}
      >
        ✦ Versículo do Dia ✦
      </p>

      <blockquote
        className="text-2xl md:text-4xl leading-[1.25] mb-7 max-w-3xl mx-auto"
        style={{ fontFamily: "'Crimson Pro', serif", fontStyle: "italic", fontWeight: 300 }}
      >
        &ldquo;{versiculo.texto}&rdquo;
      </blockquote>

      <cite
        className="font-sans text-sm not-italic"
        style={{ color: "var(--gold-light)", fontWeight: 500 }}
      >
        — {versiculo.ref}
      </cite>

      <hr className="gold-divider w-24 mx-auto mt-6" />

      <button
        onClick={copiar}
        className="font-sans text-xs px-4 py-2.5 rounded-full border mt-2 transition-all hover:-translate-y-px"
        style={{
          borderColor: "var(--gold)",
          color: copiado ? "var(--ink)" : "var(--gold-light)",
          background: copiado ? "var(--gold)" : "transparent",
        }}
      >
        {copiado ? "✓ Copiado!" : "Copiar versículo"}
      </button>
    </div>
  );
}
