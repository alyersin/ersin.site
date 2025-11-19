"use client";

import "./globals.css";
import ConnectingDots from "@/components/ui/Effects/ConnectingDots";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ConnectingDots />
        <ChakraProvider theme={theme}>
          <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
        </ChakraProvider>
      </body>
    </html>
  );
}
