"use server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import { dataDB } from "@/db/drizzle";
import { dashboards } from "@/db/data/schema";
import { eq } from "drizzle-orm";

import type { dashboardProps } from "@/lib/types";
import { ViewerEditableWidgets, WidgetType } from "@/lib/widgetRegistry";

import uuidToShort from "@/lib/uuidToShort";

import getProfileOfUser from "@/actions/getProfileOfUser";
import getDashboard from "@/actions/getDashboard";
import getRoleInDashboard from "@/actions/getRoleInDashboard";

export async function updateWidget(dashboardId: string, widgetId: string, widgetProps: { [key: string]: string }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    const profile = await getProfileOfUser(session.user.id);
    if (!profile) {
        return null;
    }

    const dashboard = await getDashboard(uuidToShort(dashboardId), profile.profileId);
    if (!dashboard) {
        return null;
    }

    const isOwner = dashboard.ownerId === profile.profileId;
    const role = await getRoleInDashboard(dashboardId, profile.profileId);
    if (!isOwner && !role) {
        return null;
    }

    const props = dashboard.properties as dashboardProps;

    const element = props.elements.find((element) => element.id === widgetId);
    if (!element) {
        return null;
    }

    const isEditableByViewer = ViewerEditableWidgets.includes(element.type as WidgetType);
    console.log("Is editable by viewer:", isEditableByViewer);
    if (!isEditableByViewer && !isOwner && !["admin", "editor"].includes(role ?? "")) {
        return null;
    }

    console.log("Updating widget:", { dashboardId, widgetId, element });
    console.log("New props:", widgetProps);

    const newProps: dashboardProps = {
        preferences: props.preferences,
        rows: props.rows,
        elements: props.elements.map((element) => {
            if (element.id === widgetId) {
                return {
                    ...element,
                    content: widgetProps,
                };
            }
            return element;
        }),
    };

    console.log("New props:", newProps);
    console.log(
        "Ne element:",
        newProps.elements.find((element) => element.id === widgetId),
    );

    const result = await dataDB
        .update(dashboards)
        .set({
            properties: newProps,
        })
        .where(eq(dashboards.dashboardId, dashboardId))
        .returning({
            updatedId: dashboards.dashboardId,
        });

    return result[0].updatedId;
}
