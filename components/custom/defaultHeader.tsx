export default function DefaultHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
    return (
        <header className="sticky top-0 flex w-[90%] flex-row items-center justify-start space-x-3 border-b border-neutral-300 bg-white px-3 py-4 md:space-x-5 md:px-5">
            {icon}
            <h1 className="text-2xl font-semibold md:text-4xl">{title}</h1>
        </header>
    );
}
