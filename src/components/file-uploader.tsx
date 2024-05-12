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
import { api } from "~/libs/api";
import {
  cn,
  formatBytes,
  handleAttachment,
  handleFileName,
  uploadFiles,
  useUploadThing,
} from "~/libs/utils";
import { CircularProgress } from "./circular-progress";
import { Button } from "./ui/button";

type FileUploaderProps = Omit<React.ComponentProps<"input">, "type">;

type FileState = File & {
  id: string;
  progress: number;
  key?: string;
  sourceName: string;
  isUploaded: boolean;
  isDeleting: boolean;
  uploadedAt: Date;
};

export const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(
  ({ className, ...props }, ref) => {
    const [files, setFiles] = useState<FileState[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
      const renamedAcceptedFiles = acceptedFiles.map((file) => {
        const [, ext] = handleFileName(file.name);

        return {
          name: file.name,
          file: new File([file], crypto.randomUUID() + "." + ext, {
            type: file.type,
          }),
        };
      });

      const mappedAcceptedFiles = renamedAcceptedFiles.map(({ file, name }) => {
        return {
          arrayBuffer() {
            return file.arrayBuffer();
          },
          lastModified: file.lastModified,
          name: file.name,
          sourceName: name,
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
          isUploaded: false,
          isDeleting: false,
          progress: 0,
          uploadedAt: new Date(),
        };
      });

      setFiles((files) => [...files, ...mappedAcceptedFiles]);

      uploadFiles("uploader", {
        files: renamedAcceptedFiles.map(({ file }) => file),
        onUploadProgress(opts) {
          setFiles((files) =>
            files.map((file) => {
              if (opts.file === file.name) {
                return {
                  ...file,
                  progress: opts.progress,
                  isUploaded: opts.progress < 100 ? false : true,
                };
              }

              return file;
            }),
          );
        },
        skipPolling: true,
      })
        .then((uploadedFiles) => {
          setFiles((files) =>
            files.map((file) => {
              const upFile = uploadedFiles.filter(
                (upFile) => upFile.name === file.name,
              );
              if (upFile[0]) {
                return { ...file, key: upFile[0].key };
              }

              return file;
            }),
          );
        })
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

    const deleteFile = api.course.deleteAttachment.useMutation({
      onMutate(variables) {
        setFiles((files) =>
          files.map((upFile) => {
            if (upFile.key === variables.key) {
              return { ...upFile, isDeleting: true };
            }

            return upFile;
          }),
        );
      },
      onSuccess(data, variables) {
        if (data.success === false) {
          setFiles((files) =>
            files.map((upFile) => {
              if (upFile.key === variables.key) {
                return { ...upFile, isDeleting: false };
              }

              return upFile;
            }),
          );

          toast.error("Неожиданная ошибка! Попробуй позже.");

          return;
        }

        setFiles((files) =>
          files.filter((upFile) => upFile.key !== variables.key),
        );
      },
      onError(error, variables) {
        setFiles((files) =>
          files.map((upFile) => {
            if (upFile.key === variables.key) {
              return { ...upFile, isDeleting: false };
            }

            return upFile;
          }),
        );

        toast.error(error.message);
      },
    });

    const fileTypes = permittedFileInfo?.config
      ? Object.keys(permittedFileInfo?.config)
      : [];

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
      multiple: true,
    });

    console.log(files);

    return (
      <div className="flex gap-2 max-[1120px]:flex-col min-[1120px]:gap-8">
        <div {...getRootProps()}>
          <input {...props} {...getInputProps()} />
          <div
            className={cn(
              "flex h-72 flex-col items-center justify-center rounded-lg border border-dashed border-foreground/20 bg-primary/5 px-6 py-2 shadow-sm peer-focus-visible:outline-none peer-focus-visible:ring-1 peer-focus-visible:ring-ring peer-disabled:cursor-not-allowed peer-disabled:opacity-50 xs:min-w-96",
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
                    <p className="truncate font-medium">{file.sourceName}</p>
                    <span className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
                      {dayjs(file.uploadedAt).format("DD MMM, YYYY HH:ss")} /{" "}
                      {file.isUploaded
                        ? formatBytes(file.size)
                        : `${formatBytes(file.size * (file.progress / 100))} - ${formatBytes(file.size)}`}
                    </span>
                    {file.isUploaded ? (
                      <Button
                        className="row-span-2 rounded-full"
                        variant="ghost-destructive"
                        size="icon"
                        disabled={file.isDeleting}
                        onClick={() => {
                          if (!file.key) return;

                          deleteFile.mutate({ key: file.key });
                        }}
                      >
                        {file.isDeleting ? (
                          <CircularProgress
                            strokeWidth={5}
                            className="text-xl"
                            variant="indeterminate"
                          />
                        ) : (
                          <BiTrash className="text-xl" />
                        )}
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
    );
  },
);

FileUploader.displayName = "FileUploader";
