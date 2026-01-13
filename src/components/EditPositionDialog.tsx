"use client";

import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GpsPosition } from "@/lib/types";

const schema = z.object({
  name: z.string().min(2).max(40),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

type FormValues = z.infer<typeof schema>;

export default function EditPositionDialog(props: {
  open: boolean;
  position: GpsPosition | null;
  loading?: boolean;
  onClose: () => void;
  onSave: (v: { name: string; lat: number; lng: number }) => void;
}) {
  const { open, position, loading, onClose, onSave } = props;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { name: "", lat: 0, lng: 0 },
  });

  React.useEffect(() => {
    if (position && open) {
      form.reset({
        name: position.name,
        lat: position.lat,
        lng: position.lng,
      });
    }
  }, [position, open, form]);

  const values = form.watch();

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose}>
      <DialogTitle fontWeight={800}>Modifier la position</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <TextField
            label="Nom"
            {...form.register("name")}
            error={!!form.formState.errors.name}
            helperText={form.formState.errors.name?.message}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              label="Latitude"
              type="number"
              inputProps={{ step: "any" }}
              value={values.lat}
              onChange={(e) =>
                form.setValue("lat", Number(e.target.value), {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              error={!!form.formState.errors.lat}
              helperText={form.formState.errors.lat?.message}
              fullWidth
            />
            <TextField
              label="Longitude"
              type="number"
              inputProps={{ step: "any" }}
              value={values.lng}
              onChange={(e) =>
                form.setValue("lng", Number(e.target.value), {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              error={!!form.formState.errors.lng}
              helperText={form.formState.errors.lng?.message}
              fullWidth
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined">
          Annuler
        </Button>
        <Button
          onClick={() => onSave(values)}
          disabled={loading || !form.formState.isValid}
          variant="contained"
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}