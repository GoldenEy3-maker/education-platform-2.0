import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

import Image, { type StaticImageData } from "next/image";
import { BiCheck, BiCheckCircle } from "react-icons/bi";
import { cn } from "~/libs/utils";

type ChooseBgCourseDialogDrawerProps = {
  image: StaticImageData | undefined;
  onImageSelect: (image: StaticImageData) => void;
  preloadedImages: StaticImageData[];
} & React.PropsWithChildren;

export const ChooseBgCourseDialogDrawer: React.FC<
  ChooseBgCourseDialogDrawerProps
> = ({ children, preloadedImages, image, onImageSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Выберите предустановленное изображение</DialogTitle>
            <DialogDescription>
              Изображение можно будет понять в любой момент.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-2">
            {preloadedImages.map((imageData, index) => (
              <button
                type="button"
                key={index}
                className={cn(
                  "relative h-40 overflow-hidden rounded-md transition-all",
                  {
                    "scale-95": image?.src === imageData.src,
                  },
                )}
                onClick={() => onImageSelect(imageData)}
              >
                <Image
                  src={imageData}
                  fill
                  blurDataURL={imageData.blurDataURL}
                  placeholder="blur"
                  alt="Предустановенное фоновое изображение"
                  sizes="33vw"
                />
                <span
                  className={cn(
                    "invisible absolute bottom-2 right-2 rounded-full bg-background opacity-0 transition-all",
                    {
                      "visible opacity-100": image?.src === imageData.src,
                    },
                  )}
                >
                  <BiCheck className="text-2xl text-primary" />
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Выберите предустановленное изображение</DrawerTitle>
          <DrawerDescription>
            Изображение можно будет понять в любой момент.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid max-h-[calc(100vh-10rem)] grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-2 overflow-auto">
          {preloadedImages.map((imageData, index) => (
            <button
              type="button"
              key={index}
              className={cn(
                "relative h-40 overflow-hidden rounded-md transition-all",
                {
                  "scale-95": image?.src === imageData.src,
                },
              )}
              onClick={() => onImageSelect(imageData)}
            >
              <Image
                src={imageData}
                fill
                blurDataURL={imageData.blurDataURL}
                placeholder="blur"
                alt="Предустановенное фоновое изображение"
                sizes="33vw"
              />
              <span
                className={cn(
                  "invisible absolute bottom-2 right-2 rounded-full bg-background opacity-0 transition-all",
                  {
                    "visible opacity-100": image?.src === imageData.src,
                  },
                )}
              >
                <BiCheck className="text-2xl text-primary" />
              </span>
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};