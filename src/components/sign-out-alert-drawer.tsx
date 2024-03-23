import { signOut } from "next-auth/react";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { PagePathMap } from "~/libs/enums";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

type SignOutAlertDrawerProps = React.PropsWithChildren;

export const SignOutAlertDrawer: React.FC<SignOutAlertDrawerProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Вы точно уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Вы будите перенаправлены на главную
              страницу в режиме &rdquo;гость&rdquo;, потеряв доступ к некоторому
              функционалу портала.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" disabled={isLoading}>
                Отменить
              </Button>
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true);
                await signOut({
                  callbackUrl: PagePathMap.Auth,
                });
                setIsLoading(false);
              }}
            >
              Выйти
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-center">Вы точно уверены?</DrawerTitle>
          <DrawerDescription className="text-center">
            Это действие нельзя отменить. Вы будите перенаправлены на главную
            страницу в режиме &rdquo;гость&rdquo;, потеряв доступ к некоторому
            функционалу портала.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              await signOut({
                callbackUrl: PagePathMap.Auth,
              });
              setIsLoading(false);
            }}
          >
            Выйти
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" disabled={isLoading} className="w-full">
              Отменить
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
