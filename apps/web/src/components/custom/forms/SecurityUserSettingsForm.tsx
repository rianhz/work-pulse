import { IUserWithProviders } from "@/app/settings/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Table } from "@/components/ui/table";
import { useChangePassword, useLogout, useRemoveGoogle, useRemovePassword } from "@/features/auth/hooks";
import { UpdatePasswordFormValues, updatePasswordSchema } from "@/features/users/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Activity, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export function SecurityUserSettingsForm({ user, isLoading }: { user: IUserWithProviders, isLoading: boolean }) {
  const { mutate: removePasswordMutation, isPending: isPendingRemovePassword } = useRemovePassword();
  const { mutate: removeGoogleMutation, isPending: isPendingRemoveGoogle } = useRemoveGoogle();
  const { mutate: logoutMutation, isPending: isPendingLogout } = useLogout();
  const { mutate: changePasswordMutation, isPending: isPendingChangePassword } = useChangePassword();
  
  const [disconnectProvider, setDisconnectProvider] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword, isSubmitting: isSubmittingPassword },
    reset: resetPassword,
  } = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  
  const handleChangePasswordClicked = () => {
    setIsChangePasswordDialogOpen(true);
  };

  const handleDisconnectClicked = (provider: string) => {
    setDisconnectProvider(provider);
    setIsDialogOpen(true);
  };

  const handleDisconnectConfirmed = async () => {
    try {
      if (disconnectProvider === 'google') {
        removeGoogleMutation();
        logoutMutation();
      } else if (disconnectProvider === 'password') {
        removePasswordMutation();
        logoutMutation();
      }
    } catch (error) {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to disconnect provider');
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleChangePasswordDialogOpenChanged = (open: boolean) => {
    setIsChangePasswordDialogOpen(open);
    resetPassword();
  };

  const onSubmitPassword = async (values: UpdatePasswordFormValues) => {
    changePasswordMutation({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    },{
      onSuccess: () => {
        setIsChangePasswordDialogOpen(false);
        resetPassword({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      },
    });
  };

  const handleCloseChangePasswordDialog = () => {
    setIsChangePasswordDialogOpen(false);
    resetPassword();
  };

  return (
    <>
      <Dialog open={isChangePasswordDialogOpen} onOpenChange={handleChangePasswordDialogOpenChanged}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Change Password
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input type="password" id="currentPassword" {...registerPassword("currentPassword")} />
            </div>
            <Activity mode={errorsPassword.currentPassword ? "visible" : "hidden"}>
              <p className="text-xs text-red-500">
                {errorsPassword.currentPassword?.message}
              </p>
            </Activity>
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input type="password" id="newPassword" {...registerPassword("newPassword")} />
            </div>
            <Activity mode={errorsPassword.newPassword ? "visible" : "hidden"}>
              <p className="text-xs text-red-500">
                {errorsPassword.newPassword?.message}
              </p>
            </Activity>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input type="password" id="confirmNewPassword" {...registerPassword("confirmNewPassword")} />
            </div>
            <Activity mode={errorsPassword.confirmNewPassword ? "visible" : "hidden"}>
              <p className="text-xs text-red-500">
                {errorsPassword.confirmNewPassword?.message}
              </p>
            </Activity>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" type="button" onClick={handleCloseChangePasswordDialog}>Cancel</Button>
              <Button type="submit" variant="default" loading={isSubmittingPassword || isPendingChangePassword} disabled={isSubmittingPassword || isPendingChangePassword}>
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Activity mode={user.providers && user.providers.length > 1 ? "visible" : "hidden"}>
                Are you sure?
              </Activity>
              <Activity mode={user.providers && user.providers.length === 1 ? "visible" : "hidden"}>
                Alert
              </Activity>              
            </DialogTitle>
            <DialogDescription>
              {user.providers && user.providers.length > 1 ? `Once disconnected, you won't be able to use your {disconnectProvider === 'google' ? 'Google account' : 'password'} to access this account.
              <br />
              <strong>This action forces you to logout</strong>` : 'You cannot disconnect your last provider. Please add another provider to continue.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Activity mode={user.providers && user.providers.length > 1 ? "visible" : "hidden"}>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDisconnectConfirmed} loading={isPendingRemovePassword || isPendingRemoveGoogle || isPendingLogout} disabled={isPendingRemovePassword || isPendingRemoveGoogle || isPendingLogout}>
                  Disconnect
                </Button>
            </Activity>
            <Activity mode={user.providers && user.providers.length === 1 ? "visible" : "hidden"}>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            </Activity>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="w-full max-w-2xl py-0 rounded-md">
        <Table>
          <TableBody>
            <TableRow className="group hover:bg-popover">
              <TableCell colSpan={2} className="flex flex-col gap-2 px-4">
                <Activity mode={user?.providers?.includes('google') ? "visible" : "hidden"}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      Google account <CircleCheck className="size-4 text-green-500" />
                    </span>
                    <Button type="button" variant="destructive" size='xs' onClick={() => handleDisconnectClicked('google')}>Disconnect</Button>
                  </div>
                </Activity>

                <Activity mode={user?.providers?.includes('password') ? "visible" : "hidden"}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      Password <CircleCheck className="size-4 text-green-500" />
                    </span>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="secondary" size='xs' onClick={handleChangePasswordClicked}>Change</Button>
                      <Button type="button" variant="destructive" size='xs' onClick={() => handleDisconnectClicked('password')}>Disconnect</Button>
                    </div>
                  </div>
                </Activity>

              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </>
  )
}