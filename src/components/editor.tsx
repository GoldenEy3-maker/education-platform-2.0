import React, { useEffect, useRef, useState } from "react";
import { BiBold, BiItalic, BiUnderline } from "react-icons/bi";
import {
  createEditor,
  Range,
  Editor as SlateEditor,
  Element as SlateElement,
  Transforms,
  type BaseEditor,
  type Descendant,
} from "slate";
import { withHistory, type HistoryEditor } from "slate-history";
import {
  Editable,
  Slate,
  useFocused,
  useSlate,
  withReact,
  type ReactEditor,
} from "slate-react";
import {
  type EditableProps,
  type RenderElementProps,
  type RenderLeafProps,
} from "slate-react/dist/components/editable";
import { EditorElementAlignMap, EditorElementListTypeMap } from "~/libs/enums";
import { cn } from "~/libs/utils";
import { Button } from "./ui/button";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type ParagraphElement = {
  type: "paragraph";
  align?: EditorElementAlignMap;
  children: CustomText[];
};

export type HeadingElement = {
  type: "heading";
  align?: EditorElementAlignMap;
  level: number;
  children: CustomText[];
};

export type BulletedListElement = {
  type: "bulleted-list";
  children: CustomText[];
};

export type NumberedListElement = {
  type: "bulleted-list";
  children: CustomText[];
};

export type ListItemElement = {
  type: "list-item";
  align?: EditorElementAlignMap;
  children: CustomText[];
};

export type CustomElement =
  | ParagraphElement
  | HeadingElement
  | BulletedListElement
  | ListItemElement;

export type FormattedText = {
  text: string;
  bold?: true;
  italic?: true;
  underline?: true;
};

export type TextFormat = keyof Omit<FormattedText, "text">;
export type ElementFormat = EditorElementAlignMap | CustomElement["type"];

export type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [
      {
        text: "",
      },
    ],
  },
];

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;

  return <span {...attributes}>{children}</span>;
};

const Heading: React.FC<
  Pick<RenderElementProps, "attributes"> &
    React.HTMLAttributes<HTMLHeadElement> & { level: number }
> = ({ level, children, attributes, ...props }) => {
  switch (level) {
    case 1:
      return (
        <h1 {...props} {...attributes}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 {...props} {...attributes}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 {...props} {...attributes}>
          {children}
        </h3>
      );
    case 4:
      return (
        <h4 {...props} {...attributes}>
          {children}
        </h4>
      );
    case 5:
      return (
        <h5 {...props} {...attributes}>
          {children}
        </h5>
      );
    case 6:
      return (
        <h6 {...props} {...attributes}>
          {children}
        </h6>
      );
  }
};

const Element: React.FC<RenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  switch (element.type) {
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "list-item":
      return (
        <li style={{ textAlign: element.align }} {...attributes}>
          {children}
        </li>
      );
    case "heading":
      return (
        <Heading
          style={{ textAlign: element.align }}
          level={element.level}
          attributes={attributes}
        >
          {children}
        </Heading>
      );
    default:
      return (
        <p style={{ textAlign: element.align }} {...attributes}>
          {children}
        </p>
      );
  }
};

const toggleMark = (editor: CustomEditor, format: TextFormat) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    SlateEditor.removeMark(editor, format);
  } else {
    SlateEditor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor: CustomEditor, format: TextFormat) => {
  const marks = SlateEditor.marks(editor);
  return marks ? marks[format] === true : false;
};

const isBlockActive = (
  editor: CustomEditor,
  format: ElementFormat,
  blockType: keyof Omit<CustomElement, "children"> = "type",
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    SlateEditor.nodes(editor, {
      at: SlateEditor.unhangRange(editor, selection),
      match: (n) => {
        return (
          !SlateEditor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n[blockType] === format
        );
      },
    }),
  );

  return !!match;
};

const toggleBlock = (editor: CustomEditor, format: ElementFormat) => {
  const isFormatAlignValues = Object.values(EditorElementAlignMap).includes(
    format,
  );

  const isActive = isBlockActive(
    editor,
    format,
    isFormatAlignValues ? "align" : "type",
  );

  const isList = Object.values(EditorElementListTypeMap).includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !SlateEditor.isEditor(n) &&
      SlateElement.isElement(n) &&
      Object.values(EditorElementListTypeMap).includes(n.type) &&
      !isFormatAlignValues,
    split: true,
  });

  Transforms.setNodes(
    editor,
    isFormatAlignValues
      ? { align: isActive ? undefined : (format as EditorElementAlignMap) }
      : {
          type: isActive
            ? "paragraph"
            : isList
              ? "list-item"
              : (format as EditorElementListTypeMap),
        },
  );

  if (!isActive && isList) {
    const block: CustomElement = {
      type: format as EditorElementListTypeMap,
      children: [],
    };
    Transforms.wrapNodes(editor, block);
  }
};

const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  const marks = SlateEditor.marks(editor);

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      SlateEditor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();

    if (!domSelection) return;

    const domRange = domSelection.getRangeAt(0);

    const rect = domRange.getBoundingClientRect();
    el.style.visibility = "visible";
    el.style.opacity = "1";
    el.style.marginTop = "-0.5rem";
    el.style.top = `${rect.top + window.scrollY - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.scrollX - el.offsetWidth / 2 + rect.width / 2
    }px`;
    setTimeout(() => {
      el.style.transition =
        "left 300ms ease, top 300ms ease, visibity 300ms ease, opacity 300ms ease, margin-top 300ms ease";
    }, 50);
  });

  return (
    <div
      ref={ref}
      className="invisible absolute left-0 top-0 z-10 mt-0 rounded-lg border border-border bg-background p-1 opacity-0 shadow-sm transition-[visiblity,opacity,margin-top] duration-300"
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      <ToggleGroup value={marks ? Object.keys(marks) : []} type="multiple">
        <ToggleGroupItem
          value="bold"
          onClick={() => toggleMark(editor, "bold")}
        >
          <BiBold className="text-xl" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          onClick={() => toggleMark(editor, "italic")}
        >
          <BiItalic className="text-xl" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          onClick={() => toggleMark(editor, "underline")}
        >
          <BiUnderline className="text-xl" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export const Editor: React.FC<EditableProps> = ({
  className,
  onBlur,
  ...props
}) => {
  const [editor] = useState(() => withHistory(withReact(createEditor())));

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        renderPlaceholder={({ children, attributes }) => (
          <span className="text-muted-foreground !opacity-100" {...attributes}>
            {children}
          </span>
        )}
        renderLeaf={(props) => <Leaf {...props} />}
        renderElement={(props) => <Element {...props} />}
        className={cn(
          "hidden-scrollbar !min-h-28 w-full overflow-auto rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground placeholder-shown:truncate focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onDOMBeforeInput={(event: InputEvent) => {
          switch (event.inputType) {
            case "formatBold":
              event.preventDefault();
              return toggleMark(editor, "bold");
            case "formatItalic":
              event.preventDefault();
              return toggleMark(editor, "italic");
            case "formatUnderline":
              event.preventDefault();
              return toggleMark(editor, "underline");
          }
        }}
        onBlur={(event) => {
          if (onBlur) onBlur(event);
        }}
        {...props}
      />
      <HoveringToolbar />
    </Slate>
  );
};
