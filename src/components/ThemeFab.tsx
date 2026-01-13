"use client";

import * as React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { ThemeModeContext } from "@/app/providers";

export default function ThemeFab() {
  const { mode, toggle } = React.useContext(ThemeModeContext);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1300,
      }}
    >
      <Tooltip title={mode === "light" ? "Dark theme" : "Light theme"}>
        <IconButton
          onClick={toggle}
          aria-label="toggle theme"
          sx={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            transition: "transform 0.18s ease",
            "&:hover": { transform: "translateY(-2px)" },
          }}
        >
          {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}