"use client";
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Navigation from "../components/navigation2";
import TuneIcon from "@mui/icons-material/Tune";
import { PieChart } from "@mui/x-charts/PieChart";

import TransactionCard from "@/app/components/TransactionCard";
import { Transaction } from "@/app/interfaces/interface";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { FiberManualRecord } from "@mui/icons-material";

interface Categories {
  id: number;
  name: string;
}

export default function Page() {
  const [open, setOpen] = useState("histori");

  // TRANSACTIONS
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  async function getTransactions() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE_BASE}/transactions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();

      setTransactions(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setOpen(newValue);
  };

  //   STATISTICS
  const [categories, setCategories] = useState<Categories[]>([]);
  const colors = [
    "#8dd3c7",
    "#ffffb3",
    "#bebada",
    "#fb8072",
    "#80b1d3",
    "#fdb462",
    "#b3de69",
    "#fccde5",
    "#d9d9d9",
    "#bc80bd",
    "#ccebc5",
    "#ffed6f",
    "#aaffc3",
    "#f984ef",
  ];

  const statisticData = categories.map((category, index) => ({
    id: index,
    value: index,
    label: `${category.name}`,
    color: `${colors[index]}`,
  }));

  //   const statisticData0 = [
  //     { id: 0, value: 0, label: "Pupuk", color: "#000" },
  //     { id: 1, value: 15, label: "Air" },
  //     { id: 2, value: 20, label: "Pajak" },
  //     { id: 3, value: 20, label: "Benih" },
  //   ];

  async function getCategories() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE_BASE}/transactions/categories`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      setCategories(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 14,
    fontWeight: "bold",
  }));

  function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  }

  useEffect(() => {
    getTransactions();
    getCategories();
  }, []);
  return (
    // PAGE
    <Stack
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      height={1}
      sx={{ width: "100vw", height: "100vh" }}
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
          <Tab value="statistik" label="Statistik" />
          <Tab value="histori" label="Histori" />
        </Tabs>
      </Stack>

      {/*  CONTENT */}
      {open == "histori" ? (
        <Stack
          direction={"column"}
          gap={2}
          padding={2}
          width={1}
          height={1}
          maxWidth={"sm"}
          paddingBottom={10}
        >
          {transactions.length > 0 &&
            transactions.map((transaction: Transaction, index: number) => (
              <TransactionCard
                key={index}
                transaction={transaction}
                yesterday={transactions[index - 1] || undefined}
              />
            ))}
        </Stack>
      ) : (
        <Stack
          direction={"column"}
          gap={2}
          padding={2}
          width={1}
          height={1}
          maxWidth={"sm"}
          paddingBottom={10}
          overflow={"scroll"}
        >
          <Paper
            sx={{
              backgroundColor: "#ffffff",
              height: "fit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              borderRadius: 2,
              paddingX: 4,
              paddingY: 8,
            }}
          >
            <PieChart
              series={[
                {
                  data: statisticData,
                  innerRadius: 80,
                },
              ]}
              legend={{ hidden: true }}
              width={400}
              height={200}
              margin={{ right: 5 }}
            >
              <PieCenterLabel>Rp 5.000.000</PieCenterLabel>
            </PieChart>
          </Paper>
          {statisticData.map(
            (data) =>
              data.id > 0 && (
                <Paper key={data.id} sx={{ display: "flex" }}>
                  <Box
                    sx={{
                      backgroundColor: data.color,
                      width: 5,
                      borderTopLeftRadius: 4,
                      borderBottomLeftRadius: 4,
                    }}
                  />
                  <Stack padding={2}>
                    <Typography variant="body1">{data.label}</Typography>
                    <Typography variant="caption">{data.value}%</Typography>
                  </Stack>
                  <Stack
                    marginLeft={"auto"}
                    marginRight={2}
                    justifyContent={"center"}
                  >
                    <Typography variant="body1" color={"error"}>
                      - Rp 500.000
                    </Typography>
                  </Stack>
                </Paper>
              )
          )}
        </Stack>
      )}

      <Navigation />
    </Stack>
  );
}
