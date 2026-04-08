import Link from "next/link";
import { ArrowRight, Eye, FileDown, Layers3 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FORM_STEPS } from "@/lib/character-form/steps";
import { cn } from "@/lib/utils";

const highlights = [
  {
    icon: Layers3,
    title: "Fluxo guiado",
    description:
      "Cada etapa organiza um pilar importante do backstory para você não esquecer nada.",
  },
  {
    icon: Eye,
    title: "Preview vivo",
    description:
      "Veja o documento tomar forma enquanto preenche os dados do personagem.",
  },
  {
    icon: FileDown,
    title: "Exportações prontas",
    description:
      "Baixe a história final em Markdown, texto puro ou PDF sem depender de backend.",
  },
] as const;

export default function Home() {
  return (
    <div className="page-section">
      <div className="layout-shell flex flex-col gap-10">
        <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-border/70 bg-card/80 px-3 py-1 text-caption font-medium text-muted-foreground">
              Backstory de RPG · tudo no navegador
            </span>
            <div className="space-y-4">
              <h1 className="text-display max-w-3xl">
                Histórias de personagem completas, passo a passo.
              </h1>
              <p className="text-lead max-w-2xl text-muted-foreground text-pretty">
                Organize origem, personalidade, relacionamentos e objetivos em
                um fluxo claro, acompanhe o preview ao vivo e exporte a versão
                final direto do navegador.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/criar"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "inline-flex rounded-full px-5"
                )}
              >
                Começar agora
                <ArrowRight aria-hidden />
              </Link>
              <Link
                href="#como-funciona"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "inline-flex rounded-full px-5"
                )}
              >
                Como funciona
              </Link>
            </div>
          </div>

          <Card className="surface-panel overflow-hidden">
            <CardHeader className="border-b border-border/70 pb-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-caption font-medium text-primary">
                    O que você percorre
                  </p>
                  <CardTitle>Sete etapas até a revisão</CardTitle>
                </div>
                <span className="rounded-full bg-primary/12 px-3 py-1 text-caption font-medium text-primary">
                  Salvo localmente
                </span>
              </div>
              <CardDescription>
                Cada bloco abaixo corresponde a uma etapa real do editor: do
                nome do personagem à exportação do documento.
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[min(28rem,55vh)] space-y-3 overflow-y-auto pt-6">
              {FORM_STEPS.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
                >
                  <p className="text-caption text-muted-foreground">
                    Etapa {s.indexLabel}
                  </p>
                  <p className="font-medium">{s.title}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section
          id="como-funciona"
          className="grid gap-4 scroll-mt-28 md:grid-cols-3"
        >
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="h-full">
                <CardHeader>
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-body text-muted-foreground text-pretty">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
}
