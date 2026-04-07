import Link from "next/link";
import { ScrollText } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4">
          <ScrollText className="size-5 text-primary" aria-hidden />
          <span className="font-semibold tracking-tight">Meu Background</span>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-4 py-16">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Histórias de personagem completas, passo a passo
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
            Preencha cada etapa do backstory, veja o documento em tempo real e
            exporte em Markdown, texto ou PDF — tudo no seu navegador, sem
            cadastro.
          </p>
        </div>
        <div>
          <Link
            href="/criar"
            className={cn(buttonVariants({ size: "lg" }), "inline-flex")}
          >
            Começar agora
          </Link>
        </div>
      </main>
    </div>
  );
}
