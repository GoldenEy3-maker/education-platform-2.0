import { type BaseEditor } from "slate";
import { type HistoryEditor } from "slate-history";
import { type ReactEditor } from "slate-react";
import { type ValueOf } from "~/libs/utils";

export const ElementTypeMap = {
  Paragraph: "paragraph",
  BulletedList: "bulleted-list",
  NumberedList: "numbered-list",
  ListItem: "list-item",
} as const;

export const ElementAlignMap = {
  Center: "center",
  Left: "left",
  Right: "right",
  Justify: "justify",
} as const;

export const ElementListTypeMap = {
  Bulleted: "bulleted-list",
  Numbered: "numbered-list",
} as const;

export type ElementListTypeMap = ValueOf<typeof ElementListTypeMap>;
export type ElementAlignMap = ValueOf<typeof ElementAlignMap>;
export type ElementTypeMap = ValueOf<typeof ElementTypeMap>;

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type CustomElement = {
  type: ElementTypeMap;
  align?: ElementAlignMap;
  children: CustomText[];
};

export type FormattedText = {
  text: string;
  bold?: true;
  italic?: true;
  underline?: true;
};

export type TextFormat = keyof Omit<FormattedText, "text">;
export type ElementTypes = CustomElement["type"];
export type ElementFormat = ElementAlignMap | ElementTypes;

export type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
