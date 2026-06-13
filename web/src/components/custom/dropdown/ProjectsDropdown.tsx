import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useGetProjectsByBulkIds } from "@/features/projects/hooks";
import { IProject } from "@/features/projects/project";
import { FolderKanban, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function ProjectsDropdown({onChangeHanlder}: {onChangeHanlder: (project: { id: string; name: string; }) => void}) {
  const userProjects = useSelector((state: RootState) => state.currentUser.user?.projects);
  const { data: projectsOptions, mutate: getProjectsByBulkIds, isPending } = useGetProjectsByBulkIds();

  useEffect(() => {
    if (userProjects) {
      getProjectsByBulkIds(userProjects);
    }
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isPending}>
        <FolderKanban className="cursor-pointer"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-80">
        {isPending && (
          <DropdownMenuItem disabled>
            <Loader2 className="animate-spin" />
          </DropdownMenuItem>
        )}
        {!isPending && projectsOptions && projectsOptions.map(project => (
          <DropdownMenuItem key={project._id} onSelect={() => onChangeHanlder({ id: project._id, name: project.name })} className="w-full truncate line-clamp-1">
            {project.name}
          </DropdownMenuItem>
        ))}

        {!isPending && !projectsOptions && (
          <DropdownMenuItem disabled>
            No projects found
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}