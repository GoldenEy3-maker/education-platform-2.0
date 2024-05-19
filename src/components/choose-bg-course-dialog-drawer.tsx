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
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";

import Image from "next/image";
import BgAbstract1 from "~/assets/bg-abstract-1.jpg";
import BgAbstract10 from "~/assets/bg-abstract-10.png";
import BgAbstract2 from "~/assets/bg-abstract-2.jpg";
import BgAbstract3 from "~/assets/bg-abstract-3.jpg";
import BgAbstract4 from "~/assets/bg-abstract-4.jpg";
import BgAbstract5 from "~/assets/bg-abstract-5.jpg";
import BgAbstract6 from "~/assets/bg-abstract-6.jpg";
import BgAbstract7 from "~/assets/bg-abstract-7.jpg";
import BgAbstract8 from "~/assets/bg-abstract-8.png";
import BgAbstract9 from "~/assets/bg-abstract-9.jpg";

type ChooseBgCourseDialogDrawerProps = {
  onImageSelect: (src: string) => void;
} & React.PropsWithChildren;

export const ChooseBgCourseDialogDrawer: React.FC<
  ChooseBgCourseDialogDrawerProps
> = ({ children, onImageSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const preloadedBgImages = [
    BgAbstract1,
    BgAbstract2,
    BgAbstract3,
    BgAbstract4,
    BgAbstract5,
    BgAbstract6,
    BgAbstract7,
    BgAbstract8,
    BgAbstract9,
    BgAbstract10,
  ];

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Выберите предустановленное изображение</DialogTitle>
            <DialogDescription>
              Фоновое изображение можно будет понять в любой момент в настройках
              курса.
            </DialogDescription>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-2">
              {preloadedBgImages.map((imageData, index) => (
                <div key={index} className="relative h-32">
                  <Image
                    src={imageData}
                    fill
                    alt="Предустановенное фоновое изображение"
                  />
                </div>
              ))}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>123</DrawerContent>
    </Drawer>
  );
};
