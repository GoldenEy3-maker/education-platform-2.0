import { type CourseAttachment } from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";
import { handleAttachment } from "~/libs/utils";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

type CourseOverviewTabProps = {
  description?: string | null;
  attachments: CourseAttachment[];
  isLoading: boolean;
};

export const CourseOverviewTab: React.FC<CourseOverviewTabProps> = ({
  description,
  isLoading,
  attachments,
}) => {
  return (
    <div className="space-y-4">
      {!isLoading ? (
        <>
          <section>
            <h3 className="mb-2 border-b py-2 text-xl font-medium">Описание</h3>
            {description ? <p>{description}</p> : <p>Описание отсутствует.</p>}
          </section>
          <section>
            <h3 className="mb-2 border-b py-2 text-xl font-medium">
              Дополнительные материалы
            </h3>
            {attachments.length > 0 ? (
              <div className="flex flex-col gap-2">
                {attachments.map((attachment) => {
                  const [name, template] = handleAttachment({
                    name: attachment.name,
                    isLink: !attachment.key,
                  });

                  return (
                    <Button
                      key={attachment.id}
                      asChild
                      variant="link"
                      className="group justify-normal gap-2 text-foreground hover:no-underline"
                    >
                      <Link href="#">
                        <span className="text-2xl">{template.icon}</span>
                        <p className="grow truncate group-hover:underline">
                          {!attachment.key ? attachment.name : name}
                        </p>
                        <span className="text-sm text-muted-foreground">
                          ({dayjs().format("DD MMMM YYYY")})
                        </span>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            ) : (
              <p>Дополнительные материалы отсутствуют.</p>
            )}
          </section>
        </>
      ) : (
        <>
          <div>
            <Skeleton className="mb-3 h-7 w-40 rounded-full" />
            <div className="space-y-2 pl-4">
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
            </div>
          </div>
          <div>
            <Skeleton className="mb-3 h-7 w-56 rounded-full" />
            <div className="space-y-2 pl-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="grow">
                  <Skeleton className="h-4 w-48 rounded-full" />
                </div>
                <Skeleton className="h-4 w-28 rounded-full max-xs:hidden" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="grow">
                  <Skeleton className="h-4 w-48 rounded-full" />
                </div>
                <Skeleton className="h-4 w-28 rounded-full max-xs:hidden" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="grow">
                  <Skeleton className="h-4 w-48 rounded-full" />
                </div>
                <Skeleton className="h-4 w-28 rounded-full max-xs:hidden" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
