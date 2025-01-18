import { format, addMonths, endOfMonth, startOfMonth, subDays, subMonths } from 'date-fns';
import tailwindConfig from "../../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

const tailwind = resolveConfig(tailwindConfig);

const today = new Date();


export const exampleStatuses = [
    { id: "1", name: "Planned", color: tailwind.theme.colors.gray[500] },
    { id: "2", name: "In Progress", color: tailwind.theme.colors.amber[500] },
    { id: "3", name: "Done", color: tailwind.theme.colors.emerald[500] },
];

export const exampleFeatures = [
    {
        id: "1",
        bugText: "AI Scene Analysis",
        startAt: startOfMonth(subMonths(today, 6)),
        endAt: subDays(endOfMonth(today), 5),
        status: exampleStatuses[0],

    },
    {
        id: "2",
        bugText: "Collaborative Editing",
        startAt: startOfMonth(subMonths(today, 5)),
        endAt: subDays(endOfMonth(today), 5),
        status: exampleStatuses[1],

    },
    {
        id: "3",
        bugText: "AI-Powered Color Grading",
        startAt: startOfMonth(subMonths(today, 4)),
        endAt: subDays(endOfMonth(today), 5),
        status: exampleStatuses[2],
    },
    {
        id: "4",
        bugText: "Real-time Video Chat",
        startAt: startOfMonth(subMonths(today, 3)),
        endAt: subDays(endOfMonth(today), 12),
        status: exampleStatuses[0],

    },
    {
        id: "5",
        bugText: "AI Voice-to-Text Subtitles",
        startAt: startOfMonth(subMonths(today, 2)),
        endAt: subDays(endOfMonth(today), 5),
        status: exampleStatuses[1],

    },
    {
        id: "6",
        bugText: "Cloud Asset Management",
        startAt: startOfMonth(subMonths(today, 1)),
        endAt: endOfMonth(today),
        status: exampleStatuses[2],

    },
    {
        id: "7",
        bugText: "AI-Assisted Video Transitions",
        startAt: startOfMonth(today),
        endAt: endOfMonth(addMonths(today, 1)),
        status: exampleStatuses[0],

    },
    {
        id: "8",
        bugText: "Version Control System",
        startAt: startOfMonth(addMonths(today, 1)),
        endAt: endOfMonth(addMonths(today, 2)),
        status: exampleStatuses[1],

    },
    {
        id: "9",
        bugText: "AI Content-Aware Fill",
        startAt: startOfMonth(addMonths(today, 2)),
        endAt: endOfMonth(addMonths(today, 3)),
        status: exampleStatuses[2],

    },
    {
        id: "10",
        bugText: "Multi-User Permissions",
        startAt: startOfMonth(addMonths(today, 3)),
        endAt: endOfMonth(addMonths(today, 4)),
        status: exampleStatuses[0],

    },
    {
        id: "11",
        bugText: "AI-Powered Audio Enhancement",
        startAt: startOfMonth(addMonths(today, 4)),
        endAt: endOfMonth(addMonths(today, 5)),
        status: exampleStatuses[1],

    },
    {
        id: "12",
        bugText: "Real-time Project Analytics",
        startAt: startOfMonth(addMonths(today, 5)),
        endAt: endOfMonth(addMonths(today, 6)),
        status: exampleStatuses[2],
    },
    {
        id: "13",
        bugText: "AI Scene Recommendations",
        startAt: startOfMonth(addMonths(today, 6)),
        endAt: endOfMonth(addMonths(today, 7)),
        status: exampleStatuses[0],

    },
    {
        id: "14",
        bugText: "Collaborative Storyboarding",
        startAt: startOfMonth(addMonths(today, 7)),
        endAt: endOfMonth(addMonths(today, 8)),
        status: exampleStatuses[1],

    },
    {
        id: "15",
        bugText: "AI-Driven Video Compression",
        startAt: startOfMonth(addMonths(today, 8)),
        endAt: endOfMonth(addMonths(today, 9)),
        status: exampleStatuses[2],

    },
    {
        id: "16",
        bugText: "Global CDN Integration",
        startAt: startOfMonth(addMonths(today, 9)),
        endAt: endOfMonth(addMonths(today, 10)),
        status: exampleStatuses[0],

    },
    {
        id: "17",
        bugText: "AI Object Tracking",
        startAt: startOfMonth(addMonths(today, 10)),
        endAt: endOfMonth(addMonths(today, 11)),
        status: exampleStatuses[1],

    },
    {
        id: "18",
        bugText: "Real-time Language Translation",
        startAt: startOfMonth(addMonths(today, 11)),
        endAt: endOfMonth(addMonths(today, 12)),
        status: exampleStatuses[2],

    },
    {
        id: "19",
        bugText: "AI-Powered Video Summarization",
        startAt: startOfMonth(addMonths(today, 12)),
        endAt: endOfMonth(addMonths(today, 13)),
        status: exampleStatuses[0],

    },
    {
        id: "20",
        bugText: "Blockchain-based Asset Licensing",
        startAt: startOfMonth(addMonths(today, 13)),
        endAt: endOfMonth(addMonths(today, 14)),
        status: exampleStatuses[1],

    },
];