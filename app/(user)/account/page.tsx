"use client";
import CardTemplate from "@/components/card-template";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/utils/date.utils";
import {
  useInvestments,
  useDeleteInvestment,
  useUpdateInvestment,
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

function toLocalInput(dateIso: string) {
  const d = new Date(dateIso);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 16);
}

const InvestmentDayCard = ({
  day,
  date,
  amount,
}: {
  day: number;
  date: string;
  amount: number;
}) => (
  <CardTemplate className="py-4 rounded-none">
    <div className="flex justify-between items-center">
      <Label>
        Day {day} - {date}
      </Label>
      <Label>{amount.toLocaleString()} Php</Label>
    </div>
  </CardTemplate>
);

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
        setDeletingId(null);
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
        <h2 className="text-2xl font-bold">Accounts</h2>
        <AddAccountForm />
      </div>

      {/* Accounts List */}
      {investments.length === 0 && !isLoading ? (
        <CardTemplate>
          <p className="text-muted-foreground text-center py-8">
            No accounts found. Create your first account!
          </p>
        </CardTemplate>
      ) : (
        investments.map((investment) => {
          const isDeleting =
            deleteMutation.isPending && deletingId === investment.id;
          return (
            <Fragment key={investment.id}>
              <CardTemplate isInviteCard isInvited={investment.isInvited}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                  <div>
                    <Label className="text-muted-foreground mb-3">
                      Account Details:{" "}
                    </Label>
                    <p className="text-secondary-foreground capitalize">
                      {investment.name}
                    </p>
                    <p className="text-secondary-foreground">
                      {investment.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground mb-3">
                      Join Date:{" "}
                    </Label>
                    <p className="text-secondary-foreground">
                      {formatDate(
                        new Date(investment.date),
                        true,
                        true,
                        true,
                        false,
                        false
                      )}
                    </p>
                    <p className="text-secondary-foreground">
                      {formatDate(
                        new Date(investment.date),
                        false,
                        false,
                        false,
                        true,
                        true
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground mb-3">
                      Investment Amount:{" "}
                    </Label>
                    <p className="text-secondary-foreground">
                      {investment.amount.toLocaleString()} Php
                    </p>
                  </div>
                  <div className="flex flex-col justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => requestEdit(investment)}
                      className="inline-flex items-center gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => requestDelete(investment.id)}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              </CardTemplate>
            </Fragment>
          );
        })
      )}

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
