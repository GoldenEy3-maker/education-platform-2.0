import { type CourseAttachment } from "@prisma/client";
import { create } from "zustand";

type CreateCourseStore = {
  fullTitle: string;
  shortTitle: string;
  description: string;
  files: CourseAttachment[];
  setFullTitle: (value: string) => void;
  setShortTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setFiles: (files: CourseAttachment[]) => void;
};

export const useCreateCourseStore = create<CreateCourseStore>((set) => ({
  fullTitle: "",
  shortTitle: "",
  description: "",
  files: [],
  setFullTitle: (value) => set({ fullTitle: value }),
  setShortTitle: (value) => set({ shortTitle: value }),
  setDescription: (value) => set({ description: value }),
  setFiles: (files) => set({ files: files }),
}));
