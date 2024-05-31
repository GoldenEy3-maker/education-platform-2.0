import { cn, formatBytes, handleAttachment } from "~/libs/utils";
import { FileUploader, type UploadAttachments } from "./file-uploader";
import { Label } from "./ui/label";
import dayjs from "dayjs";
import { CircularProgress } from "./circular-progress";
import { BiCheck, BiSolidBadgeCheck, BiTrash, BiX } from "react-icons/bi";
import { Button } from "./ui/button";
import { useId } from "react";
import { Progress } from "./ui/progress";

type AttachmentsUploaderProps = {
  multiple?: boolean;
  attachments: UploadAttachments[];
  onChange: (value: React.SetStateAction<UploadAttachments[]>) => void;
  isLoading?: boolean;
  isError?: boolean;
  name?: string;
  onBlur?: React.FocusEventHandler;
  errorMessage?: React.ReactNode;
};

export const AttachmentsUploader: React.FC<AttachmentsUploaderProps> = ({
  attachments,
  multiple,
  name,
  isLoading,
  isError,
  errorMessage,
  onChange,
  onBlur,
}) => {
  const id = useId();

  return (
    <div className="flex gap-4 max-[1120px]:flex-col min-[1120px]:gap-8">
      <div className="max-w-96 space-y-2">
        <Label htmlFor={id} className={cn({ "text-destructive": isError })}>
          Дополнительные материалы
        </Label>
        <FileUploader
          multiple={multiple}
          onChange={onChange}
          disabled={isLoading}
          onBlur={onBlur}
          name={name}
          id={id}
        />
        {errorMessage}
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
                  className="relative rounded-lg border border-border p-2"
                >
                  <div className="flex items-center gap-x-3">
                    <span className="row-span-2 text-4xl">{template.icon}</span>
                    <div>
                      <p className="mb-0.5 truncate font-medium">
                        {attachment.originalName}
                      </p>
                      <p
                        className="flex
                           items-center gap-2 truncate text-sm text-muted-foreground"
                      >
                        {dayjs(attachment.uploadedAt).format(
                          "DD MMM, YYYY HH:ss",
                        )}{" "}
                        {attachment.file ? (
                          <>
                            <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
                            <span>
                              {attachment.isUploading
                                ? `${formatBytes(attachment.file.size * (attachment.progress / 100))} / ${formatBytes(attachment.file.size)}`
                                : formatBytes(attachment.file.size)}
                            </span>
                            {attachment.isUploading ? (
                              <>
                                <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
                                <CircularProgress
                                  variant="indeterminate"
                                  className="ml-1 inline-block text-base"
                                />
                                <span className="-ml-1 text-foreground">
                                  {attachment.progress === 100
                                    ? "Синхронизируется..."
                                    : "Загружается..."}
                                </span>
                              </>
                            ) : attachment.key ? (
                              <>
                                <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
                                <BiSolidBadgeCheck className="text-base text-useful" />
                                <span className="-ml-1 text-foreground">
                                  Завершено
                                </span>
                              </>
                            ) : null}
                          </>
                        ) : null}
                      </p>
                    </div>
                  </div>
                  {attachment.isUploading ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-9 w-9 rounded-full"
                    >
                      <BiX className="text-base" />
                    </Button>
                  ) : !attachment.key ? (
                    <Button
                      type="button"
                      className="absolute right-2 top-2 h-9 w-9 rounded-full"
                      variant="ghost"
                      size="icon"
                      disabled={isLoading}
                      onClick={() => {
                        onChange(
                          attachments.filter((a) => a.id !== attachment.id),
                        );
                      }}
                    >
                      <BiTrash className="text-base" />
                    </Button>
                  ) : null}
                  {attachment.isUploading ? (
                    <Progress value={attachment.progress} className="mt-2" />
                  ) : null}
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
