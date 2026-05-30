import { Separator } from "@/components/ui/separator";

import type { dashboardUserSelectReturn } from "@/lib/types";

export default function PrivateCheckbox({
    setCurrentUsers,
    users,
    privateDashboard,
    setPrivateDashboard,
    label,
    description,
    setUsersChanged,
}: {
    setCurrentUsers: (users: dashboardUserSelectReturn) => void;
    users: dashboardUserSelectReturn;
    privateDashboard: boolean;
    setPrivateDashboard: (privateDashboard: boolean) => void;
    label: string;
    description: string;
    setUsersChanged: (changed: boolean) => void;
}) {
    return (
        <>
            <div className="flex flex-col items-start justify-start space-y-1 py-2">
                <div className="flex w-full flex-row items-center justify-between px-2 md:px-6">
                    <label htmlFor="privateCheckbox" className="w-2/3">
                        {label}
                    </label>
                    <input
                        type="checkbox"
                        className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm shadow outline-0 focus-within:border-blue-500"
                        id="privateCheckbox"
                        name="privateCheckbox"
                        checked={privateDashboard}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setCurrentUsers([]);
                                setUsersChanged(true);
                            } else {
                                setCurrentUsers(users);
                            }
                            setPrivateDashboard(e.target.checked);
                        }}
                    />
                </div>
                <p className="px-6 text-xs text-neutral-500">{description}</p>
            </div>
            <Separator className="w-full" />
        </>
    );
}
