import { useDropzone } from "@uploadthing/react";
import { useCallback } from "react";
import { BiCloudUpload } from "react-icons/bi";
import { toast } from "sonner";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { UploadThingError } from "uploadthing/server";
import { cn, handleFileName, uploadFiles, useUploadThing } from "~/libs/utils";

export type UploadAttachments = {
  id: string;
  progress: number;
  key?: string;
  size?: number;
  href?: string;
  originalName: string;
  isUploaded: boolean;
  isDeleting: boolean;
  uploadedAt: Date;
  file?: File;
};

type FileUploaderProps = Omit<
  React.ComponentProps<"input">,
  "type" | "onChange"
> & {
  attachments: UploadAttachments[];
  onChange: (value: React.SetStateAction<UploadAttachments[]>) => void;
};

export const FileUploader: React.FC<FileUploaderProps> = ({
  className,
  multiple,
  attachments,
  onChange,
  ...props
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const renamedAcceptedFiles = acceptedFiles.map((file) => {
      const [, ext] = handleFileName(file.name);

      return {
        originalName: file.name,
        file: new File([file], crypto.randomUUID() + "." + ext, {
          type: file.type,
        }),
      };
    });

    const mappedAcceptedFiles = renamedAcceptedFiles.map(
      ({ file, originalName }) => {
        return {
          originalName: originalName,
          id: crypto.randomUUID(),
          isUploaded: false,
          isDeleting: false,
          progress: 0,
          href: undefined,
          size: file.size,
          uploadedAt: new Date(),
          file: new File([file], file.name, { type: file.type }),
        };
      },
    );

    onChange((attachments) => [...attachments, ...mappedAcceptedFiles]);

    uploadFiles("uploader", {
      files: renamedAcceptedFiles.map(({ file }) => file),
      onUploadProgress(opts) {
        onChange((attachments) =>
          attachments.map((attachment) => {
            if (opts.file === attachment.file?.name) {
              return {
                ...attachment,
                progress: opts.progress,
                isUploaded: opts.progress < 100 ? false : true,
              };
            }

            return attachment;
          }),
        );
      },
      skipPolling: true,
    })
      .then((uploadedFiles) => {
        onChange((attachments) =>
          attachments.map((attachment) => {
            const upFile = uploadedFiles.find(
              (upFile) => upFile.name === attachment.file?.name,
            );
            if (upFile) {
              return { ...attachment, key: upFile.key };
            }

            return attachment;
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
                : message.includes("countmismatch".toUpperCase().trim())
                  ? "Превышено количество файлов!"
                  : "Возникла неожиданная ошибка!",
          );
        } else {
          toast.error("Возникла неожиданная ошибка!");
        }

        onChange((attachments) =>
          attachments.filter((attachment) => attachment.key !== undefined),
        );
      });
  }, []);

  const { permittedFileInfo } = useUploadThing("uploader");

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    multiple: multiple,
  });

  return (
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
        <span className="text-sm text-primary">Найдите его на устройстве</span>
      </div>
    </div>
  );
};
