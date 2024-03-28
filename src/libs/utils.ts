import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export type ValueOf<T> = T[keyof T];

export const capitalizeFirstLetter = (str: string) =>
  str.at(0)!.toUpperCase() + str.slice(1);

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
