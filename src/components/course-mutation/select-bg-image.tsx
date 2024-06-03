import Image from "next/image";
import { useFileReader } from "~/hooks/fileReader";
import { cn } from "~/libs/utils";
import { CircularProgress } from "../circular-progress";
import { BiCheck } from "react-icons/bi";
import { ChooseBgCourseDialogDrawer } from "../choose-bg-course-dialog-drawer";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

type SelectBgImageProps = {
  preloadedImage: string;
  loadingProgress: boolean | number;
  preloadedImages: string[];
  isLoading?: boolean;
  isPreloadedImageLoading?: boolean;
  isImageUploaded: boolean;
  onUploadImage: (image: File) => void;
  onSelectPreloadedImage?: (image: string) => void;
};

export const SelectBgImage: React.FC<SelectBgImageProps> = ({
  preloadedImage,
  loadingProgress,
  isLoading,
  isImageUploaded,
  isPreloadedImageLoading,
  preloadedImages,
  onSelectPreloadedImage,
  onUploadImage,
}) => {
  const fileReader = useFileReader();

  return (
    <div className="space-y-2">
      <div className="relative h-56 w-full overflow-hidden rounded-md shadow-sm xs:w-80">
        {!isPreloadedImageLoading ? (
          <>
            <Image
              src={
                fileReader.previews
                  ? fileReader.previews[0]!.base64
                  : preloadedImage
              }
              fill
              alt="Фон курса"
              sizes="33vw"
            />
            <div
              className={cn(
                "invisible absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-all",
                {
                  "visible opacity-100": loadingProgress !== false,
                },
              )}
            >
              <span className="rounded-full bg-background/70 p-1">
                {loadingProgress !== true ? (
                  <CircularProgress
                    variant={
                      loadingProgress === 100 ? "indeterminate" : "determinate"
                    }
                    value={
                      typeof loadingProgress === "number" &&
                      loadingProgress !== 100
                        ? loadingProgress
                        : undefined
                    }
                    strokeWidth={5}
                    className="text-5xl text-primary"
                  />
                ) : (
                  <BiCheck className="text-5xl text-primary" />
                )}
              </span>
            </div>
          </>
        ) : (
          <Skeleton className="absolute inset-0" />
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <ChooseBgCourseDialogDrawer
          image={isImageUploaded ? undefined : preloadedImage}
          preloadedImages={preloadedImages}
          onImageSelect={(image) => {
            onSelectPreloadedImage?.(image);
            fileReader.reset();
          }}
        >
          <Button variant="ghost" disabled={isLoading}>
            Выбрать другое
          </Button>
        </ChooseBgCourseDialogDrawer>
        <div>
          <input
            className="peer absolute h-0 w-0 opacity-0"
            type="file"
            id="bg-course"
            disabled={isLoading}
            onChange={async (event) => {
              if (event.target.files && event.target.files.length > 0) {
                await fileReader.readFiles(event.target.files);
                onUploadImage(event.target.files[0]!);
              }
            }}
            accept="image/*"
          />
          <Button
            variant="ghost"
            asChild
            className={cn(
              "cursor-pointer peer-focus-visible:ring-1 peer-focus-visible:ring-ring",
              {
                "pointer-events-none opacity-50": isLoading,
              },
            )}
          >
            <label htmlFor="bg-course">
              <span>Загрузить свое</span>
            </label>
          </Button>
        </div>
      </div>
    </div>
  );
};
