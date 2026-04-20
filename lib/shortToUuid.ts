import { createTranslator } from "short-uuid";

export default function shortToUuid(uuid: string): string {
    const translator = createTranslator();
    return translator.toUUID(uuid);
}
