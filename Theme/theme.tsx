import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { green, orange, red } from "@mui/material/colors";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    warning: {
      main: orange[800],
    },
    success: {
      main: green[800],
    },
    error: {
      main: red[800],
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === "info" && {
            backgroundColor: "#60a5fa",
          }),
        }),
      },
    },
  },
});

export default theme;
