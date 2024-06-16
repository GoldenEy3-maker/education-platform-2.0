import { type CourseAttachment } from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";
import { formatBytes, handleAttachment } from "~/libs/utils";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { type Descendant } from "slate";
import { serializeHTML } from "../editor/utils";
import { BiChevronRight } from "react-icons/bi";

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
            {description ? (
              <div
                className="space-y-4 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: (JSON.parse(description) as Descendant[])
                    .map((node) => serializeHTML(node))
                    .join(""),
                }}
              />
            ) : (
              <p>Описание отсутствует.</p>
            )}
          </section>
          <section>
            <h3 className="mb-2 border-b py-2 text-xl font-medium">
              Дополнительные материалы
            </h3>
            {attachments.length > 0 ? (
              <div className="flex flex-col gap-2">
                {attachments.map((attachment) => {
                  const [, template] = handleAttachment({
                    name: attachment.name,
                    isLink: !attachment.key,
                  });

                  return (
                    <Button
                      key={attachment.id}
                      asChild
                      variant="outline"
                      className="group h-auto justify-normal gap-2 gap-x-3 p-2 text-foreground hover:no-underline"
                    >
                      <Link href={attachment.url} target="_blank">
                        <span className="row-span-2 text-4xl">
                          {template.icon}
                        </span>
                        <div className="flex-1 overflow-hidden">
                          <p className="mb-0.5 truncate font-medium">
                            {attachment.name}
                          </p>
                          <p
                            className="flex
                           items-center gap-2 truncate text-sm text-muted-foreground"
                          >
                            {dayjs(attachment.uploadedAt).format(
                              "DD MMM, YYYY HH:ss",
                            )}{" "}
                            {attachment.size ? (
                              <>
                                <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
                                <span>{formatBytes(attachment.size)}</span>
                              </>
                            ) : null}
                          </p>
                        </div>
                        <BiChevronRight className="text-xl" />
                        {/* <span className="text-2xl">{template.icon}</span>
                        <p className="grow truncate group-hover:underline">
                          {!attachment.key ? attachment.name : name}
                        </p>
                        <span className="text-sm text-muted-foreground">
                          ({dayjs(attachment.uploadedAt).format("DD MMMM YYYY")}
                          )
                        </span> */}
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
