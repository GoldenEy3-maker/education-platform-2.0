import { useDropzone } from "@uploadthing/react";
import dayjs from "dayjs";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { BiCloudUpload, BiTrash } from "react-icons/bi";
import { toast } from "sonner";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { UploadThingError } from "uploadthing/server";
import {
  cn,
  formatBytes,
  handleAttachment,
  uploadFiles,
  useUploadThing,
} from "~/libs/utils";
import { CircularProgress } from "./circular-progress";
import { Button } from "./ui/button";

type FileUploaderProps = Omit<React.ComponentProps<"input">, "type">;

type FileState = File & {
  id: string;
  progress: number;
  isCompleted: boolean;
  uploadedAt: Date;
};

export const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(
  ({ className, ...props }, ref) => {
    const [files, setFiles] = useState<FileState[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
      setFiles((files) => [
        ...files,
        ...acceptedFiles.map((file) => {
          return {
            arrayBuffer() {
              return file.arrayBuffer();
            },
            lastModified: file.lastModified,
            name: file.name,
            size: file.size,
            slice(start?: number, end?: number, contentType?: string) {
              return file.slice(start, end, contentType);
            },
            stream() {
              return file.stream();
            },
            text() {
              return file.text();
            },
            type: file.type,
            webkitRelativePath: file.webkitRelativePath,
            id: crypto.randomUUID(),
            isCompleted: false,
            progress: 0,
            uploadedAt: new Date(),
          };
        }),
      ]);

      uploadFiles("uploader", {
        files: acceptedFiles,
        onUploadProgress(opts) {
          setFiles((files) =>
            files.map((file) => {
              if (opts.file === file.name) {
                return {
                  ...file,
                  progress: opts.progress,
                  isCompleted: opts.progress < 100 ? false : true,
                };
              }

              return file;
            }),
          );
        },
        skipPolling: true,
      })
        .then(() => toast.success("Операция прошла успешно!"))
        .catch((error) => {
          if (error instanceof UploadThingError) {
            const message = error.message.toUpperCase().trim();

            toast.error(
              message.includes("filetype".toUpperCase().trim())
                ? "Недопустимый формат файлов!"
                : message.includes("filesize".toUpperCase().trim())
                  ? "Первышен максимальный размер файлов!"
                  : "Возникла неожиданная ошибка!",
            );
            return;
          }

          toast.error("Возникла неожиданная ошибка!");
        });
    }, []);

    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!, []);

    const { permittedFileInfo } = useUploadThing("uploader");

    const fileTypes = permittedFileInfo?.config
      ? Object.keys(permittedFileInfo?.config)
      : [];

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
      multiple: true,
    });

    return (
      <div className="flex gap-8">
        <div {...getRootProps()}>
          <input {...props} {...getInputProps()} />
          <div
            className={cn(
              "flex h-72 min-w-96 flex-col items-center justify-center rounded-lg border border-dashed border-foreground/20 bg-primary/5 px-6 py-2 shadow-sm peer-focus-visible:outline-none peer-focus-visible:ring-1 peer-focus-visible:ring-ring peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              className,
              {
                "border-primary": isDragActive,
              },
            )}
          >
            <BiCloudUpload className="text-7xl text-primary/80" />
            <p className="text-sm text-muted-foreground">
              Перетащите сюда файл или
            </p>
            <span
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer text-sm text-primary"
            >
              Найти на устройстве
            </span>
          </div>
        </div>
        {/* <div>
          {files.length > 0 && (
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await uploadFiles("uploader", {
                    files: files,
                    onUploadProgress: (progress) => {
                      console.log("upload in progress", progress);
                    },
                    onUploadBegin: () => {
                      console.log("upload has begun");
                    },
                    skipPolling: true,
                  });

                  console.log("upload success", res);
                } catch (error) {
                  if (error instanceof UploadThingError) {
                    const message = error.message.toUpperCase().trim();

                    toast.error(
                      message.includes("filetype".toUpperCase().trim())
                        ? "Недопустимый формат файлов!"
                        : message.includes("filesize".toUpperCase().trim())
                          ? "Первышен максимальный размер файлов!"
                          : "Возникла неожиданная ошибка!",
                    );
                    return;
                  }

                  toast.error("Возникла неожиданная ошибка!");
                }
              }}
            >
              Upload {files.length} files
            </button>
          )}
        </div> */}
        <div className="flex-1">
          <span className="text-sm font-medium">Выбрано</span>
          {files.length > 0 ? (
            <ul className="custom-scrollbar max-h-72 space-y-2 overflow-auto">
              {files.map((file) => {
                const [, attachment] = handleAttachment({
                  name: file.name,
                  href: null,
                });

                return (
                  <li
                    key={file.id}
                    className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] items-center gap-x-3"
                  >
                    <span className="row-span-2 text-3xl">
                      {attachment.icon}
                    </span>
                    <p className="truncate font-medium">{file.name}</p>
                    <span className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
                      {dayjs(file.uploadedAt).format("DD MMM, YYYY HH:ss")} /{" "}
                      {file.isCompleted
                        ? formatBytes(file.size)
                        : `${formatBytes(file.size * (file.progress / 100))} - ${formatBytes(file.size)}`}
                    </span>
                    {file.isCompleted ? (
                      <Button
                        className="row-span-2"
                        variant="ghost-destructive"
                        size="icon"
                      >
                        <BiTrash className="text-xl" />
                      </Button>
                    ) : (
                      <CircularProgress
                        className="row-span-2 text-2xl text-primary"
                        strokeWidth={5}
                        value={file.progress}
                      />
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
      // <div className="">
      //   <input
      //     ref={inputRef}
      //     type="file"
      //     className="peer absolute h-0 w-0"
      //     {...props}
      //   />
      // <div
      //   className={cn(
      //     "flex h-72 min-w-96 flex-col items-center justify-center rounded-lg border border-dashed border-foreground/20 bg-primary/5 px-6 py-2 shadow-sm peer-focus-visible:outline-none peer-focus-visible:ring-1 peer-focus-visible:ring-ring peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      //     className,
      //   )}
      // >
      //   <BiCloudUpload className="text-7xl text-primary/80" />
      //   <p className="text-sm text-muted-foreground">
      //     Перетащите сюда файл или
      //   </p>
      //   <span
      //     onClick={() => inputRef.current?.click()}
      //     className="cursor-pointer text-sm text-primary"
      //   >
      //     Найти на устройстве
      //   </span>
      // </div>
      //   {/* <div className="flex-1">
      //     <p className="text-sm font-medium">Загружено</p>
      //   </div> */}
      // </div>
    );
  },
);

FileUploader.displayName = "FileUploader";
