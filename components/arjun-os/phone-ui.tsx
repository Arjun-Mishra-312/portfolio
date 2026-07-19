"use client";

import { Search } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

export function usePhonePresentationState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try { return JSON.parse(sessionStorage.getItem(`arjun-os-phone-${key}`) ?? "null") ?? initial; } catch { return initial; }
  });
  useEffect(() => { sessionStorage.setItem(`arjun-os-phone-${key}`, JSON.stringify(value)); }, [key, value]);
  return [value, setValue] as const;
}

export function PhoneLargeTitle({ title, eyebrow, trailing }: { title: string; eyebrow?: string; trailing?: ReactNode }) {
  return (
    <header className="os-phone-large-title">
      <div>
        {eyebrow && <p className="os-phone-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
      </div>
      {trailing}
    </header>
  );
}

export function PhoneSearch({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="os-phone-search">
      <Search aria-hidden />
      <span className="sr-only">{placeholder}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type="search" />
    </label>
  );
}

export function PhoneSegmented<T extends string>({ value, options, onChange, label }: { value: T; options: readonly T[]; onChange: (value: T) => void; label: string }) {
  return (
    <div className="os-phone-segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button key={option} type="button" className={cn(value === option && "is-active")} aria-pressed={value === option} onClick={() => onChange(option)}>{option}</button>
      ))}
    </div>
  );
}

export function PhoneSection({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("os-phone-section", className)}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}
