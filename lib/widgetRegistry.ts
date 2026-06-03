import type { widgetCombo } from "@/lib/types";
import { TestWidget } from "@/components/widgets/testWidget";
import { ClockWidget } from "@/components/widgets/clockWidget";
import { LinksWidget } from "@/components/widgets/linksWidget";
import { EmbedWidget } from "@/components/widgets/embedWidget";
import { AnnouncementWidget } from "@/components/widgets/announcementWidget";
import { NotesWidget } from "@/components/widgets/notesWidget";
import { TasksWidget } from "@/components/widgets/tasksWidget";

export enum WidgetType {
    TEST = "TEST",
    CLOCK = "CLOCK",
    LINKS = "LINKS",
    EMBED = "EMBED",
    ANNOUNCEMENT = "ANNOUNCEMENT",
    NOTES = "NOTES",
    TASKS = "TASKS",
}

export const ViewerEditableWidgets: WidgetType[] = [WidgetType.NOTES, WidgetType.TASKS];

export const WidgetList: { [key in WidgetType]: widgetCombo } = {
    TEST: TestWidget,
    CLOCK: ClockWidget,
    LINKS: LinksWidget,
    EMBED: EmbedWidget,
    ANNOUNCEMENT: AnnouncementWidget,
    NOTES: NotesWidget,
    TASKS: TasksWidget,
};
