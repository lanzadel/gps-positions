"use client";

import * as React from "react";
import { Box, Container, Stack, Typography, Paper } from "@mui/material";
import GpsWizard from "../components/GpsWizard";
import PositionsTable from "../components/PositionsTable";

export default function Page() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        backgroundImage:
          "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(255,255,255,0.65) 82%)",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 10 } }}>
        <Stack
          spacing={2}
          alignItems="center"
          textAlign="center"
          sx={{ mb: { xs: 6, md: 8 } }}
        >
          <Typography
            sx={{
              fontWeight: 950,
              letterSpacing: "-0.06em",
              lineHeight: 1.02,
              fontSize: { xs: 44, sm: 58, md: 76 },
              color: "text.primary",
            }}
          >
            Gérer les positions GPS
          </Typography>

          <Typography
            sx={{
              maxWidth: 860,
              color: "text.secondary",
              fontSize: { xs: 16, md: 18 },
              lineHeight: 1.75,
            }}
          >
            Créer, modifier, supprimer et calculer la distance entre des positions enregistrées 
            à l’aide d’un assistant étape par étape et d’une grille claire au style administratif.
          </Typography>
        </Stack>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "420px 1fr" },
            gap: { xs: 3, md: 4 },
            alignItems: "start",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 3.5 },
              borderRadius: 2,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
            }}
          >
            <Typography sx={{ fontWeight: 900, fontSize: 18, mb: 2 }}>
              Créer une position
            </Typography>
            <GpsWizard />
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 3.5 },
              borderRadius: 2,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
            }}
          >
            <Typography sx={{ fontWeight: 900, fontSize: 18, mb: 2 }}>
              Positions enregistrées
            </Typography>
            <PositionsTable />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}