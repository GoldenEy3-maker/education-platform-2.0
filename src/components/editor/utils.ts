import { Editor, Element, Transforms } from "slate";
import {
  ElementAlignMap,
  ElementListTypeMap,
  type CustomEditor,
  type CustomElement,
  type ElementFormat,
  type ElementTypeMap,
  type TextFormat,
} from "./types";

export const toggleMark = (editor: CustomEditor, format: TextFormat) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isMarkActive = (editor: CustomEditor, format: TextFormat) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const isBlockActive = (
  editor: CustomEditor,
  format: ElementFormat,
  blockType: keyof Omit<CustomElement, "children"> = "type",
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => {
        return (
          !Editor.isEditor(n) && Element.isElement(n) && n[blockType] === format
        );
      },
    }),
  );

  return !!match;
};

export const toggleBlock = (editor: CustomEditor, format: ElementFormat) => {
  const isActive = isBlockActive(
    editor,
    format,
    Object.values(ElementAlignMap).includes(format) ? "align" : "type",
  );
  const isList = Object.values(ElementListTypeMap).includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      Object.values(ElementListTypeMap).includes(n.type) &&
      !Object.values(ElementAlignMap).includes(format),
    split: true,
  });
  let newProperties: Partial<CustomElement>;
  if (Object.values(ElementAlignMap).includes(format)) {
    newProperties = {
      align: isActive ? undefined : (format as ElementAlignMap),
    };
  } else {
    newProperties = {
      type: isActive
        ? "paragraph"
        : isList
          ? "list-item"
          : (format as ElementTypeMap),
    };
  }
  Transforms.setNodes<Element>(editor, newProperties);

  if (!isActive && isList) {
    const block: CustomElement = {
      type: format as ElementTypeMap,
      children: [],
    };
    Transforms.wrapNodes(editor, block);
  }
};
