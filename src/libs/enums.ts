import { type ValueOf } from "./utils";

export const PagePathMap = {
  Home: "/",
  Auth: "/auth",
  Courses: "/courses",
} as const;

export const TranslateRoleMap = {
  Student: "Студент",
  Admin: "Админ",
  Teacher: "Преподаватель",
} as const;

export type PagePathMap = ValueOf<typeof PagePathMap>;
export type TranslateRoleMap = ValueOf<typeof TranslateRoleMap>;
