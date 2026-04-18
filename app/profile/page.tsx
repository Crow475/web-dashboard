import { notoColorEmoji } from "@/lib/fonts";
import { LuLink, LuMail, LuPencil } from "react-icons/lu";

export default function Profile() {
    return (
        <main className="flex h-screen w-full flex-col items-center justify-center px-4 py-2">
            <div className="absolute flex h-[90vh] w-[60%] flex-col items-center justify-between rounded-2xl border border-neutral-300 bg-white p-6 shadow">
                <div className="flex w-full flex-col justify-start">
                    <div className="flex w-full flex-row justify-start px-3 pt-2">
                        <div
                            className={`flex flex-row items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 px-2 py-2.5 text-4xl shadow select-none ${notoColorEmoji.className}`}
                            role="img"
                            aria-label="Profile Picture"
                        >
                            &#129315;
                        </div>
                    </div>
                    <header className="flex w-full flex-row items-center justify-between border-b border-neutral-300 py-4 pl-4">
                        <h1>
                            <span className="text-4xl font-bold">John Doe</span>
                        </h1>

                        <button className="flex cursor-pointer flex-row items-center justify-start space-x-1 rounded-md bg-neutral-100 px-2 py-1 text-sm text-neutral-500">
                            <LuLink />
                            <code>ngsbwcqkvrewme</code>
                        </button>
                    </header>
                    <div className="flex w-full flex-col items-start justify-start space-y-4 px-6 py-4">
                        <div className="flex flex-row items-center justify-start space-x-2 text-neutral-500">
                            <LuMail size={20} />
                            <a href="mailto:johndoe@gmail.com" className="underline">
                                johndoe@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
                <div className="flex w-full flex-row items-center justify-end">
                    <a
                        className="flex flex-row items-center justify-start space-x-1 rounded-md border border-neutral-100 bg-white px-4 py-2 text-neutral-500 shadow hover:border-amber-300 hover:bg-amber-200 hover:text-amber-500 hover:shadow-amber-200"
                        href="/profile/edit"
                    >
                        <LuPencil />
                        <span>Edit</span>
                    </a>
                </div>
            </div>
        </main>
    );
}
