import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { type DatesSetArg, type EventInput } from "@fullcalendar/core";

interface Props {
  events: EventInput[];
  onChangeDateRange: (dateRange: Record<string, Date>) => void;
}

export default function CalendarView({ events, onChangeDateRange }: Props) {
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
      datesSet={(arg: DatesSetArg) => {
        const { start, end } = arg;
        onChangeDateRange({
          startDate: start,
          endDate: end,
        });
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
