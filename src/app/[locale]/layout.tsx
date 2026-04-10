import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppIntlProvider } from "@/components/i18n/app-intl-provider";
import { LocaleHtmlLang } from "@/components/i18n/locale-html-lang";
import { AppShell } from "@/components/layout/app-shell";
import { type Locale, isLocale, locales } from "@/lib/i18n/config";
import { getMessageValue } from "@/lib/i18n/format-message";
import { loadMessages } from "@/lib/i18n/messages-loader";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    return { title: "Meu Background" };
  }
  const messages = await loadMessages(raw);
  const titleDefault =
    getMessageValue(messages, "meta.titleDefault") ?? "Meu Background";
  const description = getMessageValue(messages, "meta.description") ?? "";
  const titleTemplateRaw =
    getMessageValue(messages, "meta.titleTemplate") ?? "{title} · Meu Background";
  const titleTemplate = titleTemplateRaw.replace("{title}", "%s");

  return {
    title: {
      default: titleDefault,
      template: titleTemplate,
    },
    description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const messages = await loadMessages(locale);

  return (
    <AppIntlProvider locale={locale} messages={messages}>
      <LocaleHtmlLang />
      <AppShell>{children}</AppShell>
    </AppIntlProvider>
  );
}
