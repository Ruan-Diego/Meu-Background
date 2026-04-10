import type { Locale } from "@/lib/i18n/config";

export type Messages = Record<string, unknown>;

export async function loadMessages(locale: Locale): Promise<Messages> {
  switch (locale) {
    case "pt-BR":
      return (await import("../../../messages/pt-BR.json")).default as Messages;
    case "en":
      return (await import("../../../messages/en.json")).default as Messages;
    default: {
      const _exhaustive: never = locale;
      return _exhaustive;
    }
  }
}
