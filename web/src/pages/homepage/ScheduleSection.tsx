import { type EventInput } from "@fullcalendar/core";
import { Header } from "./Header";
import CalendarView from "../../components/calendar/CalendarView";
import CalendarViewTabs from "../../components/tabs/CalendarViewTabs";

type ViewType = "calendar" | "list";

export function ScheduleSection({
  calendarView,
  setCalendarView,
  events,
  onScheduleClass,
}: {
  calendarView: ViewType;
  setCalendarView: (view: ViewType) => void;
  events: EventInput[];
  onScheduleClass: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Header
        title="Class Schedule"
        subtitle="Manage recurring schedules and one-off classes"
        actionLabel="Schedule Class"
        onAction={onScheduleClass}
      />

      <CalendarViewTabs activeView={calendarView} onChange={setCalendarView} />

      {calendarView === "calendar" ? (
        <div className="h-screen">
          <CalendarView
            events={events}
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
