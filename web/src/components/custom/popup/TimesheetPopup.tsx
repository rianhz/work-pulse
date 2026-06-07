"use client";

import { useEffect, useState } from "react";

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
import ProjectsDropdown, { IProject } from "../dropdown/ProjectsDropdown";
import { ITimeSheet } from "@/features/timesheet/timesheet";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onOpenChange: (
    open: boolean
  ) => void;

  initialData?: {
    id: string;
    title: string;
    payAs: string;
    start: string;
    end: string;
    description: string;
    project: IProject;
  };
}

export default function TimesheetDialog({
  open,
  onOpenChange,
  initialData,
}: Props) {
  const [event, setEvent] = useState<ITimeSheet>({
    id: "",
    title: "",
    start: "",
    end: "",
    description: "",
    project: { id: "", name: "" },
    payAs: "",
  });

  const save = async () => {
    console.log(event);

    onOpenChange(false);
  };

  useEffect(() => {
    setEvent((prev) => ({
      ...prev,
      ...initialData,
    }));

    console.log(event);
  }, [initialData]);

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
              <Field>
                <FieldLabel htmlFor="time-picker-optional">Start</FieldLabel>
                <Input
                  type="time"
                  id="time-picker-start"
                  value={event.start ? moment(event.start).format("HH:mm") : ""}
                  className="border text-black border-border appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  onChange={(e) => {
                    const timeValue = e.target.value; // This yields a 24-hour format string "HH:mm" (e.g. "17:30")
                    
                    setEvent((prev) => ({
                      ...prev,
                      // 💡 If your backend expects a full date-time string, you can merge the new time back into the date object:
                      start: moment(prev.start).set({
                        hour: parseInt(timeValue.split(":")[0]),
                        minute: parseInt(timeValue.split(":")[1]),
                      }).toISOString(), 
                      
                      // 💡 Alternative: If your state just stores the plain time string ("17:30"), use this instead:
                      // start: timeValue,
                    }));
                  }}
                />
              </Field>
              
            </FieldGroup>
            <FieldGroup className="flex gap-2">
              <Field>
                <FieldLabel htmlFor="time-picker-optional">End</FieldLabel>
                <Input
                  type="time"
                  id="time-picker-end"
                  value={event.end ? moment(event.end).format("HH:mm") : ""}
                  className="border text-black border-border appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  onChange={(e) => {
                    const timeValue = e.target.value; // This yields a 24-hour format string "HH:mm" (e.g. "17:30")
                    
                    setEvent((prev) => ({
                      ...prev,
                      end: moment(prev.end).set({
                        hour: parseInt(timeValue.split(":")[0]),
                        minute: parseInt(timeValue.split(":")[1]),
                      }).toISOString(), 
                    }));
                  }}
                />
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
              project: project,
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
                  <RadioGroupItem value="debt" id="debt" />
                  <Label htmlFor="debt">Debt</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="overtime" id="overtime" />
                  <Label htmlFor="overtime">Overtime</Label>
                </div>
              </RadioGroup>
              <Badge variant="secondary">{event.project.name}</Badge>
            </div>
          )}

          <div className="h-[220px] overflow-y-auto rounded-md border border-border p-2">
            <BaseEditor initialContent={event.description} />
          </div>

          <DialogFooter>
            <Button
              onClick={save}
            >
              Save
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