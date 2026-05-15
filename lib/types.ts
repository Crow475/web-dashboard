import getDashboard from "@/actions/getDashboard";

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
    content: unknown;
};

export type dashboardProps = {
    rows: number;
    elements: dashboardElement[];
    preferences: {
        [key: string]: string;
    };
};

export type dashboardSelectReturn = NonNullable<Awaited<ReturnType<typeof getDashboard>>>;
