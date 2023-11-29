"use client";
import { Box, Button, Container, Paper, Stack } from "@mui/material";
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

	return (
		// ALL
		<Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
			<Paper
				square
				sx={{
					bgcolor: "primary.main",
					width: "100vw",
					zIndex: 50,
					position: "fixed",
				}}
			>
				<Container maxWidth={"sm"} sx={{ display: "flex", justifyContent: "space-between" }}>
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
						<TabPanel value="1">Statistik</TabPanel>
						<TabPanel value="2">
							<Stack gap={3}>
								{yields?.map(
									(yields, index) =>
										yields.quantity > 0 && <PertanianCard key={index} yields={yields} />
								)}
							</Stack>
						</TabPanel>
						<TabPanel value="3">
							<Stack gap={3}>
								{yields?.map(
									(yields, index) =>
										yields.quantity == 0 &&
										!yields.isHarvested && <PertanianCard key={index} yields={yields} />
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
