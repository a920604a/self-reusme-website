import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts: {
    heading: "'Manrope', ui-sans-serif, system-ui, sans-serif",
    body:    "'Inter', ui-sans-serif, system-ui, sans-serif",
    mono:    "'JetBrains Mono', ui-monospace, monospace",
  },
  styles: {
    global: {
      body: {
        bg: "#0b1326",
        color: "#dae2fd",
      },
    },
  },
});

export default theme;
