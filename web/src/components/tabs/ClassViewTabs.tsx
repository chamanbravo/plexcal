import clsx from "clsx";
import type { ClassViewType } from "../../types";

interface TabItem {
  key: string;
  title: string;
}

const TABS: TabItem[] = [
  { key: "schedule", title: "Class Schedule" },
  { key: "types", title: "Class Types" },
];

interface Props {
  activeView: ClassViewType;
  onChange: (view: ClassViewType) => void;
}

export default function ClassViewTabs({ activeView, onChange }: Props) {
  return (
    <div className="flex border border-gray-200 w-fit">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key as ClassViewType)}
          className={clsx(
            "flex items-center gap-1 px-4 py-2 text-sm font-medium hover:cursor-pointer",
            activeView === tab.key
              ? "text-black"
              : "text-gray-500 hover:text-black",
          )}
        >
          {tab.title}
        </button>
      ))}
    </div>
  );
}
