"use client";

import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Stack,
  Typography,
  MenuItem,
  TextField,
  Alert,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { GpsPosition } from "@/lib/types";
import { haversineKm } from "@/lib/distance";

export default function DistanceDialog(props: {
  open: boolean;
  positions: GpsPosition[];
  onClose: () => void;
}) {
  const { open, positions, onClose } = props;

  const [a, setA] = React.useState<string>("");
  const [b, setB] = React.useState<string>("");

  React.useEffect(() => {
    if (open) {
      setA(positions[0]?.id ?? "");
      setB(positions[1]?.id ?? positions[0]?.id ?? "");
    }
  }, [open, positions]);

  const pa = positions.find((p) => p.id === a);
  const pb = positions.find((p) => p.id === b);

  const km =
    pa && pb ? haversineKm({ lat: pa.lat, lng: pa.lng }, { lat: pb.lat, lng: pb.lng }) : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={800}>Distance entre 2 positions</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          {positions.length < 2 ? (
            <Alert severity="info">
              Ajoute au moins 2 positions pour calculer une distance.
            </Alert>
          ) : (
            <>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  select
                  label="Position A"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  fullWidth
                >
                  {positions.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Position B"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  fullWidth
                >
                  {positions.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Button
                startIcon={<SwapHorizIcon />}
                variant="outlined"
                onClick={() => {
                  const tmp = a;
                  setA(b);
                  setB(tmp);
                }}
              >
                Inverser
              </Button>

              <Stack
                alignItems="center"
                textAlign="center"
                sx={(t) => ({
                  p: 2,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  background:
                    t.palette.mode === "dark"
                      ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
                      : "linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0.015))",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.06)",
                })}
                spacing={0.75}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  Résultat (Haversine)
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: 28, sm: 32 },
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                  }}
                >
                  {km === null ? "—" : km.toFixed(2)}
                  <Typography
                    component="span"
                    sx={{
                      ml: 0.5,
                      fontSize: "0.5em",
                      fontWeight: 700,
                      color: "text.secondary",
                    }}
                  >
                    km
                  </Typography>
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {pa?.name ?? "—"} → {pb?.name ?? "—"}
                </Typography>
              </Stack>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}