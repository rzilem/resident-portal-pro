
import { useState } from 'react';

export function useDialog(initialState: boolean = false) {
  const [open, setOpen] = useState(initialState);
  
  return {
    open,
    setOpen,
    openDialog: () => setOpen(true),
    closeDialog: () => setOpen(false),
    toggleDialog: () => setOpen(!open)
  };
}
