import { useEffect, useRef } from "react";
import {
  BiAlignJustify,
  BiAlignLeft,
  BiAlignMiddle,
  BiAlignRight,
  BiBold,
  BiHeading,
  BiItalic,
  BiListUl,
  BiUnderline,
} from "react-icons/bi";
import { Editor, Range } from "slate";
import {
  ReactEditor,
  useFocused,
  useSlate,
  useSlateSelection,
} from "slate-react";
import { useEventListener } from "usehooks-ts";
import { cn } from "~/libs/utils";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { isBlockActive, isMarkActive, toggleBlock, toggleMark } from "./utils";

export const HoveringToolbar: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) return;

    if (
      !selection ||
      // !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
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
    }, 10);
  });

  return (
    <div
      ref={ref}
      className="invisible absolute left-0 top-0 z-10 mt-0 flex items-center gap-1 rounded-lg border border-border bg-background p-1 opacity-0 shadow-sm transition-[visiblity,opacity,margin-top] duration-300"
      onMouseDown={(e) => e.preventDefault()}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("shrink-0", {
          "bg-muted": isMarkActive(editor, "bold"),
        })}
        onClick={() => toggleMark(editor, "bold")}
      >
        <BiBold className="text-xl" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("shrink-0", {
          "bg-muted": isMarkActive(editor, "italic"),
        })}
        onClick={() => toggleMark(editor, "italic")}
      >
        <BiItalic className="text-xl" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("shrink-0", {
          "bg-muted": isMarkActive(editor, "underline"),
        })}
        onClick={() => toggleMark(editor, "underline")}
      >
        <BiUnderline className="text-xl" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("shrink-0", {
          "bg-muted": isBlockActive(editor, "left", "align"),
        })}
        onClick={() => toggleBlock(editor, "left")}
      >
        <BiAlignLeft className="text-xl" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("shrink-0", {
          "bg-muted": isBlockActive(editor, "right", "align"),
        })}
        onClick={() => toggleBlock(editor, "right")}
      >
        <BiAlignRight className="text-xl" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("shrink-0", {
          "bg-muted": isBlockActive(editor, "center", "align"),
        })}
        onClick={() => toggleBlock(editor, "center")}
      >
        <BiAlignMiddle className="text-xl" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("shrink-0", {
          "bg-muted": isBlockActive(editor, "justify", "align"),
        })}
        onClick={() => toggleBlock(editor, "justify")}
      >
        <BiAlignJustify className="text-xl" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("shrink-0", {
          "bg-muted": isBlockActive(editor, "bulleted-list"),
        })}
        onClick={() => toggleBlock(editor, "bulleted-list")}
      >
        <BiListUl className="text-xl" />
      </Button>
      <Select defaultValue="h1">
        <Button
          asChild
          variant="outline"
          size="icon"
          className="w-auto shrink-0 gap-1"
        >
          <SelectTrigger>
            <SelectValue placeholder="h1" />
          </SelectTrigger>
        </Button>
        <SelectContent className="min-w-full">
          <SelectItem value="h1">h1</SelectItem>
          <SelectItem value="h2">h2</SelectItem>
          <SelectItem value="h3">h3</SelectItem>
          <SelectItem value="h4">h4</SelectItem>
          <SelectItem value="h5">h5</SelectItem>
          <SelectItem value="h6">h6</SelectItem>
        </SelectContent>
      </Select>
      <span
        tabIndex={0}
        onFocus={() => ReactEditor.focus(editor)}
        className="absolute h-0 w-0"
      />
    </div>
  );
};
