import dayjs from "dayjs";
import Link from "next/link";
import { BiImage, BiLink } from "react-icons/bi";
import {
  TbFileTypeCsv,
  TbFileTypeDoc,
  TbFileTypeDocx,
  TbFileTypePdf,
  TbFileUnknown,
  TbFileZip,
} from "react-icons/tb";
import { Button } from "./ui/button";

type CourseOverviewTabProps = {
  description: string;
  // files: {
  //   id: string;
  //   name: string;
  //   link: string;
  //   type: "LINK" | "CSV" | "PDF" | "DOC" | "DOCX" | "ZIP" | "IMG";
  // }[];
};

export const CourseOverviewTab: React.FC<CourseOverviewTabProps> = ({
  description,
}) => {
  return (
    <>
      <section>
        <h3 className="mb-2 text-xl font-medium">Описание</h3>
        <div className="grid grid-cols-[auto_1fr] gap-x-4">
          <span className="ml-1 block w-0.5 rounded-full bg-primary/30"></span>
          <p>{description}</p>
        </div>
      </section>
      <section>
        <h3 className="mb-2 text-xl font-medium">Ссылки и документы</h3>
        <div className="grid grid-cols-[auto_1fr] gap-x-4">
          <span className="ml-1 block w-0.5 rounded-full bg-primary/30"></span>
          <div className="flex flex-col gap-2">
            <Button
              asChild
              variant="link"
              className="group justify-normal gap-2 text-foreground hover:no-underline"
            >
              <Link href="#">
                <BiLink className="text-2xl text-[hsl(265,86%,60%)]" />
                <p className="grow truncate group-hover:underline">Ссылка №1</p>
                <span className="text-sm text-muted-foreground">
                  ({dayjs(new Date()).format("DD MMMM YYYY")})
                </span>
              </Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="group justify-normal gap-2 text-foreground hover:no-underline"
            >
              <Link href="#">
                <TbFileTypeCsv className="text-2xl text-useful" />
                <p className="grow truncate group-hover:underline">
                  Таблица №1
                </p>
                <span className="text-sm text-muted-foreground">
                  ({dayjs(new Date()).format("DD MMMM YYYY")})
                </span>
              </Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="group justify-normal gap-2 text-foreground hover:no-underline"
            >
              <Link href="#">
                <TbFileTypePdf className="text-2xl text-[hsl(14,86%,57%)]" />
                <p className="grow truncate group-hover:underline">
                  Документ №1
                </p>
                <span className="text-sm text-muted-foreground">
                  ({dayjs(new Date()).format("DD MMMM YYYY")})
                </span>
              </Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="group justify-normal gap-2 text-foreground hover:no-underline"
            >
              <Link href="#">
                <TbFileTypeDoc className="text-2xl text-primary" />
                <p className="grow truncate group-hover:underline">
                  Документ №2
                </p>
                <span className="text-sm text-muted-foreground">
                  ({dayjs(new Date()).format("DD MMMM YYYY")})
                </span>
              </Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="group justify-normal gap-2 text-foreground hover:no-underline"
            >
              <Link href="#">
                <TbFileTypeDocx className="text-2xl text-primary" />
                <p className="grow truncate group-hover:underline">
                  Документ №3
                </p>
                <span className="text-sm text-muted-foreground">
                  ({dayjs(new Date()).format("DD MMMM YYYY")})
                </span>
              </Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="group justify-normal gap-2 text-foreground hover:no-underline"
            >
              <Link href="#">
                <TbFileZip className="text-2xl text-destructive" />
                <p className="grow truncate group-hover:underline">Архив №1</p>
                <span className="text-sm text-muted-foreground">
                  ({dayjs(new Date()).format("DD MMMM YYYY")})
                </span>
              </Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="group justify-normal gap-2 text-foreground hover:no-underline"
            >
              <Link href="#">
                <BiImage className="text-2xl text-warning" />
                <p className="grow truncate group-hover:underline">
                  Изображение №1
                </p>
                <span className="text-sm text-muted-foreground">
                  ({dayjs(new Date()).format("DD MMMM YYYY")})
                </span>
              </Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="group justify-normal gap-2 text-foreground hover:no-underline"
            >
              <Link href="#">
                <TbFileUnknown className="text-2xl" />
                <p className="grow truncate group-hover:underline">Файл №1</p>
                <span className="text-sm text-muted-foreground">
                  ({dayjs(new Date()).format("DD MMMM YYYY")})
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
