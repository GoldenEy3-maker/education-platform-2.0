import {
  AvatarFallback,
  AvatarImage,
  Avatar as UiAvatar,
} from "~/components/ui/avatar";
import { cn } from "~/libs/utils";

type AvatarProps = {
  src?: string | null;
  alt?: string;
  fallback?: string;
  isOnline?: boolean;
  className?: string;
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  isOnline,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative h-12 w-12 after:absolute after:bottom-0 after:right-0 after:h-[0.875em] after:w-[0.875em] after:scale-0 after:rounded-full after:border-2 after:border-background after:bg-primary after:transition after:content-['']",
        {
          "after:scale-100": isOnline,
        },
        className,
      )}
    >
      <UiAvatar className="h-full w-full">
        <AvatarImage src={src ?? undefined} alt={alt} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </UiAvatar>
    </div>
  );
};
