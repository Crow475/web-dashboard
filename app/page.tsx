"use client";

import { DragDropProvider } from "@dnd-kit/react";
import DropTarget from "@/components/dropTarget";
import DragElement from "@/components/dragElement";
import { useState, useEffect } from "react";

import type { UniqueIdentifier } from "@dnd-kit/core";

export default function Home() {
    const targets = ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3", "3-1", "3-2", "3-3", "4-1", "4-2", "4-3"];
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
                <div className="grid w-[80%] grid-cols-3 grid-rows-4 gap-2 px-2 py-4">
                    {targets.map((id) => (
                        <DropTarget key={id} id={id}>
                            {currentTarget === id ? <DragElement isDropped isDragging={isDragging} /> : null}
                        </DropTarget>
                    ))}
                </div>
            </DragDropProvider>
        </div>
    );
}
