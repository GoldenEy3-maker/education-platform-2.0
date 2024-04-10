import { type Role } from "@prisma/client";
import { type ValueOf } from "./utils";

export const PagePathMap = {
  Home: "/",
  Auth: "/auth",
  Courses: "/courses",
  Course: "/courses/",
} as const;

export const TranslatedRoleMap: Record<Role, string> = {
  Student: "Студент",
  Admin: "Админ",
  Teacher: "Преподаватель",
} as const;

export const StatusCourseMap = {
  Published: "Published",
  Archived: "Archived",
} as const;

export const TranslatedStatusCourseMap: Record<StatusCourseMap, string> = {
  Archived: "Архивирован",
  Published: "Опубликован",
};

export type PagePathMap = ValueOf<typeof PagePathMap>;
export type TranslateRoleMap = ValueOf<typeof TranslatedRoleMap>;
export type StatusCourseMap = ValueOf<typeof StatusCourseMap>;
