"use client";

import * as React from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { api } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères.").max(40),

  lat: z
    .number({ message: "Latitude invalide." })
    .finite("Latitude invalide.") // gère NaN / Infinity
    .min(-90, "Latitude min: -90")
    .max(90, "Latitude max: 90"),

  lng: z
    .number({ message: "Longitude invalide." })
    .finite("Longitude invalide.")
    .min(-180, "Longitude min: -180")
    .max(180, "Longitude max: 180"),
});

type FormValues = z.infer<typeof schema>;

const steps = ["Nom", "Coordonnées", "Récapitulatif"];

export default function GpsWizard() {
  const [active, setActive] = React.useState(0);
  const qc = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { name: "", lat: 48.8566, lng: 2.3522 },
  });

  const createMutation = useMutation({
    mutationFn: (input: { name: string; lat: number; lng: number }) =>
      api.create(input),
    onSuccess: async () => {
      enqueueSnackbar("Position enregistrée ✅", { variant: "success" });
      await qc.invalidateQueries({ queryKey: ["positions"] });
      form.reset({ name: "", lat: 48.8566, lng: 2.3522 });
      setActive(0);
    },
    onError: (e: any) => {
      enqueueSnackbar(e?.message ?? "Erreur lors de la sauvegarde", {
        variant: "error",
      });
    },
  });

  const values = form.watch();

  async function next() {
    if (active === 0) {
      const ok = await form.trigger(["name"]);
      if (!ok) return;
    }
    if (active === 1) {
      const ok = await form.trigger(["lat", "lng"]);
      if (!ok) return;
    }
    setActive((s) => Math.min(s + 1, steps.length - 1));
  }

  function back() {
    setActive((s) => Math.max(s - 1, 0));
  }

  function submit() {
    createMutation.mutate({
      name: values.name,
      lat: values.lat,
      lng: values.lng,
    });
  }

  return (
    <Stack spacing={2}>
      <Stepper activeStep={active} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box
        sx={(t) => ({
                p: 2.5,
                borderRadius: 2,
                background:
                  t.palette.mode === "dark"
                    ? "linear-gradient(180deg, rgba(46,125,98,0.18), rgba(46,125,98,0.10))"
                    : "linear-gradient(180deg, rgba(46,125,98,0.12), rgba(46,125,98,0.06))",
                border: "1px solid",
                borderColor: "rgba(46,125,98,0.25)",
              })}
      >
        {active === 0 && (
          <Stack spacing={1.5}>
            <Typography fontWeight={800}>Étape 1 — Nom</Typography>
            <TextField
              label="Nom de la position"
              placeholder="Ex: Maison, Bureau, Paris..."
              {...form.register("name")}
              error={!!form.formState.errors.name}
              helperText={form.formState.errors.name?.message}
            />
            <Alert severity="info" sx={{ mt: 1 }}>
              Saisissez un nom unique pour faciliter la recherche et la comparaison.
            </Alert>
          </Stack>
        )}

        {active === 1 && (
          <Stack spacing={1.5}>
            <Typography fontWeight={800}>Étape 2 — Coordonnées</Typography>

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

            <Divider sx={{ borderColor: "rgba(255,255,255,0.10)" }} />

            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Plages acceptées : latitude [-90..90], longitude [-180..180].
            </Typography>
          </Stack>
        )}

        {active === 2 && (
          <Stack spacing={1.5}>
            <Typography fontWeight={800}>Étape 3 — Récapitulatif</Typography>

            <Stack
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.10)",
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
              spacing={0.75}
            >
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Nom
              </Typography>
              <Typography fontWeight={800}>{values.name || "—"}</Typography>

              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                Latitude / Longitude
              </Typography>
              <Typography fontWeight={800}>
                {values.lat} / {values.lng}
              </Typography>
            </Stack>

            <Alert severity="warning">
              Vérifie bien avant de sauvegarder : les coordonnées sont stockées
              telles quelles.
            </Alert>
          </Stack>
        )}
      </Box>

      <Stack direction="row" spacing={1.25} justifyContent="space-between">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={back}
          disabled={active === 0 || createMutation.isPending}
          variant="outlined"
        >
          Retour
        </Button>

        {active < 2 ? (
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={next}
            disabled={createMutation.isPending}
            variant="contained"
          >
            Continuer
          </Button>
        ) : (
          <Button
            startIcon={<SaveIcon />}
            onClick={submit}
            disabled={createMutation.isPending || !form.formState.isValid}
            variant="contained"
          >
            {createMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}