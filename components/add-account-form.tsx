"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateInvestment } from "@/hooks/useInvestments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";

// Helper to get local datetime string suitable for datetime-local input
function nowLocalInput(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 16);
}

// Form validation schema
const accountSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  amount: z.number(),
  // Accept datetime-local string; forbid future dates
  date: z
    .string()
    .min(1, "Date is required")
    .refine((val) => new Date(val) <= new Date(), {
      message: "Date cannot be in the future",
    }),
  isInvited: z.boolean().default(true),
});

// Use input type for react-hook-form to align with resolver types
type AccountFormInput = z.input<typeof accountSchema>;

interface AddAccountFormProps {
  onSuccess?: () => void;
}

export function AddAccountForm({ onSuccess }: AddAccountFormProps) {
  const [open, setOpen] = useState(false);
  const createInvestmentMutation = useCreateInvestment();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<AccountFormInput>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: 0,
      date: nowLocalInput(),
      isInvited: true,
    },
  });

  const isInvited = watch("isInvited");

  const onSubmit = async (data: AccountFormInput) => {
    try {
      // Convert datetime-local string to ISO string for API/DB
      const isoDate = new Date(data.date).toISOString();
      await createInvestmentMutation.mutateAsync({
        ...data,
        date: isoDate,
        isInvited: !!data.isInvited,
      });
      reset({
        name: "",
        email: "",
        amount: 0,
        date: nowLocalInput(),
        isInvited: true,
      });
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create account:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-primary/90">
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
          <DialogDescription>
            Create a new investment account with name, email, amount and date.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Juan Dela Cruz"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Amount Field */}
          <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount (Php)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              placeholder="0"
              {...register("amount", { valueAsNumber: true })}
              className={errors.amount ? "border-destructive" : ""}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* DateTime Field */}
          <div className="space-y-2">
            <Label htmlFor="date">Investment Date & Time</Label>
            <Input
              id="date"
              type="datetime-local"
              step="60"
              max={nowLocalInput()}
              {...register("date")}
              className={errors.date ? "border-destructive" : ""}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Invited Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isInvited"
              checked={!!isInvited}
              onCheckedChange={(checked) =>
                setValue("isInvited", Boolean(checked))
              }
            />
            <Label
              htmlFor="isInvited"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              This account was invited
            </Label>
          </div>

          {/* Error Display */}
          {createInvestmentMutation.error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">
                Failed to create account:{" "}
                {createInvestmentMutation.error.message}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createInvestmentMutation.isPending}
              onClick={handleSubmit(onSubmit)}
            >
              {createInvestmentMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
