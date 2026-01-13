import { createTheme, alpha } from "@mui/material/styles";

export type AppThemeMode = "light" | "dark";

const BRAND = {
  green: "#1E7A5C",
  beige: "#F3EEE6",
  ink: "#121212",
  muted: "#6B6B6B",
  border: "#E2D9CD",
  darkBg: "#0E1110",
  darkPaper: "#141817",
  darkText: "#F2EFE8",
};

export function buildTheme(mode: AppThemeMode) {
  const isDark = mode === "dark";

  const palette = {
    mode,
    primary: { main: BRAND.green },
    background: {
      default: isDark ? BRAND.darkBg : BRAND.beige,
      paper: isDark ? BRAND.darkPaper : "#FFFFFF",
    },
    text: {
      primary: isDark ? BRAND.darkText : BRAND.ink,
      secondary: isDark ? alpha(BRAND.darkText, 0.72) : BRAND.muted,
    },
    divider: isDark ? alpha("#FFFFFF", 0.10) : BRAND.border,
  } as const;

  return createTheme({
    cssVariables: true,
    palette,
    shape: { borderRadius: 18 },
    typography: {
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
      h3: { fontWeight: 950, letterSpacing: -0.8 },
      h4: { fontWeight: 950, letterSpacing: -0.6 },
      h6: { fontWeight: 900, letterSpacing: -0.2 },
      button: { textTransform: "none", fontWeight: 800 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 14 },
          containedPrimary: {
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${palette.divider}`,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            backgroundColor: isDark
              ? alpha("#FFFFFF", 0.04)
              : alpha(BRAND.ink, 0.03),
          },
          notchedOutline: { borderColor: palette.divider },
        },
      },
    },
  });
}