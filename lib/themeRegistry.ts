export enum themeTypes {
    none = "none",
    sunset = "sunset",
    metallic = "metallic",
    northern = "northern",
    cool = "cool",
    forrest = "forrest",
    slate = "slate",
    progressive = "progressive",
}

export const themeRegistry: { [key in themeTypes]: { className: string } } = {
    none: {
        className: "bg-white",
    },
    sunset: {
        className: "bg-linear-to-t from-red-200 via-orange-100 to-white via-10% to-40%",
    },
    metallic: {
        className: "bg-linear-to-t from-slate-200 via-mauve-100 to-white via-10% to-50%",
    },
    northern: {
        className: "bg-linear-to-t from-cyan-200 via-blue-100 to-white via-10% to-40%",
    },
    cool: {
        className: "bg-linear-to-t from-sky-100 via-blue-50 to-white via-10% to-50%",
    },
    forrest: {
        className: "bg-linear-to-t from-olive-200 via-green-100 to-neutral-50 via-20% to-80%",
    },
    slate: {
        className: "bg-linear-to-t from-slate-300 via-slate-200 to-mauve-100 via-40% to-80%",
    },
    progressive: {
        className: "bg-conic/decreasing from-violet-700/20 via-lime-300/20 to-violet-700/20",
    },
};
