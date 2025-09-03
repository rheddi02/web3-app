'use client'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Investment {
  id: string;
  name: string;
  email: string;
  amount: number;
  date: string;
  isInvited: boolean;
  createdAt: string;
  updatedAt: string;
}

// API functions
const fetchInvestments = async (): Promise<Investment[]> => {
  const response = await fetch("/api/investments");
  
  if (!response.ok) {
    throw new Error("Failed to fetch investments");
  }
  
  const data = await response.json();
  return data.investments || [];
};

const createInvestment = async ({ name, email, amount, date, isInvited }: { name: string; email: string; amount: number; date: string; isInvited: boolean }): Promise<Investment> => {
  const response = await fetch("/api/investments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, amount, date, isInvited }),
  });

  if (!response.ok) {
    throw new Error("Failed to create investment");
  }

  const data = await response.json();
  return data.investment;
};

const deleteInvestment = async (id: string): Promise<void> => {
  const response = await fetch(`/api/investments/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete investment");
  }
};

const updateInvestment = async ({ id, ...payload }: { id: string } & Partial<Pick<Investment, "name" | "email" | "amount" | "date" | "isInvited">>): Promise<Investment> => {
  const response = await fetch(`/api/investments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to update investment");
  }
  const data = await response.json();
  return data.investment;
};

// React Query hooks
export const useInvestments = () => {
  return useQuery({
    queryKey: ["investments"],
    queryFn: fetchInvestments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvestment,
    onSuccess: () => {
      // Invalidate and refetch investments after successful creation
      queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
    onError: (error) => {
      console.error("Failed to create investment:", error);
    },
  });
};

export const useDeleteInvestment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInvestment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
    onError: (error) => {
      console.error("Failed to delete investment:", error);
    },
  });
};

export const useUpdateInvestment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInvestment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
    onError: (error) => {
      console.error("Failed to update investment:", error);
    },
  });
};
