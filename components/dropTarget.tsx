import { useDroppable } from "@dnd-kit/react";

import { LuListX } from "react-icons/lu";

export default function DropTarget({ id, children }: Readonly<{ id: string; children: React.ReactNode }>) {
    const { ref } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={ref}
            className="group relative col-span-1 flex h-[45dvh] w-full flex-col items-center justify-center rounded-lg border border-slate-50 shadow-sm"
        >
            {children}
        </div>
    );
}
