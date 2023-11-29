"use client";
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Navigation from "../../components/navigation2";
import TuneIcon from "@mui/icons-material/Tune";
import TopBar from "@/app/components/TopBar";
import { AccessTime } from "@mui/icons-material";
import axios from "axios";

export default function Page() {
  const [open, setOpen] = useState("histori");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setOpen(newValue);
  };

  const getData = async () => {
    const response = await axios.get(
      "https://growink-api.up.railway.app/" + "yields",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    console.log(response.data);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    // PAGE
    <Stack
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      sx={{ width: "100vw", height: "100vh" }}
      overflow={"hidden"}
    >
      {/* TOP BAR */}
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
          <IconButton
            sx={{ color: "#ffffff" }}
            onClick={() => (window.location.href = "/keuangan/histori/filter")}
          >
            <TuneIcon />
          </IconButton>
        </Container>
      </Paper>

      {/* TABS */}
      <Stack width={1} maxWidth={"sm"}>
        <Tabs value={open} onChange={handleChange} variant="fullWidth">
          <Tab value="statistik" label="Statistik" disabled />
          <Tab value="histori" label="Histori" />
          <Tab value="pantau" label="Pantau" />
        </Tabs>
      </Stack>

      {/* HISTORY CONTAINER */}
      <Stack
        direction={"column"}
        gap={2}
        padding={2}
        width={1}
        height={1}
        maxWidth={"sm"}
      >
        <Typography variant="overline" marginBottom={-2}>
          Senin 23 November 2023
        </Typography>

        {/* CARD */}
        <Paper>
          <Stack direction={"row"} padding={2} justifyContent={"space-between"}>
            <Stack direction={"column"}>
              <Typography variant="body1">Biji minyak</Typography>
              <Typography variant="caption" color={"secondary.text"}>
                Biji kacang lahan A
              </Typography>
              <Typography color={"primary.main"} variant="caption">
                Panen 20 November 2023
              </Typography>
            </Stack>
            <Stack justifyContent={"center"}>
              <Button
                color="warning"
                startIcon={<AccessTime />}
                variant="outlined"
              >
                2 Minggu
              </Button>
              {/* <Typography color={"primary.main"} variant="body1">
                500 kg
              </Typography> */}
            </Stack>
          </Stack>
        </Paper>

        {/* CARD */}
        <Paper>
          <Stack direction={"row"} padding={2} justifyContent={"space-between"}>
            <Stack direction={"column"}>
              <Typography variant="body1">Biji minyak</Typography>
              <Typography variant="caption">Biji kacang lahan A</Typography>
              <Typography color={"primary.main"} variant="caption">
                Panen 20 November 2023
              </Typography>
            </Stack>
            <Stack justifyContent={"center"}>
              <Button color="primary" variant="contained">
                Panen
              </Button>
              {/* <Typography color={"primary.main"} variant="body1">
                500 kg
              </Typography> */}
            </Stack>
          </Stack>
        </Paper>
      </Stack>

      <Navigation />
    </Stack>
  );
}
