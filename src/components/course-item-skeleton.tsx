import { Skeleton } from "./ui/skeleton";

export const CourseItemSkeleton: React.FC = () => {
  return (
    <div>
      <Skeleton className="mb-4 h-48 w-full rounded-lg" />
      <Skeleton className="mb-4 h-6 w-32 rounded-full" />
      <Skeleton className="mb-3 h-6 w-full rounded-full" />
      <Skeleton className="mb-1 h-4 w-full rounded-full" />
      <Skeleton className="mb-1 h-4 w-full rounded-full" />
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-full rounded-full" />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24 rounded-full" />
      </div>
    </div>
  );
};
