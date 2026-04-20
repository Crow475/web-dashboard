export default function DefaultHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
    return (
        <header className="sticky top-0 flex w-[90%] flex-row items-center justify-start space-x-5 border-b border-neutral-300 bg-white px-5 py-4">
            {icon}
            <h1 className="text-4xl font-semibold">{title}</h1>
        </header>
    );
}
