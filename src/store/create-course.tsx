import { type CourseAttachment } from "@prisma/client";
import { create } from "zustand";

type CreateCourseStore = {
  title: string;
  description: string;
  files: CourseAttachment[];
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setFiles: (files: CourseAttachment[]) => void;
};

export const useCreateCourseStore = create<CreateCourseStore>((set) => ({
  title: "",
  description: "",
  files: [],
  setTitle: (value) => set({ title: value }),
  setDescription: (value) => set({ description: value }),
  setFiles: (files) => set({ files: files }),
}));
