import getDashboard from "@/actions/getDashboard";
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
    component: React.ReactElement;
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

export type dashboardSelectReturn = NonNullable<Awaited<ReturnType<typeof getDashboard>>>;
