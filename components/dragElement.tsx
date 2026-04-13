"use client";

import { useRef } from "react";
import { useDraggable } from "@dnd-kit/react";

import { LuGripVertical } from "react-icons/lu";

export default function DragElement({ isDropped, isDragging }: { isDropped?: boolean; isDragging?: boolean }) {
    const handleRef = useRef<HTMLDivElement>(null);

    const { ref } = useDraggable({
        id: "draggable",
        handle: handleRef,
    });

    const expanded = isDropped && !isDragging;

    return (
        <button
            ref={ref}
            className={`flex flex-col justify-start space-x-2 rounded-md bg-black py-1 text-white transition-all duration-100 ${expanded ? "h-full w-full" : "items-center"}`}
        >
            <div className="flex w-full flex-row items-center justify-start pr-2">
                <div ref={handleRef} className="cursor-grab pl-1">
                    <LuGripVertical size={expanded ? 16 : 20} />
                </div>
                <span className={expanded ? "text" : "text-lg"}>Draggable</span>
            </div>
            {expanded ? (
                <div className="flex h-full w-full items-center justify-center">
                    <span className="text-2xl">Dropped!</span>
                </div>
            ) : null}
        </button>
    );
}
