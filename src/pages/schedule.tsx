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
  LastMonth: "LastMonth",
} as const;

type SelectValueMap = ValueOf<typeof SelectValueMap>;

const SelectValueContentMap: Record<SelectValueMap, string> = {
  Today: "Сегодня",
  LastWeek: "Неделя",
  LastMonth: "Месяц",
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
              max={31}
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Tabs defaultValue={TabsMap.All} className="mt-4 overflow-hidden">
        <TabsList className="hidden-scrollbar mb-4 flex h-auto max-w-[calc(100vw-2rem)] justify-normal overflow-auto rounded-none border-b bg-transparent p-0">
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
          <table className="inline-block border-spacing-0 overflow-hidden rounded-xl border border-border bg-clip-padding">
            <tbody className="-m-[1px] inline-block">
              <tr>
                <th className="border border-border p-0">
                  <Button
                    variant="ghost"
                    className="flex h-full w-full rounded-none"
                  >
                    <BiChevronLeft className="text-xl" />
                  </Button>
                </th>
                <th className="border border-border p-0">
                  <Button
                    variant="ghost"
                    className=" flex h-full w-full rounded-none"
                  >
                    <BiChevronRight className="text-xl" />
                  </Button>
                </th>
                <th className="border border-border px-4 font-medium">
                  {dayjs().format("DD MMM")}
                </th>
                <th className="border border-border px-4 font-medium">
                  {dayjs().format("DD MMM")}
                </th>
                <th className="border border-border px-4 font-medium">
                  {dayjs().format("DD MMM")}
                </th>
                <th className="border border-border px-4 font-medium">
                  {dayjs().format("DD MMM")}
                </th>
                <th className="border border-border px-4 font-medium">
                  {dayjs().format("DD MMM")}
                </th>
                <th className="border border-border px-4 font-medium">
                  {dayjs().format("DD MMM")}
                </th>
                <th className="border border-border px-4 font-medium">
                  {dayjs().format("DD MMM")}
                </th>
              </tr>
            </tbody>
          </table>
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
