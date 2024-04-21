import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const textContent =
    "Вы перейдете в режим гостя, потеряете доступ к своим данным и многому функционалу портала.";

  if (isDesktop) {
    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-[31.25rem]">
          <AlertDialogHeader>
            <AlertDialogTitle>Вы точно уверены?</AlertDialogTitle>
            <AlertDialogDescription>{textContent}</AlertDialogDescription>
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
                  redirect: false,
                });
                setIsLoading(false);
                void router.push({
                  pathname: PagePathMap.Auth,
                  query: {
                    callbackUrl: router.asPath,
                  },
                });
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
            {textContent}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              await signOut({
                redirect: false,
              });
              setIsLoading(false);
              void router.push({
                pathname: PagePathMap.Auth,
                query: {
                  callbackUrl: router.asPath,
                },
              });
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
