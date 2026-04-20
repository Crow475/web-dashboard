import { createTranslator } from "short-uuid";

export default function uuidToShort(uuid: string): string {
    const translator = createTranslator();
    return translator.fromUUID(uuid);
}
