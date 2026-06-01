import getDashboard from "@/actions/getDashboard";
import getAllUserDashboards from "@/actions/getAllUserDashboards";
import getUsersOfDashboard from "@/actions/getUsersOfDashboard";
import getProfileById from "@/actions/getProfileById";
import getPinned from "@/actions/getPinned";
import React from "react";
import { themeTypes } from "@/lib/themeRegistry";

type messages = {
    [key: string]: string | boolean;
};

export type actionState = {
    messages: messages;
    errors?: {
        [key: string]: string[];
    };
};

export type dashboardElement = {
    id: string;
    position: {
        row: number;
        col: number;
    };
    type: string;
    content: { [key: string]: string };
};

export type dashboardProps = {
    rows: number;
    elements: dashboardElement[];
    preferences: {
        theme: themeTypes;
        [key: string]: string;
    };
};

export type widgetCombo = {
    name: string;
    expanded: React.ReactElement;
    regular: React.ReactElement;
    settings?: React.ReactElement;
    fullScreen?: React.ReactElement;
};

export type profilePreferences = {
    pinned: string[];
    lastOpened: string | null;
};

export type dashboardSelectReturn = NonNullable<Awaited<ReturnType<typeof getDashboard>>>;
export type dashboardFullSelectReturn = NonNullable<Awaited<ReturnType<typeof getAllUserDashboards>>>;
export type dashboardUserSelectReturn = NonNullable<Awaited<ReturnType<typeof getUsersOfDashboard>>>;
export type profileSelectReturn = NonNullable<Awaited<ReturnType<typeof getProfileById>>>;
export type pinnedSelectReturn = NonNullable<Awaited<ReturnType<typeof getPinned>>>;
