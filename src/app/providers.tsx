"use client";

import * as React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppThemeMode, buildTheme } from "@/theme/theme";

export const ThemeModeContext = React.createContext<{
  mode: AppThemeMode;
  toggle: () => void;
}>({ mode: "light", toggle: () => {} });

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: 0 },
          mutations: { retry: 0 },
        },
      })
  );

  const [mode, setMode] = React.useState<AppThemeMode>("light");

  React.useEffect(() => {
    const saved = window.localStorage.getItem("app_theme_mode") as AppThemeMode | null;
    if (saved === "light" || saved === "dark") setMode(saved);
  }, []);

  const toggle = React.useCallback(() => {
    setMode((m) => {
      const next = m === "light" ? "dark" : "light";
      window.localStorage.setItem("app_theme_mode", next);
      return next;
    });
  }, []);

  const theme = React.useMemo(() => buildTheme(mode), [mode]);

  return (
    <QueryClientProvider client={client}>
      <ThemeModeContext.Provider value={{ mode, toggle }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={2500}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            {children}
          </SnackbarProvider>
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </QueryClientProvider>
  );
}