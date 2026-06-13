"use client";

import { useContext, useState, useEffect } from "react";

import { WidgetDataContex } from "@/components/custom/widget";
import { WidgetDataContexRegular } from "@/components/custom/widgetRegular";

import { widgetCombo } from "@/lib/types";

import { updateWidget } from "@/actions/updateWidget";

import { useTranslations } from "next-intl";

import getUsersOfDashboard from "@/actions/getUsersOfDashboard";
import getRoleInDashboard from "@/actions/getRoleInDashboard";
import getOwnerOfDashboard from "@/actions/getOwnerOfDashboard";

import uuidToShort from "@/lib/uuidToShort";
import { createTranslator } from "short-uuid";

import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

import TaskElement from "@/components/widgets/elements/taskElement";

import type { dashboardUserSelectReturn } from "@/lib/types";
import { LuCirclePlus, LuUndo2, LuCheck } from "react-icons/lu";

type tasksProps = {
    title: string;
    tasks: string;
};

export type tasksParsed = { text: string; user: string; dueDate: Date; completed: boolean; id: string }[];

function TasksExpanded() {
    const value = useContext(WidgetDataContex);
    const state = value.widgetProps as tasksProps;
    const setWidgetProps = value.setWidgetProps;
    const id = value.id;
    const dashboardId = value.dashboardId;
    const profileId = value.profileId;

    const [users, setUsers] = useState<dashboardUserSelectReturn>([]);
    const decimalTranslator = createTranslator("0123456789");

    const [role, setRole] = useState<"admin" | "editor" | "viewer" | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            const result = await getUsersOfDashboard(uuidToShort(dashboardId));
            const owner = await getOwnerOfDashboard(dashboardId);

            if (!result) {
                return;
            }

            if (!owner) {
                return;
            }

            setUsers([owner, ...result]);
        }

        async function fetchRole() {
            const result = await getRoleInDashboard(dashboardId, profileId);

            if (!result) {
                return;
            }

            setRole(result);
        }

        fetchUsers();
        fetchRole();
    }, [dashboardId, profileId]);

    const t = useTranslations("component.widgets.tasks");

    const [edited, setEdited] = useState(false);

    const parsed: tasksParsed = JSON.parse(state.tasks ?? `[]`);
    const [tasks, setTasks] = useState<tasksParsed>(
        parsed.map((task) => ({ ...task, dueDate: new Date(task.dueDate ?? "") })),
    );

    function handleSave() {
        setWidgetProps({
            ...state,
            tasks: JSON.stringify(tasks),
        });

        const result = updateWidget(dashboardId, id.split("-")[2], {
            tasks: JSON.stringify(tasks),
            title: state.title,
        });
        if (!result) {
            toast.error(t("saveFailure"));
            return;
        }

        toast.success(t("saveSuccess"));

        setEdited(false);
    }

    return (
        <div className="flex h-full w-full flex-col items-center justify-start rounded-xl bg-white px-1 pb-2">
            <div className="flex w-full flex-row items-center justify-between pt-2 pr-2 pb-1 pl-4">
                <h1 className="text-2xl font-bold md:text-3xl">{state.title}</h1>
                <div className="flex flex-row items-center justify-end space-x-1">
                    <button
                        className={`${edited ? "flex" : "hidden"} cursor-pointer flex-row items-center justify-center space-x-1 rounded-md border border-neutral-300 bg-white px-2 py-2 text-xs shadow hover:bg-neutral-100 md:text-sm`}
                        title={t("undoChanges")}
                        onClick={() => {
                            setTasks(parsed.map((task) => ({ ...task, dueDate: new Date(task.dueDate ?? "") })));
                            setEdited(false);
                        }}
                    >
                        <LuUndo2 className="size-3 md:size-4" />
                    </button>
                    <button
                        className={`${edited ? "flex" : "hidden"} cursor-pointer flex-row items-center justify-center space-x-1 rounded-md border border-blue-400 bg-blue-500 px-2 py-1.5 text-xs text-white shadow hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300 md:text-sm`}
                        onClick={() => handleSave()}
                    >
                        <span>{t("save")}</span>
                        <LuCheck />
                    </button>
                </div>
            </div>
            <ScrollArea className="flex h-68 w-full overflow-y-hidden">
                <div className="flex h-3 w-full flex-row" />
                {tasks
                    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                    .map((task) => (
                        <TaskElement
                            key={`task-${task.id}`}
                            users={users}
                            currenttask={task}
                            tasks={tasks}
                            setTasks={setTasks}
                            setEdited={setEdited}
                            deleteLabel={t("deleteLabel")}
                            role={role}
                            profileId={profileId}
                            taskPlaceholder={t("taskPlaceholder")}
                        />
                    ))}
                <div className="flex w-full flex-row items-center justify-start space-x-1 py-1 pr-4 pl-2">
                    <button
                        className="flex w-full flex-row items-center justify-center space-x-1 rounded-md border border-neutral-200 px-1 py-1"
                        onClick={() => {
                            setTasks([
                                ...tasks,
                                {
                                    text: "",
                                    user: "",
                                    dueDate: new Date(),
                                    completed: false,
                                    id: decimalTranslator.generate(),
                                },
                            ]);
                            setEdited(true);
                        }}
                    >
                        <LuCirclePlus className="text-neutral-500" />
                        <span className="text-neutral-500">{t("addTask")}</span>
                    </button>
                </div>
            </ScrollArea>
        </div>
    );
}

function TasksSettings() {
    const value = useContext(WidgetDataContex);
    const state = value.widgetProps as tasksProps;
    const setWidgetProps = value.setWidgetProps;

    const t = useTranslations("component.widgets.tasks");

    return (
        <div className="flex h-full w-full flex-col items-center justify-start rounded-xl bg-white">
            <div className="flex w-full flex-row items-center justify-start space-x-2 px-4 py-2">
                <label htmlFor="title" className="w-1/4">
                    {t("titleLabel")}
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-3/4 rounded-md border border-neutral-200 px-1 py-1"
                    value={state.title}
                    onChange={(e) => {
                        setWidgetProps({ ...state, title: e.target.value });
                    }}
                    autoComplete="off"
                />
            </div>
        </div>
    );
}

function TasksRegular() {
    const value = useContext(WidgetDataContexRegular);
    const state = value.widgetProps as tasksProps;
    const id = value.id;
    const dashboardId = value.dashboardId;
    const profileId = value.profileId;

    const [role, setRole] = useState<"admin" | "editor" | "viewer" | null>(null);
    const [users, setUsers] = useState<dashboardUserSelectReturn>([]);
    const decimalTranslator = createTranslator("0123456789");

    useEffect(() => {
        async function fetchUsers() {
            const result = await getUsersOfDashboard(uuidToShort(dashboardId));
            const owner = await getOwnerOfDashboard(dashboardId);

            if (!owner) {
                return;
            }

            if (!result) {
                setUsers([owner]);
                return;
            }

            setUsers([owner, ...result]);
        }

        async function fetchRole() {
            const result = await getRoleInDashboard(dashboardId, profileId);

            if (!result) {
                return;
            }

            setRole(result);
        }

        fetchUsers();
        fetchRole();
    }, [dashboardId, profileId]);

    const t = useTranslations("component.widgets.tasks");

    const [edited, setEdited] = useState(false);

    const parsed: tasksParsed = JSON.parse(state.tasks ?? `[]`);
    const [tasks, setTasks] = useState<tasksParsed>(
        parsed.map((task) => ({ ...task, dueDate: new Date(task.dueDate ?? "") })),
    );

    async function handleSave() {
        const result = await updateWidget(dashboardId, id, {
            tasks: JSON.stringify(tasks),
            title: state.title,
        });
        console.log("Result: ", result);
        if (!result) {
            toast.error(t("saveFailure"));
            return;
        }

        toast.success(t("saveSuccess"));

        setEdited(false);
    }

    return (
        <div className="flex h-full w-full flex-col items-center justify-start rounded-xl bg-white px-1 pb-2">
            <div className="flex w-full flex-row items-center justify-between pt-2 pr-2 pb-1 pl-4">
                <h1 className="text-2xl font-bold md:text-3xl">{state.title}</h1>
                <div className="flex flex-row items-center justify-end space-x-1">
                    <button
                        className={`${edited ? "flex" : "hidden"} cursor-pointer flex-row items-center justify-center space-x-1 rounded-md border border-neutral-300 bg-white px-2 py-2 text-xs shadow hover:bg-neutral-100 md:text-sm`}
                        title={t("undoChanges")}
                        onClick={() => {
                            setTasks(parsed.map((task) => ({ ...task, dueDate: new Date(task.dueDate ?? "") })));
                            setEdited(false);
                        }}
                    >
                        <LuUndo2 className="size-3 md:size-4" />
                    </button>
                    <button
                        className={`${edited ? "flex" : "hidden"} cursor-pointer flex-row items-center justify-center space-x-1 rounded-md border border-blue-400 bg-blue-500 px-2 py-1.5 text-xs text-white shadow hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300 md:text-sm`}
                        onClick={() => handleSave()}
                    >
                        <span>{t("save")}</span>
                        <LuCheck />
                    </button>
                </div>
            </div>
            <ScrollArea className="flex h-64 w-full overflow-y-hidden md:h-80">
                <div className="flex h-3 w-full flex-row" />
                {tasks
                    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                    .map((task) => (
                        <TaskElement
                            key={`task-${task.id}`}
                            users={users}
                            currenttask={task}
                            tasks={tasks}
                            setTasks={setTasks}
                            setEdited={setEdited}
                            deleteLabel={t("deleteLabel")}
                            role={role}
                            profileId={profileId}
                            taskPlaceholder={t("taskPlaceholder")}
                        />
                    ))}
                <div className="flex w-full flex-row items-center justify-start space-x-1 py-1 pr-4 pl-2">
                    <button
                        className="flex w-full flex-row items-center justify-center space-x-1 rounded-md border border-neutral-200 px-1 py-1"
                        disabled={role === "viewer"}
                        onClick={() => {
                            setTasks([
                                ...tasks,
                                {
                                    text: "",
                                    user: "",
                                    dueDate: new Date(),
                                    completed: false,
                                    id: decimalTranslator.generate(),
                                },
                            ]);
                            setEdited(true);
                        }}
                    >
                        <LuCirclePlus className="text-neutral-500" />
                        <span className="text-sm text-neutral-500 md:text-base">{t("addTask")}</span>
                    </button>
                </div>
            </ScrollArea>
        </div>
    );
}

export const TasksWidget: widgetCombo = {
    name: "tasks",
    expanded: <TasksExpanded />,
    regular: <TasksRegular />,
    settings: <TasksSettings />,
};
