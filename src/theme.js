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
  fontSizes: {
    "2xs": "11px",
    xs:    "12px",
    sm:    "13px",
    md:    "15px",
    lg:    "17px",
    xl:    "20px",
    "2xl": "22px",
    "3xl": "28px",
    "4xl": "34px",
    "5xl": "40px",
    "6xl": "48px",
  },
  fontWeights: {
    normal:    400,
    medium:    500,
    semibold:  600,
    bold:      700,
    extrabold: 800,
  },
  radii: {
    none:  "0",
    sm:    "8px",
    md:    "12px",
    lg:    "16px",
    xl:    "20px",
    "2xl": "28px",
    full:  "9999px",
  },
  shadows: {
    sm:      "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
    md:      "0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
    lg:      "0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
    xl:      "0 8px 32px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)",
    "dark-sm": "0 1px 3px rgba(0,0,0,0.4)",
    "dark-md": "0 2px 8px rgba(0,0,0,0.4)",
    "dark-lg": "0 4px 20px rgba(0,0,0,0.5)",
    "dark-xl": "0 8px 40px rgba(0,0,0,0.6)",
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "#000000" : "#FFFFFF",
        color: props.colorMode === "dark" ? "#FFFFFF" : "#000000",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
      html: {
        scrollBehavior: "smooth",
        bg: props.colorMode === "dark" ? "#000000" : "#FFFFFF",
      },
    }),
  },
  semanticTokens: {
    colors: {
      "bg.canvas":     { default: "#FFFFFF",             _dark: "#000000" },
      "bg.primary":    { default: "#F2F2F7",             _dark: "#1C1C1E" },
      "bg.elevated":   { default: "#FFFFFF",             _dark: "#2C2C2E" },
      "bg.grouped":    { default: "#F2F2F7",             _dark: "#1C1C1E" },
      "bg.fill":       { default: "rgba(120,120,128,0.2)", _dark: "rgba(120,120,128,0.36)" },
      "label.primary":   { default: "#000000",                   _dark: "#FFFFFF" },
      "label.secondary": { default: "rgba(60,60,67,0.6)",        _dark: "rgba(235,235,245,0.6)" },
      "label.tertiary":  { default: "rgba(60,60,67,0.3)",        _dark: "rgba(235,235,245,0.3)" },
      "accent":          { default: "#007AFF",                   _dark: "#0A84FF" },
      "accent.soft":     { default: "rgba(0,122,255,0.12)",      _dark: "rgba(10,132,255,0.2)" },
      "separator":       { default: "rgba(60,60,67,0.29)",       _dark: "rgba(84,84,88,0.65)" },
      "border.opaque":   { default: "#C6C6C8",                   _dark: "#38383A" },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: "'Manrope', ui-sans-serif, system-ui, sans-serif",
        fontWeight: 600,
        borderRadius: "12px",
        _focus: { boxShadow: "none" },
      },
    },
    Input: {
      baseStyle: { field: { borderRadius: "12px" } },
    },
    Textarea: {
      baseStyle: { borderRadius: "12px" },
    },
  },
});

export default theme;
