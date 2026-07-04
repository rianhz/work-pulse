import { createProject, deleteProject, getMeProjects, getProjects, getProjectsByBulkIds, updateProject } from "./api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { IProjectPayload } from "./project";
import { IPaginationQueryOptions } from "@/global";

export const useGetProjectsByBulkIds = () => {
  return useMutation({
    mutationFn: (ids: string[]) => getProjectsByBulkIds(ids),
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};

export const useGetProjects = (options: IPaginationQueryOptions) => {
  return useQuery({
    queryKey: ["projects", options],
    queryFn: () => getProjects(options),
  });
};

export const useCreateProject = () => {
  return useMutation({
    mutationFn: (payload: IProjectPayload) => createProject(payload),
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string, payload: IProjectPayload }) => updateProject(projectId, payload),
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};

export const useDeleteProject = () => {
  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};

export const useGetMeProjects = () => {
  return useQuery({
    queryKey: ["meProjects"],
    queryFn: () => getMeProjects(),
  });
};