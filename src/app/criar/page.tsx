import type { Metadata } from "next";

import { CharacterFormWizard } from "@/components/character-form/character-form-wizard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
              Formulário guiado com etapas, progresso e validação por passo.
            </h1>
            <p className="text-lead max-w-3xl text-muted-foreground text-pretty">
              Navegue entre as seções do backstory; os campos detalhados entram
              nas próximas entregas. À direita, o painel continua preparado para
              o preview ao vivo.
            </p>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
          <CharacterFormWizard />

          <Card className="overflow-hidden lg:sticky lg:top-28 lg:self-start">
            <CardHeader className="border-b border-border/70">
              <CardTitle>Preview do documento</CardTitle>
              <CardDescription>
                Painel preparado para refletir o backstory renderizado em tempo
                real.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <p className="text-caption font-medium text-primary">
                  Título do personagem
                </p>
                <p className="text-section">Seu documento aparecerá aqui</p>
                <p className="text-body text-muted-foreground">
                  O preview vai consolidar as respostas por seção e preparar a
                  mesma base para exportação em Markdown, TXT e PDF.
                </p>
              </div>

              <div className="space-y-3 rounded-2xl border border-border/70 bg-background/70 p-4">
                {["Origem", "Traços", "Relacionamentos", "Objetivos"].map(
                  (section) => (
                    <div key={section} className="space-y-1">
                      <p className="text-caption font-medium text-foreground">
                        {section}
                      </p>
                      <div className="h-2 rounded-full bg-muted" />
                    </div>
                  )
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {["Markdown", "Texto", "PDF"].map((format) => (
                  <span
                    key={format}
                    className="rounded-full border border-border/70 bg-card px-3 py-1 text-caption text-muted-foreground"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
