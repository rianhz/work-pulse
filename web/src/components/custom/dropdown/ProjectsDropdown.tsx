import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useGetMeProjects } from "@/features/projects/hooks";
import { FolderKanban, Loader2 } from "lucide-react";
import { useMemo } from "react";

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
        {isGetMeProjectsPending && (
          <DropdownMenuItem disabled>
            <Loader2 className="animate-spin" />
          </DropdownMenuItem>
        )}
        {!isGetMeProjectsPending && projects && projects.length > 0 && projects.map(project => (
          <DropdownMenuItem key={project._id} onSelect={() => onChangeHanlder({ id: project._id, name: project.name })} className="w-full truncate line-clamp-1">
            {project.name}
          </DropdownMenuItem>
        ))}

        {!isGetMeProjectsPending && projects && projects.length === 0 && (
          <DropdownMenuItem disabled>
            No projects found
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}