import { type Role } from "@prisma/client";
import { type ValueOf } from "./utils";

export const PagePathMap = {
  Home: "/",
  Auth: "/auth",
  Courses: "/courses",
  Course: "/courses/",
  HomeChat: "/chat",
  Chat: "/chat/",
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

export type PagePathMap = ValueOf<typeof PagePathMap>;
export type RoleContentMap = ValueOf<typeof RoleContentMap>;
export type StatusCourseMap = ValueOf<typeof StatusCourseMap>;
