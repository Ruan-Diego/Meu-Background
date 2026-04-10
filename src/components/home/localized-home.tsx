"use client";

import Link from "next/link";
import { ArrowRight, Eye, FileDown, Layers3 } from "lucide-react";

import { useIntl } from "@/components/i18n/app-intl-provider";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { withLocalePath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

export function LocalizedHome() {
  const { locale, t } = useIntl();

  const cards = [
    { icon: Layers3, titleKey: "home.card1Title", bodyKey: "home.card1Body" },
    { icon: Eye, titleKey: "home.card2Title", bodyKey: "home.card2Body" },
    {
      icon: FileDown,
      titleKey: "home.card3Title",
      bodyKey: "home.card3Body",
    },
  ] as const;

  return (
    <div className="page-section">
      <div className="layout-shell flex flex-col gap-10">
        <section className="space-y-6">
          <span className="inline-flex rounded-full border border-border/70 bg-card/80 px-3 py-1 text-caption font-medium text-muted-foreground">
            {t("home.badge")}
          </span>
          <div className="space-y-4">
            <h1 className="text-display max-w-3xl">{t("home.heroTitle")}</h1>
            <p className="text-lead max-w-2xl text-muted-foreground text-pretty">
              {t("home.heroLead")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={withLocalePath(locale, "/criar")}
              className={cn(
                buttonVariants({ size: "lg" }),
                "inline-flex rounded-full px-5"
              )}
            >
              {t("home.ctaPrimary")}
              <ArrowRight aria-hidden />
            </Link>
            <Link
              href="#como-funciona"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "inline-flex rounded-full px-5"
              )}
            >
              {t("home.ctaSecondary")}
            </Link>
          </div>
        </section>

        <section
          id="como-funciona"
          className="grid gap-4 scroll-mt-28 md:grid-cols-3"
        >
          {cards.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.titleKey} className="h-full">
                <CardHeader>
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <CardTitle>{t(item.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-body text-muted-foreground text-pretty">
                    {t(item.bodyKey)}
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
