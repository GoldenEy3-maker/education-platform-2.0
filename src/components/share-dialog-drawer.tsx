import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  BiCheck,
  BiCopy,
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

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  if (isDesktop)
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Поделиться</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center gap-2">
            <Button asChild variant="ghost" className="h-auto flex-col gap-2">
              <Link
                href={`https://t.me/share/url?url=${origin + router.asPath}&text=Иностранный язык в профессиональной деятельности`}
                target="_blank"
              >
                <div className="flex items-center justify-center rounded-full bg-[hsl(200_100%_40%_/_.1)] p-4">
                  <BiLogoTelegram className="text-3xl text-[hsl(200_100%_40%)]" />
                </div>
                <span>Telegram</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-auto flex-col gap-2">
              <Link
                href={`https://wa.me/?text=${origin + router.asPath}`}
                target="_blank"
              >
                <div className="flex items-center justify-center rounded-full bg-[hsl(142_70%_40%_/_.1)] p-4">
                  <BiLogoWhatsapp className="text-3xl text-[hsl(142_70%_40%)]" />
                </div>
                <span>WhatsApp</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-auto flex-col gap-2">
              <Link
                href={`http://vk.com/share.php?url=${origin + router.asPath}&title=Иностранный язык в профессиональной деятельности`}
                target="_blank"
              >
                <div className="flex items-center justify-center rounded-full bg-[hsl(209_100%_50%_/_.1)] p-4">
                  <BiLogoVk className="text-3xl text-[hsl(209_100%_50%)]" />
                </div>
                <span>Vk</span>
              </Link>
            </Button>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Ссылка</h3>
            <Input
              value={origin + router.asPath}
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
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          <Button asChild variant="ghost" className="h-auto flex-col gap-2">
            <Link
              href={`https://t.me/share/url?url=${origin + router.asPath}&text=Иностранный язык в профессиональной деятельности`}
              target="_blank"
            >
              <div className="flex items-center justify-center rounded-full bg-[hsl(200_100%_40%_/_.1)] p-4">
                <BiLogoTelegram className="text-3xl text-[hsl(200_100%_40%)]" />
              </div>
              <span>Telegram</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-auto flex-col gap-2">
            <Link
              href={`https://wa.me/?text=${origin + router.asPath}`}
              target="_blank"
            >
              <div className="flex items-center justify-center rounded-full bg-[hsl(142_70%_40%_/_.1)] p-4">
                <BiLogoWhatsapp className="text-3xl text-[hsl(142_70%_40%)]" />
              </div>
              <span>WhatsApp</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-auto flex-col gap-2">
            <Link
              href={`http://vk.com/share.php?url=${origin + router.asPath}&title=Иностранный язык в профессиональной деятельности`}
              target="_blank"
            >
              <div className="flex items-center justify-center rounded-full bg-[hsl(209_100%_50%_/_.1)] p-4">
                <BiLogoVk className="text-3xl text-[hsl(209_100%_50%)]" />
              </div>
              <span>Vk</span>
            </Link>
          </Button>
        </div>
        <div>
          <h3 className="mb-2 font-medium">Ссылка</h3>
          <Input
            value={origin + router.asPath}
            readOnly
            trailingIcon={
              copiedText ? (
                <BiCheck className="text-xl" />
              ) : (
                <BiCopy className="text-xl" />
              )
            }
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
