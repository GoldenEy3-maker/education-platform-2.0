import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AttachmentsMap, type AttachmentExtensionsMap } from "./enums";

export type ValueOf<T> = T[keyof T];

export const capitalizeFirstLetter = (str: string) =>
  str.at(0)!.toUpperCase() + str.slice(1);

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getRandomInt = (min: number, max: number) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};

export const getPersonInitials = (
  surname: string,
  name: string,
  fathername?: string | null,
) => {
  const main = surname + " " + name.at(0) + ".";

  return fathername ? main + " " + fathername?.at(0) + "." : main;
};

export const getFirstLettersUserCredentials = (
  surname: string,
  name: string,
) => {
  const surnameLetter = surname.at(0);
  const nameLetter = name.at(0);

  if (!surnameLetter && !nameLetter) return "";

  if (!surnameLetter) return nameLetter;
  if (!nameLetter) return surnameLetter;

  return surnameLetter + nameLetter;
};

const AttachmentKeys = Object.keys(AttachmentsMap);

export const handleAttachment = (attachment: {
  name: string;
  href: string | null;
}): [string, { icon: React.ReactNode; color: string }] => {
  const lastIndex = attachment.name.lastIndexOf(".");
  const name = attachment.name.substring(0, lastIndex);
  const ext = attachment.name.substring(lastIndex + 1);
  const template = attachment.href
    ? AttachmentsMap.LINK
    : AttachmentKeys.includes(ext.toLocaleUpperCase())
      ? AttachmentsMap[ext.toUpperCase() as AttachmentExtensionsMap]
      : AttachmentsMap.UNKNOWN;

  return [name, template];
};
