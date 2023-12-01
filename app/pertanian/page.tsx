"use client";
import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Container,
	Paper,
	Stack,
	Typography,
	styled,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRouter } from "next/navigation";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useState } from "react";

import Navigation from "../components/navigation2";

import HistoryCard from "../components/historyCard";
import PantauCard from "../components/pantauCard";
import PertanianCard from "../components/PertanianCard";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { useDrawingArea } from "@mui/x-charts/hooks";

interface Product {
	id: number;
	name: string;
}

interface Yields {
	id: number;
	productId: number;
	plantingTime: string;
	harvestTime: any;
	description: string;
	quantity: number;
	isHarvested: boolean;
	product: Product;
}

export default function Pertanian() {
	const router = useRouter();
	const [value, setValue] = useState("2");
	const [products, setProducts] = useState<Product[]>([]);
	const [yields, setYields] = useState<Yields[]>([]);
	const currentDate = new Date();

	const [totalQuantity, setTotalQuantity] = useState(0);
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

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	async function getProducts() {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_BASE}/yields/products`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
			});
			const data = await response.json();
			setProducts(data);
		} catch (error) {
			console.log(error);
		}
	}

	async function getYields() {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_BASE}/yields`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
			});
			const data = await response.json();
			setYields(data);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getProducts();
		getYields();
	}, []);

	function PieCenterLabel({ children }: { children: React.ReactNode }) {
		const { width, height, left, top } = useDrawingArea();
		return (
			<StyledText x={left + width / 2} y={top + height / 2}>
				{children}
			</StyledText>
		);
	}

	const StyledText = styled("text")(({ theme }) => ({
		fill: theme.palette.text.primary,
		textAnchor: "middle",
		dominantBaseline: "central",
		fontSize: 14,
		fontWeight: "bold",
	}));

	const statisticData = yields.map((yields, index) => ({
		id: index,
		value: yields.quantity,
		label: `${yields.product.name}`,
		color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
	}));

	const calculateTotalQuantity = () => {
		let total = 0;
		yields.forEach((yieldData) => {
			total += yieldData.quantity;
		});
		setTotalQuantity(total);
	};

	useEffect(() => {
		calculateTotalQuantity();
	}, [yields]);

	const [quantityProduct, setQuantityProduct] = useState(0);
	const calculateQuantity = (productId: number) => {};

	function calculatePercentage(value: number, total: number): number {
    const result = (value / total) * 100;
    return parseFloat(result.toFixed(1)); // Mengubah kembali hasil ke tipe number
  }

  return (
    // ALL
    <Box
      sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <Paper
        square
        sx={{
          bgcolor: "primary.main",
          width: "100vw",
          zIndex: 50,
          position: "fixed",
        }}
      >
        <Container
          maxWidth={"sm"}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            onClick={() => router.push("/home")}
            startIcon={<ArrowBackIosNewIcon />}
            variant="text"
            sx={{ color: "#ffffff" }}
          >
            Pertanian
          </Button>
        </Container>
      </Paper>

      <Box
        maxWidth={"sm"}
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box sx={{ width: "100%", typography: "body1", mt: 6 }}>
          <TabContext value={value}>
            <Box borderBottom={1} borderColor={"divider"}>
              <TabList
                centered
                onChange={handleChange}
                aria-label="lab API tabs example"
                variant="fullWidth"
              >
                <Tab label="Statistik" value="1" />
                <Tab label="History" value="2" />
                <Tab label="Pantau" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
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
                    <PieCenterLabel>{totalQuantity} Kg</PieCenterLabel>
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
                          <Typography variant="caption">
                            {calculatePercentage(data.value, totalQuantity)}%
                          </Typography>
                        </Stack>
                        <Stack
                          marginLeft={"auto"}
                          marginRight={2}
                          justifyContent={"center"}
                        >
                          <Typography variant="body1" color={"error"}>
                            {data.value}
                          </Typography>
                        </Stack>
                      </Paper>
                    )
                )}
              </Stack>
            </TabPanel>

            <TabPanel value="2">
              <Stack gap={3}>
                {yields?.map(
                  (yields, index) =>
                    yields.quantity > 0 && (
                      <PertanianCard key={index} yields={yields} />
                    )
                )}
              </Stack>
            </TabPanel>
            <TabPanel value="3">
              <Stack gap={3}>
                {yields?.map(
                  (yields, index) =>
                    yields.quantity == 0 &&
                    !yields.isHarvested && (
                      <PertanianCard key={index} yields={yields} />
                    )
                )}
              </Stack>
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
      <Navigation />
    </Box>
  );
}
