import type { widgetCombo } from "@/lib/types";
import { TestWidget } from "@/components/widgets/testWidget";
import { ClockWidget } from "@/components/widgets/clockWidget";

export enum WidgetType {
    TEST = "TEST",
    CLOCK = "CLOCK",
}

export const WidgetList: { [key in WidgetType]: widgetCombo } = {
    TEST: TestWidget,
    CLOCK: ClockWidget,
};
