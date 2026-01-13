"use client";

import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";

export default function ConfirmDialog(props: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const {
    open,
    title,
    description,
    confirmLabel = "Confirmer",
    danger,
    loading,
    onClose,
    onConfirm,
  } = props;

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose}>
      <DialogTitle fontWeight={800}>{title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ opacity: 0.9 }}>{description}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined">
          Annuler
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color={danger ? "error" : "primary"}
        >
          {loading ? "..." : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}