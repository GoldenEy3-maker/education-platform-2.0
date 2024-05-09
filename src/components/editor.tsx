import React, { forwardRef, useEffect, useRef, useState } from "react";
import { BiBold, BiItalic, BiUnderline } from "react-icons/bi";
import {
  createEditor,
  Range,
  Editor as SlateEditor,
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
  type RenderLeafProps,
} from "slate-react/dist/components/editable";
import { cn } from "~/libs/utils";
import { Button } from "./ui/button";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

export type HeadingElement = {
  type: "heading";
  level: number;
  children: CustomText[];
};

export type CustomElement = ParagraphElement | HeadingElement;

export type FormattedText = {
  text: string;
  bold?: true;
  italic?: true;
  underline?: true;
};

export type TextFormat = keyof Omit<FormattedText, "text">;

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
    el.style.top = `${rect.top + window.scrollY - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.scrollX - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

  return (
    <div
      ref={ref}
      className="invisible absolute -left-full -top-full z-10 !-mt-2 rounded-lg border border-border bg-background p-1 opacity-0 shadow-sm transition-[visiblity,opacity] duration-300"
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
      <HoveringToolbar />
      <Editable
        renderPlaceholder={({ children, attributes }) => (
          <span className="text-muted-foreground !opacity-100" {...attributes}>
            {children}
          </span>
        )}
        renderLeaf={(props) => <Leaf {...props} />}
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
    </Slate>
  );
};
