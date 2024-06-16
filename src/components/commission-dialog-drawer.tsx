import { useState } from "react";
import { useMediaQuery } from "./stepper/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar } from "./avatar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

type CommissionDialogDrawerProps = {
  onSelect: (data: { login: string; password: string }) => void;
} & React.PropsWithChildren;

export const CommissionDialogDrawer: React.FC<CommissionDialogDrawerProps> = ({
  onSelect,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Пользователи для комиссии</DialogTitle>
            <DialogDescription>
              Выберите любого пользователя, и нажмите &quot;Войти&quot;.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1">
            <Button
              type="button"
              variant="ghost"
              className="grid h-auto w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center justify-normal gap-x-3 text-left"
              onClick={() => {
                onSelect({ login: "ivan", password: "ivan" });
                setIsOpen(false);
              }}
            >
              <Avatar fallback="ИИ" className="row-span-2" />
              <p className="font-medium">Иванов Иван Иванович</p>
              <span className="text-muted-foreground">Студент</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="grid h-auto w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center justify-normal gap-x-3 text-left"
              onClick={() => {
                onSelect({ login: "sergey", password: "sergey" });
                setIsOpen(false);
              }}
            >
              <Avatar fallback="СС" className="row-span-2" />
              <p className="font-medium">Сергеев Сергей Сергеевич</p>
              <span className="text-muted-foreground">Перподаватель</span>
            </Button>
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
          <DrawerTitle>Пользователи для комиссии</DrawerTitle>
          <DrawerDescription>
            Выберите любого пользователя, и нажмите &quot;Войти&quot;.
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-1 p-4 pt-0">
          <Button
            type="button"
            variant="ghost"
            className="grid h-auto w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center justify-normal gap-x-3 text-left"
            onClick={() => {
              onSelect({ login: "ivan", password: "ivan" });
              setIsOpen(false);
            }}
          >
            <Avatar fallback="ИИ" className="row-span-2" />
            <p className="font-medium">Иванов Иван Иванович</p>
            <span className="text-muted-foreground">Студент</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="grid h-auto w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center justify-normal gap-x-3 text-left"
            onClick={() => {
              onSelect({ login: "sergey", password: "sergey" });
              setIsOpen(false);
            }}
          >
            <Avatar fallback="СС" className="row-span-2" />
            <p className="font-medium">Сергеев Сергей Сергеевич</p>
            <span className="text-muted-foreground">Перподаватель</span>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
