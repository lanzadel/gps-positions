import * as React from "react";

import Providers from "./providers";
import "./globals.css";
import ThemeFab from "../components/ThemeFab";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
          <Providers>
            {children}
            <ThemeFab />
          </Providers>
       
      </body>
    </html>
  );
}