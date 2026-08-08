"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export default function EditConfirm({announcementId, open, setOpen, confirm, isLoading}: {announcementId: string, open: boolean, setOpen: (open: boolean) => void, confirm: () => void, isLoading: boolean }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleStartEditing = () => {
    if (dontShowAgain) {
        localStorage.setItem(`announcement-edit-dialog-hidden-${announcementId}`,"true");
    }

    confirm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Announcement</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-start gap-4">
          <p>Editing this announcement will automatically change its status to <strong>draft</strong>. This announcement will no longer be visible to users until you publish it again.</p>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dont-show-again"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked === true)}
            />
            <Label htmlFor="dont-show-again">
              Don't show this message again
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleStartEditing} disabled={isLoading} loading={isLoading}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}