"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { IProject } from "@/features/projects/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectPayloadFormValues, projectPayloadSchema } from "@/features/projects/validator";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { Command, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useSearchUsers } from "@/features/users/hooks";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function ProjectsPage() {
  const currentUser = useSelector((state: RootState) => state.currentUser.user);
  const isAdminOrOwner = currentUser?.role === "admin" || currentUser?.role === "owner" || currentUser?.role === "manager";

  const [openCreateProject, setOpenCreateProject] = useState(false);
  const [participantsSearch, setParticipantsSearch] = useState("");
  const [participantsPopoverOpen, setParticipantsPopoverOpen] = useState(false);
  const [participant, setParticipant] = useState({ userId: "", role: "" });

  const { data: participantsResponse, isLoading: isLoadingParticipants, isError: isErrorParticipants } = useSearchUsers(participantsSearch);
  const participants = useMemo(() => participantsResponse?.data, [participantsResponse]);

  const { handleSubmit, register , formState: { isSubmitting, errors: errorsCreateProject }, reset: resetCreateProject, control: controlCreateProject } = useForm<ProjectPayloadFormValues>({
    resolver: zodResolver(projectPayloadSchema),
    defaultValues: {
      name: "",
      description: "",
      entity: "",
      participants: [],
    },
  });

  const { handleSubmit: handleSubmitParticipant, control: controlParticipant, register: registerParticipant, formState: { errors: errorsParticipant }, reset: resetParticipant } = useForm<{ userId: string, role: string }>({
    resolver: zodResolver(z.object({
      userId: z.string(),
      role: z.string(),
    })),
    defaultValues: {
      userId: "",
      role: "",
    },
  });

  const onSubmitParticipant = (data: { userId: string, role: string }) => {
    console.log(data);
      setParticipant({ userId: data.userId, role: data.role });
      resetParticipant();
      setParticipantsPopoverOpen(false);
    };

  const onSubmit = (data: ProjectPayloadFormValues) => {
    console.log(data);
  };

  return (
    <>
      <Dialog open={openCreateProject} onOpenChange={setOpenCreateProject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between items-end gap-4 w-full">
            <div className="grid gap-2 w-full">
              <Label htmlFor="name" required>Name</Label>
              <Input type="text" id="name" {...register("name")} />
              {errorsCreateProject.name && <p className="text-red-500">{errorsCreateProject.name.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="description" optional>Description</Label>
              <Textarea rows={3} id="description" {...register("description")} />
              {errorsCreateProject.description && <p className="text-red-500">{errorsCreateProject.description.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="entity" optional>Entity</Label>
              <Input type="text" id="entity" {...register("entity")} />
              {errorsCreateProject.entity && <p className="text-red-500">{errorsCreateProject.entity.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <div className="flex justify-between items-center">
                <Label htmlFor="participants" optional>Participants</Label>
                <Controller
                  control={controlCreateProject}
                  name="participants"
                  render={({ field }) => {
                    const currentParticipants = field.value || [];
                    // const displayLabel = currentParticipants.map((p) => p.user?.fullName).join(", ") || "Select participants...";
                    const displayLabel = "Select participants...";

                    return (
                      <Popover open={participantsPopoverOpen} onOpenChange={setParticipantsPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            size="sm"
                            className="group"
                          >
                            Add participants
                          </Button>
                        </PopoverTrigger>
                        
                        <PopoverContent className="p-0" align="end">
                          <form onSubmit={handleSubmitParticipant(onSubmitParticipant)} className="mx-2 my-4">
                            <Command className="w-full p-0! rounded-none!" shouldFilter={false}>
                              <Label htmlFor="role" required>Role</Label>
                              <Input type="text" id="role" placeholder="Set a role (e.g. Developer, Designer)" {...registerParticipant("role")} className="mt-2" />
                              {errorsParticipant.role && <p className="text-red-500">{errorsParticipant.role.message}</p>}
                              <CommandSeparator className="my-2" />
                              <CommandInput
                                placeholder="Search users..."
                                value={participantsSearch}
                                onValueChange={setParticipantsSearch}
                                className="p-0!"
                              />
                              <CommandList className="max-h-[100px] overflow-y-auto mt-2">
                                {isLoadingParticipants && (
                                  <div className="flex justify-center items-center py-4">
                                    <Spinner className="size-4" />
                                  </div>
                                )}

                                {!isLoadingParticipants && !isErrorParticipants && (
                                  <>
                                    {participants && participants.length === 0 && (
                                      <CommandItem disabled className="justify-center py-2 text-sm text-muted-foreground">
                                        No users found.
                                      </CommandItem>
                                    )}
                                    
                                    {participants && participants.map((user) => (
                                      <CommandItem
                                        key={user._id}
                                        value={user.fullName} 
                                        onSelect={() => {
                                          field.onChange([...currentParticipants, { user: user._id, role: "participant" }]);
                                          console.log(field.value);
                                          console.log([...currentParticipants, { user: user._id, role: "participant" }])
                                          // setParticipantsSearch("");
                                          // setParticipantsPopoverOpen(false);
                                        }}
                                        className="cursor-pointer"
                                      >
                                        {user.fullName}
                                      </CommandItem>
                                    ))}
                                  </>
                                )}

                                {isErrorParticipants && (
                                  <CommandItem disabled className="text-center text-red-500">
                                    Failed to load users.
                                  </CommandItem>
                                )}
                              </CommandList>
                            </Command>
                            <div className="flex justify-end items-center gap-2 mt-4">
                              <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => resetParticipant()}>Cancel</Button>
                              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Spinner className="size-4" /> : 'Add'}</Button>
                            </div>
                          </form>
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </div>
              {errorsCreateProject.participants && <p className="text-red-500">{errorsCreateProject.participants.message}</p>}
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => setOpenCreateProject(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Spinner className="size-4" /> : 'Create'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader className="flex justify-between items-end flex-row">
          <div>
            <CardTitle className="text-2xl font-bold">Projects</CardTitle>
            <CardDescription>Track, organize, and manage your workspace initiatives, project roles, and delivery lifecycles.</CardDescription>
          </div>
          {isAdminOrOwner && (
            <Button onClick={() => setOpenCreateProject(true)}>Create Project</Button>
          )}
        </CardHeader>
        <CardContent>

        </CardContent>
      </Card>
    </>
  );
}