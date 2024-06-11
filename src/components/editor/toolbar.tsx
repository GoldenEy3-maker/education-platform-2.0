import {
  TbAlignCenter,
  TbAlignJustified,
  TbAlignLeft,
  TbAlignRight,
  TbBold,
  TbItalic,
  TbList,
  TbListNumbers,
  TbUnderline,
} from "react-icons/tb";
import { useSlate } from "slate-react";
import { cn } from "~/libs/utils";
import { Button } from "../ui/button";
import { isBlockActive, isMarkActive, toggleBlock, toggleMark } from "./utils";

type ToolbarProps = {
  disabled?: boolean;
};

export const Toolbar: React.FC<ToolbarProps> = ({ disabled }) => {
  const editor = useSlate();

  return (
    <div
      className="sticky bottom-[1px] z-10 flex max-w-full items-center gap-1 overflow-auto rounded-b-md border-t border-input bg-background px-3 py-1"
      onPointerDown={(e) => e.preventDefault()}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        className={cn("shrink-0", {
          "bg-muted": isMarkActive(editor, "bold"),
        })}
        onClick={() => toggleMark(editor, "bold")}
      >
        <TbBold className="text-base" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        className={cn("shrink-0", {
          "bg-muted": isMarkActive(editor, "italic"),
        })}
        onClick={() => toggleMark(editor, "italic")}
      >
        <TbItalic className="text-base" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        className={cn("mr-2 shrink-0", {
          "bg-muted": isMarkActive(editor, "underline"),
        })}
        onClick={() => toggleMark(editor, "underline")}
      >
        <TbUnderline className="text-base" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        className={cn("shrink-0", {
          "bg-muted": isBlockActive(editor, "left", "align"),
        })}
        onClick={() => toggleBlock(editor, "left")}
      >
        <TbAlignLeft className="text-base" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        className={cn("shrink-0", {
          "bg-muted": isBlockActive(editor, "right", "align"),
        })}
        onClick={() => toggleBlock(editor, "right")}
      >
        <TbAlignRight className="text-base" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        className={cn("shrink-0", {
          "bg-muted": isBlockActive(editor, "center", "align"),
        })}
        onClick={() => toggleBlock(editor, "center")}
      >
        <TbAlignCenter className="text-base" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        className={cn("mr-2 shrink-0", {
          "bg-muted": isBlockActive(editor, "justify", "align"),
        })}
        onClick={() => toggleBlock(editor, "justify")}
      >
        <TbAlignJustified className="text-base" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        className={cn("shrink-0", {
          "bg-muted": isBlockActive(editor, "bulleted-list"),
        })}
        onClick={() => toggleBlock(editor, "bulleted-list")}
      >
        <TbList className="text-base" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        className={cn("shrink-0", {
          "bg-muted": isBlockActive(editor, "numbered-list"),
        })}
        onClick={() => toggleBlock(editor, "numbered-list")}
      >
        <TbListNumbers className="text-base" />
      </Button>
      {/* <Select defaultValue="h1">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="w-auto shrink-0 gap-1 border-none shadow-none"
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
      </Select> */}
      {/* <span
        tabIndex={0}
        onFocus={() => ReactEditor.focus(editor)}
        className="absolute h-0 w-0"
      /> */}
    </div>
  );
};
