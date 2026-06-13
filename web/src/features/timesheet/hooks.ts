import { useMutation, useQuery } from "@tanstack/react-query";
import { createTimesheet, deleteTimesheet, getTimesheet, getTimesheets, updateTimesheet } from "./api";
import { ITimeSheet } from "./timesheet";

export const useCreateTimesheet = () => {
  return useMutation({
    mutationFn: createTimesheet,
  });
};

export const useGetTimesheets = () => {
  return useQuery({
    queryKey: ['timesheets'],
    queryFn: getTimesheets,
  });
};

export const useGetTimesheet = (id: string) => {
  return useQuery({
    queryKey: ['timesheet', id],
    queryFn: () => getTimesheet(id),
  });
};  

export const useUpdateTimesheet = () => {
  return useMutation({
    mutationFn: ({ id, timesheet }: { id: string, timesheet: ITimeSheet }) => updateTimesheet(id, timesheet),
  });
};

export const useDeleteTimesheet = (id: string) => {
  return useMutation({
    mutationFn: () => deleteTimesheet(id),
  });
};