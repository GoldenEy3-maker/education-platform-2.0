import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  BiCheck,
  BiCopy,
  BiLinkExternal,
  BiSearch,
  BiShare,
} from "react-icons/bi";
import { useCopyToClipboard, useMediaQuery } from "usehooks-ts";
import { getFirstLettersUserCredentials } from "~/libs/utils";
import { Avatar } from "./avatar";
import { Button } from "./ui/button";
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
import { Input } from "./ui/input";

export const InviteDialogDrawer: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const [copiedText, copy] = useCopyToClipboard();
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  if (isDesktop)
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отправить приглашение</DialogTitle>
            <DialogDescription>
              Приглашение действительно только для пользователя, которому было
              отправлено.
            </DialogDescription>
          </DialogHeader>
          <Input
            leadingIcon={<BiSearch className="text-xl" />}
            placeholder="Найти студента..."
          />
          <div>
            <p className="mb-2 font-medium">Список студентов</p>
            <div className="custom-scrollbar max-h-[min(calc(100vh-25rem),14.5rem)] space-y-3 overflow-auto">
              <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-3 overflow-hidden">
                <Avatar
                  className="row-span-2"
                  fallback={getFirstLettersUserCredentials("Королев", "Данил")}
                  src={undefined}
                />
                <p className="truncate">Королев Данил</p>
                <span className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
                  К.105с11-5
                </span>
                <div className="row-span-2 flex items-center justify-center">
                  <Button variant="outline">Пригласить</Button>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-3 overflow-hidden">
                <Avatar
                  className="row-span-2"
                  fallback={getFirstLettersUserCredentials("Королев", "Данил")}
                  src={undefined}
                />
                <p className="truncate">Королев Данил</p>
                <span className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
                  К.105с11-5
                </span>
                <div className="row-span-2 flex items-center justify-center">
                  <Button variant="outline">Пригласить</Button>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-3 overflow-hidden">
                <Avatar
                  className="row-span-2"
                  fallback={getFirstLettersUserCredentials("Королев", "Данил")}
                  src={undefined}
                />
                <p className="truncate">Королев Данил</p>
                <span className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
                  К.105с11-5
                </span>
                <div className="row-span-2 flex items-center justify-center">
                  <Button variant="outline">Пригласить</Button>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-3 overflow-hidden">
                <Avatar
                  className="row-span-2"
                  fallback={getFirstLettersUserCredentials("Королев", "Данил")}
                  src={undefined}
                />
                <p className="truncate">Королев Данил</p>
                <span className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
                  К.105с11-5
                </span>
                <div className="row-span-2 flex items-center justify-center">
                  <Button variant="outline">Пригласить</Button>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-3 overflow-hidden">
                <Avatar
                  className="row-span-2"
                  fallback={getFirstLettersUserCredentials("Королев", "Данил")}
                  src={undefined}
                />
                <p className="truncate">Королев Данил</p>
                <span className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
                  К.105с11-5
                </span>
                <div className="row-span-2 flex items-center justify-center">
                  <Button variant="outline">Пригласить</Button>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-3 overflow-hidden">
                <Avatar
                  className="row-span-2"
                  fallback={getFirstLettersUserCredentials("Королев", "Данил")}
                  src={undefined}
                />
                <p className="truncate">Королев Данил</p>
                <span className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
                  К.105с11-5
                </span>
                <div className="row-span-2 flex items-center justify-center">
                  <Button variant="outline">Пригласить</Button>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-3 overflow-hidden">
                <Avatar
                  className="row-span-2"
                  fallback={getFirstLettersUserCredentials("Королев", "Данил")}
                  src={undefined}
                />
                <p className="truncate">Королев Данил</p>
                <span className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
                  К.105с11-5
                </span>
                <div className="row-span-2 flex items-center justify-center">
                  <Button variant="outline">Пригласить</Button>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-3 overflow-hidden">
                <Avatar
                  className="row-span-2"
                  fallback={getFirstLettersUserCredentials("Королев", "Данил")}
                  src={undefined}
                />
                <p className="truncate">Королев Данил</p>
                <span className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
                  К.105с11-5
                </span>
                <div className="row-span-2 flex items-center justify-center">
                  <Button variant="outline">Пригласить</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Публичный доступ</p>
            <span className="text-sm text-muted-foreground">
              Все, у кого есть ссылка, могут получить доступ к курсу.
            </span>
            <Input
              readOnly
              value={origin + router.asPath}
              trailingIcon={
                copiedText ? (
                  <BiCheck className="text-xl" />
                ) : (
                  <BiCopy className="text-xl" />
                )
              }
              leadingIcon={<BiLinkExternal className="text-xl" />}
              onClickTrailingIcon={() => {
                copy(origin + router.asPath)
                  .then((text) => text)
                  .catch((error) => console.error(error));
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-6 pt-0">
        <DrawerHeader>
          <DrawerTitle>Отправить приглашение</DrawerTitle>
          <DrawerDescription>
            Приглашение действительно только для пользователя, которому было
            отправлено.
          </DrawerDescription>
        </DrawerHeader>
        <Input
          leadingIcon={<BiSearch className="text-xl" />}
          placeholder="Найти студента..."
        />
        <div className="mt-4">
          <p className="mb-2 font-medium">Список студентов</p>
          <div className="custom-scrollbar max-h-[min(calc(100vh-26rem),13.5rem)] space-y-3 overflow-auto xs:max-h-[min(calc(100vh-25rem),14.5rem)]">
            <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-3 overflow-hidden">
              <Avatar
                className="row-span-2 h-10 w-10 xs:h-12 xs:w-12"
                fallback={getFirstLettersUserCredentials("Королев", "Данил")}
                src={undefined}
              />
              <p className="truncate">Королев Данил</p>
              <span className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
                К.105с11-5
              </span>
              <div className="row-span-2 flex items-center justify-center">
                <Button
                  variant="outline"
                  className="max-xs:h-10 max-xs:w-10 max-xs:rounded-full"
                >
                  <span className="max-xs:hidden">Пригласить</span>
                  <span className="xs:hidden">
                    <BiShare className="text-xl" />
                  </span>
                  <span className="sr-only xs:hidden">Пригласить</span>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-3 overflow-hidden">
              <Avatar
                className="row-span-2 h-10 w-10 xs:h-12 xs:w-12"
                fallback={getFirstLettersUserCredentials("Королев", "Данил")}
                src={undefined}
              />
              <p className="truncate">Королев Данил</p>
              <span className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
                К.105с11-5
              </span>
              <div className="row-span-2 flex items-center justify-center">
                <Button
                  variant="outline"
                  className="max-xs:h-10 max-xs:w-10 max-xs:rounded-full"
                >
                  <span className="max-xs:hidden">Пригласить</span>
                  <span className="xs:hidden">
                    <BiShare className="text-xl" />
                  </span>
                  <span className="sr-only xs:hidden">Пригласить</span>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-3 overflow-hidden">
              <Avatar
                className="row-span-2 h-10 w-10 xs:h-12 xs:w-12"
                fallback={getFirstLettersUserCredentials("Королев", "Данил")}
                src={undefined}
              />
              <p className="truncate">Королев Данил</p>
              <span className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
                К.105с11-5
              </span>
              <div className="row-span-2 flex items-center justify-center">
                <Button
                  variant="outline"
                  className="max-xs:h-10 max-xs:w-10 max-xs:rounded-full"
                >
                  <span className="max-xs:hidden">Пригласить</span>
                  <span className="xs:hidden">
                    <BiShare className="text-xl" />
                  </span>
                  <span className="sr-only xs:hidden">Пригласить</span>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-3 overflow-hidden">
              <Avatar
                className="row-span-2 h-10 w-10 xs:h-12 xs:w-12"
                fallback={getFirstLettersUserCredentials("Королев", "Данил")}
                src={undefined}
              />
              <p className="truncate">Королев Данил</p>
              <span className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
                К.105с11-5
              </span>
              <div className="row-span-2 flex items-center justify-center">
                <Button
                  variant="outline"
                  className="max-xs:h-10 max-xs:w-10 max-xs:rounded-full"
                >
                  <span className="max-xs:hidden">Пригласить</span>
                  <span className="xs:hidden">
                    <BiShare className="text-xl" />
                  </span>
                  <span className="sr-only xs:hidden">Пригласить</span>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-3 overflow-hidden">
              <Avatar
                className="row-span-2 h-10 w-10 xs:h-12 xs:w-12"
                fallback={getFirstLettersUserCredentials("Королев", "Данил")}
                src={undefined}
              />
              <p className="truncate">Королев Данил</p>
              <span className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
                К.105с11-5
              </span>
              <div className="row-span-2 flex items-center justify-center">
                <Button
                  variant="outline"
                  className="max-xs:h-10 max-xs:w-10 max-xs:rounded-full"
                >
                  <span className="max-xs:hidden">Пригласить</span>
                  <span className="xs:hidden">
                    <BiShare className="text-xl" />
                  </span>
                  <span className="sr-only xs:hidden">Пригласить</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <p className="font-medium">Публичный доступ</p>
          <span className="text-sm text-muted-foreground">
            Все, у кого есть ссылка, могут получить доступ к курсу.
          </span>
          <Input
            readOnly
            value={origin + router.asPath}
            trailingIcon={
              copiedText ? (
                <BiCheck className="text-xl" />
              ) : (
                <BiCopy className="text-xl" />
              )
            }
            leadingIcon={<BiLinkExternal className="text-xl" />}
            onClickTrailingIcon={() => {
              copy(origin + router.asPath)
                .then((text) => text)
                .catch((error) => console.error(error));
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
