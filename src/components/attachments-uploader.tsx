import { formatBytes, handleAttachment } from "~/libs/utils";
import { FileUploader, type UploadAttachments } from "./file-uploader";
import { Label } from "./ui/label";
import dayjs from "dayjs";
import { CircularProgress } from "./circular-progress";
import { BiCheck, BiTrash } from "react-icons/bi";
import { Button } from "./ui/button";

type AttachmentsUploaderProps = {
  multiple?: boolean;
  attachments: UploadAttachments[];
  onChange: (value: React.SetStateAction<UploadAttachments[]>) => void;
  isLoading?: boolean;
  name?: string;
  onBlur?: React.FocusEventHandler;
};

export const AttachmentsUploader: React.FC<AttachmentsUploaderProps> = ({
  attachments,
  multiple,
  name,
  isLoading,
  onChange,
  onBlur,
}) => {
  return (
    <div className="flex gap-4 max-[1120px]:flex-col min-[1120px]:gap-8">
      <div className="space-y-2">
        <Label htmlFor="">Дополнительные материалы</Label>
        <FileUploader
          multiple={multiple}
          onChange={onChange}
          disabled={isLoading}
          onBlur={onBlur}
          name={name}
        />
      </div>
      <div className="flex-1 space-y-2">
        <span className="text-sm font-medium">Выбрано</span>
        {attachments.length > 0 ? (
          <ul className="space-y-2">
            {attachments.map((attachment) => {
              const [, template] = handleAttachment({
                name: attachment.originalName,
                isLink: !attachment.file,
              });

              return (
                <li
                  key={attachment.id}
                  className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] items-center gap-x-3"
                >
                  <span className="row-span-2 text-3xl">{template.icon}</span>
                  <p className="truncate font-medium">
                    {attachment.originalName}
                  </p>
                  <p
                    className="col-start-2 row-start-2 flex
                           items-center gap-2 truncate text-sm text-muted-foreground"
                  >
                    {dayjs(attachment.uploadedAt).format("DD MMM, YYYY HH:ss")}{" "}
                    {attachment.file ? (
                      <>
                        <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
                        {attachment.isUploading
                          ? `${formatBytes(attachment.file.size * (attachment.progress / 100))} / ${formatBytes(attachment.file.size)}`
                          : formatBytes(attachment.file.size)}
                      </>
                    ) : null}
                  </p>
                  {attachment.isUploading ? (
                    <CircularProgress
                      variant={
                        attachment.progress === 100
                          ? "indeterminate"
                          : "determinate"
                      }
                      className="row-span-2 text-2xl text-primary"
                      strokeWidth={5}
                      value={
                        attachment.progress < 100
                          ? attachment.progress
                          : undefined
                      }
                    />
                  ) : attachment.key ? (
                    <span className="row-span-2 flex items-center justify-center">
                      <BiCheck className="text-2xl text-primary" />
                    </span>
                  ) : (
                    <Button
                      type="button"
                      className="row-span-2 rounded-full"
                      variant="ghost-destructive"
                      size="icon"
                      onClick={() => {
                        onChange(
                          attachments.filter((a) => a.id !== attachment.id),
                        );
                      }}
                    >
                      <BiTrash className="text-xl" />
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Тут будут отображаться выбранные файлы.
          </p>
        )}
      </div>
    </div>
  );
};
