"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useMemo, useRef, useState } from "react";
import TimesheetDialog from "../popup/TimesheetDialog";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import moment from "moment";
import { ITimeSheet } from "@/features/timesheet/timesheet";
import { Label } from "@/components/ui/label";
import { useGetTimesheets, useUpdateTimesheet } from "@/features/timesheet/hooks";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";


export default function TimesheetCalendar() {
  const [open, setOpen] = useState(false);
  const [updatingEventId, setUpdatingEventId] = useState<string | null>(null);

  const { mutate: updateTimesheet, isPending: isUpdating } = useUpdateTimesheet(); 

  const { data: timesheets = [], isLoading } = useGetTimesheets();
  const mappedTimesheets = useMemo(() => {
    return timesheets.map((timeSheet: ITimeSheet) => ({
      ...timeSheet,
      id: timeSheet._id,
    }));
  }, [timesheets]);

  const [timeSheetData, setTimeSheetData] = useState<ITimeSheet>({
    _id: "",
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
    setTimeSheetData({
      _id: info.event.id,
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
    setTimeSheetData({
      _id: "",
      title: "",
      start: info.date,
      end: moment(info.date).add(30, 'minutes').toISOString(),
      description: "",
      project: { id: "", name: "" },
      payAs: "debt",
    });
    setOpen(true);
  };

  const handleEventDrop = (info: any) => {
    const { event } = info;
    setUpdatingEventId(event.id);

    updateTimesheet({
      id: event.id,
      timesheet: {
        ...event.extendedProps,
        start: event.start,
        end: event.end,
      },
    }, {
      onSettled: () => {
        setUpdatingEventId(null);
      },
      onError: () => {
        info.revert()
        toast.error("Failed to update timesheet");
      },
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2 md:flex-row items-start md:items-center justify-start md:justify-between pb-4 px-0 border-b">
        <div className="flex w-full justify-center md:justify-start md:w-auto items-center gap-2">
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
        
        <div className="flex w-full justify-between md:justify-end md:w-auto items-center gap-4">
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
      <div className="relative">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={activeView}
          headerToolbar={false}
          height="auto"
          events={mappedTimesheets}
          nowIndicator={true}
          editable={!isUpdating}
          eventClassNames={(arg) => {
            const isThisEventUpdating = updatingEventId === arg.event.id;
            return isThisEventUpdating ? "pointer-events-none opacity-60 select-none" : "";
          }}
          eventContent={(arg) => {
            const start = arg.event.start;
            const end = arg.event.end;
            const now = new Date();
            
            const isRunning = start && end && now >= start && now <= end;

            const duration = moment(end).diff(moment(start), 'minutes');

            return (
              <div className="flex items-center gap-2 font-bold flex-1 px-2">
                {isRunning && (
                  <span className="live-dot" />
                )}
                <span className={`truncate-2 max-w-[220px] md:max-w-[370px] lg:max-w-[450px] xl:max-w-[800px] ${duration >= 90 ? "line-clamp-2" : "line-clamp-1"}`}>{arg.event.title}</span> 
                {isUpdating && arg.event.id === updatingEventId && <Spinner className="size-4 animate-spin" /> }
              </div>
            );
          }}
          dateClick={(info) => {
            if (isUpdating) return;
            handleDateClicked(info);
          }}
          eventClick={(info) => {
            if (isUpdating) return;
            handleEventClicked(info);
          }}
          eventDrop={(info) => {
            handleEventDrop(info);
          }}
          eventResize={(info) => {
            handleEventDrop(info);
          }}
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
      </div>
      
      <TimesheetDialog
        open={open}
        onOpenChange={setOpen}
        timeSheetData={timeSheetData}
      />
    </div>
  );
}