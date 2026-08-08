import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { BaseDatePicker } from "../date-picker/BaseDatePicker";
import { Button } from "@/components/ui/button";
import { LEAVE_TYPE_ANNUAL_LEAVE, LEAVE_TYPE_HOURS_ADJUSTMENT, LEAVE_TYPE_MARRIAGE_LEAVE, LEAVE_TYPE_MATERNITY_LEAVE, LEAVE_TYPE_PATERNITY_LEAVE, LEAVE_TYPE_PERIOD_LEAVE, LEAVE_TYPE_SICK_LEAVE, LEAVE_TYPE_UNPAID_LEAVE, leaveTypesOptions } from "@/helpers/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { leaveRequestFormSchema, LeaveRequestFormValues } from "@/features/leave/validator";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLeaveRequest } from "@/features/leave/hooks";
import { Activity } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function LeaveForm() {
  const queryClient = useQueryClient();
  const { mutate: createLeaveRequest, isPending: isPendingCreateLeaveRequest } = useCreateLeaveRequest();
  const { control, watch, setValue, handleSubmit, formState: { errors } } = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(leaveRequestFormSchema),
    defaultValues: {
      leaveType: null,
      startDate: new Date(),
      endDate: new Date(),
      notes: '',
    },
  });
  const leaveTypeWatcher = watch('leaveType');
  const leaveTypes = leaveTypesOptions;
  const onSubmit = (data: LeaveRequestFormValues) => {
    if(data.leaveType) {
      const payload = {
        ...data,
        leaveType: data.leaveType
      };
      createLeaveRequest(payload, {
        onSuccess: (data: any) => {
          toast.success(data.message);
          queryClient.invalidateQueries({ queryKey: ['my-leave-requests'] });
          handleCancel();
        },
      });
    }
  };
  const handleCancel = () => {
    setValue('leaveType', null, { shouldDirty: true });
    setValue('startDate', new Date(), { shouldDirty: true });
    setValue('endDate', new Date(), { shouldDirty: true });
    setValue('notes', '', { shouldDirty: true });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
      <Card className="p-4 min-h-[calc(100vh-200px)]">
        <CardContent className="px-0">
          <Collapsible open={leaveTypeWatcher !== null} className="w-full space-y-2">
            <CollapsibleTrigger asChild>
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col gap-2 w-full">
                  <Label>Leave Type</Label>
                  <Controller 
                    control={control}
                    name="leaveType"
                    render={({ field }) => (
                      <div onClick={(e) => e.stopPropagation()} className="w-full">
                        <Select value={field.value ?? ''} onValueChange={field.onChange} >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a leave" />
                          </SelectTrigger>
                          <SelectContent>
                            {leaveTypes.map((leaveType) => (
                              <SelectItem key={leaveType.value} value={leaveType.value}>
                                {leaveType.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                  <Activity mode={errors.leaveType ? 'visible' : 'hidden'}>
                    <p className="text-xs text-destructive">{errors.leaveType?.message}</p>
                  </Activity>
                </div>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-2 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
              <div className="space-y-4 pt-2 pb-1 flex flex-col">
                <div className="flex items-start gap-8 w-full">
                  <div className="flex flex-col gap-2 flex-1">
                    <Label>Start</Label>
                    <Controller 
                      control={control}
                      name="startDate"
                      render={({ field }) => (
                        <BaseDatePicker value={field.value} onChange={field.onChange} id="startDate" className="px-3 py-2" />
                      )}
                    />
                    <Activity mode={errors.startDate ? 'visible' : 'hidden'}>
                      <p className="text-xs text-destructive">{errors.startDate?.message}</p>
                    </Activity>
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <Label>End</Label>
                    <Controller 
                      control={control}
                      name="endDate"
                      render={({ field }) => (
                        <BaseDatePicker value={field.value} onChange={field.onChange} id="endDate" className="px-3 py-2" />
                      )}
                    />
                    <Activity mode={errors.endDate ? 'visible' : 'hidden'}>
                      <p className="text-xs text-destructive">{errors.endDate?.message}</p>
                    </Activity>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Notes <span className="text-xs text-muted-foreground">(optional)</span></Label>
                  <Controller 
                    control={control}
                    name="notes"
                    render={({ field }) => (
                      <Textarea value={field.value} onChange={field.onChange} className="h-[130px] break-all" rows={2} />
                    )}
                  />
                  <Activity mode={errors.notes ? 'visible' : 'hidden'}>
                    <p className="text-xs text-destructive">{errors.notes?.message}</p>
                  </Activity>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
                  <Button type="submit" loading={isPendingCreateLeaveRequest}>Submit</Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </form>
  );
}