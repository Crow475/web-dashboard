import { widgetCombo } from "@/lib/types";

function TestExpanded() {
    return (
        <div className="flex h-full w-full items-center justify-center rounded-b-xl bg-white">
            <span className="text-2xl">Dropped!</span>
        </div>
    );
}

export const TestWidget: widgetCombo = {
    name: "test",
    regular: <TestExpanded />,
    expanded: <TestExpanded />,
    fullScreen: <TestExpanded />,
};
