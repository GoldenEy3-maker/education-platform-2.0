import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { BiExpandVertical, BiPlus, BiSearch, BiTrash } from "react-icons/bi";
import {
  TbFileTypeCsv,
  TbFileTypeDoc,
  TbFileTypeDocx,
  TbFileTypePdf,
  TbFileZip,
} from "react-icons/tb";
import { handleAttachment } from "~/libs/utils";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";

const MOK_DATA = [
  {
    id: "1",
    title: "Карьерная гостинная",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit expedita voluptatibus temporibus quibusdam voluptates quae repellendus voluptate nobis hic, quam beatae esse fugiat vero, natus reiciendis minus odio eveniet alias.",
    attachments: [
      {
        id: "1",
        name: "Таблица №1.csv",
        href: null,
      },
      {
        id: "2",
        name: "Документ №1.pdf",
        href: null,
      },
      {
        id: "3",
        name: "Документ №2.doc",
        href: null,
      },
    ],
  },
  {
    id: "2",
    title: "Карьерная гостинная",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit expedita voluptatibus temporibus quibusdam voluptates quae repellendus voluptate nobis hic, quam beatae esse fugiat vero, natus reiciendis minus odio eveniet alias. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni, nam soluta accusantium ipsa, animi dicta, expedita unde illum suscipit harum natus numquam deleniti molestias. Tempore nobis numquam architecto fuga tenetur!",
    attachments: [
      {
        id: "1",
        name: "Изображение №1.png",
        href: null,
      },
      {
        id: "2",
        name: "Документ №1.docx",
        href: null,
      },
    ],
  },
  {
    id: "3",
    title: "Карьерная гостинная",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit expedita voluptatibus temporibus quibusdam voluptates quae repellendus voluptate nobis hic, quam beatae esse fugiat vero, natus reiciendis minus odio eveniet alias. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni, nam soluta accusantium ipsa, animi dicta, expedita unde illum suscipit harum natus numquam deleniti molestias. Tempore nobis numquam architecto fuga tenetur! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi dolorum earum impedit odit hic, ab, praesentium velit necessitatibus fuga harum iusto quaerat quia neque molestiae non, qui adipisci porro ipsam",
    attachments: [
      {
        id: "1",
        name: "Презентация №1.ppt",
        href: null,
      },
    ],
  },
];

const AnnouncementSkeleton: React.FC = () => {
  return (
    <div>
      <div className="px-4 py-2">
        <Skeleton className="h-5 w-52 rounded-full" />
      </div>
      <div className="space-y-1 px-4 py-3">
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-full rounded-full" />
      </div>
    </div>
  );
};

type CourseAnnouncementsTabProps = {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  isLoading: boolean;
  isAuthor: boolean;
  isSubStudent: boolean;
  isTeacher: boolean;
};

export const CourseAnnouncementsTab: React.FC<CourseAnnouncementsTabProps> = ({
  onSearchValueChange,
  searchValue,
  isAuthor,
  isLoading,
  isSubStudent,
  isTeacher,
}) => {
  const { data: session } = useSession();

  return (
    <div>
      <div className="mb-4 grid grid-cols-[1fr_auto] items-center gap-2">
        <Input
          leadingIcon={<BiSearch className="text-xl" />}
          placeholder="Поиск объявлений..."
          value={searchValue}
          className="max-w-64"
          onChange={(event) => onSearchValueChange(event.target.value)}
          disabled={!session?.user}
        />
        {isAuthor ? (
          <Button className="gap-2 max-md:w-10 max-md:rounded-full">
            <BiPlus className="shrink-0 text-xl" />
            <span className="max-md:hidden">Создать новое</span>
            <span className="sr-only md:hidden">Создать новое объявление</span>
          </Button>
        ) : null}
      </div>
      <div className="space-y-2">
        {!isLoading ? (
          MOK_DATA.map((announcement) => (
            <Collapsible key={announcement.id}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="grid h-auto w-full grid-cols-[1fr_auto] gap-x-2 border-b text-left max-sm:grid-rows-[auto_auto] sm:grid-cols-[auto_1fr_auto]"
                >
                  <h3 className="truncate text-base font-medium">
                    {announcement.title}
                  </h3>
                  <span className="truncate capitalize text-muted-foreground max-sm:row-start-2">
                    ({dayjs().format("DD MMMM YYYY, HH:mm:ss")})
                  </span>
                  <BiExpandVertical className="max-sm:row-span-2" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pb-2">
                  <div className="flex gap-2">
                    <div>
                      <p>{announcement.text}</p>
                    </div>
                    {isAuthor ? (
                      <Button
                        variant="ghost-destructive"
                        className="shrink-0 rounded-full"
                        size="icon"
                      >
                        <BiTrash className="text-xl" />
                      </Button>
                    ) : null}
                  </div>
                  {announcement.attachments &&
                  announcement.attachments.length > 0 ? (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {announcement.attachments.map((attachment) => {
                        const [name, template] = handleAttachment(attachment);
                        return (
                          <Button
                            key={attachment.id}
                            variant="outline"
                            className="gap-2"
                            asChild
                          >
                            <Link href="#">
                              <span className="text-xl">{template.icon}</span>
                              <span>{name}</span>
                            </Link>
                          </Button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        ) : (
          <>
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
          </>
        )}
      </div>
    </div>
  );
};
