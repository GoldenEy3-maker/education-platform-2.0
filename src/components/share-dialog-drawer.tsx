import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  BiCheck,
  BiCopy,
  BiLogoDiscord,
  BiLogoTelegram,
  BiLogoVk,
  BiLogoWhatsapp,
} from "react-icons/bi";
import { useCopyToClipboard, useMediaQuery } from "usehooks-ts";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Input } from "./ui/input";

export const ShareDialogDrawer: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const [copiedText, copy] = useCopyToClipboard();
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Поделиться</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-2">
            <Button asChild variant="ghost" className="h-auto flex-col gap-2">
              <Link href="#" target="_blank">
                <div className="flex items-center justify-center rounded-full bg-muted/50 p-4">
                  <BiLogoTelegram className="text-2xl" />
                </div>
                <span>Telegram</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-auto flex-col gap-2">
              <Link href="#" target="_blank">
                <div className="flex items-center justify-center rounded-full bg-muted/50 p-4">
                  <BiLogoWhatsapp className="text-2xl" />
                </div>
                <span>WhatsApp</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-auto flex-col gap-2">
              <Link href="#" target="_blank">
                <div className="flex items-center justify-center rounded-full bg-muted/50 p-4">
                  <BiLogoVk className="text-2xl" />
                </div>
                <span>Vk</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-auto flex-col gap-2">
              <Link href="#" target="_blank">
                <div className="flex items-center justify-center rounded-full bg-muted/50 p-4">
                  <BiLogoDiscord className="text-2xl" />
                </div>
                <span>Discord</span>
              </Link>
            </Button>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Ссылка</h3>
            <Input
              value={
                (typeof window !== "undefined" ? window.location.origin : "") +
                router.asPath
              }
              readOnly
              trailingIcon={
                copiedText ? (
                  <BiCheck className="text-xl" />
                ) : (
                  <BiCopy className="text-xl" />
                )
              }
              onClickTrailingIcon={() => {
                copy(
                  (typeof window !== "undefined"
                    ? window.location.origin
                    : "") + router.asPath,
                )
                  .then((text) => text)
                  .catch((error) => console.error(error));
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-6 pt-0">
        <DrawerHeader>
          <DrawerTitle>Поделиться</DrawerTitle>
        </DrawerHeader>
        <div className="mb-4 grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-2">
          <Button asChild variant="ghost" className="h-auto flex-col gap-2">
            <Link href="#" target="_blank">
              <div className="flex items-center justify-center rounded-full bg-muted/50 p-4">
                <BiLogoTelegram className="text-2xl" />
              </div>
              <span>Telegram</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-auto flex-col gap-2">
            <Link href="#" target="_blank">
              <div className="flex items-center justify-center rounded-full bg-muted/50 p-4">
                <BiLogoWhatsapp className="text-2xl" />
              </div>
              <span>WhatsApp</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-auto flex-col gap-2">
            <Link href="#" target="_blank">
              <div className="flex items-center justify-center rounded-full bg-muted/50 p-4">
                <BiLogoVk className="text-2xl" />
              </div>
              <span>Vk</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-auto flex-col gap-2">
            <Link href="#" target="_blank">
              <div className="flex items-center justify-center rounded-full bg-muted/50 p-4">
                <BiLogoDiscord className="text-2xl" />
              </div>
              <span>Discord</span>
            </Link>
          </Button>
        </div>
        <div>
          <h3 className="mb-2 font-medium">Ссылка</h3>
          <Input
            value={
              (typeof window !== "undefined" ? window.location.origin : "") +
              router.asPath
            }
            readOnly
            trailingIcon={
              copiedText ? (
                <BiCheck className="text-xl" />
              ) : (
                <BiCopy className="text-xl" />
              )
            }
            onClickTrailingIcon={() => {
              copy(
                (typeof window !== "undefined" ? window.location.origin : "") +
                  router.asPath,
              )
                .then((text) => text)
                .catch((error) => console.error(error));
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
