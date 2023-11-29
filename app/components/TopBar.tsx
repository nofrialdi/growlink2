import { Paper, Container, Button, IconButton } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";

export default function TopBar() {
  return (
    <Paper
      square
      sx={{
        bgcolor: "primary.main",

        width: "100vw",
        zIndex: 50,
      }}
    >
      <Container
        maxWidth={"sm"}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button variant="text" sx={{ color: "#ffffff" }}>
          Keuangan
        </Button>
        <IconButton sx={{ color: "#ffffff" }}>
          <TuneIcon />
        </IconButton>
      </Container>
    </Paper>
  );
}
