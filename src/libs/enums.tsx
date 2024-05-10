import { type Role, type TaskType } from "@prisma/client";
import { BiImage, BiLink } from "react-icons/bi";
import { SiGimp } from "react-icons/si";
import {
  TbFileDatabase,
  TbFileTextAi,
  TbFileTypeBmp,
  TbFileTypeCss,
  TbFileTypeCsv,
  TbFileTypeDoc,
  TbFileTypeDocx,
  TbFileTypeHtml,
  TbFileTypeJpg,
  TbFileTypeJs,
  TbFileTypeJsx,
  TbFileTypePdf,
  TbFileTypePhp,
  TbFileTypePng,
  TbFileTypePpt,
  TbFileTypeSql,
  TbFileTypeSvg,
  TbFileTypeTs,
  TbFileTypeTsx,
  TbFileTypeTxt,
  TbFileTypeXls,
  TbFileTypeXml,
  TbFileUnknown,
  TbFileZip,
  TbGif,
} from "react-icons/tb";
import { type ValueOf } from "./utils";

export const PagePathMap = {
  Home: "/",
  Auth: "/auth",
  Courses: "/courses",
  Course: "/courses/",
  HomeChat: "/chat",
  Chat: "/chat/",
  Profile: "/profile/",
  Schedule: "/schedule",
  ResetPassword: "/reset-password",
  Settings: "/settings",
  CreateCourse: "/courses/create",
  CreateCourseContent: "/courses/create/content",
  CreateCourseSettings: "/courses/create/settings",
} as const;

export const RoleContentMap: Record<Role, string> = {
  Student: "Студент",
  Admin: "Админ",
  Teacher: "Преподаватель",
} as const;

export const StatusCourseMap = {
  Published: "Published",
  Archived: "Archived",
} as const;

export const StatusCourseContentMap: Record<StatusCourseMap, string> = {
  Archived: "Архивирован",
  Published: "Опубликован",
};

export const TaskTypeContentMap: Record<TaskType, string> = {
  Lec: "Лекция",
  Quiz: "Тест",
  Pract: "Практическая",
};

export const AttachmentExtensionsMap = {
  LINK: "LINK",
  CSV: "CSV",
  XLS: "XLS",
  XLSX: "XLSX",
  PDF: "PDF",
  DOC: "DOC",
  DOCX: "DOCX",
  RAR: "RAR",
  ZIP: "ZIP",
  PNG: "PNG",
  JPG: "JPG",
  JPEG: "JPEG",
  AVIF: "AVIF",
  WEBP: "WEBP",
  XCF: "XCF",
  BMP: "BMP",
  SVG: "SVG",
  PSD: "PSD",
  TIFF: "TIFF",
  GIF: "GIF",
  HEIF: "HEIF",
  HEIC: "HEIC",
  AI: "AI",
  CDR: "CDR",
  PPT: "PPT",
  PPTX: "PPTX",
  XML: "XML",
  CSS: "CSS",
  HTML: "HTML",
  JS: "JS",
  JSX: "JSX",
  PHP: "PHP",
  SQL: "SQL",
  DB: "DB",
  TXT: "TXT",
  TS: "TS",
  TSX: "TSX",
  UNKNONW: "UNKNOWN",
} as const;

export const AttachmentsMap: Record<
  AttachmentExtensionsMap,
  { icon: React.ReactNode; color: string }
> = {
  LINK: {
    icon: <BiLink className="text-[hsl(265,86%,60%)]" />,
    color: "hsl(265,86%,60%)",
  },
  CSS: {
    icon: <TbFileTypeCss />,
    color: "",
  },
  HTML: {
    icon: <TbFileTypeHtml />,
    color: "",
  },
  JS: {
    icon: <TbFileTypeJs />,
    color: "",
  },
  JSX: {
    icon: <TbFileTypeJsx />,
    color: "",
  },
  TS: {
    icon: <TbFileTypeTs />,
    color: "",
  },
  TSX: {
    icon: <TbFileTypeTsx />,
    color: "",
  },
  XML: {
    icon: <TbFileTypeXml />,
    color: "",
  },
  AI: {
    icon: <TbFileTextAi />,
    color: "",
  },
  AVIF: {
    icon: <BiImage className="text-warning" />,
    color: "theme('colors.warning.DEFAULT')",
  },
  CDR: {
    icon: <BiImage className="text-warning" />,
    color: "theme('colors.warning.DEFAULT')",
  },
  JPG: {
    icon: <TbFileTypeJpg className="text-warning" />,
    color: "theme('colors.warning.DEFAULT')",
  },
  JPEG: {
    icon: <TbFileTypeJpg className="text-warning" />,
    color: "theme('colors.warning.DEFAULT')",
  },
  PNG: {
    icon: <TbFileTypePng className="text-warning" />,
    color: "theme('colors.warning.DEFAULT')",
  },
  BMP: {
    icon: <TbFileTypeBmp className="text-warning" />,
    color: "theme('color.warning.DEFAULT')",
  },
  GIF: {
    icon: <TbGif className="text-warning" />,
    color: "theme('colors.warning.DEFAULT')",
  },
  HEIC: {
    icon: <BiImage className="text-warning" />,
    color: "theme('colors.warning.DEFAULT')",
  },
  HEIF: {
    icon: <BiImage className="text-warning" />,
    color: "theme('colors.warning.DEFAULT')",
  },
  PSD: {
    icon: <BiImage className="text-warning" />,
    color: "theme('colors.warning.DEFAULT')",
  },
  XCF: {
    icon: <SiGimp className="text-warning" />,
    color: "theme('colors.warning.DEFAULT')",
  },
  WEBP: {
    icon: <BiImage className="text-warning" />,
    color: "theme('colors.warning.DEFAULT')",
  },
  SVG: {
    icon: <TbFileTypeSvg className="text-warning" />,
    color: "theme('colors.warning.DEFAULT')",
  },
  TIFF: {
    icon: <BiImage className="text-warning" />,
    color: "theme('colors.warning.DEFAULT')",
  },
  PDF: {
    icon: <TbFileTypePdf className="text-[hsl(14,86%,57%)]" />,
    color: "hsl(14,86%,57%)",
  },
  CSV: {
    icon: <TbFileTypeCsv className="text-useful" />,
    color: "theme('colors.useful.DEFAULT')",
  },
  XLS: {
    icon: <TbFileTypeXls className="text-useful" />,
    color: "theme('colors.useful.DEFAULT')",
  },
  XLSX: {
    icon: <TbFileTypeXls className="text-useful" />,
    color: "theme('colors.useful.DEFAULT')",
  },
  RAR: {
    icon: <TbFileZip className="text-destructive" />,
    color: "theme('colors.destructive.DEFAULT')",
  },
  ZIP: {
    icon: <TbFileZip className="text-destructive" />,
    color: "theme('colors.destructive.DEFAULT')e",
  },
  DOC: {
    icon: <TbFileTypeDoc className="text-primary" />,
    color: "theme('colors.primary.DEFAULT')",
  },
  DOCX: {
    icon: <TbFileTypeDocx className="text-primary" />,
    color: "theme('colors.primary.DEFAULT')",
  },
  PPT: {
    icon: <TbFileTypePpt />,
    color: "",
  },
  PPTX: {
    icon: <TbFileTypePpt />,
    color: "",
  },
  PHP: {
    icon: <TbFileTypePhp />,
    color: "",
  },
  DB: {
    icon: <TbFileDatabase />,
    color: "",
  },
  SQL: {
    icon: <TbFileTypeSql />,
    color: "",
  },
  TXT: {
    icon: <TbFileTypeTxt />,
    color: "",
  },
  UNKNOWN: {
    icon: <TbFileUnknown />,
    color: "",
  },
};

export type PagePathMap = ValueOf<typeof PagePathMap>;
export type RoleContentMap = ValueOf<typeof RoleContentMap>;
export type StatusCourseMap = ValueOf<typeof StatusCourseMap>;
export type AttachmentExtensionsMap = ValueOf<typeof AttachmentExtensionsMap>;
