"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import type { Locale } from "@/lib/i18n/config";
import { getMessageValue } from "@/lib/i18n/format-message";

export type MessagesRecord = Record<string, unknown>;

type IntlContextValue = {
  locale: Locale;
  messages: MessagesRecord;
  t: (path: string) => string;
};

const IntlContext = createContext<IntlContextValue | null>(null);

export function AppIntlProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: MessagesRecord;
  children: ReactNode;
}) {
  const value = useMemo<IntlContextValue>(() => {
    const t = (path: string) => getMessageValue(messages, path) ?? path;
    return { locale, messages, t };
  }, [locale, messages]);

  return (
    <IntlContext.Provider value={value}>{children}</IntlContext.Provider>
  );
}

export function useIntl() {
  const ctx = useContext(IntlContext);
  if (!ctx) {
    throw new Error("useIntl must be used within AppIntlProvider");
  }
  return ctx;
}
