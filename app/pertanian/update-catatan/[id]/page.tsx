"use client";
import {
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Modal,
	Paper,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRouter } from "next/navigation";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import Navigation from "@/app/components/navigation2";
import Shortcut from "@/app/components/shortcut";
import { format } from "path";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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

export default function UpdatePertanian({ params }: { params: { id: string } }) {
	const router = useRouter();

	const [selectedProduct, setSelectedProduct] = useState("");
	const [products, setProducts] = useState<Product[]>([]);
	const [plantingTime, setPlantingTime] = useState("");
	const [selectedPlantingTime, setSelectedPlantingTime] = useState(new Date(plantingTime));
	const [selectedHarvestTime, setSelectedHarvestTime] = useState("");
	const [harvestTime, setHarvestTime] = useState("");
	const [description, setDescription] = useState("");
	const [quantity, setQuantity] = useState(0);
	const [yields, setYields] = useState<Yields[]>([]);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [productId, setProductId] = useState("");
	const [selectedPlantingDate, setSelectedPlantingDate] = useState<Dayjs | null>(null);
	const [selectedHarvestDate, setSelectedHarvestDate] = useState<Dayjs | null>(null);
	const handleDialogOpen = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	async function deleteYield() {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_BASE}/yields/${params.id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
			});
			router.push(`/pertanian`);
		} catch (error) {
			console.log(error);
		}
	}

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

	const handleChange = (event: SelectChangeEvent) => {
		setSelectedProduct(event.target.value as string);
		setProductId(event.target.value as string);
	};

	const updateDataPertanian = async (id: string, data: any) => {
		let response = null;
		let bearer = "";

		if (typeof window !== "undefined") {
			const accessToken = localStorage.getItem("accessToken");
			if (accessToken) {
				bearer = `Bearer ${accessToken}`;

				try {
					const config = {
						headers: {
							Authorization: bearer,
							"Content-Type": "application/json",
						},
					};

					const updatedData = {
						productId: data?.productId,
						plantingTime: data?.plantingTime,
						harvestTime: data?.harvestTime,
						description: data?.description,
						quantity: parseInt(data?.quantity),
						imageUrl: data?.imageUrl,
						isHarvested: data?.isHarvested,
					};

					const response = await axios.patch(
						`${process.env.NEXT_PUBLIC_SERVICE_BASE}/yields/${id}`,
						updatedData,
						config
					);
					return response.data;
				} catch (error) {
					console.error("Error:", error);
					return null;
				}
			} else {
				response = { error: "Access token not found" };
			}
		} else {
			response = { error: "localStorage not available on the server" };
		}

		return response;
	};

	async function getYields() {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_BASE}/yields/${params.id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
			});
			const data = await response.json();
			const pt = convertDateDes(data.plantingTime);
			setPlantingTime(pt);
			setSelectedPlantingDate(dayjs(pt));

			const ht = convertDateDes(data.harvestTime);
			setHarvestTime(ht);
			setSelectedHarvestDate(dayjs(ht));

			setDescription(data.description);
			setQuantity(data.quantity);
			setProductId(data.productId);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getProducts();
		getYields();
	}, []);

	useEffect(() => {
		if (plantingTime) {
			setSelectedPlantingDate(dayjs(plantingTime));
		}
	}, [plantingTime]);

	useEffect(() => {
		if (harvestTime) {
			setSelectedHarvestDate(dayjs(harvestTime));
		}
	}, [harvestTime]);

	const convertDateDes = (isoDate: string) => {
		const date = new Date(isoDate);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();

		if (month < 10) {
			return `${year}-0${month}-${day}`;
		}
		if (day < 10) {
			return `${year}-${month}-0${day}`;
		}
		console.log(`${year}-${month}-${day}`);

		return `${year}-${month}-${day}`;
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const data: any = {};

		Array.from(formData.entries()).forEach(([key, value]) => {
			data[key] = value;
		});

		data.plantingTime = selectedPlantingDate;
		data.harvestTime = selectedHarvestDate;

		try {
			const res: any = await updateDataPertanian(params.id, data);
			console.log(res);
			if (res) {
				toast.success("Data updated successfully!", {
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
				toast.error("Data failed to update", {
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
		} catch {
			toast.error("Data failed to update", {
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
	};

	const handleHarvestDateChange = (date: any) => {
		setSelectedHarvestDate(date);
	};

	const handlePlantingDateChange = (date: any) => {
		setSelectedPlantingDate(date);
	};

	const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value === "") {
			setQuantity(0);
		} else {
			setQuantity(parseInt(event.target.value));
		}
	};

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
						onClick={() => router.push("/pertanian")}
						startIcon={<ArrowBackIosNewIcon />}
						variant="text"
						sx={{ color: "#ffffff" }}
					>
						Ubah Data Pertanian
					</Button>
				</Container>
			</Paper>

			<ToastContainer />

			{/* CONTENT */}
			<Typography
				variant="h6"
				component="h6"
				sx={{ textAlign: "center", color: "primary.main", my: 3 }}
			>
				Update Data Pertanian
			</Typography>
			<Box
				component="form"
				paddingX={4}
				paddingBottom={10}
				display={"flex"}
				flexDirection={"column"}
				justifyContent={"flex-start"}
				onSubmit={handleSubmit}
				sx={{
					"& .MuiTextField-root": { width: "100%" },
				}}
				height={1}
				noValidate
				autoComplete="off"
				maxWidth={"sm"}
			>
				<FormControl sx={{ my: 1 }} fullWidth>
					<InputLabel id="produkSelected">Produk</InputLabel>
					<Select
						onChange={handleChange}
						value={productId}
						labelId="produkSelected"
						label="Produk"
						name="productId"
						defaultValue={productId} // Gunakan nilai defaultValue sesuai dengan productId yang ingin Anda jadikan nilai default
					>
						{products?.map((product) => (
							<MenuItem key={product.id} value={product.id}>
								{product.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<Stack sx={{ my: 1 }} direction={"row"} justifyContent={"space-between"} gap={2}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							format="DD/MM/YYYY"
							label="Tanggal Tanam"
							value={selectedPlantingDate}
							onChange={(date) => handlePlantingDateChange(date)}
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
							format="DD/MM/YYYY"
							label="Tanggal Panen"
							value={selectedHarvestDate}
							onChange={(date) => handleHarvestDateChange(date)}
						/>
					</LocalizationProvider>
				</Stack>

				{/* <Typography>{formattedDatePlants}</Typography> */}

				<TextField
					sx={{ my: 1 }}
					fullWidth
					label="Catatan"
					id="catatan"
					type="text"
					value={description}
					name="description"
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
					name="quantity"
					onChange={handleQuantityChange}
					InputProps={{
						endAdornment: <InputAdornment position="end">kg</InputAdornment>,
						inputMode: "numeric",
					}}
				/>
				<Button type="submit" variant="contained" fullWidth sx={{ my: 1, marginTop: "auto" }}>
					Simpan
				</Button>
				<Button
					type="button"
					variant="outlined"
					color="error"
					fullWidth
					sx={{ my: 1 }}
					onClick={handleDialogOpen}
				>
					Hapus Data
				</Button>
			</Box>
			<Navigation />

			<Dialog
				open={dialogOpen}
				onClose={handleDialogClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Hapus data?"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Apakah anda yakin ingin menghapus data ini? Data yang sudah dihapus tidak dapat
						dikembalikan.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose}>Batal</Button>
					<Button
						color="error"
						onClick={() => {
							deleteYield();
						}}
						autoFocus
					>
						Hapus
					</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
}
