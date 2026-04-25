import { pgTable, foreignKey, uuid, varchar, timestamp, json, boolean, char, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const userRole = pgEnum("user_role", ["admin", "editor", "viewer"]);

export const dashboards = pgTable(
    "dashboards",
    {
        dashboardId: uuid("dashboard_id")
            .default(sql`uuid_generate_v4()`)
            .notNull()
            .primaryKey(),
        title: varchar({ length: 63 }).notNull(),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
        editedAt: timestamp("edited_at", { mode: "string" }),
        properties: json().notNull(),
        ownerId: uuid("owner_id").notNull(),
        isPrivate: boolean("is_private").default(true),
        icon: char({ length: 35 }),
    },
    (table) => [
        foreignKey({
            columns: [table.ownerId],
            foreignColumns: [profiles.profileId],
            name: "dashboard_owner",
        }),
    ],
);

export const usersOfDashboard = pgTable(
    "users_of_dashboard",
    {
        profileId: uuid("profile_id").notNull(),
        roleInDashboard: userRole("role_in_dashboard"),
        dashboardId: uuid("dashboard_id").notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.profileId],
            foreignColumns: [profiles.profileId],
            name: "fk_profile",
        }),
        foreignKey({
            columns: [table.dashboardId],
            foreignColumns: [dashboards.dashboardId],
            name: "fk_dashboard",
        }),
    ],
);

export const profiles = pgTable("profiles", {
    profileId: uuid("profile_id")
        .default(sql`uuid_generate_v4()`)
        .notNull()
        .primaryKey(),
    username: varchar({ length: 63 }).notNull(),
    userId: uuid("user_id").notNull(),
    icon: char({ length: 35 }),
    publicEmail: varchar("public_email", { length: 254 }),
    preferences: json(),
});
