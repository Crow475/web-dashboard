"use client";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { notoColorEmoji } from "@/lib/fonts";

import type { dashboardUserSelectReturn } from "@/lib/types";

import { LuCheck, LuCalendarDays, LuTrash2 } from "react-icons/lu";

import type { tasksParsed } from "@/components/widgets/tasksWidget";

export default function TaskElement({
    users,
    setEdited,
    currenttask,
    tasks,
    setTasks,
    deleteLabel,
    role,
    profileId,
    taskPlaceholder,
}: {
    users: dashboardUserSelectReturn;
    setEdited: (value: boolean) => void;
    currenttask: tasksParsed[0];
    tasks: tasksParsed;
    setTasks: (tasks: tasksParsed) => void;
    deleteLabel: string;
    role: "admin" | "editor" | "viewer" | null;
    profileId: string;
    taskPlaceholder: string;
}) {
    console.log("Current task: ", currenttask);

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div className="flex w-full flex-row items-center justify-start space-x-1 py-1 pr-2 pl-1 md:pr-4 md:pl-2">
                    <Select
                        disabled={role === "viewer"}
                        value={users.length > 1 ? currenttask.user : (users[0]?.profile?.profileId ?? "")}
                        onValueChange={(e) => {
                            setTasks([
                                ...tasks.filter((task) => task.id !== currenttask.id),
                                { ...currenttask, user: e },
                            ]);
                            setEdited(true);
                        }}
                    >
                        <SelectTrigger className="w-[17%] rounded-md border border-neutral-200 px-0.5 py-1 md:w-1/4 md:px-1">
                            <SelectValue />
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.profile?.profileId} value={user.profile?.profileId ?? ""}>
                                        <span className={`${notoColorEmoji.className} text-base md:text-lg`}>
                                            {user.profile?.icon}
                                        </span>
                                        <span
                                            className={`${currenttask.completed ? "text-neutral-500 line-through decoration-2" : ""} text-sm font-semibold md:text-base`}
                                        >
                                            {user.profile?.username}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectTrigger>
                    </Select>
                    <input
                        disabled={role === "viewer"}
                        type="text"
                        id="text"
                        name="text"
                        placeholder={taskPlaceholder}
                        value={currenttask.text}
                        onChange={(e) => {
                            setTasks([
                                ...tasks.filter((task) => task.id !== currenttask.id),
                                { ...currenttask, text: e.target.value },
                            ]);
                            setEdited(true);
                        }}
                        className={`${currenttask.completed ? "text-neutral-500 line-through decoration-2" : ""} w-1/2 rounded-md border border-neutral-200 px-1 py-1 text-sm disabled:border-neutral-100 disabled:text-neutral-400 md:text-base`}
                        autoComplete="off"
                    />
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className={`${currenttask.completed ? "text-neutral-500 line-through decoration-2" : ""} felx-row group flex w-[23%] flex-row items-center justify-between rounded-md border border-neutral-200 px-1.5 py-1.5 disabled:border-neutral-100 md:w-[20%] md:py-1`}
                                disabled={role === "viewer"}
                            >
                                <LuCalendarDays className="size-3 text-neutral-500 group-disabled:text-neutral-300 md:size-4" />
                                {currenttask.dueDate ? (
                                    <span className="text-xs group-disabled:text-neutral-400 md:text-base">
                                        <span>{String(currenttask.dueDate.getDate()).padStart(2, "0")}.</span>
                                        <span>{String(currenttask.dueDate.getMonth() + 1).padStart(2, "0")}</span>
                                        <span className="hidden md:inline">.{currenttask.dueDate.getFullYear()}</span>
                                    </span>
                                ) : (
                                    <span className="group-disabled:text-neutral-400">Due date</span>
                                )}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={currenttask.dueDate}
                                onSelect={(e) => {
                                    setTasks([
                                        ...tasks.filter((task) => task.id !== currenttask.id),
                                        { ...currenttask, dueDate: e ?? new Date() },
                                    ]);
                                    setEdited(true);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <button
                        className="group flex w-1/10 flex-row items-center justify-end md:w-[5%]"
                        disabled={role === "viewer" && currenttask.user !== profileId}
                        onClick={() => {
                            setTasks([
                                ...tasks.filter((task) => task.id !== currenttask.id),
                                { ...currenttask, completed: !currenttask.completed },
                            ]);
                            setEdited(true);
                        }}
                    >
                        <div
                            className={`flex flex-row items-center justify-center rounded-full border p-1 ${currenttask.completed ? "border-blue-200 bg-blue-500 group-disabled:bg-blue-400" : "border-neutral-200 bg-white group-disabled:bg-neutral-50"} `}
                        >
                            <LuCheck
                                className={`${currenttask.completed ? "opacity-100" : "opacity-0"} size-4 text-white`}
                            />
                        </div>
                    </button>
                </div>
            </HoverCardTrigger>
            {role !== "viewer" && (
                <HoverCardContent
                    side="right"
                    sideOffset={-5}
                    className="flex h-8 w-8 flex-col items-center justify-center"
                >
                    <button
                        className="flex cursor-pointer rounded-lg border border-neutral-300 bg-white p-2 text-neutral-500 hover:bg-red-300 hover:text-red-950 focus-visible:text-neutral-600"
                        type="button"
                        title={deleteLabel}
                        onClick={() => {
                            setTasks([...tasks.filter((task) => task.id !== currenttask.id)]);
                            setEdited(true);
                        }}
                    >
                        <LuTrash2 className="size-4" />
                    </button>
                </HoverCardContent>
            )}
        </HoverCard>
    );
}
