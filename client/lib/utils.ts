import clsx, { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Combine conditional class names and merge Tailwind classes intelligently
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
