import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar personagem",
};

export default function CriarPage() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col justify-center gap-4 px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        Formulário guiado
      </h1>
      <p className="text-muted-foreground">
        O fluxo em etapas, preview e exportações entram aqui nas próximas
        tarefas do MVP (M1-F03 em diante).
      </p>
    </div>
  );
}
