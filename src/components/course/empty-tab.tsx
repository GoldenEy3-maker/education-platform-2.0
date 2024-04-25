import { cn } from "~/libs/utils";

type CourseEmptyTabProps = {
  icon: React.ReactNode;
  text: React.ReactNode;
  className?: string;
};

export const CourseEmptyTab: React.FC<CourseEmptyTabProps> = ({
  text,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-[40rem] flex-col items-center justify-center p-6",
        className,
      )}
    >
      {icon}
      <div className="mt-2 text-center">{text}</div>
    </div>
  );
};
