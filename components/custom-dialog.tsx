"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import useUserStore from "@/store/user.store";

export default function CustomDialog() {
  const { dialog } = useUserStore();
  return (
    <Dialog open={dialog.open} onOpenChange={() => dialog.cancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialog.title}</DialogTitle>
          <DialogDescription>
            {dialog.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => dialog.cancel()}>
            {dialog.cancelButton}
          </Button>
          <Button
            variant="destructive"
            onClick={() => dialog.action()}
            disabled={false}
          >
            {dialog.actionButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}