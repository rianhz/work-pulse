"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { BaseEditor } from "@/components/tiptap/base/BaseEditor";
import ProjectsDropdown from "../dropdown/ProjectsDropdown";
import { ITimeSheet } from "@/features/timesheet/timesheet";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCreateTimesheet, useUpdateTimesheet } from "@/features/timesheet/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { ClockIcon, Loader2 } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

interface Props {
  open: boolean;
  onOpenChange: (
    open: boolean
  ) => void;

  timeSheetData: ITimeSheet;
}

export default function TimesheetDialog({
  open,
  onOpenChange,
  timeSheetData,
}: Props) {
  const { mutate: createTimesheet, isPending } = useCreateTimesheet();
  const { mutate: updateTimesheet, isPending: isUpdating } = useUpdateTimesheet();
  const queryClient = useQueryClient();
  const [event, setEvent] = useState<ITimeSheet>({
    _id: "",
    title: "",
    start: "",
    end: "",
    description: "",
    project: { id: "", name: "" },
    payAs: "",
  });

  const isValid = useMemo(() => {
    return moment(event.start).isBefore(moment(event.end)) && event.title && event.project.id && event.payAs;
  }, [event]);

  const save = async () => {
    if (timeSheetData._id) {
      updateTimesheet({ id: timeSheetData._id, timesheet: event }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['timesheets'] });
          onOpenChange(false);
        },
      });
    } else {
      const { _id, ...rest } = event;
      createTimesheet(event, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['timesheets'] });
          onOpenChange(false);
        },
      });
    }
  };

  const handleDescriptionChange = (content: string) => {
    setEvent((prev) => ({
      ...prev,
      description: content,
    }));
  };

  useEffect(() => {
  if (open) {
    setEvent({
      _id: timeSheetData._id || "",
      title: timeSheetData.title || "",
      start: timeSheetData.start || "",
      end: timeSheetData.end || "",
      description: timeSheetData.description || "",
      project: timeSheetData.project || { id: "", name: "" },
      payAs: timeSheetData.payAs || "",
    });
  }
}, [timeSheetData, open]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Timesheet Entry
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-w-sm">
          <div className="flex gap-2">
          
            <FieldGroup className="flex gap-2">
              <Field className="gap-1">
                <FieldLabel htmlFor="time-picker-optional">Start</FieldLabel>
                <InputGroup className="border text-black border-border appearance-none bg-background group focus-within:text-black">
                  <InputGroupInput
                  type="time"
                  id="time-picker-start"
                  value={event.start ? moment(event.start).format("HH:mm") : ""}
                  className="[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  onChange={(e) => {
                    const timeValue = e.target.value;
                    
                    setEvent((prev) => ({
                      ...prev,
                      start: moment(prev.start).set({
                        hour: parseInt(timeValue.split(":")[0]),
                        minute: parseInt(timeValue.split(":")[1]),
                      }).toISOString(), 
                      
                  
                    }));
                  }}
                />
                <InputGroupAddon align="inline-end" className="bg-transparent flex justify-center items-center">
                  <ClockIcon className="size-4 text-muted-foreground transition-colors group-focus-within:text-black" />
                </InputGroupAddon>
              </InputGroup>
              </Field>
              
            </FieldGroup>
            <FieldGroup className="flex gap-2">
              <Field className="gap-1">
                <FieldLabel htmlFor="time-picker-optional">End</FieldLabel>
                <InputGroup className="border text-black border-border appearance-none bg-background group focus-within:text-black">

                  <InputGroupInput
                    type="time"
                    id="time-picker-end"
                    value={event.end ? moment(event.end).format("HH:mm") : ""}
                    className="[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    onChange={(e) => {
                      const timeValue = e.target.value;
                      
                      setEvent((prev) => ({
                        ...prev,
                        end: moment(prev.end).set({
                          hour: parseInt(timeValue.split(":")[0]),
                          minute: parseInt(timeValue.split(":")[1]),
                        }).toISOString(), 
                      }));
                    }}
                  />
                  <InputGroupAddon align="inline-end" className="bg-transparent flex justify-center items-center">
                    <ClockIcon className="size-4 text-muted-foreground transition-colors group-focus-within:text-black" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </FieldGroup>

          </div>
         

          <div className="flex gap-2">
            <Input
              placeholder="Title"
              className="bg-background border text-black border-border"
              value={event.title}
              onChange={(e) =>
                setEvent((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />

            <ProjectsDropdown onChangeHanlder={(project) => setEvent((prev) => ({
              ...prev,
              project: { id: project.id, name: project.name },
            }))} />
          </div>

          {event.project.id && (
            <div className="w-full flex justify-end items-center gap-1">
              <RadioGroup 
                value={event.payAs} 
                onValueChange={(value) => setEvent((prev) => ({
                  ...prev,
                  payAs: value,
                }))}
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="debt" id="debt" className="cursor-pointer" />
                  <Label className="cursor-pointer" htmlFor="debt">Debt</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="overtime" id="overtime" className="cursor-pointer" />
                  <Label className="cursor-pointer" htmlFor="overtime">Overtime</Label>
                </div>
              </RadioGroup>
              <Badge variant="secondary">{event.project.name}</Badge>
            </div>
          )}

          <div className="h-[220px] overflow-y-auto rounded-md border border-border p-2">
            <BaseEditor initialContent={event.description} onChange={handleDescriptionChange} />
          </div>

          <DialogFooter>
            <Button
              onClick={save}
              disabled={isPending || isUpdating || !isValid}
            >
              {isPending || isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
      <DialogDescription className="sr-only">
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </Dialog>
  );
}