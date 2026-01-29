import { type JSX } from "react";
import clsx from "clsx";
import { Calendar as CalendarIcon, List as ListIcon } from "lucide-react";
import type { CalendarViewType } from "../../types";

interface TabItem {
  key: string;
  title: string;
  icon: JSX.Element;
}

const TABS: TabItem[] = [
  { key: "calendar", title: "Calendar", icon: <CalendarIcon size={16} /> },
  { key: "list", title: "List", icon: <ListIcon size={16} /> },
];

interface Props {
  activeView: CalendarViewType;
  onChange: (view: CalendarViewType) => void;
}

export default function ViewTabs({ activeView, onChange }: Props) {
  return (
    <div className="flex border border-gray-200 w-fit">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key as CalendarViewType)}
          className={clsx(
            "flex items-center gap-1 px-4 py-2 text-sm font-medium hover:cursor-pointer",
            activeView === tab.key
              ? "text-black"
              : "text-gray-500 hover:text-black",
          )}
        >
          {tab.icon}
          {tab.title}
        </button>
      ))}
    </div>
  );
}
