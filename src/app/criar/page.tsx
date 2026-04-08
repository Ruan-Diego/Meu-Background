import type { Metadata } from "next";

import { CharacterFormWizard } from "@/components/character-form/character-form-wizard";

export const metadata: Metadata = {
  title: "Criar personagem",
};

export default function CriarPage() {
  return (
    <div className="page-section">
      <div className="layout-shell flex flex-col gap-8">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-border/70 bg-card/80 px-3 py-1 text-caption font-medium text-muted-foreground">
            Editor do personagem
          </span>
          <div className="space-y-2">
            <h1 className="text-title max-w-2xl">
              Monte o backstory com etapas, validação e preview ao vivo.
            </h1>
            <p className="text-lead max-w-3xl text-muted-foreground text-pretty">
              Use a coluna da esquerda para preencher cada seção; à direita, o
              documento é atualizado conforme você avança. Na última etapa,
              exporte em Markdown, texto ou PDF.
            </p>
          </div>
        </div>

        <CharacterFormWizard />
      </div>
    </div>
  );
}
