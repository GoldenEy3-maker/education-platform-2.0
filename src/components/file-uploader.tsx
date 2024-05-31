import { useDropzone } from "@uploadthing/react";
import { useCallback } from "react";
import { BiCloudUpload } from "react-icons/bi";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { cn, handleFileName, useUploadThing } from "~/libs/utils";
import { Button } from "./ui/button";

export type UploadAttachments = {
  id: string;
  progress: number;
  key?: string;
  size?: number;
  url?: string;
  originalName: string;
  isUploading: boolean;
  uploadedAt: Date;
  file?: File;
};

type FileUploaderProps = Omit<
  React.ComponentProps<"input">,
  "type" | "onChange"
> & {
  onChange: (value: React.SetStateAction<UploadAttachments[]>) => void;
};

export const FileUploader: React.FC<FileUploaderProps> = ({
  className,
  multiple,
  onChange,
  disabled,
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
          isUploading: false,
          progress: 0,
          key: undefined,
          url: undefined,
          size: file.size,
          uploadedAt: new Date(),
          file: new File([file], file.name, { type: file.type }),
        };
      },
    );

    onChange((attachments) => [...attachments, ...mappedAcceptedFiles]);
  }, []);

  const { permittedFileInfo } = useUploadThing("uploader");

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    multiple: multiple,
    disabled: disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex h-72 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-foreground/20 px-6 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring xs:w-96",
        className,
        {
          "border-primary": isDragActive,
          "cursor-not-allowed opacity-50": disabled,
        },
      )}
    >
      <input {...props} {...getInputProps()} />
      <BiCloudUpload className="mb-4 text-5xl text-muted-foreground" />
      <p className="text-sm">Выберите файл или перетащите его сюда.</p>
      <span className="text-sm text-muted-foreground">
        Любой формат файла до 64 МБ.
      </span>
      <Button type="button" variant="outline" className="mt-4">
        Найти на устройстве
      </Button>
    </div>
  );
};
