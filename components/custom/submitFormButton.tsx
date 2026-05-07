import { LuLoaderCircle } from "react-icons/lu";

export default function SubmitFormButton({
    pending,
    label,
    icon,
}: {
    pending: boolean;
    label: string;
    icon: React.ReactNode;
}) {
    return (
        <button
            type="submit"
            className="flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-blue-400 bg-blue-500 px-3 py-2 text-xs text-white shadow hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300 md:text-sm"
            disabled={pending}
        >
            <span>{label}</span>
            {pending ? <LuLoaderCircle className="animate-spin" /> : icon}
        </button>
    );
}
