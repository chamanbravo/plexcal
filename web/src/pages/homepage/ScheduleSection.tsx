import { Header } from "./Header";
import CalendarView from "../../components/calendar/CalendarView";
import CalendarViewTabs from "../../components/tabs/CalendarViewTabs";
import { useGetClassSchedules } from "../../hooks/queries/useCreateClass";
import { useState } from "react";

type ViewType = "calendar" | "list";

export function ScheduleSection({
  calendarView,
  setCalendarView,
}: {
  calendarView: ViewType;
  setCalendarView: (view: ViewType) => void;
}) {
  const [dateRange, setDateRange] = useState<Record<string, Date>>();
  const { data, isError } = useGetClassSchedules(dateRange);

  if (isError) {
    return <div className="text-red-500">Error loading class schedules.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Header
        title="Class Schedule"
        subtitle="Manage recurring schedules and one-off classes"
        actionLabel="Schedule Class"
      />

      <CalendarViewTabs activeView={calendarView} onChange={setCalendarView} />

      {calendarView === "calendar" ? (
        <div className="h-[calc(100vh-80px)]">
          <CalendarView
            events={data?.data || []}
            onChangeDateRange={setDateRange}
            onEventClick={(title: string) => {
              console.log(title);
            }}
          />
        </div>
      ) : (
        <div className="rounded-md border p-4 text-gray-600">WIP</div>
      )}
    </div>
  );
}
