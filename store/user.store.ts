import { create } from "zustand";

interface UserState {
  dialog: {
    title: string;
    description: string;
    open: boolean;
    actionButton?: string;
    cancelButton?: string;
    action: () => void;
    cancel: () => void;
  };
  setDialog: (dialog: UserState["dialog"]) => void;
  resetDialog: () => void;
}

const useUserStore = create<UserState>((set) => ({
  dialog: {
    title: "",
    description: "",
    open: false,
    actionButton: "Confirm",
    cancelButton: "Cancel",
    action: () => {},
    cancel: () => {},
  },
  setDialog: (dialog) => set({ dialog }),
  resetDialog: () =>
    set({
      dialog: {
        title: "",
        description: "",
        open: false,
        actionButton: "Confirm",
        cancelButton: "Cancel",
        action: () => {},
        cancel: () => {},
      },
    }),
}));

export default useUserStore;
