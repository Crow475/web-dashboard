import type { actionState } from "@/lib/types";

import EmojiPicker from "emoji-picker-react";
import { EmojiStyle } from "emoji-picker-react";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { notoColorEmoji } from "@/lib/fonts";

import { LuPencil } from "react-icons/lu";

export default function IconPicker({
    state,
    id,
    selectedEmoji,
    setSelectedEmoji,
    label,
}: {
    state: actionState;
    id: string;
    selectedEmoji: string;
    label: string;
    setSelectedEmoji: (emoji: string) => void;
}) {
    return (
        <div className="flex w-full flex-col items-start justify-start space-y-1">
            <label htmlFor={id} className="emojiFont mr-2 text-xs text-neutral-600 md:text-sm">
                {label}
            </label>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        className={`group relative flex cursor-pointer flex-row items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 px-[0.3rem] py-1 text-center text-2xl shadow select-none md:px-2 md:py-2.5 md:text-4xl ${notoColorEmoji.className}`}
                        type="button"
                        aria-label={label}
                        id={id}
                    >
                        {selectedEmoji}
                        <input type="hidden" id={id} name={id} value={selectedEmoji} />
                        <div className="pointer-events-none absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center rounded-full bg-blue-300/20 opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100">
                            <LuPencil size={20} className="text-white" />
                        </div>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <EmojiPicker
                        emojiStyle={EmojiStyle.GOOGLE}
                        onEmojiClick={(emojiObject) => setSelectedEmoji(emojiObject.emoji)}
                        previewConfig={{ showPreview: false }}
                        height={350}
                    />
                </PopoverContent>
            </Popover>
            <div className="min-h-6">
                {state.errors?.username && (
                    <span className="text-xs text-red-500/50">{state.errors?.profileIcon?.join(", ")}</span>
                )}
            </div>
        </div>
    );
}
