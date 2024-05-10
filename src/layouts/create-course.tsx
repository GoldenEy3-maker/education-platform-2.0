import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { api } from "~/libs/api";
import { PagePathMap } from "~/libs/enums";
import { useCreateCourseStore } from "~/store/create-course";

type CreateCourseLayoutProps = {
  formId?: string;
} & React.PropsWithChildren;

export const CreateCourseLayout: React.FC<CreateCourseLayoutProps> = ({
  formId,
  children,
}) => {
  const createCourseStore = useCreateCourseStore();

  const createCourseMutation = api.course.create.useMutation();

  return (
    <main>
      <Breadcrumb className="mb-4 overflow-hidden">
        <BreadcrumbList className="overflow-hidden">
          <BreadcrumbItem>
            <BreadcrumbLink href={PagePathMap.Courses}>Курсы</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Новый курс</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <header className="mb-4 flex justify-between gap-2 max-sm:flex-col sm:items-center">
        <div>
          <h1 className="text-2xl font-medium">Создать новый курс</h1>
          <p className="text-muted-foreground">
            Заполните все поля информации вашего нового курса.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline">Сохранить в черновик</Button> */}
          {formId ? (
            <Button type="submit" form={formId}>
              Продолжить
            </Button>
          ) : (
            <Button
              onClick={() =>
                createCourseMutation.mutate({
                  title: createCourseStore.fullTitle,
                })
              }
            >
              Опубликовать
            </Button>
          )}
        </div>
      </header>
      {children}
    </main>
  );
};
