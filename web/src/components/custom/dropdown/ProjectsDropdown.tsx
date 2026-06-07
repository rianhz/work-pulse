import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { FolderKanban } from "lucide-react";
import { useState } from "react";

export interface IProject {
  id: string;
  name: string;
}

const dummyProjects = [
    {
      id: "1",
      name:
        "WorkPulse Development",
    },
    {
      id: "2",
      name:
        "Internal Development",
    },
  ];

export default function ProjectsDropdown({onChangeHanlder}: {onChangeHanlder: (project: IProject) => void}) {
  const [projectOptions, setProjectOptions] = useState<IProject[]>(dummyProjects);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <FolderKanban className="cursor-pointer"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-80">
        {projectOptions.map(project => (
          <DropdownMenuItem key={project.id} onSelect={() => onChangeHanlder(project)} className="w-full truncate line-clamp-1">
            {project.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}