"use client";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
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

interface Product {
	id: number;
	name: string;
}

interface Yields {
	id: number;
	productId: number;
	product: string;
	plantingTime: string;
	harvestTime: string;
	description: string;
	quantity: number;
}

export default function Page() {
	const [open, setOpen] = useState(0);
	const [products, setProducts] = useState<Product[]>([]);
	const [yields, setYields] = useState<Yields[]>([]);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setOpen(newValue);
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

	var isoDateplantsString = yields[0]?.plantingTime;
	const isoDatePlats = new Date(isoDateplantsString);
	const options = { year: "numeric", month: "long", day: "numeric" };
	const formattedDatePlants = isoDatePlats.toLocaleDateString(
		"id-ID",
		options as Intl.DateTimeFormatOptions
	);

	return (
		// PAGE
		<Box
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
				<Container maxWidth={"sm"} sx={{ display: "flex", justifyContent: "space-between" }}>
					<Button variant="text" sx={{ color: "#ffffff" }}>
						Pertanian
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

			<Stack direction={"column"} gap={2} padding={2} width={1} height={1} maxWidth={"sm"}>
				{yields?.map((yieldItem) => (
					<Card key={yieldItem.id} sx={{ mt: 1, maxWidth: "sm" }}>
						<CardActions
							onClick={() => (window.location.href = `/pertanian/update-catatan/${yieldItem.id}`)}
							sx={{ cursor: "pointer" }}
						>
							<CardContent sx={{ width: "100%" }}>
								<Stack padding={"2"} direction={"row"} justifyContent={"space-between"}>
									<Stack direction={"column"}>
										<Typography variant="h6">
											{products?.find((product) => product.id === yieldItem.productId)?.name}
										</Typography>
										<Typography variant="body1" color={"secondary.text"}>
											{yieldItem.description}
										</Typography>
										<Typography color={"primary.main"} variant="body1">
											{formattedDatePlants}
										</Typography>
									</Stack>
									<Stack justifyContent={"center"}>
										<Typography color={"primary.main"} variant="body1">
											{yieldItem.quantity} Kg
										</Typography>
									</Stack>
								</Stack>
							</CardContent>
						</CardActions>
					</Card>
				))}
			</Stack>

			<Navigation />
		</Box>
	);
}
