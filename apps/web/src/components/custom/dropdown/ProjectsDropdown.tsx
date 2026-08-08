import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useGetMeProjects } from "@/features/projects/hooks";
import { FolderKanban, Loader2 } from "lucide-react";
import { Activity, useMemo } from "react";

export default function ProjectsDropdown({onChangeHanlder}: {onChangeHanlder: (project: { id: string; name: string; }) => void}) {
  const { data: projectsOptions, isPending: isGetMeProjectsPending } = useGetMeProjects();

  const projects = useMemo(() => {
    return projectsOptions
  }, [projectsOptions]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isGetMeProjectsPending}>
        <FolderKanban className="cursor-pointer"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-80">
        <Activity mode={isGetMeProjectsPending ? "visible" : "hidden"}>
          <DropdownMenuItem disabled>
            <Spinner className="size-4 animate-spin" />
          </DropdownMenuItem>
        </Activity>

        <Activity mode={!isGetMeProjectsPending && projects && projects.length > 0 ? "visible" : "hidden"}>
          {projects?.map(project => (
            <DropdownMenuItem key={project._id} onSelect={() => onChangeHanlder({ id: project._id, name: project.name })} className="w-full truncate line-clamp-1">
              {project.name}
            </DropdownMenuItem>
          ))}
        </Activity>

        <Activity mode={!isGetMeProjectsPending && projects && projects.length === 0 ? "visible" : "hidden"}>
          <DropdownMenuItem disabled>
            No projects found
          </DropdownMenuItem>
        </Activity>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}