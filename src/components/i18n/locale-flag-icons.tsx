"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

type FlagIconProps = {
  className?: string;
};

/** Brazil — cores aproximadas; SVG funciona no Windows (emoji de bandeira costuma falhar). */
export function BrazilFlagIcon({ className }: FlagIconProps) {
  return (
    <svg
      className={cn("size-4 shrink-0 overflow-hidden rounded-[2px]", className)}
      viewBox="0 0 20 14"
      aria-hidden
    >
      <rect width="20" height="14" fill="#009c3b" />
      <path d="M10 2.2 17.2 7 10 11.8 2.8 7Z" fill="#ffdf00" />
      <circle cx="10" cy="7" r="2.85" fill="#002776" />
    </svg>
  );
}

/** Reino Unido (Union Jack) — locale `en`; baseado no desenho simplificado usual (proporção 2:1). */
export function UkFlagIcon({ className }: FlagIconProps) {
  const raw = useId().replace(/:/g, "");
  const clipOuter = `uk-s-${raw}`;
  const clipTri = `uk-t-${raw}`;

  return (
    <svg
      className={cn("size-4 shrink-0 overflow-hidden rounded-[2px]", className)}
      viewBox="0 0 60 30"
      aria-hidden
    >
      <defs>
        <clipPath id={clipOuter}>
          <path d="M0,0 v30 h60 V0 H0 z" />
        </clipPath>
        <clipPath id={clipTri}>
          <path d="M30,15 h30 v15 z v15 H0 z H0 V0 z H30 V15 z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipOuter})`}>
        <path fill="#012169" d="M0,0 v30 h60 V0 H0 z" />
        <path
          stroke="#fff"
          strokeWidth="6"
          d="M0,0 L60,30 M60,0 L0,30"
        />
        <path
          stroke="#c8102e"
          strokeWidth="4"
          clipPath={`url(#${clipTri})`}
          d="M0,0 L60,30 M60,0 L0,30"
        />
        <path stroke="#fff" strokeWidth="10" d="M30,0 v30 M0,15 h60" />
        <path stroke="#c8102e" strokeWidth="6" d="M30,0 v30 M0,15 h60" />
      </g>
    </svg>
  );
}
