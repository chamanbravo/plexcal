import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { type DatesSetArg, type EventInput } from "@fullcalendar/core";

interface Props {
  events: EventInput[];
  onChangeDateRange: (dateRange: Record<string, Date>) => void;
  onEventClick: (date: string) => void;
}

export default function CalendarView({
  events,
  onChangeDateRange,
  onEventClick,
}: Props) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      initialDate={new Date()}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "timeGridDay,timeGridWeek,dayGridMonth",
      }}
      buttonText={{
        today: "Today",
        month: "Month",
        week: "Week",
        day: "Day",
      }}
      events={events}
      dateClick={(info) => {
        console.log("Date clicked:", info.date);
      }}
      datesSet={(arg: DatesSetArg) => {
        const { start, end } = arg;
        onChangeDateRange({
          startDate: start,
          endDate: end,
        });
      }}
      eventClick={(info) => {
        onEventClick(info.event.title);
      }}
      height="100%"
      allDaySlot={false}
      dayHeaderContent={(args) => {
        if (args.view.type === "dayGridMonth") {
          return args.text;
        }

        const date = args.date;
        const day = date.toLocaleDateString("en-US", {
          weekday: "short",
        });

        return (
          <div className="font-semibold uppercase tracking-wide flex flex-col ">
            <span className="text-xs text-gray-700">{day}</span>
            <span className="text-xl">{date.getDate()}</span>
          </div>
        );
      }}
    />
  );
}
