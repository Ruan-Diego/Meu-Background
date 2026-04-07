"use client";

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const EMPTY_VALUE = "__empty__";

type RhfCountrySelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  id: string;
  options: readonly string[];
  "aria-invalid"?: boolean | undefined;
  "aria-describedby"?: string | undefined;
  triggerClassName?: string;
};

export function RhfCountrySelect<T extends FieldValues>({
  control,
  name,
  id,
  options,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  triggerClassName,
}: RhfCountrySelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          value={field.value === "" ? EMPTY_VALUE : field.value}
          onValueChange={(value) => {
            field.onChange(value === EMPTY_VALUE ? "" : value);
          }}
        >
          <SelectTrigger
            id={id}
            size="default"
            className={cn(
              "h-9 w-full min-w-0 shadow-xs bg-background",
              triggerClassName
            )}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
          >
            <SelectValue placeholder="Selecione…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EMPTY_VALUE}>Selecione…</SelectItem>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

type RhfEnumSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  id: string;
  options: readonly string[];
  optionLabel: (value: string) => string;
  "aria-invalid"?: boolean | undefined;
  "aria-describedby"?: string | undefined;
  triggerClassName?: string;
};

export function RhfEnumStringSelect<T extends FieldValues>({
  control,
  name,
  id,
  options,
  optionLabel,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  triggerClassName,
}: RhfEnumSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger
            id={id}
            size="default"
            className={cn(
              "h-9 w-full min-w-0 shadow-xs bg-background",
              triggerClassName
            )}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {optionLabel(opt)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
