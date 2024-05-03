import dayjs from "dayjs";
import Link from "next/link";
import { BiChevronRight, BiEnvelope, BiShareAlt } from "react-icons/bi";
import { Avatar } from "~/components/avatar";
import { CourseItem } from "~/components/course-item";
import { ShareDialogDrawer } from "~/components/share-dialog-drawer";
import { Button } from "~/components/ui/button";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { PagePathMap } from "~/libs/enums";
import { type NextPageWithLayout } from "../_app";

const ProfilePage: NextPageWithLayout = () => {
  return (
    <main>
      <div className="h-56 w-full rounded-3xl bg-muted/30"></div>
      <div className="-translate-y-14 sm:px-8">
        <div>
          <Avatar className="mb-1 h-28 w-28 text-2xl" fallback="КД" />
          <h2 className="text-xl font-medium sm:text-2xl">
            Королев Данил Николаевич
          </h2>
          <span className="text-muted-foreground">
            Был(а) в сети {dayjs(new Date("04/24/2024 05:05:05")).fromNow()}
          </span>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Студент</span>
            <div className="flex items-center gap-4">
              <ShareDialogDrawer>
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent max-lg:h-10 max-lg:w-10 max-lg:rounded-full max-lg:border-none max-lg:shadow-none"
                >
                  <BiShareAlt className="shrink-0 text-xl" />
                  <span className="max-lg:hidden">Поделиться</span>
                </Button>
              </ShareDialogDrawer>
              <Button asChild className="gap-2">
                <Link href={PagePathMap.Chat + "1"}>
                  <BiEnvelope className="text-xl" />
                  <span>Написать</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="mb-2 text-xl font-medium xs:hidden">Информация</h3>
          <h3 className="mb-2 text-xl font-medium max-xs:hidden">
            Дополнительная информация
          </h3>
          <dl className="grid gap-2 sm:grid-cols-2">
            <dt className="text-muted-foreground">Адрес электронной почты</dt>
            <dd>
              <Link
                href="mailto:danil-danil-korolev@bk.ru"
                className="underline-offset-4 hover:underline"
              >
                danil-danil-korolev@bk.ru
              </Link>
            </dd>
            <dt className="text-muted-foreground">Страна</dt>
            <dd>Россия</dd>
            <dt className="text-muted-foreground">Город</dt>
            <dd>Барнаул</dd>
            <dt className="text-muted-foreground">Специальность</dt>
            <dd>09.02.07 Информационные системы и программирование</dd>
          </dl>
        </div>
        <div className="mt-8">
          <header className="mb-4 flex items-center justify-between gap-2">
            <h3 className="text-xl font-medium xs:hidden">Курсы</h3>
            <h3 className="text-xl font-medium max-xs:hidden">
              Информация о курсах
            </h3>
            <Button asChild variant="outline" className="gap-1">
              <Link href={PagePathMap.Courses}>
                <span>Смотреть все</span>
                <BiChevronRight className="text-xl" />
              </Link>
            </Button>
          </header>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-4">
            <CourseItem
              id="123"
              title="Иностранный язык в профессиональной деятельности"
              author={{
                fathername: "Михайловна",
                id: "123",
                image: null,
                name: "Любовь",
                surname: "Демкина",
              }}
            />
            <CourseItem
              id="123"
              title="Иностранный язык в профессиональной деятельности"
              author={{
                fathername: "Михайловна",
                id: "123",
                image: null,
                name: "Любовь",
                surname: "Демкина",
              }}
            />
            <CourseItem
              id="123"
              title="Иностранный язык в профессиональной деятельности"
              author={{
                fathername: "Михайловна",
                id: "123",
                image: null,
                name: "Любовь",
                surname: "Демкина",
              }}
            />
            <CourseItem
              id="123"
              title="Иностранный язык в профессиональной деятельности"
              author={{
                fathername: "Михайловна",
                id: "123",
                image: null,
                name: "Любовь",
                surname: "Демкина",
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

ProfilePage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default ProfilePage;
