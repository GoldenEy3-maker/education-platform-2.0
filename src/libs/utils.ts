import { generateReactHelpers } from "@uploadthing/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { FileRouter } from "~/server/uploadthing";
import { AttachmentsMap, type AttachmentExtensionsMap } from "./enums";

export type ValueOf<T> = T[keyof T];

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<FileRouter>();

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

export const handleFileName = (filename: string) => {
  const lastIndex = filename.lastIndexOf(".");
  const name = filename.substring(0, lastIndex);
  const ext = filename.substring(lastIndex + 1);

  return [name, ext] as const;
};

export const handleAttachment = (attachment: {
  name: string;
  isLink: boolean;
}): [string, { icon: React.ReactNode; color: string }] => {
  if (attachment.isLink) return [attachment.name, AttachmentsMap.LINK];

  const [name, ext] = handleFileName(attachment.name);

  const template = AttachmentKeys.includes(ext.toUpperCase())
    ? AttachmentsMap[ext.toUpperCase() as AttachmentExtensionsMap]
    : AttachmentsMap.UNKNOWN;

  return [name, template];
};

export const prepareSearchMatching = (str: string) => {
  return str.toUpperCase().trim();
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const getUploadUrlKey = (url: string) => {
  const lastIndex = url.lastIndexOf("/");

  return url.substring(lastIndex + 1);
};

export const isValidUrl = (str: string) => {
  let url;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};
