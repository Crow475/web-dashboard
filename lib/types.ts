type messages = {
    [key: string]: string | boolean;
};

export type actionState = {
    messages: messages;
    errors?: {
        [key: string]: string[];
    };
};
