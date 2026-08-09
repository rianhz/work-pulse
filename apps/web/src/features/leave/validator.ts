import z from "zod";
import { LEAVE_TYPE_ANNUAL_LEAVE, LEAVE_TYPE_SICK_LEAVE, LEAVE_TYPE_MATERNITY_LEAVE, LEAVE_TYPE_PATERNITY_LEAVE, LEAVE_TYPE_PERIOD_LEAVE, LEAVE_TYPE_MARRIAGE_LEAVE } from "@/helpers/constants";
import moment from "moment";

export const leaveRequestFormSchema = z
  .object({
    leaveType: z
      .enum([
        LEAVE_TYPE_ANNUAL_LEAVE,
        LEAVE_TYPE_SICK_LEAVE,
        LEAVE_TYPE_MATERNITY_LEAVE,
        LEAVE_TYPE_PATERNITY_LEAVE,
        LEAVE_TYPE_PERIOD_LEAVE,
        LEAVE_TYPE_MARRIAGE_LEAVE,
      ])
      .nullable(),
    startDate: z
      .date({ message: 'Start date is required' })
      .refine((date) => moment(date).isSameOrAfter(moment().startOf('day')), {
        message: 'Start date cannot be in the past',
      }),
    endDate: z.date({ message: 'End date is required' }),
    notes: z.string().optional(),
  })
  .refine((data) => moment(data.endDate).isSameOrAfter(moment(data.startDate), 'day'), {
    message: 'End date cannot be earlier than start date',
    path: ['endDate'],
  });

export type LeaveRequestFormValues = z.infer<typeof leaveRequestFormSchema>;