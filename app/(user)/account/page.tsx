"use client";
import CardTemplate from "@/components/card-template";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/utils/date.utils";
import {
  useInvestments,
  useDeleteInvestment,
  useUpdateInvestment,
  Investment,
} from "@/hooks/useInvestments";
import { AddAccountForm } from "@/components/add-account-form";
import React, { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ListView } from "./_components/list-table";
import GridView from "./_components/list-grid";

function toLocalInput(dateIso: string) {
  const d = new Date(dateIso);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 16);
}

const AccountPage = () => {
  const {
    data: investments = [],
    isLoading,
    error,
    refetch,
  } = useInvestments();
  const deleteMutation = useDeleteInvestment();
  const updateMutation = useUpdateInvestment();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | undefined>(undefined);
  const [listType, setListType] = useState<'list' | 'grid'>('list');

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    amount: 0,
    date: "",
    isInvited: true,
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="ml-2 px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const requestDelete = (id: string) => {
    if (deleteMutation.isPending) return;
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDeleteId) return;
    setDeletingId(toDeleteId);
    deleteMutation.mutate(toDeleteId, {
      onSettled: () => {
        setConfirmOpen(false);
        setToDeleteId(null);
        setDeletingId(undefined);
      },
    });
  };

  const requestEdit = (inv: any) => {
    setEditId(inv.id);
    setEditForm({
      name: inv.name || "",
      email: inv.email || "",
      amount: inv.amount || 0,
      date: toLocalInput(inv.date || inv.createdAt),
      isInvited: !!inv.isInvited,
    });
    setEditOpen(true);
  };

  const confirmEdit = () => {
    if (!editId) return;
    updateMutation.mutate(
      {
        id: editId,
        name: editForm.name,
        email: editForm.email,
        amount: Number(editForm.amount) || 0,
        date: new Date(editForm.date).toISOString(),
        isInvited: !!editForm.isInvited,
      },
      {
        onSettled: () => {
          setEditOpen(false);
          setEditId(null);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Accounts</h2>
          <Button variant={listType === 'grid' ? 'outline' : 'default'} size={'sm'} onClick={() => setListType('list')}>
            List
          </Button>
          <Button variant={listType === 'list' ? 'outline' : 'default'} size={'sm'} onClick={() => setListType('grid')}>
            Grid
          </Button>
        </div>
        <AddAccountForm />
      </div>
      <div className="flex flex-col gap-4 h-[calc(100vh-400px)] overflow-y-scroll">
        {/* Accounts List */}
        {investments.length === 0 && !isLoading ? (
          <CardTemplate>
            <p className="text-muted-foreground text-center py-8">
              No accounts found. Create your first account!
            </p>
          </CardTemplate>
        ) : (
          listType === 'list' ? (
            <ListView
              {...{ investments, deleteMutation, deletingId, requestDelete, requestEdit }}
            />
          ) : (
            <GridView
              {...{ investments, deleteMutation, deletingId, requestDelete, requestEdit }}
            />
          )
        )}
      </div>

      {/* Confirm Delete Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete investment</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently
              delete this investment?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit account</DialogTitle>
            <DialogDescription>
              Update the account details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm({ ...editForm, amount: Number(e.target.value) })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-date">Date & Time</Label>
              <Input
                id="edit-date"
                type="datetime-local"
                value={editForm.date}
                onChange={(e) =>
                  setEditForm({ ...editForm, date: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-invited"
                checked={editForm.isInvited}
                onCheckedChange={(v) =>
                  setEditForm({ ...editForm, isInvited: Boolean(v) })
                }
              />
              <Label htmlFor="edit-invited">Invited</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default AccountPage;
