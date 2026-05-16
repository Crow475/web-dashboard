"use client";

import { useRef } from "react";
import { useDraggable } from "@dnd-kit/react";

import { LuGripVertical } from "react-icons/lu";

export default function DragElement({
    isDropped,
    isDragging,
    id,
}: {
    isDropped?: boolean;
    isDragging?: boolean;
    id: string;
}) {
    const handleRef = useRef<HTMLDivElement>(null);

    const { ref } = useDraggable({
        id: id,
        handle: handleRef,
        data: {
            type: "TEST",
        },
    });

    const expanded = isDropped;

    return (
        <button
            ref={ref}
            className={`flex w-full flex-col justify-start space-x-2 border border-neutral-200 bg-white transition-all duration-100 ${expanded ? "h-full w-full rounded-xl" : "items-center rounded-md"}`}
        >
            <div
                className={`flex w-full flex-row items-center justify-start bg-neutral-50 py-1 pr-2 ${expanded ? "rounded-t-xl border-b border-neutral-200" : "rounded-t-md rounded-b-md"}`}
            >
                <div ref={handleRef} className="cursor-grab pl-1">
                    <LuGripVertical size={expanded ? 16 : 20} />
                </div>
                <span className={expanded ? "text" : "text-lg"}>Draggable</span>
            </div>
            {expanded ? (
                <div className="flex h-full w-full items-center justify-center rounded-b-xl bg-white">
                    <span className="text-2xl">Dropped!</span>
                </div>
            ) : null}
        </button>
    );
}
