"use client";

import "./globals.css";
import ConnectingDots from "@/components/ui/Effects/ConnectingDots";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  breakpoints: {
    base: "0em", // 0px
    sm: "30em", // 480px
    md: "48em", // 768px
    lg: "62em", // 992px
    xl: "80em", // 1280px
    "2xl": "96em", // 1536px
  },
});

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
