"use client";

import { FileText } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import type { CharacterFormValues } from "@/lib/character-form/schema";
import {
  buildCharacterDocument,
  type DocumentBlock,
  type DocumentEntry,
  type DocumentHeader,
  type DocumentSection,
} from "@/lib/character-form/document-sections";

function PreviewHeader({ header }: { header: DocumentHeader }) {
  const hasName = header.characterName.trim().length > 0;
  const hasPlayer = header.playerName.trim().length > 0;
  const hasMeta = header.meta.length > 0;

  if (!hasName && !hasPlayer && !hasMeta) return null;

  return (
    <header className="space-y-2 border-b border-border/50 pb-6">
      <h2 className="text-title wrap-break-word text-foreground">
        {hasName ? header.characterName : (
          <span className="text-muted-foreground/60 italic">Sem nome</span>
        )}
      </h2>

      {hasPlayer && (
        <p className="text-body text-muted-foreground">
          por {header.playerName}
        </p>
      )}

      {hasMeta && (
        <p className="text-caption text-muted-foreground">
          {header.meta.map((m) => m.value).join(" · ")}
        </p>
      )}
    </header>
  );
}

function EntryItem({ entry }: { entry: DocumentEntry }) {
  return (
    <li className="space-y-0.5">
      <span className="text-body font-medium text-foreground">
        {entry.primary}
      </span>
      {entry.secondary && (
        <span className="text-caption text-muted-foreground">
          {" "}
          — {entry.secondary}
        </span>
      )}
      {entry.detail && (
        <p className="text-caption text-muted-foreground">{entry.detail}</p>
      )}
    </li>
  );
}

function BlockRenderer({ block }: { block: DocumentBlock }) {
  switch (block.type) {
    case "text":
      return (
        <div className="space-y-1">
          <p className="text-caption font-semibold text-muted-foreground">
            {block.label}
          </p>
          <p className="text-body text-foreground">{block.value}</p>
        </div>
      );

    case "tags":
      return (
        <div className="space-y-1.5">
          <p className="text-caption font-semibold text-muted-foreground">
            {block.label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {block.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      );

    case "entries":
      return (
        <div className="space-y-1.5">
          <p className="text-caption font-semibold text-muted-foreground">
            {block.label}
          </p>
          <ul className="space-y-2 pl-4 list-disc list-outside marker:text-muted-foreground/50">
            {block.entries.map((entry, i) => (
              <EntryItem key={i} entry={entry} />
            ))}
          </ul>
        </div>
      );

    case "note":
      return (
        <div className="space-y-1">
          <h4 className="text-body font-semibold text-foreground">
            {block.heading}
          </h4>
          {block.body && (
            <p className="text-body text-muted-foreground whitespace-pre-line">
              {block.body}
            </p>
          )}
        </div>
      );
  }
}

function SectionRenderer({ section }: { section: DocumentSection }) {
  return (
    <section className="space-y-4">
      <h3 className="text-section text-foreground">{section.title}</h3>
      <div className="space-y-4">
        {section.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
        <FileText className="h-7 w-7 text-muted-foreground/60" />
      </div>
      <div className="space-y-1">
        <p className="text-body font-medium text-foreground">
          Nenhum dado preenchido
        </p>
        <p className="text-caption text-muted-foreground">
          Preencha o formulário para ver o preview do documento.
        </p>
      </div>
    </div>
  );
}

export function DocumentPreview() {
  const { getValues } = useFormContext<CharacterFormValues>();
  const values = getValues();
  const doc = buildCharacterDocument(values);

  if (doc.isEmpty) return <EmptyState />;

  return (
    <article className="space-y-8">
      <PreviewHeader header={doc.header} />
      {doc.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </article>
  );
}
