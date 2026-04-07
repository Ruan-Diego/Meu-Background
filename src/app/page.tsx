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
              MVP Foundation · M1-F02
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
                href="/criar"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "inline-flex rounded-full px-5"
                )}
              >
                Ver layout do editor
              </Link>
            </div>
          </div>

          <Card className="surface-panel overflow-hidden">
            <CardHeader className="border-b border-border/70 pb-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-caption font-medium text-primary">
                    Estrutura do documento
                  </p>
                  <CardTitle>Um shell pronto para o MVP</CardTitle>
                </div>
                <span className="rounded-full bg-primary/12 px-3 py-1 text-caption font-medium text-primary">
                  Responsivo
                </span>
              </div>
              <CardDescription>
                A base visual já separa navegação, conteúdo principal e espaço
                para o preview que será conectado nas próximas tarefas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {[
                "Informações básicas",
                "Origem e passado",
                "Personalidade e traços",
                "Relacionamentos",
                "Objetivos e aparência",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
                >
                  <div>
                    <p className="text-caption text-muted-foreground">
                      Etapa {index + 1}
                    </p>
                    <p className="font-medium">{step}</p>
                  </div>
                  <span className="text-caption rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                    Em breve
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
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
