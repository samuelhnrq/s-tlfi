import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function tn(...classes: ClassValue[]): string {
  return twMerge(clsx(classes))
}

export { tn }
