import dayjs from "dayjs";
import { BiExpandVertical, BiPlus, BiSearch } from "react-icons/bi";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Input } from "./ui/input";

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
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <Input
          leadingIcon={<BiSearch className="text-xl" />}
          placeholder="Поиск объявлений..."
          className="max-w-80"
          value={searchValue}
          onChange={(event) => onSearchValueChange(event.target.value)}
        />
        {isAuthor ? (
          <Button className="gap-2 max-md:w-10 max-md:rounded-full">
            <BiPlus className="shrink-0 text-xl" />
            <span className="max-md:hidden">Создать новое</span>
            <span className="sr-only md:hidden">Создать новое объявление</span>
          </Button>
        ) : null}
      </div>
      <div>
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="grid h-auto w-full grid-cols-[1fr_auto] gap-x-2 border-b text-left max-sm:grid-rows-[auto_auto] sm:grid-cols-[auto_1fr_auto]"
            >
              <h3 className="truncate text-base font-medium">
                Карьерная гостинная
              </h3>
              <span className="truncate capitalize text-muted-foreground max-sm:row-start-2">
                ({dayjs().format("DD MMMM YYYY, HH:mm:ss")})
              </span>
              <BiExpandVertical className="max-sm:row-span-2" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi
                sequi numquam voluptatum molestiae dolorum accusantium alias
                amet quaerat. Itaque consequatur odio odit veritatis harum
                repellendus facilis voluptatem nisi laboriosam natus?
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="grid h-auto w-full grid-cols-[1fr_auto] gap-x-2 border-b text-left max-sm:grid-rows-[auto_auto] sm:grid-cols-[auto_1fr_auto]"
            >
              <h3 className="truncate text-base font-medium">
                Карьерная гостинная
              </h3>
              <span className="truncate capitalize text-muted-foreground max-sm:row-start-2">
                ({dayjs().format("DD MMMM YYYY, HH:mm:ss")})
              </span>
              <BiExpandVertical className="max-sm:row-span-2" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi
                sequi numquam voluptatum molestiae dolorum accusantium alias
                amet quaerat. Itaque consequatur odio odit veritatis harum
                repellendus facilis voluptatem nisi laboriosam natus? Lorem
                ipsum dolor sit amet, consectetur adipisicing elit. Ratione
                maxime nulla consequatur eaque repellat libero totam doloremque
                aperiam tempora, laboriosam dolorem tempore illum sunt
                reiciendis quidem vero alias, iste eveniet!
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="grid h-auto w-full grid-cols-[1fr_auto] gap-x-2 border-b text-left max-sm:grid-rows-[auto_auto] sm:grid-cols-[auto_1fr_auto]"
            >
              <h3 className="truncate text-base font-medium">
                Карьерная гостинная
              </h3>
              <span className="truncate capitalize text-muted-foreground max-sm:row-start-2">
                ({dayjs().format("DD MMMM YYYY, HH:mm:ss")})
              </span>
              <BiExpandVertical className="max-sm:row-span-2" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi
                sequi numquam voluptatum molestiae dolorum accusantium alias
                amet quaerat. Itaque consequatur odio odit veritatis harum
                repellendus facilis voluptatem nisi laboriosam natus? Lorem
                ipsum dolor sit amet, consectetur adipisicing elit. Natus
                maiores quibusdam vero officiis veniam a, quas consectetur dicta
                cupiditate corporis modi possimus ab quasi, est commodi impedit
                amet? Illo, nam! Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Corrupti, nulla. Quisquam numquam, error
                adipisci corrupti consequatur ipsam, rem placeat doloremque,
                labore tempore ipsa sequi! Eius modi quam dolores voluptates
                assumenda?
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
