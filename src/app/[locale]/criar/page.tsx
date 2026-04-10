import type { Metadata } from "next";

import { LocalizedCriarPage } from "@/components/criar/localized-criar-page";
import { isLocale } from "@/lib/i18n/config";
import { formatMessage, getMessageValue } from "@/lib/i18n/format-message";
import { loadMessages } from "@/lib/i18n/messages-loader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const messages = await loadMessages(raw);
  const criarTitle = getMessageValue(messages, "meta.criarTitle") ?? "";
  const titleTemplate =
    getMessageValue(messages, "meta.titleTemplate") ??
    "{title} · Meu Background";

  return {
    title: formatMessage(titleTemplate, { title: criarTitle }),
  };
}

export default function CriarPage() {
  return <LocalizedCriarPage />;
}
