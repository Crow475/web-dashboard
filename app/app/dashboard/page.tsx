"use client";

import { DragDropProvider } from "@dnd-kit/react";
import DropTarget from "@/components/dropTarget";
import DragElement from "@/components/dragElement";
import { useState, useEffect } from "react";
import React from "react";

import { LuCirclePlus, LuListX } from "react-icons/lu";

import type { UniqueIdentifier } from "@dnd-kit/core";

export default function Home() {
    const targets = [
        ["1-1", "1-2"],
        ["2-1", "2-2"],
        ["3-1", "3-2"],
        ["4-1", "4-2"],
    ];
    const [currentTarget, setCurrentTarget] = useState<UniqueIdentifier | undefined>();
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const storedTarget = localStorage.getItem("currentTarget");
        if (storedTarget) {
            // this is fine because we only want to set the current target on initial load, and it won't cause
            // an infinite loop since we're not updating localStorage in this effect. Eslint is just being dumb here.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentTarget(storedTarget);
        }
    }, []);

    return (
        <div className="relative flex w-full flex-1 flex-row items-start justify-around">
            <DragDropProvider
                onDragEnd={(event) => {
                    if (event.canceled) return;

                    setCurrentTarget(event.operation.target?.id);
                    setIsDragging(false);
                    localStorage.setItem("currentTarget", event.operation.target?.id.toString() ?? "");
                }}
                onDragStart={() => {
                    setIsDragging(true);
                }}
            >
                <div className="sticky top-0 flex h-dvh w-[20%] flex-col items-start justify-start px-2 py-4">
                    {currentTarget ? null : <DragElement />}
                </div>
                <div className="flex w-[80%] flex-col items-center justify-start">
                    <div className="gridEditing grid w-full grid-rows-4 gap-2 px-2 py-4">
                        {targets.map((row, rowIndex) => {
                            return (
                                <React.Fragment key={"row-" + rowIndex}>
                                    <button className="col-span-1 flex h-full cursor-pointer flex-row items-center justify-center rounded-md border border-neutral-100 p-1 text-neutral-500 shadow">
                                        <LuListX size={16} />
                                    </button>
                                    {row.map((id) => (
                                        <DropTarget key={id} id={id}>
                                            {currentTarget === id ? (
                                                <DragElement isDropped isDragging={isDragging} />
                                            ) : null}
                                        </DropTarget>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </div>
                    <div className="flex w-full flex-row items-center justify-end px-2 pb-4">
                        <button className="flex w-[97%] cursor-pointer flex-row items-center justify-center space-x-2 rounded-md border border-neutral-100 py-4 text-neutral-500 shadow">
                            <LuCirclePlus size={20} />
                            <span className="font-semibold">Add row</span>
                        </button>
                    </div>
                </div>
            </DragDropProvider>
        </div>
    );
}
