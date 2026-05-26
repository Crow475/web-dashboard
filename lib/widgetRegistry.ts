import type { widgetCombo } from "@/lib/types";
import { TestWidget } from "@/components/widgets/testWidget";
import { ClockWidget } from "@/components/widgets/clockWidget";
import { LinksWidget } from "@/components/widgets/linksWidget";

export enum WidgetType {
    TEST = "TEST",
    CLOCK = "CLOCK",
    LINKS = "LINKS",
}

export const WidgetList: { [key in WidgetType]: widgetCombo } = {
    TEST: TestWidget,
    CLOCK: ClockWidget,
    LINKS: LinksWidget,
};
