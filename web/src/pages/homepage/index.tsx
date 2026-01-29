import { useMemo, useState } from "react";
import ClassViewTabs from "../../components/tabs/ClassViewTabs";
import { ScheduleSection } from "./ScheduleSection";
import { ClassTypesSection } from "./ClassTypeSection";
import type { CalendarViewType, ClassViewType } from "../../types";

export default function CalendarPage() {
  const [calendarView, setCalendarView] =
    useState<CalendarViewType>("calendar");
  const [classView, setClassView] = useState<ClassViewType>("schedule");

  const events = useMemo(
    () => [
      {
        id: "1",
        title: "Demo Class",
        start: new Date().toISOString(),
      },
    ],
    [],
  );

  const handleScheduleClass = () => {
    alert("Schedule Class Modal");
  };

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
          events={events}
          onScheduleClass={handleScheduleClass}
        />
      ) : (
        <ClassTypesSection onAddClassType={handleAddClassType} />
      )}
    </div>
  );
}
