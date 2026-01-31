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
    <div className="flex bg-[#F5F5F5] p-1 rounded-md w-fit">
      {TABS.map((tab) => (
        <div
          key={tab.key}
          onClick={() => onChange(tab.key as ClassViewType)}
          className={clsx(
            "flex items-center gap-1 px-2 py-1 text-sm font-medium hover:cursor-pointer",
            activeView === tab.key
              ? "text-black bg-white rounded-md border-[#F5F5F5] shadow"
              : "text-gray-500 hover:text-black",
          )}
        >
          {tab.title}
        </div>
      ))}
    </div>
  );
}
