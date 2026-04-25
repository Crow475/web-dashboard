import { relations } from "drizzle-orm/relations";
import { profiles, dashboards, usersOfDashboard } from "./schema";

export const dashboardsRelations = relations(dashboards, ({ one, many }) => ({
    profile: one(profiles, {
        fields: [dashboards.ownerId],
        references: [profiles.profileId],
    }),
    usersOfDashboards: many(usersOfDashboard),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
    dashboards: many(dashboards),
    usersOfDashboards: many(usersOfDashboard),
}));

export const usersOfDashboardRelations = relations(usersOfDashboard, ({ one }) => ({
    profile: one(profiles, {
        fields: [usersOfDashboard.profileId],
        references: [profiles.profileId],
    }),
    dashboard: one(dashboards, {
        fields: [usersOfDashboard.dashboardId],
        references: [dashboards.dashboardId],
    }),
}));
