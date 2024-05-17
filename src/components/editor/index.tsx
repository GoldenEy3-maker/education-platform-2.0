import React, { useState } from "react";
import { createEditor, type Descendant } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import {
  type EditableProps,
  type RenderElementProps,
  type RenderLeafProps,
} from "slate-react/dist/components/editable";
import { cn } from "~/libs/utils";
import { Toolbar } from "./toolbar";
import { toggleMark } from "./utils";

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
  return (
    <span
      style={{
        fontWeight: leaf.bold ? "bold" : "normal",
        fontStyle: leaf.italic ? "italic" : "normal",
        textDecoration: leaf.underline ? "underline" : "none",
      }}
      {...attributes}
    >
      {children}
    </span>
  );
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
      return (
        <ul className="list-inside list-disc" {...attributes}>
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol className="list-inside list-decimal" {...attributes}>
          {children}
        </ol>
      );
    case "list-item":
      return (
        <li style={{ textAlign: element.align }} {...attributes}>
          {children}
        </li>
      );
    default:
      return (
        <p style={{ textAlign: element.align }} {...attributes}>
          {children}
        </p>
      );
  }
};

export const Editor: React.FC<EditableProps> = ({
  className,
  onBlur,
  ...props
}) => {
  const [editor] = useState(() => withHistory(withReact(createEditor())));

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <div className="relative rounded-md border border-input shadow-sm">
        <Editable
          renderPlaceholder={({ children, attributes }) => (
            <span
              className="!top-auto pr-4 text-muted-foreground !opacity-100"
              {...attributes}
            >
              {children}
            </span>
          )}
          renderLeaf={(props) => <Leaf {...props} />}
          renderElement={(props) => <Element {...props} />}
          className={cn(
            "hidden-scrollbar mb-[1px] !min-h-28 w-full overflow-auto rounded-t-md bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground placeholder-shown:truncate focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
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
        <Toolbar />
      </div>
      {/* <HoveringToolbar /> */}
    </Slate>
  );
};