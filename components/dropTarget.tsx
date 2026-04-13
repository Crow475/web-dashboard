import { useDroppable } from "@dnd-kit/react";

export default function DropTarget({ id, children }: Readonly<{ id: string; children: React.ReactNode }>) {
    const { ref } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={ref}
            className="flex h-[45dvh] w-full flex-col items-center justify-center rounded-lg border border-slate-50 shadow-sm"
        >
            {children}
        </div>
    );
}
