"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useRef, useState } from "react";
import TimesheetDialog from "../popup/TimesheetPopup";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import moment from "moment";
import { ITimeSheet } from "@/features/timesheet/timesheet";
import { Label } from "@/components/ui/label";


export default function TimesheetCalendar() {
  const [open, setOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<ITimeSheet>({
    id: "",
    title: "",
    start: "",
    end: "",
    description: "",
    project: {
      id: "",
      name: "",
    },
    payAs: "",
  });

  const calendarRef = useRef<FullCalendar | null>(null)
  const [currentTitle, setCurrentTitle] = useState("")

  const [activeView, setActiveView] = useState("timeGridDay")

  const handleCalendarAction = (action: "prev" | "next" | "today" | "dayGridMonth" | "timeGridWeek" | "timeGridDay") => {
    const calendarApi = calendarRef.current?.getApi()
    if (!calendarApi) return

    // Execute the action
    if (action === "prev") calendarApi.prev()
    else if (action === "next") calendarApi.next()
    else if (action === "today") calendarApi.today()
    else {
      calendarApi.changeView(action)
      setActiveView(action)
    }

    setCurrentTitle(calendarApi.view.title)
  }

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      setCurrentTitle(calendarApi.view.title)
    }
  }, [])

  const handleEventClicked = (info: any) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      description: info.event.extendedProps.description,
      project: info.event.extendedProps.project,
      payAs: info.event.extendedProps.payAs,
    });
    setOpen(true);
  };

  const handleDateClicked = (info: any) => {
    setSelectedEvent({
      id: "",
      title: "",
      start: info.date,
      end: moment(info.date).add(30, 'minutes').toISOString(),
      description: "",
      project: { id: "", name: "" },
      payAs: "debt",
    });
    setOpen(true);
  };
  const events = [
    {
      id: "1",
      title: "Fix Authentication Module",
      start: "2026-06-07T11:30:00",
      end: "2026-06-07T13:00:00",
      description: "Fix Authentication Module",
      project: {
        id: "1",
        name: "WorkPulse Development",
      },
      payAs: "debt",
    },
    {
      id: "2",
      title: "Team Meeting",
      start: "2026-06-07T13:00:00",
      end: "2026-06-07T17:00:00",
      description: "Team Meeting",
      project: {
        id: "2",
        name: "Internal Development",
      },
      payAs: "overtime",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between py-4 px-0 border-b">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => handleCalendarAction("prev")}
          >
            <ChevronLeftIcon className="size-4 text-muted-foreground" />
          </Button>
          <Label>
            {currentTitle}
          </Label>
          <Button 
            variant="outline"
            onClick={() => handleCalendarAction("next")}
          >
            <ChevronRightIcon className="size-4 text-muted-foreground" />
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              className="rounded-sm"
              onClick={() => handleCalendarAction("today")}
            >
              Today
            </Button>
          </div>
          <div className="flex gap-1 align-center border border-border rounded-sm">
            <Button 
              onClick={() => handleCalendarAction("timeGridDay")}
              className="rounded-sm" 
              variant={activeView === "timeGridDay" ? "default" : "ghost"}
            >
              Day
            </Button>
            <Button 
              onClick={() => handleCalendarAction("timeGridWeek")} 
              className="rounded-sm" 
              variant={activeView === "timeGridWeek" ? "default" : "ghost"}
            >
              Week
            </Button>
            <Button 
              onClick={() => handleCalendarAction("dayGridMonth")} 
              className="rounded-sm" 
              variant={activeView === "dayGridMonth" ? "default" : "ghost"}
            >
              Month
            </Button>
          </div>
        </div>
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={activeView}
        headerToolbar={false}
        height="auto"
        events={events}
        eventContent={(arg) => {
          const start = arg.event.start;
          const end = arg.event.end;
          const now = new Date();
          
          const isRunning = start && end && now >= start && now <= end;

          return (
            <div
              className={
                isRunning
                  ? "running-event"
                  : ""
              }
              >
              {isRunning && (
                <span className="live-dot" />
              )}

              <span>
                {arg.event.title}
              </span>
            </div>
          );
        }}
        dateClick={(info) => {
          handleDateClicked(info);
        }}
        eventClick={(info) => {
          handleEventClicked(info);
        }}
        editable={true}
        eventDurationEditable={true}
        allDaySlot={false}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}

        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />
      <TimesheetDialog
        open={open}
        onOpenChange={setOpen}
        initialData={selectedEvent}
      />
    </div>
  );
}