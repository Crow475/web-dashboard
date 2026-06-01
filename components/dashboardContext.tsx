"use client";

import { createContext } from "react";

import type { dashboardSelectReturn, profileSelectReturn } from "@/lib/types";

export const DashboardContext = createContext<{
    dashboard: dashboardSelectReturn;
    role: string | null;
    profile: profileSelectReturn;
}>({
    dashboard: {
        dashboardId: "",
        title: "",
        createdAt: "",
        editedAt: "",
        properties: {},
        ownerId: "",
        icon: "",
        isPrivate: false,
    },
    role: "",
    profile: {
        profileId: "",
        username: "",
        icon: "",
        publicEmail: "",
        userId: "",
        preferences: {},
    },
});

export default function DashboardContextProvider({
    children,
    dashboard,
    role,
    profile,
}: {
    children: React.ReactNode;
    dashboard: dashboardSelectReturn;
    role: string | null;
    profile: profileSelectReturn;
}) {
    return (
        <DashboardContext.Provider value={{ dashboard: dashboard, role: role, profile: profile }}>
            {children}
        </DashboardContext.Provider>
    );
}
