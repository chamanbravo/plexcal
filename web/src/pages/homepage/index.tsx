import { useState } from "react";
import ClassViewTabs from "../../components/tabs/ClassViewTabs";
import { ScheduleSection } from "./ScheduleSection";
import { ClassTypesSection } from "./ClassTypeSection";
import type { CalendarViewType, ClassViewType } from "../../types";

export default function CalendarPage() {
  const [calendarView, setCalendarView] =
    useState<CalendarViewType>("calendar");
  const [classView, setClassView] = useState<ClassViewType>("schedule");

  const handleAddClassType = () => {
    alert("Add Class Type Modal");
  };

  return (
    <div className="flex flex-col gap-6">
      <ClassViewTabs activeView={classView} onChange={setClassView} />

      {classView === "schedule" ? (
        <ScheduleSection
          calendarView={calendarView}
          setCalendarView={setCalendarView}
        />
      ) : (
        <ClassTypesSection onAddClassType={handleAddClassType} />
      )}
    </div>
  );
}
