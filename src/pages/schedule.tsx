import dayjs from "dayjs";
import { useState } from "react";
import { type DateRange } from "react-day-picker";
import {
  BiCalendar,
  BiCalendarAlt,
  BiChevronLeft,
  BiChevronRight,
  BiSearch,
  BiSolidBookBookmark,
  BiSolidNotepad,
  BiSolidWidget,
} from "react-icons/bi";
import { ScheduleItem } from "~/components/home/shedule-item";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { type ValueOf } from "~/libs/utils";
import { type NextPageWithLayout } from "./_app";

const TabsMap = {
  All: "All",
  Lessions: "Lessions",
  Tasks: "Tasks",
} as const;

type TabsMap = ValueOf<typeof TabsMap>;

const TabsTriggerMap: Record<TabsMap, { icon: React.ReactNode; text: string }> =
  {
    All: {
      icon: (
        <BiSolidWidget className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Все",
    },
    Lessions: {
      icon: (
        <BiSolidBookBookmark className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Занятия",
    },
    Tasks: {
      icon: (
        <BiSolidNotepad className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Задания",
    },
  };

const SelectValueMap = {
  Today: "Today",
  LastWeek: "LastWeek",
} as const;

type SelectValueMap = ValueOf<typeof SelectValueMap>;

const SelectValueContentMap: Record<SelectValueMap, string> = {
  Today: "Сегодня",
  LastWeek: "Неделя",
};

const SchedulePage: NextPageWithLayout = () => {
  const [tabs, setTabs] = useState<TabsMap>("All");
  const [selectValue, setSelectValue] = useState<SelectValueMap>("LastWeek");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: dayjs().add(7, "d").toDate(),
  });

  return (
    <main>
      <div className="grid grid-cols-1 grid-rows-[auto_auto] gap-x-3 sm:grid-cols-[auto_1fr]">
        <span className="row-span-2 hidden w-14 items-center justify-center rounded-full border border-input sm:flex">
          <BiCalendarAlt className="text-2xl" />
        </span>
        <h1 className="text-2xl font-medium capitalize">
          {dayjs().format("MMMM DD, YYYY")}
        </h1>
        <span className="text-muted-foreground">
          На сегодня у вас есть 3 занятия и 2 задания.
        </span>
      </div>
      <div className="mt-4 grid grid-cols-[1fr_repeat(2,minmax(0,auto))] gap-2">
        <Input
          leadingIcon={<BiSearch className="text-xl" />}
          placeholder="Поиск занятий и заданий..."
          className="max-w-72"
        />
        <Select
          defaultValue={SelectValueMap.LastWeek}
          value={selectValue}
          onValueChange={(value) => setSelectValue(value as SelectValueMap)}
        >
          <Button
            asChild
            variant="outline"
            className="justify-between gap-2 bg-transparent"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
          </Button>
          <SelectContent>
            {Object.entries(SelectValueContentMap).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 bg-transparent capitalize"
            >
              <BiCalendar className="text-xl" />
              {date?.from ? (
                date?.to ? (
                  <>
                    {dayjs(date.from).format("MMM DD, YYYY")} -{" "}
                    {dayjs(date.to).format("MMM DD, YYYY")}
                  </>
                ) : (
                  dayjs(date.from).format("MMM DD, YYYY")
                )
              ) : (
                <span>Выберите дату</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              max={7}
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Tabs defaultValue={TabsMap.All} className="mt-4">
        <TabsList className="hidden-scrollbar mb-4 flex h-auto max-w-full justify-normal overflow-auto rounded-none border-b bg-transparent p-0">
          {Object.entries(TabsTriggerMap).map(([key, value]) => (
            <TabsTrigger
              value={key}
              asChild
              key={key}
              className="group h-auto shrink-0 gap-2 rounded-none border-b border-primary/0 py-3 data-[state='active']:border-primary data-[state='active']:!bg-background/0 data-[state='active']:!shadow-none data-[state='active']:hover:!bg-accent"
            >
              <Button variant="ghost" type="button">
                {value.icon}
                <span>{value.text}</span>
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={TabsMap.All}>
          <div className="custom-scrollbar max-w-full overflow-x-auto rounded-xl">
            <table className="w-full border-separate border-spacing-0 bg-clip-padding [&_tr:first-child_th:first-child]:rounded-tl-xl [&_tr:first-child_th:last-child]:rounded-tr-xl [&_tr:last-child_td:first-child]:rounded-bl-xl [&_tr:last-child_td:last-child]:rounded-br-xl">
              <thead>
                <tr>
                  <th className="sticky left-0 top-0 w-16 border border-border bg-background p-0">
                    <Button
                      variant="ghost"
                      className="h-full w-full rounded-none rounded-tl-[calc(0.75rem-1px)]"
                    >
                      <BiChevronLeft className="text-xl" />
                    </Button>
                  </th>
                  <th className="sticky left-[3.35rem] top-0 w-16 border border-border bg-background p-0">
                    <Button
                      variant="ghost"
                      className="h-full w-full rounded-none"
                    >
                      <BiChevronRight className="text-xl" />
                    </Button>
                  </th>
                  <th className="whitespace-nowrap border border-border bg-background px-4 font-medium">
                    <span className="capitalize">
                      {dayjs().format("dd, DD MMMM")}
                    </span>
                  </th>
                  <th className="whitespace-nowrap border border-border bg-background px-4 font-medium">
                    <span className="capitalize">
                      {dayjs().format("dd, DD MMMM")}
                    </span>
                  </th>
                  <th className="whitespace-nowrap border border-border bg-background px-4 font-medium">
                    <span className="capitalize">
                      {dayjs().format("dd, DD MMMM")}
                    </span>
                  </th>
                  <th className="whitespace-nowrap border border-border bg-background px-4 font-medium">
                    <span className="capitalize">
                      {dayjs().format("dd, DD MMMM")}
                    </span>
                  </th>
                  <th className="whitespace-nowrap border border-border bg-background px-4 font-medium">
                    <span className="capitalize">
                      {dayjs().format("dd, DD MMMM")}
                    </span>
                  </th>
                  <th className="whitespace-nowrap border border-border bg-background px-4 font-medium">
                    <span className="capitalize">
                      {dayjs().format("dd, DD MMMM")}
                    </span>
                  </th>
                  <th className="whitespace-nowrap border border-border bg-background px-4 font-medium">
                    <span className="capitalize">
                      {dayjs().format("dd, DD MMMM")}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    className="sticky left-0 top-0 h-20 border border-border bg-background text-center align-top"
                    colSpan={2}
                  >
                    8:00
                  </td>
                  <td className="border border-border p-2">
                    <div className="min-w-80">
                      <ScheduleItem
                        classRoom={203}
                        end={new Date("04/28/2024 9:30")}
                        start={new Date("04/28/2024 8:00")}
                        groupId="123"
                        id="123"
                        index={0}
                        pavilion={{
                          id: "123",
                          address: "пр-т Ленина, 61",
                          infoLink: "",
                          mapLink: "",
                          name: "Корпус М",
                        }}
                        pavilionId="123"
                        status="Full"
                        teacher={{
                          surname: "Демкина",
                          name: "Любовь",
                          fathername: "Михайловна",
                          status: "Преподаватель английского языка",
                        }}
                        teacherId="123"
                        title="Иностранный язык в профессиональной деятельности"
                        type="Lec"
                      />
                    </div>
                  </td>
                  <td className="border border-border p-2">
                    <div className="min-w-80">
                      <ScheduleItem
                        classRoom={203}
                        end={new Date("04/28/2024 9:30")}
                        start={new Date("04/28/2024 8:00")}
                        groupId="123"
                        id="123"
                        index={0}
                        pavilion={{
                          id: "123",
                          address: "пр-т Ленина, 61",
                          infoLink: "",
                          mapLink: "",
                          name: "Корпус М",
                        }}
                        pavilionId="123"
                        status="Full"
                        teacher={{
                          surname: "Демкина",
                          name: "Любовь",
                          fathername: "Михайловна",
                          status: "Преподаватель английского языка",
                        }}
                        teacherId="123"
                        title="Иностранный язык в профессиональной деятельности"
                        type="Lec"
                      />
                    </div>
                  </td>
                  <td className="border border-border p-2">
                    <div className="min-w-80"></div>
                  </td>
                  <td className="border border-border p-2">
                    <div className="min-w-80"></div>
                  </td>
                  <td className="border border-border p-2">
                    <div className="min-w-80"></div>
                  </td>
                  <td className="border border-border p-2">
                    <div className="min-w-80"></div>
                  </td>
                  <td className="border border-border p-2">
                    <div className="min-w-80"></div>
                  </td>
                </tr>
                <tr>
                  <td
                    className="sticky left-0 top-0 h-20 border border-border bg-background text-center align-top"
                    colSpan={2}
                  >
                    9:40
                  </td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                </tr>
                <tr>
                  <td
                    className="sticky left-0 top-0 h-20 border border-border bg-background text-center align-top"
                    colSpan={2}
                  >
                    11:20
                  </td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                </tr>
                <tr>
                  <td
                    className="sticky left-0 top-0 h-20 border border-border bg-background text-center align-top"
                    colSpan={2}
                  >
                    13:20
                  </td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                </tr>
                <tr>
                  <td
                    className="sticky left-0 top-0 h-20 border border-border bg-background text-center align-top"
                    colSpan={2}
                  >
                    15:00
                  </td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                </tr>
                <tr>
                  <td
                    className="sticky left-0 top-0 h-20 border border-border bg-background text-center align-top"
                    colSpan={2}
                  >
                    16:40
                  </td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                </tr>
                <tr>
                  <td
                    className="sticky left-0 top-0 h-20 border border-border bg-background text-center align-top"
                    colSpan={2}
                  >
                    18:20
                  </td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                </tr>
                <tr>
                  <td
                    className="sticky left-0 top-0 h-20 border border-border bg-background text-center align-top"
                    colSpan={2}
                  >
                    20:00
                  </td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                  <td className="border border-border p-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

SchedulePage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default SchedulePage;
