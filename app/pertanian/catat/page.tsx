"use client";
import {
	Box,
	Button,
	Container,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRouter } from "next/navigation";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useEffect, useState } from "react";
import Navigation from "@/app/components/navigation2";
import { toast } from "react-toastify";

interface Product {
	id: number;
	name: string;
}

interface Yield {
	productId: number;
	plantingTime: Date;
	harvestTime: Date;
	quantity: number;
	description: string;
}

export default function CatatPertanian() {
	const [selectedProduct, setSelectedProduct] = useState("");
	const [products, setProducts] = useState<Product[]>([]);
	const [plantingTime, setPlantingTime] = React.useState<Date | null>(null);
	const [harvestTime, setHarvestTime] = React.useState<Date | null>(null);
	const [description, setDescription] = useState("");
	const [quantity, setQuantity] = useState(0);

	const handleChange = (event: SelectChangeEvent) => {
		setSelectedProduct(event.target.value as string);
	};

	const router = useRouter();

	async function getProducts() {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_BASE}/yields/products`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			setProducts(data);
		} catch (error) {
			console.log(error);
		}
	}

	const handlePlantingTimeChange = (selectedPlantingTime: any) => {
		setPlantingTime(selectedPlantingTime);
	};

	const handleHarvestTimeChange = (selectedHarvestTime: any) => {
		setHarvestTime(selectedHarvestTime);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_BASE}/yields`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
				body: JSON.stringify({
					productId: products.find((product) => product.name === selectedProduct)?.id,
					plantingTime,
					harvestTime,
					description,
					quantity,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				toast.error(errorData.message, {
					position: "top-center",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
			} else {
				const data = await response.json();
				toast.success(data.message, {
					position: "top-center",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
			}
			console.log(response);
			router.push("/pertanian");
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getProducts();
	}, []);
	return (
		<Stack
			display={"flex"}
			flexDirection={"column"}
			alignItems={"center"}
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
				<Container maxWidth={"sm"} sx={{ display: "flex", justifyContent: "space-between" }}>
					<Button
						onClick={() => router.push("/")}
						startIcon={<ArrowBackIosNewIcon />}
						variant="text"
						sx={{ color: "#ffffff" }}
					>
						Catat Pertanian
					</Button>
				</Container>
			</Paper>

			{/* CONTENT */}
			<Typography
				variant="h6"
				component="h6"
				sx={{ textAlign: "center", color: "primary.main", my: 3 }}
			>
				Catat Data Pertanian
			</Typography>
			<Box
				component="form"
				sx={{
					"& .MuiTextField-root": { width: "100%" },
				}}
				noValidate
				autoComplete="off"
				onSubmit={handleSubmit}
				display={"flex"}
				flexDirection={"column"}
				height={1}
				paddingX={4}
				paddingBottom={10}
			>
				<FormControl sx={{ my: 1 }} fullWidth>
					<InputLabel id="produkSelected">Produk</InputLabel>
					<Select
						onChange={handleChange}
						value={selectedProduct}
						labelId="produkSelected"
						label="Produk"
					>
						{products?.map((product) => (
							<MenuItem key={product.id} value={product.name}>
								{product.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<Stack sx={{ my: 1 }} direction={"row"} justifyContent={"space-between"} gap={2}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							value={plantingTime}
							onChange={handlePlantingTimeChange}
							disablePast
							format="DD/MM/YYYY"
							label="Tanggal Tanam"
						/>
					</LocalizationProvider>
					<Typography
						variant="h6"
						component="h6"
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						-
					</Typography>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							value={harvestTime}
							onChange={handleHarvestTimeChange}
							format="DD/MM/YYYY"
							label="Tanngal Panen"
							disablePast
						/>
					</LocalizationProvider>
				</Stack>

				<TextField
					sx={{ my: 1 }}
					fullWidth
					label="Catatan (opsional)"
					id="catatan"
					type="text"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				{/* <TextField
					sx={{ my: 1 }}
					label="Jumlah Panen (kosongkan jika belum  panen)"
					id="jumlah panen"
					value={quantity}
					onChange={(e) => setQuantity(Number(e.target.value))}
					inputProps={{
						endAdornment: <InputAdornment position="end">kg</InputAdornment>,
						inputMode: "numeric",
					}}
				/> */}

				<TextField
					sx={{ my: 1 }}
					label="Jumlah Panen (kosongkan jika belum  panen)"
					id="jumlah panen"
					value={quantity}
					onChange={(e) => setQuantity(Number(e.target.value))}
					InputProps={{
						endAdornment: <InputAdornment position="end">kg</InputAdornment>,
						inputMode: "numeric",
					}}
				/>

				<Button type="submit" variant="contained" sx={{ width: "100%", my: 1, marginTop: "auto" }}>
					Simpan
				</Button>
			</Box>
			<Navigation />
		</Stack>
	);
}
