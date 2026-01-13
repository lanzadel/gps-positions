"use client";

import * as React from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StraightenIcon from "@mui/icons-material/Straighten";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EditPositionDialog from "./EditPositionDialog";
import ConfirmDialog from "./ConfirmDialog";
import DistanceDialog from "./DistanceDialog";
import { enqueueSnackbar } from "notistack";
import { GpsPosition } from "@/lib/types";
import { api } from "@/lib/api";

export default function PositionsTable() {
  const qc = useQueryClient();

  const [search, setSearch] = React.useState("");
  const [edit, setEdit] = React.useState<GpsPosition | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<GpsPosition | null>(
    null
  );
  const [distanceOpen, setDistanceOpen] = React.useState(false);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["positions"],
    queryFn: api.list,
  });

  const updateMutation = useMutation({
    mutationFn: (input: { id: string; name: string; lat: number; lng: number }) =>
      api.update(input),
    onSuccess: async () => {
      enqueueSnackbar("Position mise à jour ✅", { variant: "success" });
      setEdit(null);
      await qc.invalidateQueries({ queryKey: ["positions"] });
    },
    onError: (e: any) => {
      enqueueSnackbar(e?.message ?? "Erreur update", { variant: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.remove(id),
    onSuccess: async () => {
      enqueueSnackbar("Position supprimée 🗑️", { variant: "info" });
      setConfirmDelete(null);
      await qc.invalidateQueries({ queryKey: ["positions"] });
    },
    onError: () => {
      enqueueSnackbar("Erreur suppression", { variant: "error" });
    },
  });

  const filtered = React.useMemo(() => {
    const items = data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => p.name.toLowerCase().includes(q));
  }, [data, search]);

  const columns = React.useMemo<GridColDef<GpsPosition>[]>(
    () => [
      { field: "name", headerName: "Nom", flex: 1, minWidth: 160 },
      {
        field: "lat",
        headerName: "Latitude",
        width: 130,
        valueFormatter: (v) => Number(v).toFixed(6),
      },
      {
        field: "lng",
        headerName: "Longitude",
        width: 130,
        valueFormatter: (v) => Number(v).toFixed(6),
      },
      {
        field: "updatedAt",
        headerName: "Modifié",
        width: 140,
        valueFormatter: (v) => {
          if (!v) return "-";
          return new Date(String(v)).toLocaleDateString("fr-FR");
        },
      },
      {
        field: "actions",
        headerName: "",
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.25}>
            <Tooltip title="Modifier">
              <IconButton
                size="small"
                onClick={() => setEdit(params.row)}
                aria-label="edit"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Supprimer">
              <IconButton
                size="small"
                onClick={() => setConfirmDelete(params.row)}
                aria-label="delete"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    []
  );

  function NoRowsOverlay() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100%", p: 3 }}
      spacing={1}
    >
      <Typography fontWeight={900}>Aucune position</Typography>
      <Typography sx={{ opacity: 0.8 }} align="center">
        Crée ta première position via le wizard à gauche.
      </Typography>
    </Stack>
  );
}

  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.25}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
      >
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom..."
          label="Recherche"
          sx={{ maxWidth: 340 }}
        />

        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<StraightenIcon />}
            variant="outlined"
            onClick={() => setDistanceOpen(true)}
            disabled={(data?.length ?? 0) < 2}
          >
            Distance
          </Button>

          <Button
            startIcon={
              isFetching ? <CircularProgress size={16} /> : <RefreshIcon />
            }
            variant="outlined"
            onClick={() => refetch()}
          >
            Rafraîchir
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ height: 440 }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          loading={isLoading}
          getRowId={(r) => r.id}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "rgba(15,23,42,0.03)",
              borderRadius: 2,
            },
            "& .MuiDataGrid-row:hover": {
              bgcolor: "rgba(37,99,235,0.05)",
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
          }}
          slots={{
            noRowsOverlay: NoRowsOverlay,
          }}
        />
      </Box>

      <EditPositionDialog
        open={!!edit}
        position={edit}
        loading={updateMutation.isPending}
        onClose={() => setEdit(null)}
        onSave={(v) => {
          if (!edit) return;
          updateMutation.mutate({ id: edit.id, ...v });
        }}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="Supprimer cette position ?"
        description={`Cette action est irréversible. Position: "${confirmDelete?.name ?? ""}"`}
        confirmLabel="Supprimer"
        danger
        loading={deleteMutation.isPending}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (!confirmDelete) return;
          deleteMutation.mutate(confirmDelete.id);
        }}
      />

      <DistanceDialog
        open={distanceOpen}
        positions={data ?? []}
        onClose={() => setDistanceOpen(false)}
      />
    </Stack>
  );
}
