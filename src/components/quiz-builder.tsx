import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import {
  TbQuestionMark,
  TbTrashX,
  TbCategoryPlus,
  TbTrash,
} from "react-icons/tb";
import { Input } from "./ui/input";
import { Fragment } from "react";
import { Label } from "./ui/label";
import { type ValueOf } from "~/libs/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "./ui/select";

export const QuizBuilderElementTypeMap = {
  WrintingCorrentAnswer: "quiz-writing-correct-answer",
  SelectCorrectAnswer: "quiz-select-correct-answer",
  Comparatins: "quiz-comparations",
  GapsFilling: "quiz-gaps-filling",
} as const;

export type QuizBuilderElementTypeMap = ValueOf<
  typeof QuizBuilderElementTypeMap
>;

export const QuizBuilderElementTypeContent: Record<
  QuizBuilderElementTypeMap,
  string
> = {
  "quiz-writing-correct-answer": "Написать правильный вариант ответа",
  "quiz-select-correct-answer": "Выбрать правильный вариант ответа",
  "quiz-comparations": "Сопоставление",
  "quiz-gaps-filling": "Заполнить пропуски",
};

export type QuizBuilderElement =
  | {
      id: string;
      type: "quiz-writing-correct-answer";
      question: string;
      answerKeywords: string;
    }
  | {
      id: string;
      type: "quiz-select-correct-answer";
      question: string;
      options: {
        id: string;
        label: string;
        isRight: boolean;
      }[];
    }
  | {
      id: string;
      type: "quiz-comparations";
      questions: {
        id: string;
        label: string;
        optionId: string;
      }[];
      options: {
        id: string;
        label: string;
      }[];
    }
  | {
      id: string;
      type: "quiz-gaps-filling";
      text: string;
      gaps: {
        id: string;
        label: string;
      }[];
      options: {
        id: string;
        label: string;
        gapId: string;
      }[];
    };

type QuizBuilderRenderElementProps = {
  element: QuizBuilderElement;
  onChange: (value: React.SetStateAction<QuizBuilderElement[]>) => void;
  isDeleteElementDisabled: boolean;
};

export const QuizBuilderRenderElement: React.FC<
  QuizBuilderRenderElementProps
> = ({ element, onChange, isDeleteElementDisabled }) => {
  switch (element.type) {
    case "quiz-writing-correct-answer":
      return (
        <Fragment>
          <Input
            type="text"
            placeholder="Впишите вопрос..."
            value={element.question}
            onChange={(event) => {
              onChange((prev) =>
                prev.map((e) => {
                  if (
                    e.id === element.id &&
                    e.type === "quiz-writing-correct-answer"
                  ) {
                    return {
                      ...e,
                      question: event.target.value,
                    };
                  }

                  return e;
                }),
              );
            }}
            leadingIcon={<TbQuestionMark className="text-xl" />}
          />
          <div className="mt-2 space-y-2">
            <Label htmlFor={element.id}>Варианты ответа</Label>
            <Input
              id={element.id}
              placeholder="Яблоко, Банан, Апельсин..."
              value={element.answerKeywords}
              onChange={(event) => {
                onChange((prev) =>
                  prev.map((e) => {
                    if (
                      e.id === element.id &&
                      e.type === "quiz-writing-correct-answer"
                    ) {
                      return {
                        ...e,
                        answerKeywords: event.target.value,
                      };
                    }

                    return e;
                  }),
                );
              }}
            />
            <p className="whitespace-pre-wrap text-[0.8rem] text-muted-foreground">
              Перечислите все возможные варианты ответа на вопрос через запятую.
              Чем больше будет вариантов ответа, тем меньше шанс ошибиться при
              наборе случайного символа. Регистр не имеет значение!
            </p>
          </div>
          <footer className="mt-4 flex items-center justify-end">
            <Button
              type="button"
              variant="outline-destructive"
              className="gap-2"
              disabled={isDeleteElementDisabled}
              onClick={() => {
                onChange((prev) => prev.filter((e) => e.id !== element.id));
              }}
            >
              <TbTrash className="shrink-0 text-lg" />
              <span>Удалить вопрос</span>
            </Button>
          </footer>
        </Fragment>
      );
    case "quiz-select-correct-answer":
      return (
        <Fragment>
          <Input
            type="text"
            placeholder="Впишите вопрос..."
            value={element.question}
            onChange={(event) => {
              onChange((prev) =>
                prev.map((e) => {
                  if (
                    e.id === element.id &&
                    e.type === "quiz-select-correct-answer"
                  ) {
                    return {
                      ...e,
                      question: event.target.value,
                    };
                  }

                  return e;
                }),
              );
            }}
            leadingIcon={<TbQuestionMark className="text-xl" />}
          />
          <div className="mt-4 grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-2">
            <span className="text-sm">Правильный ответ</span>
            <span className="text-sm">Вариант ответа</span>
            <span className="text-sm">Удалить ответ</span>
            {element.options.map((opt, optIndex) => (
              <Fragment key={opt.id}>
                <div className="flex items-center justify-center">
                  <Switch
                    checked={opt.isRight}
                    onCheckedChange={(checked) => {
                      onChange((prev) =>
                        prev.map((e) => {
                          if (
                            e.id === element.id &&
                            e.type === "quiz-select-correct-answer"
                          ) {
                            return {
                              ...e,
                              options: e.options.map((o) => {
                                if (o.id === opt.id) {
                                  return {
                                    ...o,
                                    isRight: checked,
                                  };
                                }

                                return o;
                              }),
                            };
                          }

                          return e;
                        }),
                      );
                    }}
                  />
                </div>
                <Input
                  autoFocus
                  placeholder="Вариант ответа..."
                  value={opt.label}
                  onChange={(event) => {
                    onChange((prev) =>
                      prev.map((e) => {
                        if (
                          e.id === element.id &&
                          e.type === "quiz-select-correct-answer"
                        ) {
                          return {
                            ...e,
                            options: e.options.map((o) => {
                              if (o.id === opt.id) {
                                return {
                                  ...o,
                                  label: event.target.value,
                                };
                              }

                              return o;
                            }),
                          };
                        }

                        return e;
                      }),
                    );
                  }}
                  onKeyDown={(event) => {
                    if (event.code === "Enter") {
                      event.preventDefault();

                      onChange((prev) =>
                        prev.map((e) => {
                          if (
                            e.id === element.id &&
                            e.type === "quiz-select-correct-answer"
                          ) {
                            return {
                              ...e,
                              options: [
                                ...e.options.slice(0, optIndex + 1),
                                {
                                  id: crypto.randomUUID(),
                                  label: "",
                                  isRight: false,
                                },
                                ...e.options.slice(optIndex + 1),
                              ],
                            };
                          }

                          return e;
                        }),
                      );
                    }
                  }}
                />
                <div className="flex items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost-destructive"
                    size="icon"
                    className="rounded-full"
                    disabled={element.options.length === 1}
                    onClick={() => {
                      onChange((prev) =>
                        prev.map((e) => {
                          if (
                            e.id === element.id &&
                            e.type === "quiz-select-correct-answer"
                          ) {
                            return {
                              ...e,
                              options: e.options.filter((o) => o.id !== opt.id),
                            };
                          }

                          return e;
                        }),
                      );
                    }}
                  >
                    <TbTrashX className="text-lg" />
                  </Button>
                </div>
              </Fragment>
            ))}
          </div>
          <footer className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => {
                onChange((prev) =>
                  prev.map((e) => {
                    if (
                      e.id === element.id &&
                      e.type === "quiz-select-correct-answer"
                    ) {
                      return {
                        ...e,
                        options: [
                          ...e.options,
                          {
                            id: crypto.randomUUID(),
                            label: "",
                            isRight: false,
                          },
                        ],
                      };
                    }

                    return e;
                  }),
                );
              }}
            >
              <TbCategoryPlus className="shrink-0 text-lg" />
              <span>Добавить вариант ответа</span>
            </Button>
            <Button
              type="button"
              variant="outline-destructive"
              className="gap-2"
              disabled={isDeleteElementDisabled}
              onClick={() => {
                onChange((prev) => prev.filter((e) => e.id !== element.id));
              }}
            >
              <TbTrash className="shrink-0 text-lg" />
              <span>Удалить вопрос</span>
            </Button>
          </footer>
        </Fragment>
      );
    case "quiz-comparations":
      return (
        <Fragment>
          <div className="space-y-2">
            <div className="grid grid-cols-[minmax(auto,15rem)_1fr_auto] gap-x-4 gap-y-2">
              <Label>Правильный ответ</Label>
              <Label>Вопрос</Label>
              <span></span>
              {element.questions.map((queston, questionIndex) => (
                <Fragment key={queston.id}>
                  <Select
                    value={queston.optionId}
                    onValueChange={(value) =>
                      onChange((prev) =>
                        prev.map((e) => {
                          if (
                            e.id === element.id &&
                            e.type === "quiz-comparations"
                          ) {
                            return {
                              ...e,
                              questions: e.questions.map((q) => {
                                if (q.id === queston.id) {
                                  return { ...q, optionId: value };
                                }

                                return q;
                              }),
                            };
                          }

                          return e;
                        }),
                      )
                    }
                  >
                    <Button
                      type="button"
                      asChild
                      variant="outline"
                      className="justify-between gap-2 text-left"
                      disabled={
                        element.options.filter((opt) => opt.label !== "")
                          .length === 0
                      }
                    >
                      <SelectTrigger>
                        <p className="truncate">
                          {queston.optionId !== ""
                            ? element.options.find(
                                (opt) => opt.id === queston.optionId,
                              )?.label
                            : "Верный вариант ответа..."}
                        </p>
                      </SelectTrigger>
                    </Button>
                    <SelectContent className="max-h-60 max-w-[20rem]">
                      <SelectGroup>
                        <SelectLabel>Варианты ответа</SelectLabel>
                        {element.options
                          .filter((opt) => opt.label !== "")
                          .map((opt) => (
                            <Button
                              key={opt.id}
                              type="button"
                              variant="ghost"
                              className="h-auto min-h-10 w-full justify-start whitespace-normal text-left"
                              asChild
                            >
                              <SelectItem value={opt.id}>
                                {opt.label}
                              </SelectItem>
                            </Button>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="flex-1">
                    <Input
                      autoFocus
                      placeholder="Вопрос..."
                      value={queston.label}
                      onChange={(event) => {
                        onChange((prev) =>
                          prev.map((e) => {
                            if (
                              e.id === element.id &&
                              e.type === "quiz-comparations"
                            ) {
                              return {
                                ...e,
                                questions: e.questions.map((q) => {
                                  if (q.id === queston.id) {
                                    return { ...q, label: event.target.value };
                                  }
                                  return q;
                                }),
                              };
                            }

                            return e;
                          }),
                        );
                      }}
                      onKeyDown={(event) => {
                        if (event.code === "Enter") {
                          event.preventDefault();

                          onChange((prev) =>
                            prev.map((e) => {
                              if (
                                e.id === element.id &&
                                e.type === "quiz-comparations"
                              ) {
                                return {
                                  ...e,
                                  questions: [
                                    ...e.questions.slice(0, questionIndex + 1),
                                    {
                                      id: crypto.randomUUID(),
                                      label: "",
                                      optionId: "",
                                    },
                                    ...e.questions.slice(questionIndex + 1),
                                  ],
                                };
                              }

                              return e;
                            }),
                          );
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost-destructive"
                    size="icon"
                    className="rounded-full"
                    onClick={() => {
                      onChange((prev) =>
                        prev.map((e) => {
                          if (
                            e.id === element.id &&
                            e.type === "quiz-comparations"
                          ) {
                            return {
                              ...e,
                              questions: e.questions.filter(
                                (q) => q.id !== queston.id,
                              ),
                            };
                          }

                          return e;
                        }),
                      );
                    }}
                    disabled={element.questions.length === 1}
                  >
                    <TbTrashX className="text-lg" />
                  </Button>
                </Fragment>
              ))}
            </div>
            <footer className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onChange((prev) =>
                    prev.map((e) => {
                      if (
                        e.id === element.id &&
                        e.type === "quiz-comparations"
                      ) {
                        return {
                          ...e,
                          questions: [
                            ...e.questions,
                            {
                              id: crypto.randomUUID(),
                              label: "",
                              optionId: "",
                            },
                          ],
                        };
                      }

                      return e;
                    }),
                  );
                }}
              >
                <TbCategoryPlus className="mr-2 text-lg" />
                <span>Добавить вопрос</span>
              </Button>
            </footer>
          </div>
          <div className="mt-4 space-y-2">
            <Label>Варианты ответов</Label>
            {element.options.map((opt, optIndex) => (
              <div key={opt.id} className="flex items-center gap-x-4">
                <div className="flex-1">
                  <Input
                    autoFocus
                    placeholder="Вариант ответа..."
                    value={opt.label}
                    onChange={(event) => {
                      onChange((prev) =>
                        prev.map((e) => {
                          if (
                            e.id === element.id &&
                            e.type === "quiz-comparations"
                          ) {
                            return {
                              ...e,
                              options: e.options.map((q) => {
                                if (q.id === opt.id) {
                                  return { ...q, label: event.target.value };
                                }
                                return q;
                              }),
                            };
                          }

                          return e;
                        }),
                      );
                    }}
                    onBlur={(event) => {
                      if (event.currentTarget.value === "")
                        onChange((prev) =>
                          prev.map((e) => {
                            if (
                              e.id === element.id &&
                              e.type === "quiz-comparations"
                            ) {
                              return {
                                ...e,
                                questions: e.questions.map((q) => {
                                  if (q.optionId === opt.id) {
                                    return { ...q, optionId: "" };
                                  }

                                  return q;
                                }),
                              };
                            }

                            return e;
                          }),
                        );
                    }}
                    onKeyDown={(event) => {
                      if (event.code === "Enter") {
                        event.preventDefault();

                        onChange((prev) =>
                          prev.map((e) => {
                            if (
                              e.id === element.id &&
                              e.type === "quiz-comparations"
                            ) {
                              return {
                                ...e,
                                options: [
                                  ...e.options.slice(0, optIndex + 1),
                                  {
                                    id: crypto.randomUUID(),
                                    label: "",
                                  },
                                  ...e.options.slice(optIndex + 1),
                                ],
                              };
                            }

                            return e;
                          }),
                        );
                      }
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost-destructive"
                  size="icon"
                  className="rounded-full"
                  disabled={element.options.length === 1}
                  onClick={() => {
                    onChange((prev) =>
                      prev.map((e) => {
                        if (
                          e.id === element.id &&
                          e.type === "quiz-comparations"
                        ) {
                          return {
                            ...e,
                            questions: e.questions.map((q) => {
                              if (q.optionId === opt.id) {
                                return { ...q, optionId: "" };
                              }

                              return q;
                            }),
                            options: e.options.filter((q) => q.id !== opt.id),
                          };
                        }

                        return e;
                      }),
                    );
                  }}
                >
                  <TbTrashX className="text-lg" />
                </Button>
              </div>
            ))}
            <footer className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onChange((prev) =>
                    prev.map((e) => {
                      if (
                        e.id === element.id &&
                        e.type === "quiz-comparations"
                      ) {
                        return {
                          ...e,
                          options: [
                            ...e.options,
                            {
                              id: crypto.randomUUID(),
                              label: "",
                            },
                          ],
                        };
                      }

                      return e;
                    }),
                  );
                }}
              >
                <TbCategoryPlus className="mr-2 text-lg" />
                <span>Добавить вариант ответа</span>
              </Button>
            </footer>
          </div>
          <footer className="mt-4 flex items-center justify-end">
            <Button
              type="button"
              variant="outline-destructive"
              className="gap-2"
              disabled={isDeleteElementDisabled}
              onClick={() => {
                onChange((prev) => prev.filter((e) => e.id !== element.id));
              }}
            >
              <TbTrash className="shrink-0 text-lg" />
              <span>Удалить вопрос</span>
            </Button>
          </footer>
        </Fragment>
      );
    default:
      return null;
  }
};
